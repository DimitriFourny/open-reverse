// node:zlib zstd for the browser. OpenDecomp compresses persisted prepared
// units; browser projects never exchange bytes with Node, so these are an
// identity transform behind a 4-byte marker.
import { Buffer } from 'buffer';

const MAGIC = [0x4f, 0x52, 0x5a, 0x30]; // "ORZ0"

export const constants = new Proxy({} as Record<string, number>, { get: (_t, key) => (typeof key === 'string' ? key.length : 0) });

export function zstdCompressSync(input: Uint8Array): Buffer {
  const out = Buffer.allocUnsafe(input.byteLength + 4);
  out.set(MAGIC, 0);
  out.set(input, 4);
  return out;
}

export function zstdDecompressSync(input: Uint8Array, options?: { maxOutputLength?: number }): Buffer {
  if (input.byteLength < 4 || MAGIC.some((b, i) => input[i] !== b)) throw new Error('Unsupported compressed payload (not written by OpenReverse)');
  if (options?.maxOutputLength !== undefined && input.byteLength - 4 > options.maxOutputLength) throw new RangeError('Decompressed payload exceeds maxOutputLength');
  return Buffer.from(input.subarray(4));
}

export default { constants, zstdCompressSync, zstdDecompressSync };
