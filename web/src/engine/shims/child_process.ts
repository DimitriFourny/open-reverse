// node:child_process.spawn for the browser: OpenDecomp's project worker runs in
// this same Web Worker. The framed stdin/stdout protocol is kept unchanged and
// carried by in-memory streams; each "child" gets its own `process` object
// (the build passes it to runProjectWorker, see vite.config.ts).

import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import { parseFrames, type HelperIn, type HelperOut, type ShippedFile } from '../helper-protocol.ts';
import { vfs } from '../vfs.ts';

let nextPid = 1000;

type WriteCb = (error?: Error | null) => void;

function later(fn: () => void): void {
  setTimeout(fn, 0);
}

class ChildStdin extends EventEmitter {
  writableLength = 0;
  #child: FakeChild;
  constructor(child: FakeChild) {
    super();
    this.#child = child;
  }
  write(chunk: Uint8Array | string, encodingOrCb?: string | WriteCb, cb?: WriteCb): boolean {
    const done = typeof encodingOrCb === 'function' ? encodingOrCb : cb;
    const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
    this.#child.toChild(bytes, done);
    return true;
  }
  end(): void {
    this.#child.endChildInput();
  }
  destroy(): void {
    this.#child.endChildInput();
  }
}

class ChildProcessStdin extends EventEmitter {
  destroyed = false;
  destroy(): this {
    this.destroyed = true;
    this.emit('close');
    return this;
  }
  setEncoding(): this {
    return this;
  }
  resume(): this {
    return this;
  }
  pause(): this {
    return this;
  }
}

/** The `process` object a child runtime sees. */
class ChildProcessGlobal extends EventEmitter {
  readonly stdin = new ChildProcessStdin();
  readonly stdout: { write: (chunk: Uint8Array | string, cb?: WriteCb) => boolean; writableLength: number };
  readonly stderr = { write: (_c: unknown, cb?: WriteCb) => (cb?.(), true), writableLength: 0 };
  readonly env: Record<string, string> = {};
  readonly argv: string[];
  readonly pid: number;
  readonly platform = 'browser';
  readonly execPath = '/node';
  exitCode: number | undefined;
  #child: FakeChild;
  constructor(child: FakeChild, argv: string[]) {
    super();
    this.#child = child;
    this.pid = child.pid;
    this.argv = argv;
    this.stdout = {
      writableLength: 0,
      write: (chunk, cb) => {
        const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
        this.#child.toParent(bytes, cb);
        return true;
      },
    };
  }
  exit(code?: number): never {
    this.#child.childExited(code ?? this.exitCode ?? 0, null);
    // Code after process.exit() must not keep running in the shared thread.
    throw new ChildExit();
  }
  cwd(): string {
    return '/';
  }
  nextTick(fn: (...a: unknown[]) => void, ...args: unknown[]): void {
    queueMicrotask(() => fn(...args));
  }
}

class ChildExit extends Error {
  constructor() {
    super('child process exited');
  }
}

export class FakeChild extends EventEmitter {
  readonly pid = nextPid++;
  readonly stdin: ChildStdin;
  readonly stdout = new EventEmitter();
  readonly stderr = new EventEmitter();
  exitCode: number | null = null;
  signalCode: string | null = null;
  killed = false;
  readonly proc: ChildProcessGlobal;
  #dead = false;
  #endSent = false;
  #ready = false;
  #pending: (() => void)[] = [];

  constructor(argv: string[]) {
    super();
    this.stdin = new ChildStdin(this);
    this.proc = new ChildProcessGlobal(this, argv);
    // A Node process whose stdin is destroyed exits once its pending output is written.
    this.proc.stdin.on('close', () => later(() => later(() => this.childExited(this.proc.exitCode ?? 0, null))));
  }

  /** Called once the child runtime has attached its stdin listeners. */
  ready(): void {
    this.#ready = true;
    for (const fn of this.#pending.splice(0)) fn();
  }

  toChild(bytes: Buffer, cb?: WriteCb): void {
    const deliver = () =>
      later(() => {
        if (!this.#dead && !this.proc.stdin.destroyed) guard(this, () => this.proc.stdin.emit('data', bytes));
        cb?.(null);
      });
    if (this.#ready) deliver();
    else this.#pending.push(deliver);
  }

  endChildInput(): void {
    const fn = () =>
      later(() => {
        if (this.#dead || this.#endSent) return;
        this.#endSent = true;
        guard(this, () => this.proc.stdin.emit('end'));
      });
    if (this.#ready) fn();
    else this.#pending.push(fn);
  }

  toParent(bytes: Buffer, cb?: WriteCb): void {
    later(() => {
      if (!this.#dead) this.stdout.emit('data', bytes);
      cb?.(null);
    });
  }

  childExited(code: number | null, signal: string | null): void {
    if (this.#dead) return;
    // A dead Node process releases what it held. In this shared thread, closing the
    // runtime's stdin runs its own teardown (stop request workers, close the store).
    if (this.#ready && !this.#endSent) {
      this.#endSent = true;
      guard(this, () => this.proc.stdin.emit('end'));
    }
    this.#dead = true;
    this.exitCode = code;
    this.signalCode = signal;
    later(() => {
      this.emit('exit', code, signal);
      this.emit('close', code, signal);
    });
  }

  kill(signal: string = 'SIGTERM'): boolean {
    if (this.#dead) return false;
    this.killed = true;
    if (signal === 'SIGTERM' && this.proc.listenerCount('SIGTERM') > 0) {
      guard(this, () => this.proc.emit('SIGTERM'));
      if (!this.#dead) this.childExited(null, signal);
    } else this.childExited(null, signal);
    return true;
  }
}

function guard(child: FakeChild, fn: () => void): void {
  try {
    fn();
  } catch (error) {
    if (error instanceof ChildExit) return;
    console.error('[open-reverse] project worker crashed', error);
    child.childExited(1, null);
  }
}

/** How a spawned entry script is started inside this thread. */
export type ChildEntry = (proc: ChildProcessGlobal, argv: string[]) => Promise<void> | void;
const entries: { match: RegExp; run: ChildEntry }[] = [];

export function registerChildEntry(match: RegExp, run: ChildEntry): void {
  entries.push({ match, run });
}

// Detect the child's stdin listeners: the runtime attaches them synchronously
// at the end of runProjectWorker().
function watchReady(child: FakeChild): void {
  const check = () => {
    if (child.proc.stdin.listenerCount('data') > 0) child.ready();
    else setTimeout(check, 0);
  };
  check();
}

// ------------------------------------------------------------- remote children
// OpenDecomp's request workers run in their own Web Workers (engine/helper.ts),
// giving real parallelism. Their files cross over with the protocol frames.

const remotes: { match: RegExp; create: () => Worker }[] = [];

/** Run spawned scripts matching `match` in a Web Worker made by `create`. */
export function registerRemoteEntry(match: RegExp, create: () => Worker): void {
  remotes.push({ match, create });
}

class RemoteChild extends EventEmitter {
  readonly pid = nextPid++;
  readonly stdout = new EventEmitter();
  readonly stderr = Object.assign(new EventEmitter(), { resume() {}, pause() {} });
  readonly stdin: EventEmitter & { writableLength: number; write: (c: Uint8Array | string, e?: string | WriteCb, cb?: WriteCb) => boolean; end: () => void; destroy: () => void };
  exitCode: number | null = null;
  signalCode: string | null = null;
  killed = false;
  readonly #worker: Worker;
  #dead = false;

  constructor(worker: Worker) {
    super();
    this.#worker = worker;
    const post = (msg: HelperIn, transfer: Transferable[] = []) => {
      if (!this.#dead) worker.postMessage(msg, transfer);
    };
    this.stdin = Object.assign(new EventEmitter(), {
      writableLength: 0,
      write: (chunk: Uint8Array | string, encodingOrCb?: string | WriteCb, cb?: WriteCb): boolean => {
        const done = typeof encodingOrCb === 'function' ? encodingOrCb : cb;
        const bytes = typeof chunk === 'string' ? new Uint8Array(Buffer.from(chunk)) : Uint8Array.from(chunk);
        for (const value of parseFrames(bytes) as { kind?: string; project?: string; database?: string }[]) {
          if (value.kind !== 'open' || !value.project || !value.database) continue;
          // The request worker reads the snapshot database and the project's images/artifacts.
          const paths = [value.database, ...vfs.files(value.project, { skipLive: true })];
          const files: ShippedFile[] = paths.filter((p) => vfs.get(p)).map((path) => ({ path, data: vfs.read(path).slice() }));
          post({ type: 'files', files }, files.map((f) => f.data.buffer as ArrayBuffer));
        }
        post({ type: 'stdin', bytes }, [bytes.buffer as ArrayBuffer]);
        later(() => done?.(null));
        return true;
      },
      end: () => post({ type: 'end' }),
      destroy: () => post({ type: 'end' }),
    });
    worker.onmessage = (event: MessageEvent<HelperOut>) => {
      const msg = event.data;
      if (msg.type === 'stdout') {
        // Files first: the frame names them and the owner reads them on receipt.
        for (const f of msg.files) vfs.put(f.path, f.data);
        if (!this.#dead) this.stdout.emit('data', Buffer.from(msg.bytes));
      } else if (msg.type === 'exit') this.#exited(msg.code, null);
      else if (msg.type === 'log') console[msg.level](`[helper] ${msg.text}`);
    };
    worker.onerror = (e) => {
      console.error('[open-reverse] request worker crashed', e.message);
      this.#exited(1, null);
    };
  }

  #exited(code: number | null, signal: string | null): void {
    if (this.#dead) return;
    this.#dead = true;
    this.exitCode = code;
    this.signalCode = signal;
    this.#worker.terminate();
    later(() => {
      this.emit('exit', code, signal);
      this.emit('close', code, signal);
    });
  }

  kill(signal: string = 'SIGTERM'): boolean {
    if (this.#dead) return false;
    this.killed = true;
    this.#exited(null, signal);
    return true;
  }
}

export function spawn(command: string, args: string[] = []): FakeChild | RemoteChild {
  const argv = [command, ...args];
  const script = args.at(-1) ?? '';
  const remote = remotes.find((r) => r.match.test(script));
  if (remote) return new RemoteChild(remote.create());
  const child = new FakeChild(argv);
  const entry = entries.find((e) => e.match.test(script));
  later(async () => {
    if (!entry) {
      child.emit('error', new Error(`Cannot spawn ${script} in the browser`));
      child.childExited(1, null);
      return;
    }
    try {
      await entry.run(child.proc, argv);
      watchReady(child);
    } catch (error) {
      if (!(error instanceof ChildExit)) {
        console.error('[open-reverse] failed to start project worker', error);
        child.emit('error', error);
      }
      child.childExited(1, null);
    }
  });
  return child;
}

export function execFile(): never {
  throw new Error('execFile is not available in the browser');
}

export default { spawn, execFile };
