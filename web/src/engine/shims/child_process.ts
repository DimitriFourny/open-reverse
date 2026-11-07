// node:child_process.spawn for the browser: OpenDecomp's project worker runs in
// this same Web Worker. The framed stdin/stdout protocol is kept unchanged and
// carried by in-memory streams; each "child" gets its own `process` object
// (the build passes it to runProjectWorker, see vite.config.ts).

import { Buffer } from 'buffer';
import { EventEmitter } from 'events';

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
    const fn = () => later(() => !this.#dead && guard(this, () => this.proc.stdin.emit('end')));
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

export function spawn(command: string, args: string[] = []): FakeChild {
  const argv = [command, ...args];
  const child = new FakeChild(argv);
  const script = args.at(-1) ?? '';
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
