// Messages between the engine worker and a request-worker helper (helper.ts).

export interface ShippedFile {
  path: string;
  data: Uint8Array;
}

/** Engine → helper. */
export type HelperIn =
  | { type: 'files'; files: ShippedFile[] }
  | { type: 'stdin'; bytes: Uint8Array }
  | { type: 'end' };

/** Helper → engine. */
export type HelperOut =
  | { type: 'ready' }
  | { type: 'stdout'; bytes: Uint8Array; files: ShippedFile[] }
  | { type: 'exit'; code: number }
  | { type: 'log'; level: 'warn' | 'error'; text: string };

const decoder = new TextDecoder();

/**
 * The JSON values of the complete frames in `bytes` (OpenDecomp's worker
 * framing: 4-byte big-endian length, then UTF-8 JSON). OpenDecomp writes one
 * frame per write; a partial trailing frame is ignored here (the bytes are
 * still forwarded unchanged, so the receiver's own decoder sees everything).
 */
export function parseFrames(bytes: Uint8Array): unknown[] {
  const out: unknown[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  while (offset + 4 <= bytes.length) {
    const size = view.getUint32(offset);
    if (offset + 4 + size > bytes.length) break;
    try {
      out.push(JSON.parse(decoder.decode(bytes.subarray(offset + 4, offset + 4 + size))));
    } catch {
      break;
    }
    offset += 4 + size;
  }
  return out;
}
