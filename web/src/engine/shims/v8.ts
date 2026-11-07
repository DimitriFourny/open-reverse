// Browser replacement for `node:v8` serialize/deserialize.
//
// The bytes only round-trip through this module (they are not V8's wire format), but the
// semantics follow V8's structured serializer for plain data: plain objects (own enumerable
// string keys in property order, `undefined` fields kept), arrays (length and holes kept),
// Map, Set, Date, ArrayBuffer, typed arrays, DataView, bigint, every number including -0 and
// NaN, and strings with lone surrogates. Shared substructure and cycles are preserved.
// Functions, symbols and objects with a non-plain prototype throw a TypeError.
//
// Format: a two-byte header, then the value in pre-order. Each value starts with a tag byte.
// Containers get an id in order of first appearance and later occurrences are written as
// REF + id. Strings of up to STRING_TABLE_MAX code units are interned the same way (STR_REF).
// Lengths are unsigned LEB128 varints; small integers are zigzag varints. Both directions
// walk with an explicit stack, so nesting depth is limited only by memory.

const MAGIC = 0xd8;
const FORMAT_VERSION = 1;

const T_UNDEFINED = 0;
const T_NULL = 1;
const T_TRUE = 2;
const T_FALSE = 3;
const T_INT = 4; // zigzag varint, int32 range, never -0
const T_DOUBLE = 5; // float64 LE
const T_BIG_U32 = 6;
const T_BIG_U64 = 7;
const T_BIG_I64 = 8;
const T_BIG_HEX = 9; // sign byte, varint length, ASCII hex digits of magnitude
const T_STR_ASCII = 10; // varint length, bytes
const T_STR_UTF8 = 11; // varint byte length, UTF-8 bytes (well-formed strings only)
const T_STR_UTF16 = 12; // varint unit count, UTF-16LE units
const T_STR_REF = 13; // varint string-table index
const T_REF = 14; // varint object id
const T_HOLE = 15; // array hole
const T_ARRAY = 16; // varint length, elements
const T_OBJECT = 17; // varint key count, (key string, value) pairs
const T_MAP = 18; // varint size, (key, value) pairs
const T_SET = 19; // varint size, values
const T_DATE = 20; // float64 time value
const T_ARRAY_BUFFER = 21; // varint byte length, bytes
const T_VIEW = 22; // view kind byte, varint byte length, bytes

const STRING_TABLE_MAX = 64;
const SHORT_STRING = 32;

// Frame kinds for the explicit walk stacks.
const F_ARRAY = 0;
const F_OBJECT = 1;
const F_MAP = 2;
const F_SET = 3;

type ViewCtor = { new (buffer: ArrayBuffer, byteOffset?: number, length?: number): ArrayBufferView };

const VIEW_KINDS: (ViewCtor | undefined)[] = [
  Uint8Array,
  Int8Array,
  Uint8ClampedArray,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  Float32Array,
  Float64Array,
  typeof BigInt64Array === 'function' ? BigInt64Array : undefined,
  typeof BigUint64Array === 'function' ? BigUint64Array : undefined,
  DataView as unknown as ViewCtor,
  typeof (globalThis as { Float16Array?: ViewCtor }).Float16Array === 'function'
    ? (globalThis as { Float16Array?: ViewCtor }).Float16Array
    : undefined,
];

function viewKind(view: ArrayBufferView): number {
  if (view instanceof DataView) return 11;
  // A Node Buffer is a Uint8Array subclass and comes back as a plain Uint8Array.
  for (let i = 0; i < VIEW_KINDS.length; i++) {
    const ctor = VIEW_KINDS[i];
    if (ctor !== undefined && i !== 11 && view instanceof ctor) return i;
  }
  throw new TypeError('Unsupported ArrayBuffer view could not be cloned');
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8');

const hasIsWellFormed = typeof (String.prototype as { isWellFormed?: unknown }).isWellFormed === 'function';

function isWellFormed(s: string): boolean {
  if (hasIsWellFormed) return (s as unknown as { isWellFormed(): boolean }).isWellFormed();
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0xd800 || c > 0xdfff) continue;
    if (c > 0xdbff) return false;
    const d = s.charCodeAt(i + 1);
    if (!(d >= 0xdc00 && d <= 0xdfff)) return false;
    i++;
  }
  return true;
}

function isPlainPrototype(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

class Encoder {
  bytes: Uint8Array = new Uint8Array(1 << 16);
  view: DataView = new DataView(this.bytes.buffer);
  pos = 0;
  busy = false;
  ids = new Map<object, number>();
  strings = new Map<string, number>();
  // Walk stack, as parallel arrays to avoid a frame object per container.
  fKind: number[] = [];
  fObj: unknown[] = [];
  fIter: unknown[] = []; // keys array (object) or iterator (Map/Set)
  fIdx: number[] = [];
  fLen: number[] = [];
  fPending: unknown[] = []; // Map value waiting to be written after its key
  sp = 0;

  grow(need: number): void {
    let size = this.bytes.length * 2;
    while (size < this.pos + need) size *= 2;
    const next = new Uint8Array(size);
    next.set(this.bytes.subarray(0, this.pos));
    this.bytes = next;
    this.view = new DataView(next.buffer);
  }

  ensure(need: number): void {
    if (this.pos + need > this.bytes.length) this.grow(need);
  }

  u8(b: number): void {
    if (this.pos >= this.bytes.length) this.grow(1);
    this.bytes[this.pos++] = b;
  }

  varint(n: number): void {
    // n is a non-negative integer below 2^53.
    this.ensure(8);
    const bytes = this.bytes;
    let pos = this.pos;
    while (n >= 0x80) {
      bytes[pos++] = (n & 0x7f) | 0x80;
      n = Math.floor(n / 128);
    }
    bytes[pos++] = n;
    this.pos = pos;
  }

  tagVarint(tag: number, n: number): void {
    this.ensure(9);
    const bytes = this.bytes;
    let pos = this.pos;
    bytes[pos++] = tag;
    while (n >= 0x80) {
      bytes[pos++] = (n & 0x7f) | 0x80;
      n = Math.floor(n / 128);
    }
    bytes[pos++] = n;
    this.pos = pos;
  }

  f64(x: number): void {
    this.ensure(8);
    this.view.setFloat64(this.pos, x, true);
    this.pos += 8;
  }

  raw(src: Uint8Array): void {
    this.ensure(src.length);
    this.bytes.set(src, this.pos);
    this.pos += src.length;
  }

  string(s: string): void {
    const n = s.length;
    if (n <= STRING_TABLE_MAX) {
      const id = this.strings.get(s);
      if (id !== undefined) {
        this.tagVarint(T_STR_REF, id);
        return;
      }
      this.strings.set(s, this.strings.size);
    }
    if (n <= SHORT_STRING) {
      this.ensure(2 + n);
      const bytes = this.bytes;
      const start = this.pos;
      bytes[start] = T_STR_ASCII;
      bytes[start + 1] = n;
      let pos = start + 2;
      let i = 0;
      for (; i < n; i++) {
        const c = s.charCodeAt(i);
        if (c >= 0x80) break;
        bytes[pos++] = c;
      }
      if (i === n) {
        this.pos = pos;
        return;
      }
      this.pos = start; // not ASCII: rewrite below
    }
    if (isWellFormed(s)) {
      const max = n * 3;
      // Varint width for the worst-case byte length, written padded so the length can be
      // filled in after encoding without moving the bytes.
      const width = max < 0x80 ? 1 : max < 0x4000 ? 2 : max < 0x200000 ? 3 : max < 0x10000000 ? 4 : 5;
      this.ensure(1 + width + max);
      this.bytes[this.pos] = T_STR_UTF8;
      const lenAt = this.pos + 1;
      const dataAt = lenAt + width;
      const written = utf8Encoder.encodeInto(s, this.bytes.subarray(dataAt, dataAt + max)).written;
      let len = written;
      for (let k = 0; k < width; k++) {
        this.bytes[lenAt + k] = (len & 0x7f) | (k < width - 1 ? 0x80 : 0);
        len = Math.floor(len / 128);
      }
      this.pos = dataAt + written;
      return;
    }
    this.tagVarint(T_STR_UTF16, n);
    this.ensure(n * 2);
    const view = this.view;
    let pos = this.pos;
    for (let i = 0; i < n; i++, pos += 2) view.setUint16(pos, s.charCodeAt(i), true);
    this.pos = pos;
  }

  bigint(v: bigint): void {
    if (v >= 0n) {
      if (v <= 0xffffffffn) {
        this.ensure(5);
        this.bytes[this.pos] = T_BIG_U32;
        this.view.setUint32(this.pos + 1, Number(v), true);
        this.pos += 5;
        return;
      }
      if (v <= 0xffffffffffffffffn) {
        this.ensure(9);
        this.bytes[this.pos] = T_BIG_U64;
        this.view.setBigUint64(this.pos + 1, v, true);
        this.pos += 9;
        return;
      }
    } else if (v >= -0x8000000000000000n) {
      this.ensure(9);
      this.bytes[this.pos] = T_BIG_I64;
      this.view.setBigInt64(this.pos + 1, v, true);
      this.pos += 9;
      return;
    }
    const negative = v < 0n;
    const hex = (negative ? -v : v).toString(16);
    this.u8(T_BIG_HEX);
    this.u8(negative ? 1 : 0);
    this.varint(hex.length);
    this.ensure(hex.length);
    for (let i = 0; i < hex.length; i++) this.bytes[this.pos++] = hex.charCodeAt(i);
  }

  push(kind: number, obj: unknown, iter: unknown, len: number): void {
    const sp = this.sp++;
    this.fKind[sp] = kind;
    this.fObj[sp] = obj;
    this.fIter[sp] = iter;
    this.fIdx[sp] = 0;
    this.fLen[sp] = len;
    this.fPending[sp] = undefined;
  }

  /** Write one value; a container seen for the first time gets its header written and a frame
   * pushed, and its children are written by the run loop. */
  value(v: unknown): void {
    switch (typeof v) {
      case 'number':
        if ((v | 0) === v && !(v === 0 && 1 / v < 0)) {
          this.tagVarint(T_INT, v >= 0 ? v * 2 : -v * 2 - 1);
        } else {
          this.u8(T_DOUBLE);
          this.f64(v);
        }
        return;
      case 'string':
        this.string(v);
        return;
      case 'boolean':
        this.u8(v ? T_TRUE : T_FALSE);
        return;
      case 'undefined':
        this.u8(T_UNDEFINED);
        return;
      case 'bigint':
        this.bigint(v);
        return;
      case 'object':
        if (v === null) {
          this.u8(T_NULL);
          return;
        }
        break;
      default:
        throw new TypeError(`${String(typeof v === 'symbol' ? v.toString() : v)} could not be cloned`);
    }
    const id = this.ids.get(v);
    if (id !== undefined) {
      this.tagVarint(T_REF, id);
      return;
    }
    this.ids.set(v, this.ids.size);
    if (Array.isArray(v)) {
      const len = v.length;
      this.tagVarint(T_ARRAY, len);
      if (len > 0) this.push(F_ARRAY, v, null, len);
      return;
    }
    if (isPlainPrototype(v)) {
      const keys = Object.keys(v);
      this.tagVarint(T_OBJECT, keys.length);
      if (keys.length > 0) this.push(F_OBJECT, v, keys, keys.length);
      return;
    }
    if (v instanceof Map) {
      this.tagVarint(T_MAP, v.size);
      if (v.size > 0) this.push(F_MAP, v, v.entries(), v.size);
      return;
    }
    if (v instanceof Set) {
      this.tagVarint(T_SET, v.size);
      if (v.size > 0) this.push(F_SET, v, v.values(), v.size);
      return;
    }
    if (ArrayBuffer.isView(v)) {
      const kind = viewKind(v);
      this.u8(T_VIEW);
      this.u8(kind);
      this.varint(v.byteLength);
      this.raw(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
      return;
    }
    if (v instanceof ArrayBuffer) {
      this.tagVarint(T_ARRAY_BUFFER, v.byteLength);
      this.raw(new Uint8Array(v));
      return;
    }
    if (v instanceof Date) {
      this.u8(T_DATE);
      this.f64(v.getTime());
      return;
    }
    throw new TypeError(`${Object.prototype.toString.call(v)} could not be cloned`);
  }

  run(root: unknown): void {
    this.value(root);
    while (this.sp > 0) {
      const top = this.sp - 1;
      const idx = this.fIdx[top]!;
      if (idx >= this.fLen[top]!) {
        this.sp = top;
        this.fObj[top] = undefined;
        this.fIter[top] = undefined;
        continue;
      }
      switch (this.fKind[top]) {
        case F_ARRAY: {
          this.fIdx[top] = idx + 1;
          const arr = this.fObj[top] as unknown[];
          const item = arr[idx];
          if (item === undefined && !(idx in arr)) this.u8(T_HOLE);
          else this.value(item);
          break;
        }
        case F_OBJECT: {
          this.fIdx[top] = idx + 1;
          const key = (this.fIter[top] as string[])[idx]!;
          this.string(key);
          this.value((this.fObj[top] as Record<string, unknown>)[key]);
          break;
        }
        case F_MAP: {
          // idx counts entries; the pending slot holds the value between key and value writes.
          const pending = this.fPending[top];
          if (pending !== undefined) {
            this.fPending[top] = undefined;
            this.fIdx[top] = idx + 1;
            this.value((pending as [unknown, unknown])[1]);
          } else {
            const next = (this.fIter[top] as Iterator<[unknown, unknown]>).next();
            if (next.done) {
              this.fLen[top] = idx; // map shrank during the walk: stop
              break;
            }
            this.fPending[top] = next.value;
            this.value(next.value[0]);
          }
          break;
        }
        case F_SET: {
          const next = (this.fIter[top] as Iterator<unknown>).next();
          if (next.done) {
            this.fLen[top] = idx;
            break;
          }
          this.fIdx[top] = idx + 1;
          this.value(next.value);
          break;
        }
      }
    }
  }

  reset(): void {
    this.pos = 0;
    this.sp = 0;
    this.ids.clear();
    this.strings.clear();
    this.fObj.length = 0;
    this.fIter.length = 0;
    this.fPending.length = 0;
  }
}

let cachedEncoder: Encoder | null = null;

export function serialize(value: unknown): Uint8Array {
  // A getter could call serialize re-entrantly; that call gets its own encoder.
  const enc = cachedEncoder !== null && !cachedEncoder.busy ? cachedEncoder : new Encoder();
  cachedEncoder ??= enc;
  enc.busy = true;
  let out: Uint8Array;
  try {
    enc.reset();
    enc.u8(MAGIC);
    enc.u8(FORMAT_VERSION);
    enc.run(value);
    out = enc.bytes.slice(0, enc.pos);
  } finally {
    enc.reset();
    enc.busy = false;
    // Do not pin a huge scratch buffer forever.
    if (enc.bytes.length > 1 << 24) {
      enc.bytes = new Uint8Array(1 << 16);
      enc.view = new DataView(enc.bytes.buffer);
    }
  }
  const NodeBuffer = (globalThis as { Buffer?: { from(b: ArrayBuffer, o: number, l: number): Uint8Array } })
    .Buffer;
  return NodeBuffer ? NodeBuffer.from(out.buffer as ArrayBuffer, out.byteOffset, out.length) : out;
}

function corrupt(): never {
  throw new TypeError('Unable to deserialize cloned data');
}

class Decoder {
  bytes: Uint8Array;
  view: DataView;
  pos = 0;
  end: number;
  objs: unknown[] = [];
  strs: string[] = [];
  fKind: number[] = [];
  fObj: unknown[] = [];
  fIdx: number[] = [];
  fLen: number[] = [];
  fKey: unknown[] = [];
  fHasKey: boolean[] = [];
  sp = 0;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.end = bytes.length;
  }

  need(n: number): void {
    if (this.pos + n > this.end) corrupt();
  }

  u8(): number {
    if (this.pos >= this.end) corrupt();
    return this.bytes[this.pos++]!;
  }

  varint(): number {
    const bytes = this.bytes;
    let pos = this.pos;
    if (pos >= this.end) corrupt();
    let b = bytes[pos++]!;
    if (b < 0x80) {
      this.pos = pos;
      return b;
    }
    let result = b & 0x7f;
    let scale = 128;
    for (;;) {
      if (pos >= this.end || scale > 2 ** 56) corrupt();
      b = bytes[pos++]!;
      result += (b & 0x7f) * scale;
      if (b < 0x80) break;
      scale *= 128;
    }
    this.pos = pos;
    return result;
  }

  f64(): number {
    this.need(8);
    const x = this.view.getFloat64(this.pos, true);
    this.pos += 8;
    return x;
  }

  copy(n: number): Uint8Array {
    this.need(n);
    // Not bytes.slice(): on a Node Buffer that is a view, not a copy.
    const out = new Uint8Array(n);
    out.set(this.bytes.subarray(this.pos, this.pos + n));
    this.pos += n;
    return out;
  }

  intern(s: string): string {
    if (s.length <= STRING_TABLE_MAX) this.strs.push(s);
    return s;
  }

  stringAfterTag(tag: number): string {
    switch (tag) {
      case T_STR_REF: {
        const s = this.strs[this.varint()];
        if (s === undefined) corrupt();
        return s;
      }
      case T_STR_ASCII: {
        const n = this.varint();
        this.need(n);
        const bytes = this.bytes;
        let pos = this.pos;
        let s = '';
        if (n <= 64) {
          for (let i = 0; i < n; i++) s += String.fromCharCode(bytes[pos++]!);
        } else {
          s = utf8Decoder.decode(bytes.subarray(pos, pos + n));
          pos += n;
        }
        this.pos = pos;
        return this.intern(s);
      }
      case T_STR_UTF8: {
        const n = this.varint();
        this.need(n);
        const s = utf8Decoder.decode(this.bytes.subarray(this.pos, this.pos + n));
        this.pos += n;
        return this.intern(s);
      }
      case T_STR_UTF16: {
        const n = this.varint();
        this.need(n * 2);
        const view = this.view;
        let pos = this.pos;
        let s = '';
        const units: number[] = [];
        for (let i = 0; i < n; i++, pos += 2) {
          units.push(view.getUint16(pos, true));
          if (units.length === 4096) {
            s += String.fromCharCode.apply(null, units);
            units.length = 0;
          }
        }
        if (units.length) s += String.fromCharCode.apply(null, units);
        this.pos = pos;
        return this.intern(s);
      }
    }
    return corrupt();
  }

  push(kind: number, obj: unknown, len: number): void {
    const sp = this.sp++;
    this.fKind[sp] = kind;
    this.fObj[sp] = obj;
    this.fIdx[sp] = 0;
    this.fLen[sp] = len;
    this.fHasKey[sp] = false;
    this.fKey[sp] = undefined;
  }

  value(): unknown {
    const tag = this.u8();
    switch (tag) {
      case T_UNDEFINED:
        return undefined;
      case T_NULL:
        return null;
      case T_TRUE:
        return true;
      case T_FALSE:
        return false;
      case T_INT: {
        const z = this.varint();
        return z % 2 === 0 ? z / 2 : -(z + 1) / 2;
      }
      case T_DOUBLE:
        return this.f64();
      case T_BIG_U32: {
        this.need(4);
        const v = BigInt(this.view.getUint32(this.pos, true));
        this.pos += 4;
        return v;
      }
      case T_BIG_U64: {
        this.need(8);
        const v = this.view.getBigUint64(this.pos, true);
        this.pos += 8;
        return v;
      }
      case T_BIG_I64: {
        this.need(8);
        const v = this.view.getBigInt64(this.pos, true);
        this.pos += 8;
        return v;
      }
      case T_BIG_HEX: {
        const negative = this.u8() === 1;
        const n = this.varint();
        this.need(n);
        let hex = '';
        for (let i = 0; i < n; i++) hex += String.fromCharCode(this.bytes[this.pos++]!);
        const magnitude = BigInt('0x' + hex);
        return negative ? -magnitude : magnitude;
      }
      case T_STR_ASCII:
      case T_STR_UTF8:
      case T_STR_UTF16:
      case T_STR_REF:
        return this.stringAfterTag(tag);
      case T_REF: {
        const id = this.varint();
        if (id >= this.objs.length) corrupt();
        return this.objs[id];
      }
      case T_ARRAY: {
        const len = this.varint();
        if (len > 0xffffffff) corrupt();
        // Each element takes at least a byte, so a valid length is bounded by the input.
        if (len > this.end - this.pos) corrupt();
        const arr: unknown[] = new Array(len);
        this.objs.push(arr);
        if (len > 0) this.push(F_ARRAY, arr, len);
        return arr;
      }
      case T_OBJECT: {
        const len = this.varint();
        const obj: Record<string, unknown> = {};
        this.objs.push(obj);
        if (len > 0) this.push(F_OBJECT, obj, len);
        return obj;
      }
      case T_MAP: {
        const len = this.varint();
        const map = new Map<unknown, unknown>();
        this.objs.push(map);
        if (len > 0) this.push(F_MAP, map, len);
        return map;
      }
      case T_SET: {
        const len = this.varint();
        const set = new Set<unknown>();
        this.objs.push(set);
        if (len > 0) this.push(F_SET, set, len);
        return set;
      }
      case T_DATE: {
        const d = new Date(this.f64());
        this.objs.push(d);
        return d;
      }
      case T_ARRAY_BUFFER: {
        const buf = this.copy(this.varint()).buffer;
        this.objs.push(buf);
        return buf;
      }
      case T_VIEW: {
        const kind = this.u8();
        const ctor = VIEW_KINDS[kind];
        if (ctor === undefined) corrupt();
        const n = this.varint();
        const buf = this.copy(n).buffer as ArrayBuffer;
        const view = new ctor(buf);
        this.objs.push(view);
        return view;
      }
    }
    return corrupt();
  }

  run(): unknown {
    const root = this.value();
    while (this.sp > 0) {
      const top = this.sp - 1;
      const idx = this.fIdx[top]!;
      if (idx >= this.fLen[top]!) {
        this.sp = top;
        this.fObj[top] = undefined;
        this.fKey[top] = undefined;
        continue;
      }
      switch (this.fKind[top]) {
        case F_ARRAY: {
          this.fIdx[top] = idx + 1;
          const arr = this.fObj[top] as unknown[];
          if (this.pos < this.end && this.bytes[this.pos] === T_HOLE) this.pos++;
          else arr[idx] = this.value();
          break;
        }
        case F_OBJECT: {
          this.fIdx[top] = idx + 1;
          const obj = this.fObj[top] as Record<string, unknown>;
          const key = this.stringAfterTag(this.u8());
          const v = this.value();
          if (key === '__proto__')
            Object.defineProperty(obj, key, { value: v, writable: true, enumerable: true, configurable: true });
          else obj[key] = v;
          break;
        }
        case F_MAP: {
          if (this.fHasKey[top]) {
            const key = this.fKey[top];
            this.fHasKey[top] = false;
            this.fKey[top] = undefined;
            this.fIdx[top] = idx + 1;
            (this.fObj[top] as Map<unknown, unknown>).set(key, this.value());
          } else {
            const key = this.value();
            this.fKey[top] = key;
            this.fHasKey[top] = true;
          }
          break;
        }
        case F_SET: {
          this.fIdx[top] = idx + 1;
          (this.fObj[top] as Set<unknown>).add(this.value());
          break;
        }
      }
    }
    return root;
  }
}

export function deserialize(bytes: Uint8Array): unknown {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('deserialize expects a Uint8Array');
  if (bytes.length < 2 || bytes[0] !== MAGIC || bytes[1] !== FORMAT_VERSION) corrupt();
  const dec = new Decoder(bytes);
  dec.pos = 2;
  const value = dec.run();
  if (dec.pos !== dec.end) corrupt();
  return value;
}

export default { serialize, deserialize };
