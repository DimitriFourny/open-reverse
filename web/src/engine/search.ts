// Binary-wide search (bytes with wildcards, ASCII / UTF-16LE text, instruction
// operand values) and the navigation strip's map of the image. Pure logic over a
// small source interface, so it is testable without OpenDecomp; AnalysisSession
// provides the source (memory reads, per-function disassembly).

import type { TaskContext } from './tasks.ts';

export type SearchMode = 'bytes' | 'text' | 'immediate';

export interface SearchQuery {
  mode: SearchMode;
  text: string;
  /** Text: match case exactly (default: ASCII letters fold). */
  caseSensitive?: boolean;
  /** Text: which encodings to look for (default: both). */
  ascii?: boolean;
  utf16?: boolean;
}

export interface SearchHit {
  addr: string;
  /** What matched: a byte pattern, an ASCII or UTF-16LE string, or an instruction operand. */
  kind: 'bytes' | 'ascii' | 'utf16' | 'insn';
  /** Bytes (hex), the string around the match, or the instruction text. */
  preview: string;
  /** The function an instruction hit is in (others are located by the UI). */
  fn?: { id: string; name: string; entry: string };
}

export interface SearchResult {
  hits: SearchHit[];
  /** The hit limit was reached: there may be more. */
  truncated: boolean;
  /** Bytes or functions searched. */
  scanned: number;
  elapsedMs: number;
}

export const MAX_HITS = 1000;
const MAX_PATTERN = 256;
const READ = 65536;
/** Bytes after a match kept for its preview. */
const CONTEXT = 64;

export class SearchError extends Error {}

/** A byte pattern: `mask[i]` false is a wildcard; `fold[i]` matches an ASCII letter in either case. */
export interface Pattern {
  values: Uint8Array;
  mask: boolean[];
  fold: boolean[];
}

/**
 * `48 8B ?? 05`, `488B??05`, `48 8b ? 05`: hex byte pairs, `??` or `?` wildcards,
 * spaces optional between pairs.
 */
export function parseBytePattern(text: string): Pattern {
  const tokens = text.trim().split(/[\s,]+/).filter(Boolean);
  const values: number[] = [];
  const mask: boolean[] = [];
  for (const token of tokens) {
    if (token === '?' || token === '??') {
      values.push(0);
      mask.push(false);
      continue;
    }
    const t = token.replace(/^0x/i, '');
    if (!/^(?:[0-9a-f]{2}|\?\?)+$/i.test(t)) throw new SearchError(`Not a hex byte pattern: ${token}`);
    for (let i = 0; i < t.length; i += 2) {
      const pair = t.slice(i, i + 2);
      values.push(pair === '??' ? 0 : parseInt(pair, 16));
      mask.push(pair !== '??');
    }
  }
  if (values.length === 0) throw new SearchError('Type the bytes to search for, e.g. 48 8B ?? 05');
  if (!mask.some(Boolean)) throw new SearchError('A pattern needs at least one byte that is not a wildcard');
  return checked({ values: Uint8Array.from(values), mask, fold: values.map(() => false) });
}

/** Text as ASCII (Latin-1 bytes) or UTF-16LE code units. */
export function textPattern(text: string, encoding: 'ascii' | 'utf16', caseSensitive: boolean): Pattern {
  if (!text) throw new SearchError('Type the text to search for');
  const values: number[] = [];
  const fold: boolean[] = [];
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    const letter = !caseSensitive && /[a-z]/i.test(ch);
    if (encoding === 'ascii') {
      if (c > 0xff) throw new SearchError('ASCII text search takes Latin-1 characters only (use UTF-16)');
      values.push(c);
      fold.push(letter);
    } else {
      for (const unit of ch.length === 1 ? [c] : [ch.charCodeAt(0), ch.charCodeAt(1)]) {
        values.push(unit & 0xff, unit >> 8);
        fold.push(letter, false);
      }
    }
  }
  return checked({ values: Uint8Array.from(values), mask: values.map(() => true), fold });
}

function checked(p: Pattern): Pattern {
  if (p.values.length > MAX_PATTERN) throw new SearchError(`Patterns are limited to ${MAX_PATTERN} bytes`);
  return p;
}

/** Offsets in `buf[from, to)` where the pattern starts (it may run past `to`, not past the buffer). */
export function findAll(buf: Uint8Array, p: Pattern, from: number, to: number, onHit: (offset: number) => boolean | void): void {
  const n = p.values.length;
  // Anchor on the first exact byte with indexOf (native, fast); letters that fold are not exact.
  const anchor = p.mask.findIndex((m, i) => m && !p.fold[i]);
  const last = Math.min(to, buf.length - n + 1);
  const matchesAt = (i: number) => {
    for (let j = 0; j < n; j++) {
      if (!p.mask[j]) continue;
      const b = buf[i + j]!;
      const v = p.values[j]!;
      if (b !== v && !(p.fold[j] && (b | 0x20) === (v | 0x20))) return false;
    }
    return true;
  };
  if (anchor < 0) {
    for (let i = from; i < last; i++) if (matchesAt(i) && onHit(i) === false) return;
    return;
  }
  const a = p.values[anchor]!;
  let i = from;
  while (i < last) {
    const at = buf.indexOf(a, i + anchor);
    if (at < 0) return;
    const start = at - anchor;
    if (start >= last) return;
    if (start >= from && matchesAt(start) && onHit(start) === false) return;
    i = start + 1;
  }
}

/** A constant typed for the immediate search: `0x862`, `862h`, `2146`, `-8`. Plain digits are decimal. */
export function parseImmediate(text: string): bigint {
  const t = text.trim().toLowerCase().replace(/^#/, '');
  const m = /^(-)?(?:0x([0-9a-f]+)|([0-9][0-9a-f]*)h|([0-9]+))$/.exec(t);
  if (!m) throw new SearchError('Type a number: 0x862, 862h (hex) or 2146 (decimal)');
  const v = BigInt(m[2] !== undefined ? `0x${m[2]}` : m[3] !== undefined ? `0x${m[3]}` : m[4]!);
  return m[1] ? -v : v;
}

/** The numbers in disassembler operand text (`#0x10`, `[rsp+70h]`, `rbp-8`, `7`), negated after a minus. */
export function operandValues(operands: string): bigint[] {
  const out: bigint[] = [];
  for (const m of operands.matchAll(/(-)?(?<![\w.])(?:0x([0-9a-f]+)|([0-9][0-9a-f]*)h|([0-9]+))(?![\w.])/gi)) {
    const v = BigInt(m[2] !== undefined ? `0x${m[2]}` : m[3] !== undefined ? `0x${m[3]}` : m[4]!);
    out.push(m[1] ? -v : v);
  }
  return out;
}

const TWO32 = 1n << 32n;

/** Same value, allowing a 64- or 32-bit two's complement spelling (`-1` = `0FFFFFFFFh`). */
export function sameValue(a: bigint, b: bigint): boolean {
  if (a === b || BigInt.asUintN(64, a) === BigInt.asUintN(64, b)) return true;
  const fits32 = (x: bigint) => x >= -(TWO32 >> 1n) && x < TWO32;
  return fits32(a) && fits32(b) && BigInt.asUintN(32, a) === BigInt.asUintN(32, b);
}

// ------------------------------------------------------------------ the search

/** A mapped range of the image with bytes in the file (what byte and text searches read). */
export interface Region {
  name: string;
  start: bigint;
  size: number;
  /** File-backed bytes from `start` (0 for .bss and the like). */
  fileSize: number;
  exec: boolean;
}

export interface SearchSource {
  regions(): Promise<Region[]>;
  /** Bytes from `addr`, as contiguous runs (holes are left out). */
  read(addr: bigint, length: number): Promise<{ start: bigint; bytes: Uint8Array }[]>;
  functions(): Promise<{ id: string; name: string; entry: string }[]>;
  /** One function's instructions as `mnemonic operands`. */
  instructions(functionId: string): Promise<{ addr: string; mnemonic: string; operands: string }[]>;
}

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');

/** Printable preview of the text at a hit. */
function stringPreview(buf: Uint8Array, at: number, utf16: boolean): string {
  let s = '';
  if (utf16) {
    for (let i = at; i + 1 < buf.length && s.length < 48; i += 2) {
      const c = buf[i]! | (buf[i + 1]! << 8);
      if (c === 0) break;
      s += c < 0x20 ? `\\x${c.toString(16).padStart(2, '0')}` : String.fromCharCode(c);
    }
  } else {
    for (let i = at; i < buf.length && s.length < 48; i++) {
      const c = buf[i]!;
      if (c === 0) break;
      s += c < 0x20 || c > 0x7e ? (c === 10 ? '\\n' : c === 9 ? '\\t' : `\\x${c.toString(16).padStart(2, '0')}`) : String.fromCharCode(c);
    }
  }
  return s;
}

/** Streams hits to `ctx.progress` (`items`) in batches; returns them all. */
class Collector {
  readonly hits: SearchHit[] = [];
  #sent = 0;
  #last = 0;
  readonly #ctx: TaskContext;
  constructor(ctx: TaskContext) {
    this.#ctx = ctx;
  }
  get full(): boolean {
    return this.hits.length >= MAX_HITS;
  }
  add(hit: SearchHit): void {
    if (!this.full) this.hits.push(hit);
  }
  report(done: number, total: number | null, detail?: string, force = false): void {
    const now = Date.now();
    if (!force && now - this.#last < 100) return;
    this.#last = now;
    const items = this.hits.slice(this.#sent);
    this.#sent = this.hits.length;
    this.#ctx.progress({ phase: 'search', done, total, ...(detail ? { detail } : {}), ...(items.length ? { items } : {}) });
  }
}

/** Runs a search; cancellable through `ctx.signal`, hits stream through `ctx.progress`. */
export async function runSearch(source: SearchSource, query: SearchQuery, ctx: TaskContext): Promise<SearchResult> {
  const started = Date.now();
  const out = new Collector(ctx);
  let scanned = 0;
  if (query.mode === 'immediate') {
    const value = parseImmediate(query.text);
    const fns = await source.functions();
    for (const [n, fn] of fns.entries()) {
      ctx.signal.throwIfAborted();
      out.report(n, fns.length, fn.name);
      let insns;
      try {
        insns = await source.instructions(fn.id);
      } catch {
        continue; // a function OpenDecomp cannot disassemble has no operands to match
      }
      for (const i of insns)
        if (operandValues(i.operands).some((v) => sameValue(v, value)))
          out.add({ addr: i.addr, kind: 'insn', preview: `${i.mnemonic} ${i.operands}`.trim(), fn });
      scanned++;
      if (out.full) break;
    }
    out.report(scanned, fns.length, undefined, true);
  } else {
    const patterns: { p: Pattern; kind: SearchHit['kind'] }[] = [];
    if (query.mode === 'bytes') patterns.push({ p: parseBytePattern(query.text), kind: 'bytes' });
    else {
      const cs = !!query.caseSensitive;
      if (query.ascii !== false) patterns.push({ p: textPattern(query.text, 'ascii', cs), kind: 'ascii' });
      if (query.utf16 !== false) patterns.push({ p: textPattern(query.text, 'utf16', cs), kind: 'utf16' });
      if (!patterns.length) throw new SearchError('Choose ASCII, UTF-16 or both');
    }
    const longest = Math.max(...patterns.map((x) => x.p.values.length));
    const overlap = longest - 1 + CONTEXT;
    const step = READ - overlap;
    const regions = (await source.regions()).filter((r) => r.fileSize > 0);
    const total = regions.reduce((n, r) => n + r.fileSize, 0);
    outer: for (const r of regions) {
      for (let off = 0; off < r.fileSize; off += step) {
        ctx.signal.throwIfAborted();
        const len = Math.min(READ, r.fileSize - off);
        // Matches must start in [off, off + step); the overlap completes them and their previews.
        const limit = r.start + BigInt(Math.min(off + step, r.fileSize));
        const found: SearchHit[] = [];
        for (const run of await source.read(r.start + BigInt(off), len)) {
          const end = Number(limit - run.start);
          for (const { p, kind } of patterns)
            findAll(run.bytes, p, 0, end, (i) => {
              const preview =
                kind === 'bytes'
                  ? hex(run.bytes.subarray(i, i + Math.max(p.values.length, Math.min(16, run.bytes.length - i))))
                  : stringPreview(run.bytes, i, kind === 'utf16');
              found.push({ addr: `0x${(run.start + BigInt(i)).toString(16)}`, kind, preview });
              return found.length < MAX_HITS;
            });
        }
        // Both encodings: in address order within the chunk.
        found.sort((a, b) => (BigInt(a.addr) < BigInt(b.addr) ? -1 : 1));
        for (const h of found) out.add(h);
        scanned += Math.min(step, r.fileSize - off);
        out.report(scanned, total);
        if (out.full) break outer;
      }
    }
    out.report(scanned, total, undefined, true);
  }
  return { hits: out.hits, truncated: out.full, scanned, elapsedMs: Date.now() - started };
}

// ------------------------------------------------------------ navigation map

/** What a stretch of the image is, by priority of display. */
export const NAV_KINDS = ['unexplored', 'data', 'code', 'import', 'string', 'library'] as const;
export type NavKind = (typeof NAV_KINDS)[number];

export interface NavRegion {
  name: string;
  start: string;
  size: number;
  /** Where the region begins on the strip, in bytes from the strip's start (regions are laid end to end). */
  offset: number;
  exec: boolean;
}

export interface NavMap {
  /** Sum of the regions' sizes. */
  total: number;
  regions: NavRegion[];
  /** The most common kind in each of `kinds.length` equal slices of the strip (index into NAV_KINDS). */
  kinds: number[];
}

/**
 * The navigation strip's map: regions laid end to end (gaps between them dropped), cut
 * into `buckets` slices; each slice gets the kind covering most of its bytes. A region's
 * bytes default to unexplored (executable) or data (other), and `items` (functions,
 * strings, data symbols) override them.
 */
export function buildNavMap(regions: Region[], items: { start: bigint; size: number; kind: NavKind }[], buckets = 4096): NavMap {
  const sorted = [...regions].filter((r) => r.size > 0).sort((a, b) => (a.start < b.start ? -1 : 1));
  // Clip overlaps so every address has one place on the strip.
  const laid: NavRegion[] = [];
  let total = 0;
  let prevEnd = -1n;
  for (const r of sorted) {
    const start = r.start > prevEnd ? r.start : prevEnd;
    const end = r.start + BigInt(r.size);
    if (end <= start) continue;
    const size = Number(end - start);
    laid.push({ name: r.name, start: `0x${start.toString(16)}`, size, offset: total, exec: r.exec });
    total += size;
    prevEnd = end;
  }
  const kinds = NAV_KINDS.length;
  const counts = new Float64Array(buckets * kinds);
  const width = total / buckets;
  const paint = (pos: number, len: number, kind: number, sign: 1 | -1) => {
    if (len <= 0 || width === 0) return;
    let b = Math.floor(pos / width);
    const end = pos + len;
    while (b < buckets && b * width < end) {
      const lo = Math.max(pos, b * width);
      const hi = Math.min(end, (b + 1) * width);
      if (hi > lo) counts[b * kinds + kind]! += sign * (hi - lo);
      b++;
    }
  };
  const base = (r: NavRegion) => NAV_KINDS.indexOf(r.exec ? 'unexplored' : 'data');
  for (const r of laid) paint(r.offset, r.size, base(r), 1);
  const starts = laid.map((r) => BigInt(r.start));
  if (laid.length)
  for (const it of items) {
    const itEnd = it.start + BigInt(Math.max(1, it.size));
    // The last region starting at or before the item.
    let lo = 0;
    let hi = laid.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid]! <= it.start) lo = mid;
      else hi = mid - 1;
    }
    // Only within the region the item starts in: a function's size sums all its ranges, so
    // entry + size can run past its section.
    {
      const r = laid[lo]!;
      const rs = starts[lo]!;
      const re = rs + BigInt(r.size);
      const s = it.start > rs ? it.start : rs;
      const e = itEnd < re ? itEnd : re;
      if (e <= s) continue;
      const pos = r.offset + Number(s - rs);
      paint(pos, Number(e - s), NAV_KINDS.indexOf(it.kind), 1);
      paint(pos, Number(e - s), base(r), -1);
    }
  }
  const out: number[] = new Array(buckets);
  for (let b = 0; b < buckets; b++) {
    let best = 0;
    for (let k = 1; k < kinds; k++) if (counts[b * kinds + k]! > counts[b * kinds + best]!) best = k;
    out[b] = best;
  }
  return { total, regions: laid, kinds: out };
}

/** Where an address sits on the strip (0..1), or null outside every region. */
export function navFraction(map: Pick<NavMap, 'total' | 'regions'>, addr: string): number | null {
  const a = BigInt(addr);
  for (const r of map.regions) {
    const s = BigInt(r.start);
    if (a >= s && a < s + BigInt(r.size)) return (r.offset + Number(a - s)) / map.total;
  }
  return null;
}

/** The address at a point of the strip (0..1) and its region. */
export function navAddress(map: Pick<NavMap, 'total' | 'regions'>, fraction: number): { addr: string; region: NavRegion } | null {
  if (!map.regions.length || map.total === 0) return null;
  const pos = Math.max(0, Math.min(map.total - 1, Math.floor(fraction * map.total)));
  let lo = 0;
  let hi = map.regions.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (map.regions[mid]!.offset <= pos) lo = mid;
    else hi = mid - 1;
  }
  const region = map.regions[lo]!;
  return { addr: `0x${(BigInt(region.start) + BigInt(pos - region.offset)).toString(16)}`, region };
}
