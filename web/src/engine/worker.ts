// Web Worker entry: boots the WASM runtimes OpenDecomp needs, then serves the
// UI's calls (see ../api.ts for the other side of the protocol).

import './globals.ts';
import icedWasmUrl from '@odm/iced-x86/iced_x86_bg.wasm?url';
import { registerChildEntry } from './shims/child_process.ts';
import { initSqlite } from './shims/sqlite.ts';
import type { Engine } from './engine.ts';
import { TASK_METHODS, type TaskContext, type TaskProgress } from './tasks.ts';

export interface RpcRequest {
  id: number;
  method: string;
  args: unknown[];
}
export type RpcMessage = RpcRequest | { cancel: number };
export type RpcResponse =
  | { id: number; ok: true; value: unknown }
  | { id: number; ok: false; error: string; status: number }
  | { event: 'ready' }
  | { event: 'progress'; id: number; progress: TaskProgress }
  | { event: 'log'; level: 'warn' | 'error'; text: string }
  | { event: 'fatal'; error: string };

const post = (msg: RpcResponse, transfer: Transferable[] = []) => (self as unknown as Worker).postMessage(msg, transfer);

// Surface engine warnings/errors in the page console.
for (const level of ['warn', 'error'] as const) {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    original(...args);
    const text = args.map((a) => (a instanceof Error ? `${a.message}\n${a.stack ?? ''}` : typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    post({ event: 'log', level, text });
  };
}
self.addEventListener('unhandledrejection', (e) => console.error('unhandled rejection in engine', (e as PromiseRejectionEvent).reason));

/** Only one tab may own the IndexedDB-backed projects at a time. */
function acquireLock(): Promise<void> {
  const locks = (navigator as Navigator & { locks?: LockManager }).locks;
  if (!locks) return Promise.resolve();
  return new Promise((resolve, reject) => {
    void locks.request('open-reverse-engine', { ifAvailable: true }, (lock) => {
      if (!lock) {
        reject(new Error('OpenReverse is already open in another tab. Close it (or use that tab) to avoid corrupting your projects.'));
        return undefined;
      }
      resolve();
      return new Promise<void>(() => undefined); // hold for the worker's lifetime
    });
  });
}

const engine: Promise<Engine> = (async () => {
  await acquireLock();
  const [iced] = await Promise.all([fetch(icedWasmUrl).then((r) => r.arrayBuffer()), initSqlite()]);
  (globalThis as { __icedWasmBytes?: Uint8Array }).__icedWasmBytes = new Uint8Array(iced);
  // OpenDecomp's QueryService "spawns" its project worker: run it in this thread.
  registerChildEntry(/(^|\/)entry\.(js|ts)$/, async (proc) => {
    const [{ runProjectWorker }, { queryWorkerHandler }] = await Promise.all([
      import('@od/workers/runtime.js'),
      import('@od/service/queries/handler.js'),
    ]);
    (runProjectWorker as unknown as (h: unknown, o: unknown, p: unknown) => void)(queryWorkerHandler, undefined, proc);
  });
  const { Engine } = await import('./engine.ts');
  const e = new Engine();
  await e.init();
  return e;
})();

engine.then(
  () => post({ event: 'ready' }),
  (error: unknown) => post({ event: 'fatal', error: error instanceof Error ? error.message : String(error) }),
);

const aborts = new Map<number, AbortController>();

function transferables(value: unknown): Transferable[] {
  if (value && typeof value === 'object' && 'bytes' in value && (value as { bytes: unknown }).bytes instanceof Uint8Array)
    return [((value as { bytes: Uint8Array }).bytes.buffer as ArrayBuffer)];
  return [];
}

self.onmessage = async (event: MessageEvent<RpcMessage>) => {
  const msg = event.data;
  if ('cancel' in msg) {
    aborts.get(msg.cancel)?.abort();
    return;
  }
  const { id, method, args } = msg;
  const abort = new AbortController();
  aborts.set(id, abort);
  try {
    const e = await engine;
    const fn = (e as unknown as Record<string, unknown>)[method];
    if (typeof fn !== 'function' || method.startsWith('#')) throw Object.assign(new Error(`Unknown method ${method}`), { status: 404 });
    let extra: unknown[] = [];
    if (method === 'decompile') extra = [abort.signal];
    else if (TASK_METHODS.has(method)) {
      let last = 0;
      const ctx: TaskContext = {
        signal: abort.signal,
        progress: (progress) => {
          // At most ~20 reports a second, but always the last of a phase.
          const now = Date.now();
          if (now - last < 50 && progress.done !== progress.total) return;
          last = now;
          post({ event: 'progress', id, progress });
        },
      };
      extra = [ctx];
    }
    const value = await (fn as (...a: unknown[]) => unknown).apply(e, [...args, ...extra]);
    post({ id, ok: true, value }, transferables(value));
  } catch (error) {
    const err = error as Error & { status?: number };
    post({ id, ok: false, error: err?.message ?? String(error), status: err?.status ?? 500 });
  } finally {
    aborts.delete(id);
  }
};
