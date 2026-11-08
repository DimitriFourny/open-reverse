// A request-worker helper: a dedicated Web Worker that runs OpenDecomp's
// request worker (vendor/open-decomp/src/workers/request-worker.ts) so
// decompiles run in parallel and off the engine thread.
//
// It has a private, memory-only filesystem. The engine (shims/child_process.ts)
// ships in the files the request worker reads (the project snapshot database,
// images/, artifacts/), and this side ships back the files it writes
// (publications after each job, the summary outbox when it finishes),
// alongside the framed stdout bytes that reference them.

import { adopt } from './early.ts';
import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import icedWasmUrl from '@odm/iced-x86/iced_x86_bg.wasm?url';
import { initSqlite } from './shims/sqlite.ts';
import { vfs } from './vfs.ts';
import { parseFrames, type HelperIn, type HelperOut, type ShippedFile } from './helper-protocol.ts';

vfs.disablePersistence();

const post = (msg: HelperOut, transfer: Transferable[] = []) => (self as unknown as Worker).postMessage(msg, transfer);

for (const level of ['warn', 'error'] as const) {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    original(...args);
    post({ type: 'log', level, text: args.map((a) => (a instanceof Error ? `${a.message}\n${a.stack ?? ''}` : String(a))).join(' ') });
  };
}

class Exit extends Error {}

/** The `process` the request worker sees. */
const stdin = Object.assign(new EventEmitter(), {
  destroyed: false,
  destroy() {
    stdin.destroyed = true;
    return stdin;
  },
});
let outbox: string | null = null;
let exited = false;

function exit(code: number): never {
  if (!exited) {
    exited = true;
    post({ type: 'exit', code });
    setTimeout(() => self.close(), 0);
  }
  throw new Exit();
}

function collect(paths: string[], remove: boolean): ShippedFile[] {
  const files: ShippedFile[] = [];
  for (const path of paths) {
    if (!vfs.get(path)) continue;
    files.push({ path, data: vfs.read(path).slice() });
    if (remove) vfs.unlink(path);
  }
  return files;
}

const stdout = {
  writableLength: 0,
  write(chunk: Uint8Array | string, cb?: (e?: Error | null) => void): boolean {
    const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : Uint8Array.from(chunk);
    let files: ShippedFile[] = [];
    for (const value of parseFrames(bytes) as { kind?: string; publications?: { bytes: string; index?: string }[] }[]) {
      if (value.kind === 'done')
        files = files.concat(collect(value.publications?.flatMap((p) => (p.index ? [p.bytes, p.index] : [p.bytes])) ?? [], true));
      else if (value.kind === 'finished' && outbox) files = files.concat(collect(vfs.files(outbox), false));
    }
    post({ type: 'stdout', bytes, files }, [bytes.buffer as ArrayBuffer, ...files.map((f) => f.data.buffer as ArrayBuffer)]);
    queueMicrotask(() => cb?.(null));
    return true;
  },
};

const g = globalThis as unknown as { process: Record<string, unknown> };
Object.assign(g.process, {
  stdin,
  stdout,
  exit,
  exitCode: undefined,
  once: () => g.process,
  on: () => g.process,
});

// Messages that arrive while booting wait here.
const queue: HelperIn[] = [];
let listening = false;

function handle(msg: HelperIn): void {
  try {
    if (msg.type === 'files') {
      for (const f of msg.files) vfs.put(f.path, f.data);
    } else if (msg.type === 'stdin') {
      for (const value of parseFrames(msg.bytes) as { kind?: string; outbox?: string }[]) if (value.kind === 'open' && value.outbox) outbox = value.outbox;
      if (!stdin.destroyed) stdin.emit('data', Buffer.from(msg.bytes));
    } else if (msg.type === 'end') stdin.emit('end');
  } catch (error) {
    if (!(error instanceof Exit)) {
      console.error('[open-reverse] request worker failed', error);
      try {
        exit(1);
      } catch {
        // exited
      }
    }
  }
}

adopt<HelperIn>((event) => {
  if (listening) handle(event.data);
  else queue.push(event.data);
});

self.addEventListener('unhandledrejection', (e) => {
  if ((e as PromiseRejectionEvent).reason instanceof Exit) e.preventDefault();
});

(async () => {
  const [iced] = await Promise.all([fetch(icedWasmUrl).then((r) => r.arrayBuffer()), initSqlite()]);
  (globalThis as { __icedWasmBytes?: Uint8Array }).__icedWasmBytes = new Uint8Array(iced);
  const [{ runRequestWorker }, { queryWorkerHandler }] = await Promise.all([
    import('@od/workers/request-worker.js'),
    import('@od/service/queries/handler.js'),
  ]);
  runRequestWorker(queryWorkerHandler);
  listening = true;
  post({ type: 'ready' });
  for (const msg of queue.splice(0)) handle(msg);
})().catch((error: unknown) => {
  console.error('[open-reverse] request worker could not start', error);
  try {
    exit(1);
  } catch {
    // exited
  }
});
