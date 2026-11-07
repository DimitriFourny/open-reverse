// node:crypto subset: synchronous SHA-256 (OpenDecomp derives every identity from it).
import { sha256 } from '@noble/hashes/sha2.js';
import { Buffer } from 'buffer';

type Input = string | Uint8Array | ArrayBufferView;
const bytes = (data: Input, encoding?: string): Uint8Array =>
  typeof data === 'string'
    ? Buffer.from(data, (encoding as BufferEncoding | undefined) ?? 'utf8')
    : data instanceof Uint8Array
      ? data
      : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

function output(digest: Uint8Array, encoding?: string) {
  const buf = Buffer.from(digest.buffer, digest.byteOffset, digest.byteLength);
  return encoding ? buf.toString(encoding as BufferEncoding) : buf;
}

class Hash {
  #h = sha256.create();
  update(data: Input, encoding?: string): this {
    this.#h.update(bytes(data, encoding));
    return this;
  }
  digest(encoding?: string) {
    return output(this.#h.digest(), encoding);
  }
  copy(): Hash {
    const h = new Hash();
    h.#h = this.#h.clone();
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
  return output(sha256(bytes(data)), outputEncoding === 'buffer' ? undefined : outputEncoding);
}

export function randomBytes(n: number): Buffer {
  const b = Buffer.alloc(n);
  globalThis.crypto.getRandomValues(b);
  return b;
}

export const randomUUID = () => globalThis.crypto.randomUUID();

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) throw new RangeError('Input buffers must have the same byte length');
  let d = 0;
  for (let i = 0; i < a.byteLength; i++) d |= a[i]! ^ b[i]!;
  return d === 0;
}

export default { createHash, hash, randomBytes, randomUUID, timingSafeEqual };
