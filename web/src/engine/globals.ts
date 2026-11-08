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

// The polyfill encodes and decodes UTF-8 in JavaScript; OpenDecomp frames every worker
// message through it. Use the native TextEncoder/TextDecoder for the common cases.
{
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const isUtf8 = (e: unknown) => e === undefined || e === 'utf8' || e === 'utf-8';
  const B = Buffer as unknown as Record<string, (...a: unknown[]) => unknown>;
  const from = B.from!;
  B.from = function (value: unknown, enc2?: unknown, len?: unknown) {
    if (typeof value === 'string' && isUtf8(enc2)) {
      const bytes = enc.encode(value);
      return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    }
    return from.call(Buffer, value, enc2, len);
  };
  const byteLength = B.byteLength!;
  B.byteLength = function (value: unknown, enc2?: unknown) {
    if (typeof value === 'string' && isUtf8(enc2)) {
      // UTF-8 length without allocating: count code units by range.
      let n = 0;
      for (let i = 0; i < value.length; i++) {
        const c = value.charCodeAt(i);
        if (c < 0x80) n += 1;
        else if (c < 0x800) n += 2;
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < value.length && (value.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
          n += 4;
          i++;
        } else n += 3;
      }
      return n;
    }
    return byteLength.call(Buffer, value, enc2);
  };
  const proto = Buffer.prototype as unknown as {
    toString: (e?: string, s?: number, t?: number) => string;
    write: (str: string, offset?: unknown, length?: unknown, encoding?: unknown) => number;
  };
  const toString = proto.toString;
  proto.toString = function (this: Uint8Array, e?: string, start?: number, end?: number) {
    if (isUtf8(e)) {
      const s0 = Math.max(0, start ?? 0);
      const e0 = Math.min(this.length, end ?? this.length);
      return s0 >= e0 ? '' : dec.decode(this.subarray(s0, e0));
    }
    return toString.call(this, e, start, end);
  };
  const write = proto.write;
  proto.write = function (this: Uint8Array, str: string, offset?: unknown, length?: unknown, encoding?: unknown) {
    if (typeof offset === 'number' && length === undefined && encoding === undefined)
      return enc.encodeInto(str, this.subarray(offset)).written;
    if (offset === undefined && length === undefined) return enc.encodeInto(str, this).written;
    return write.call(this, str, offset, length, encoding);
  };
}

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
