// Minimal ZIP reader/writer (no dependency): stored or deflated entries, UTF-8
// names, no ZIP64 (entries and archives under 4 GiB, at most 65535 entries).
// Deflate uses the platform's CompressionStream('deflate-raw'), available in
// browsers, workers and Node 18+. The reader is defensive: it trusts only the
// central directory, bounds every offset, caps inflated sizes while
// streaming (zip bombs) and checks each entry's CRC-32 and size.

export interface ZipEntry {
  path: string;
  data: Uint8Array;
}

export interface ZipLimits {
  /** Most entries accepted (directories included). */
  maxEntries: number;
  /** Largest inflated entry. */
  maxEntryBytes: number;
  /** Largest sum of inflated entries. */
  maxTotalBytes: number;
}

export const DEFAULT_ZIP_LIMITS: ZipLimits = {
  maxEntries: 200_000,
  maxEntryBytes: 1024 * 1024 * 1024,
  maxTotalBytes: 2 * 1024 * 1024 * 1024 - 1,
};

export class ZipError extends Error {}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Runs bytes through a (de)compression stream, failing once the output exceeds `limit`. */
async function transform(data: Uint8Array, stream: CompressionStream | DecompressionStream, limit: number): Promise<Uint8Array> {
  const reader = new Blob([data as Uint8Array<ArrayBuffer>]).stream().pipeThrough(stream).getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel().catch(() => undefined);
      throw new ZipError('An entry inflates beyond its declared size');
    }
    chunks.push(value);
  }
  if (chunks.length === 1) return chunks[0]!;
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}

function dosDateTime(date: Date): { time: number; date: number } {
  const y = Math.max(1980, Math.min(2107, date.getFullYear()));
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    date: ((y - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: true });

/**
 * Builds a ZIP archive. Entries are deflated when that makes them smaller.
 * `onEntry` is called after each entry (progress).
 */
export async function zipEncode(
  entries: Iterable<ZipEntry>,
  opts: { date?: Date; compress?: boolean; onEntry?: (index: number) => void; signal?: AbortSignal } = {},
): Promise<Uint8Array> {
  const { time, date } = dosDateTime(opts.date ?? new Date());
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  const seen = new Set<string>();
  let offset = 0;
  let count = 0;
  for (const entry of entries) {
    opts.signal?.throwIfAborted();
    if (seen.has(entry.path)) throw new ZipError(`Duplicate entry ${entry.path}`);
    seen.add(entry.path);
    const name = enc.encode(entry.path);
    if (name.length > 0xffff) throw new ZipError(`Entry name too long: ${entry.path.slice(0, 80)}…`);
    if (entry.data.byteLength >= 0xffffffff) throw new ZipError(`Entry too large for ZIP (no ZIP64): ${entry.path}`);
    const crc = crc32(entry.data);
    let method = 0;
    let body = entry.data;
    if (opts.compress !== false && entry.data.byteLength > 64) {
      const deflated = await transform(entry.data, new CompressionStream('deflate-raw'), entry.data.byteLength + 1024);
      if (deflated.byteLength < entry.data.byteLength) {
        method = 8;
        body = deflated;
      }
    }
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8 names
    lv.setUint16(8, method, true);
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, body.byteLength, true);
    lv.setUint32(22, entry.data.byteLength, true);
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true);
    local.set(name, 30);

    const cd = new Uint8Array(46 + name.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, (3 << 8) | 20, true); // made by: Unix, 2.0
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, method, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, body.byteLength, true);
    cv.setUint32(24, entry.data.byteLength, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(38, (0o100644 << 16) >>> 0, true); // regular file, rw-r--r--
    cv.setUint32(42, offset, true);
    cd.set(name, 46);

    parts.push(local, body);
    central.push(cd);
    offset += local.byteLength + body.byteLength;
    if (offset >= 0xffffffff) throw new ZipError('Archive too large for ZIP (no ZIP64)');
    count++;
    if (count > 0xffff) throw new ZipError('Too many entries for ZIP (no ZIP64)');
    opts.onEntry?.(count - 1);
  }
  const cdSize = central.reduce((n, c) => n + c.byteLength, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, count, true);
  ev.setUint16(10, count, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + cdSize + 22);
  let p = 0;
  for (const part of [...parts, ...central, eocd]) {
    out.set(part, p);
    p += part.byteLength;
  }
  return out;
}

interface CentralRecord {
  path: string;
  method: number;
  flags: number;
  crc: number;
  csize: number;
  usize: number;
  offset: number;
}

function readCentral(bytes: Uint8Array, limits: ZipLimits): CentralRecord[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const min = Math.max(0, bytes.length - 22 - 0xffff);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= min; i--)
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  if (eocd < 0) throw new ZipError('Not a ZIP archive (no end of central directory)');
  const disk = view.getUint16(eocd + 4, true);
  const count = view.getUint16(eocd + 10, true);
  const cdSize = view.getUint32(eocd + 12, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (disk !== 0 || view.getUint16(eocd + 8, true) !== count) throw new ZipError('Multi-disk ZIP archives are not supported');
  if (count === 0xffff || cdOffset === 0xffffffff) throw new ZipError('ZIP64 archives are not supported');
  if (count > limits.maxEntries) throw new ZipError(`Too many entries (${count} > ${limits.maxEntries})`);
  if (cdOffset + cdSize > eocd) throw new ZipError('Corrupt ZIP central directory');
  const out: CentralRecord[] = [];
  let p = cdOffset;
  for (let i = 0; i < count; i++) {
    if (p + 46 > cdOffset + cdSize || view.getUint32(p, true) !== 0x02014b50) throw new ZipError('Corrupt ZIP central directory entry');
    const flags = view.getUint16(p + 8, true);
    const method = view.getUint16(p + 10, true);
    const crc = view.getUint32(p + 16, true);
    const csize = view.getUint32(p + 20, true);
    const usize = view.getUint32(p + 24, true);
    const nlen = view.getUint16(p + 28, true);
    const elen = view.getUint16(p + 30, true);
    const clen = view.getUint16(p + 32, true);
    const offset = view.getUint32(p + 42, true);
    if (p + 46 + nlen + elen + clen > cdOffset + cdSize) throw new ZipError('Corrupt ZIP central directory entry');
    let path: string;
    try {
      path = dec.decode(bytes.subarray(p + 46, p + 46 + nlen));
    } catch {
      throw new ZipError('ZIP entry name is not valid UTF-8');
    }
    out.push({ path, method, flags, crc, csize, usize, offset });
    p += 46 + nlen + elen + clen;
  }
  return out;
}

/** Reads every entry of a ZIP archive, within `limits`. Directory entries are returned with empty data. */
export async function zipDecode(bytes: Uint8Array, limits: ZipLimits = DEFAULT_ZIP_LIMITS, signal?: AbortSignal): Promise<ZipEntry[]> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const records = readCentral(bytes, limits);
  const out: ZipEntry[] = [];
  let total = 0;
  for (const r of records) {
    signal?.throwIfAborted();
    if (r.flags & 0x41) throw new ZipError(`Encrypted ZIP entries are not supported (${r.path})`);
    if (r.method !== 0 && r.method !== 8) throw new ZipError(`Unsupported compression method ${r.method} (${r.path})`);
    if (r.usize > limits.maxEntryBytes) throw new ZipError(`Entry too large: ${r.path}`);
    total += r.usize;
    if (total > limits.maxTotalBytes) throw new ZipError('Archive inflates beyond the size limit');
    if (r.offset + 30 > bytes.length || view.getUint32(r.offset, true) !== 0x04034b50) throw new ZipError(`Corrupt ZIP local header (${r.path})`);
    const start = r.offset + 30 + view.getUint16(r.offset + 26, true) + view.getUint16(r.offset + 28, true);
    if (start + r.csize > bytes.length) throw new ZipError(`Truncated ZIP entry (${r.path})`);
    const raw = bytes.subarray(start, start + r.csize);
    let data: Uint8Array;
    if (r.method === 0) {
      if (r.csize !== r.usize) throw new ZipError(`Corrupt stored entry (${r.path})`);
      data = raw.slice();
    } else {
      try {
        data = await transform(raw, new DecompressionStream('deflate-raw'), r.usize);
      } catch (e) {
        throw e instanceof ZipError ? new ZipError(`${e.message} (${r.path})`) : new ZipError(`Corrupt deflate data (${r.path})`);
      }
    }
    if (data.byteLength !== r.usize) throw new ZipError(`Entry size mismatch (${r.path})`);
    if (crc32(data) !== r.crc) throw new ZipError(`CRC mismatch (${r.path})`);
    out.push({ path: r.path, data });
  }
  return out;
}
