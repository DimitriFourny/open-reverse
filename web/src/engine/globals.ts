// Node globals OpenDecomp expects. Imported before anything else in the engine worker.
import { Buffer } from 'buffer';

const g = globalThis as Record<string, unknown>;
g.Buffer ??= Buffer;

// The npm buffer polyfill lacks Node's 'base64url' encoding (OpenDecomp's cursors use it).
{
  type Enc = BufferEncoding | 'base64url';
  const toB64 = (s: string) => {
    const t = s.replace(/-/g, '+').replace(/_/g, '/');
    return t + '='.repeat((4 - (t.length % 4)) % 4);
  };
  const toB64url = (s: string) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const B = Buffer as unknown as Record<string, (...a: unknown[]) => unknown>;
  const from = B.from!.bind(Buffer);
  B.from = (value: unknown, enc?: unknown, len?: unknown) =>
    typeof value === 'string' && enc === 'base64url' ? from(toB64(value), 'base64') : from(value, enc, len);
  const byteLength = B.byteLength!.bind(Buffer);
  B.byteLength = (value: unknown, enc?: unknown) => (typeof value === 'string' && enc === 'base64url' ? byteLength(toB64(value), 'base64') : byteLength(value, enc));
  const isEncoding = B.isEncoding!.bind(Buffer);
  B.isEncoding = (enc: unknown) => enc === 'base64url' || isEncoding(enc);
  const proto = Buffer.prototype as unknown as { toString: (enc?: Enc, start?: number, end?: number) => string };
  const toString = proto.toString;
  proto.toString = function (this: Buffer, enc?: Enc, start?: number, end?: number) {
    return enc === 'base64url' ? toB64url(toString.call(this, 'base64', start, end)) : toString.call(this, enc, start, end);
  };
}
g.global ??= globalThis;
g.process ??= {
  env: {},
  argv: [],
  platform: 'browser',
  execPath: '/node',
  pid: 1,
  versions: { node: '24.0.0' },
  version: 'v24.0.0',
  exitCode: undefined,
  cwd: () => '/',
  nextTick: (fn: (...a: unknown[]) => void, ...args: unknown[]) => queueMicrotask(() => fn(...args)),
  on: () => undefined,
  once: () => undefined,
  off: () => undefined,
  emitWarning: () => undefined,
  memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 }),
  hrtime: Object.assign(
    (prev?: [number, number]) => {
      const t = performance.now();
      const s = Math.floor(t / 1000);
      const ns = Math.floor((t % 1000) * 1e6);
      return prev ? [s - prev[0], ns - prev[1]] : [s, ns];
    },
    { bigint: () => BigInt(Math.floor(performance.now() * 1e6)) },
  ),
  stdout: { write: () => true, writableLength: 0 },
  stderr: { write: () => true, writableLength: 0 },
};

// Node timers return handles with unref()/ref(); OpenDecomp calls them.
class Timeout {
  readonly id: number;
  constructor(id: number) {
    this.id = id;
  }
  unref(): this {
    return this;
  }
  ref(): this {
    return this;
  }
  hasRef(): boolean {
    return true;
  }
  refresh(): this {
    return this;
  }
  [Symbol.toPrimitive](): number {
    return this.id;
  }
}
type TimerFn = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
const nativeSetTimeout = globalThis.setTimeout.bind(globalThis) as unknown as TimerFn;
const nativeSetInterval = globalThis.setInterval.bind(globalThis) as unknown as TimerFn;
const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);
const nativeClearInterval = globalThis.clearInterval.bind(globalThis);
const unwrap = (t: unknown) => (t instanceof Timeout ? t.id : (t as number | undefined));
g.setTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => new Timeout(nativeSetTimeout(handler, timeout, ...args));
g.setInterval = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => new Timeout(nativeSetInterval(handler, timeout, ...args));
g.clearTimeout = (t: unknown) => nativeClearTimeout(unwrap(t));
g.clearInterval = (t: unknown) => nativeClearInterval(unwrap(t));
g.setImmediate ??= (fn: (...a: unknown[]) => void, ...args: unknown[]) => new Timeout(nativeSetTimeout(() => fn(...args), 0));
g.clearImmediate ??= (t: unknown) => nativeClearTimeout(unwrap(t));
