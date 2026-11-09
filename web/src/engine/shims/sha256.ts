// SHA-256 (FIPS 180-4) for the crypto shim. OpenDecomp derives every identity (instructions,
// references, evidence, cursors) from a SHA-256 of a short canonical string, hundreds of
// thousands of times while it analyses a binary, so the per-call cost matters more than the
// throughput: this one reuses its buffers, encodes strings with the native TextEncoder and
// writes hex through a table. Checked against node:crypto in test/engine-shims.test.ts.

const K = new Int32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
const IV = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const W = new Int32Array(64);
const HEX = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

/** Absorb the 64-byte blocks of `data` from `offset` into `state`; returns the offset after the last whole block. */
function blocks(state: Int32Array, data: Uint8Array, offset: number, end: number): number {
  let h0 = state[0]!, h1 = state[1]!, h2 = state[2]!, h3 = state[3]!, h4 = state[4]!, h5 = state[5]!, h6 = state[6]!, h7 = state[7]!;
  for (; offset + 64 <= end; offset += 64) {
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      W[i] = (data[j]! << 24) | (data[j + 1]! << 16) | (data[j + 2]! << 8) | data[j + 3]!;
    }
    for (let i = 16; i < 64; i++) {
      const a = W[i - 15]!, b = W[i - 2]!;
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      W[i] = (W[i - 16]! + s0 + W[i - 7]! + s1) | 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i]! + W[i]!) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }
  state[0] = h0;
  state[1] = h1;
  state[2] = h2;
  state[3] = h3;
  state[4] = h4;
  state[5] = h5;
  state[6] = h6;
  state[7] = h7;
  return offset;
}

const encoder = new TextEncoder();
let scratch = new Uint8Array(1024);

/** Incremental SHA-256. */
export class Sha256 {
  #state = new Int32Array(IV);
  /** The bytes not yet absorbed (less than a block). */
  #tail = new Uint8Array(64);
  #tailLength = 0;
  #length = 0;

  update(data: Uint8Array): this {
    this.#length += data.length;
    let offset = 0;
    if (this.#tailLength) {
      const take = Math.min(64 - this.#tailLength, data.length);
      this.#tail.set(data.subarray(0, take), this.#tailLength);
      this.#tailLength += take;
      offset = take;
      if (this.#tailLength < 64) return this;
      blocks(this.#state, this.#tail, 0, 64);
      this.#tailLength = 0;
    }
    offset = blocks(this.#state, data, offset, data.length);
    this.#tail.set(data.subarray(offset), 0);
    this.#tailLength = data.length - offset;
    return this;
  }

  /** UTF-8 text, encoded without an intermediate allocation when it fits the scratch buffer. */
  updateText(text: string): this {
    if (text.length * 3 > scratch.length) scratch = new Uint8Array(Math.max(text.length * 3, scratch.length * 2));
    const { written } = encoder.encodeInto(text, scratch);
    return this.update(scratch.subarray(0, written));
  }

  digest(): Uint8Array {
    const state = new Int32Array(this.#state);
    const pad = new Uint8Array(this.#tailLength < 56 ? 64 : 128);
    pad.set(this.#tail.subarray(0, this.#tailLength));
    pad[this.#tailLength] = 0x80;
    const bits = this.#length * 8;
    const view = new DataView(pad.buffer);
    view.setUint32(pad.length - 8, Math.floor(bits / 0x100000000));
    view.setUint32(pad.length - 4, bits >>> 0);
    blocks(state, pad, 0, pad.length);
    const out = new Uint8Array(32);
    const outView = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) outView.setInt32(i * 4, state[i]!);
    return out;
  }

  copy(): Sha256 {
    const h = new Sha256();
    h.#state.set(this.#state);
    h.#tail.set(this.#tail);
    h.#tailLength = this.#tailLength;
    h.#length = this.#length;
    return h;
  }
}

const oneShot = new Int32Array(8);

/** SHA-256 of UTF-8 `text` as hex, in one pass over a reused buffer (no allocation but the result). */
export function sha256TextHex(text: string): string {
  // Room for the padding (at most 72 bytes past the text's UTF-8 length).
  if (text.length * 3 + 72 > scratch.length) scratch = new Uint8Array(Math.max(text.length * 3 + 72, scratch.length * 2));
  const { written } = encoder.encodeInto(text, scratch);
  const total = (written + 72) & ~63;
  scratch[written] = 0x80;
  scratch.fill(0, written + 1, total - 4);
  const bits = written * 8;
  scratch[total - 4] = bits >>> 24;
  scratch[total - 3] = (bits >>> 16) & 255;
  scratch[total - 2] = (bits >>> 8) & 255;
  scratch[total - 1] = bits & 255;
  oneShot.set(IV);
  blocks(oneShot, scratch, 0, total);
  let out = '';
  for (let i = 0; i < 8; i++) {
    const v = oneShot[i]!;
    out += HEX[v >>> 24]! + HEX[(v >>> 16) & 255]! + HEX[(v >>> 8) & 255]! + HEX[v & 255]!;
  }
  return out;
}

export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += HEX[bytes[i]!]!;
  return out;
}
