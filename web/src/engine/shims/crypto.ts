// node:crypto subset: synchronous SHA-256 (OpenDecomp derives every identity from it).
import { Buffer } from 'buffer';
import { Sha256, sha256TextHex, toHex } from './sha256.ts';

type Input = string | Uint8Array | ArrayBufferView;

function absorb(h: Sha256, data: Input, encoding?: string): void {
  if (typeof data === 'string') {
    if (!encoding || encoding === 'utf8' || encoding === 'utf-8') h.updateText(data);
    else h.update(Buffer.from(data, encoding as BufferEncoding));
  } else h.update(data instanceof Uint8Array ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
}

function output(digest: Uint8Array, encoding?: string) {
  if (encoding === 'hex') return toHex(digest);
  const buf = Buffer.from(digest.buffer, digest.byteOffset, digest.byteLength);
  return encoding ? buf.toString(encoding as BufferEncoding) : buf;
}

class Hash {
  #h = new Sha256();
  update(data: Input, encoding?: string): this {
    absorb(this.#h, data, encoding);
    return this;
  }
  digest(encoding?: string) {
    return output(this.#h.digest(), encoding);
  }
  copy(): Hash {
    const h = new Hash();
    h.#h = this.#h.copy();
    return h;
  }
}

function check(algorithm: string) {
  if (algorithm.toLowerCase().replace('-', '') !== 'sha256') throw new Error(`Hash ${algorithm} is not available in the browser`);
}

export function createHash(algorithm: string): Hash {
  check(algorithm);
  return new Hash();
}

export function hash(algorithm: string, data: Input, outputEncoding: string = 'hex') {
  check(algorithm);
  // OpenDecomp's fingerprint(): the hex digest of a canonical string.
  if (typeof data === 'string' && outputEncoding === 'hex') return sha256TextHex(data);
  const h = new Sha256();
  absorb(h, data);
  return output(h.digest(), outputEncoding === 'buffer' ? undefined : outputEncoding);
}

export function randomBytes(n: number): Buffer {
  const b = Buffer.alloc(n);
  globalThis.crypto.getRandomValues(b);
  return b;
}

/** `crypto.randomUUID` exists only in secure contexts; build a v4 UUID from random bytes otherwise. */
export function randomUUID(): string {
  if (typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID();
  const b = globalThis.crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) throw new RangeError('Input buffers must have the same byte length');
  let d = 0;
  for (let i = 0; i < a.byteLength; i++) d |= a[i]! ^ b[i]!;
  return d === 0;
}

export default { createHash, hash, randomBytes, randomUUID, timingSafeEqual };
