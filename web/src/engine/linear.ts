// The whole-image linear listing (IDA's "IDA View"): every mapped section in
// address order, functions as their disassembly, everything else as data items
// (strings, pointers, user-defined data) or undefined bytes.
//
// The image is cut into units: a defined item (a function range, a string, a
// pointer slot, a user data definition) or a run of undefined bytes, which is
// one 16-byte aligned row, an aligned run of zero rows inside one 4 KiB page, or
// a zero-fill (bss) run. Unit boundaries depend only on the address, so a window
// of rows can be built forward or backward from any address and windows fetched
// separately join without gaps or repeats. Rows within a stream have
// non-decreasing addresses; every row of one address is kept together.
//
// Pure module (the reads are injected): unit-tested under Node.


/** One disassembled instruction as the session presents it. */
export interface Instruction {
  addr: string;
  size: number;
  bytes: string;
  mnemonic: string;
  operands: string;
  valid: boolean;
  flow: { kind: string; targets: string[]; conditional: boolean };
  refs: { text: string; addr: string; kind: 'function' | 'string' | 'code' | 'data'; label: string }[];
  /** Addresses OpenDecomp computed for this instruction beyond its operand text (ARM64 ADRP+ADD/LDR,
   * x86 RIP-relative loads, GOT/import slots...), with what they name. */
  resolved: { addr: string; kind: 'function' | 'string' | 'import' | 'data' | 'code'; label: string; access: string }[];
}

export type DataType = 'u8' | 'u16' | 'u32' | 'u64' | 'ptr' | 'string';

/** A user data definition: `count` elements of `type` (for a string, its byte length with the terminator). */
export interface DataDef {
  type: DataType;
  count: number;
}

export const DATA_TYPES: readonly DataType[] = ['u8', 'u16', 'u32', 'u64', 'ptr', 'string'];
const ELEMENT_SIZE = { u8: 1, u16: 2, u32: 4, u64: 8, ptr: 8, string: 1 } as const;
const DIRECTIVE = { 1: 'db', 2: 'dw', 4: 'dd', 8: 'dq' } as Record<number, string>;

export function elementSize(type: DataType): number {
  return ELEMENT_SIZE[type];
}

export function defSize(def: DataDef): number {
  return ELEMENT_SIZE[def.type] * def.count;
}

export interface LayoutSection {
  name: string;
  start: bigint;
  end: bigint;
  /** End of the file-backed bytes; [fileEnd, end) is zero-fill. */
  fileEnd: bigint;
  perms: string[];
}

export type LayoutItem = { start: bigint; end: bigint } & (
  | { kind: 'code'; fnId: string; entry: boolean }
  | { kind: 'string'; text: string; encoding: string; terminated: boolean }
  | { kind: 'pointer'; target: bigint | null; symbol: string | null }
  | { kind: 'def'; def: DataDef }
);

export interface Layout {
  sections: LayoutSection[];
  /** Sorted by start, non-overlapping, each inside one section. */
  items: LayoutItem[];
  /** Data labels (symbols, user names) by canonical address, and their sorted addresses. */
  labels: Map<string, string>;
  labelAt: bigint[];
}

export interface Unit {
  start: bigint;
  end: bigint;
  section: number;
  item: LayoutItem | null;
  /** For undefined bytes: one row of bytes, a run of zero rows, or zero-fill. */
  fill: 'bytes' | 'run' | 'zero';
}

export interface DataRef {
  addr: string;
  kind: 'function' | 'string' | 'import' | 'data' | 'code';
  label: string;
}

export type LinearRow =
  | { kind: 'blank'; addr: string }
  | { kind: 'section'; addr: string; name: string; size: number; perms: string }
  | { kind: 'function'; addr: string; fnId: string; name: string; size: number; blocks: number; note: string | null; chunk: boolean }
  /** A branch label (`loc_…`, fnId set) or a data label (a symbol or user name, fnId null). */
  | { kind: 'label'; addr: string; name: string; fnId: string | null }
  | { kind: 'insn'; addr: string; size: number; fnId: string; insn: Instruction; local: string[] }
  | {
      kind: 'data';
      addr: string;
      size: number;
      /** Start of the item or byte run this row belongs to (what D/A/U/N/X act on). */
      unit: string;
      directive: string;
      text: string;
      ref: DataRef | null;
      comment: string | null;
      /** What defines it: a user definition, an automatic item (string, pointer), or nothing (undefined bytes). */
      def: DataType | 'auto' | null;
    };

export interface LinearWindow {
  rows: LinearRow[];
  atStart: boolean;
  atEnd: boolean;
}

export interface FunctionListing {
  function: { id: string; name: string; entry: string; size: number; renamed: boolean; originalName: string | null };
  instructions: Instruction[];
  /** CFG blocks; empty when the listing was fetched without its CFG (they are counted from the flow). */
  blocks: { start: string }[];
}

export interface Sources {
  /** `len` bytes at `start` (zero where nothing is mapped). */
  read(start: bigint, len: number): Promise<Uint8Array>;
  listing(fnId: string): Promise<FunctionListing>;
  /** Whether a function's listing is at hand (no OpenDecomp request needed). */
  listed(fnId: string): boolean;
  /** What an address points to, for pointer operands. */
  refAt(addr: bigint): DataRef | null;
}

const hex = (v: bigint | number) => `0x${v.toString(16)}`;
const ROW = 16n;
const PAGE = 4096n;
export const MAX_WINDOW_ROWS = 4000;

// ------------------------------------------------------------------ layout

/**
 * Items in priority order (earlier wins an overlap): each is kept only if it lies inside one
 * section and overlaps no item kept before it.
 */
export function buildLayout(sections: LayoutSection[], candidates: LayoutItem[], labels: Map<string, string>): Layout {
  const secs: LayoutSection[] = [];
  for (const s of [...sections].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))) {
    const prevEnd = secs.at(-1)?.end ?? 0n;
    const start = s.start < prevEnd ? prevEnd : s.start;
    if (start >= s.end) continue;
    secs.push({ ...s, start, fileEnd: s.fileEnd < start ? start : s.fileEnd > s.end ? s.end : s.fileEnd });
  }
  const items: LayoutItem[] = [];
  for (const c of candidates) {
    if (c.end <= c.start) continue;
    const si = sectionIndex(secs, c.start);
    if (si < 0 || c.end > secs[si]!.end) continue;
    // First kept item ending after c.start: c fits if it starts at or after c.end.
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (items[mid]!.end <= c.start) lo = mid + 1;
      else hi = mid;
    }
    if (lo < items.length && items[lo]!.start < c.end) continue;
    items.splice(lo, 0, c);
  }
  const labelAt = [...labels.keys()].map((k) => BigInt(k)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return { sections: secs, items, labels, labelAt };
}

/** Index of the section containing `addr`, or -1. */
export function sectionIndex(sections: LayoutSection[], addr: bigint): number {
  let lo = 0;
  let hi = sections.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const s = sections[mid]!;
    if (addr < s.start) hi = mid - 1;
    else if (addr >= s.end) lo = mid + 1;
    else return mid;
  }
  return -1;
}

/** Index of the last element of a sorted array of starts/addresses that is <= addr, or -1. */
function lastAtOrBefore<T>(arr: readonly T[], addr: bigint, key: (t: T) => bigint): number {
  let lo = 0;
  let hi = arr.length - 1;
  let out = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (key(arr[mid]!) <= addr) {
      out = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return out;
}

export function itemAt(layout: Layout, addr: bigint): LayoutItem | null {
  const i = lastAtOrBefore(layout.items, addr, (it) => it.start);
  const it = i >= 0 ? layout.items[i]! : null;
  return it && addr < it.end ? it : null;
}

const isZero = (b: Uint8Array) => b.every((x) => x === 0);

export class LinearListing {
  readonly layout: Layout;
  readonly #src: Sources;

  constructor(layout: Layout, sources: Sources) {
    this.layout = layout;
    this.#src = sources;
  }

  /** The unit holding `addr` (an address outside every section snaps to the next section, or the last). */
  async unitAt(addr: bigint): Promise<Unit | null> {
    const secs = this.layout.sections;
    if (!secs.length) return null;
    let si = sectionIndex(secs, addr);
    if (si < 0) {
      const next = secs.findIndex((s) => s.start > addr);
      if (next >= 0) {
        si = next;
        addr = secs[next]!.start;
      } else {
        si = secs.length - 1;
        addr = secs[si]!.end - 1n;
      }
    }
    const sec = secs[si]!;
    const items = this.layout.items;
    const ii = lastAtOrBefore(items, addr, (it) => it.start);
    const before = ii >= 0 ? items[ii]! : null;
    if (before && addr < before.end) return { start: before.start, end: before.end, section: si, item: before, fill: 'bytes' };
    // Undefined bytes: bounded by items, labels and the section.
    let low = sec.start;
    if (before && before.end > low) low = before.end;
    const li = lastAtOrBefore(this.layout.labelAt, addr, (a) => a);
    if (li >= 0 && this.layout.labelAt[li]! > low) low = this.layout.labelAt[li]!;
    let high = sec.end;
    const after = items[ii + 1];
    if (after && after.start < high) high = after.start;
    const nextLabel = this.layout.labelAt[li + 1];
    if (nextLabel !== undefined && nextLabel < high) high = nextLabel;
    if (addr >= sec.fileEnd) return { start: low > sec.fileEnd ? low : sec.fileEnd, end: high, section: si, item: null, fill: 'zero' };
    if (high > sec.fileEnd) high = sec.fileEnd;
    const row = addr - (addr % ROW);
    const start = row > low ? row : low;
    const end = row + ROW < high ? row + ROW : high;
    // A full row of zeros joins the adjacent full zero rows of its 4 KiB page.
    if (start === row && end === row + ROW && isZero(await this.#src.read(row, 16))) {
      const page = row - (row % PAGE);
      let runStart = row;
      while (runStart - ROW >= page && runStart - ROW >= low && isZero(await this.#src.read(runStart - ROW, 16))) runStart -= ROW;
      let runEnd = row + ROW;
      while (runEnd + ROW <= page + PAGE && runEnd + ROW <= high && isZero(await this.#src.read(runEnd, 16))) runEnd += ROW;
      if (runEnd - runStart > ROW) return { start: runStart, end: runEnd, section: si, item: null, fill: 'run' };
    }
    return { start, end, section: si, item: null, fill: 'bytes' };
  }

  async next(u: Unit): Promise<Unit | null> {
    const sec = this.layout.sections[u.section]!;
    if (u.end < sec.end) return this.unitAt(u.end);
    const n = this.layout.sections[u.section + 1];
    return n ? this.unitAt(n.start) : null;
  }

  async prev(u: Unit): Promise<Unit | null> {
    const sec = this.layout.sections[u.section]!;
    if (u.start > sec.start) return this.unitAt(u.start - 1n);
    const p = this.layout.sections[u.section - 1];
    return p ? this.unitAt(p.end - 1n) : null;
  }

  /** Rows of one unit, with its section header when it starts a section and its data label. */
  async rows(u: Unit): Promise<LinearRow[]> {
    const out: LinearRow[] = [];
    const at = hex(u.start);
    const sec = this.layout.sections[u.section]!;
    if (u.start === sec.start) {
      out.push({ kind: 'blank', addr: at });
      out.push({ kind: 'section', addr: at, name: sec.name, size: Number(sec.end - sec.start), perms: permString(sec.perms) });
    }
    const item = u.item;
    if (item?.kind === 'code') {
      out.push(...(await this.#codeRows(item)));
      return out;
    }
    const label = this.layout.labels.get(at);
    if (label) out.push({ kind: 'label', addr: at, name: label, fnId: null });
    if (!item) out.push(...(await this.#undefinedRows(u)));
    else if (item.kind === 'string') out.push(stringRow(item, at));
    else if (item.kind === 'pointer') out.push(await this.#pointerRow(item));
    else out.push(...(await this.#defRows(item)));
    return out;
  }

  async #codeRows(item: Extract<LayoutItem, { kind: 'code' }>): Promise<LinearRow[]> {
    const listing = await this.#src.listing(item.fnId);
    const fn = listing.function;
    const at = hex(item.start);
    const rows: LinearRow[] = [{ kind: 'blank', addr: at }];
    rows.push({
      kind: 'function',
      addr: at,
      fnId: fn.id,
      name: fn.name,
      size: fn.size,
      blocks: listing.blocks.length || blockCount(listing.instructions),
      note: fn.renamed && fn.originalName ? `originally ${fn.originalName}` : null,
      chunk: !item.entry,
    });
    const local = new Set(listing.instructions.map((i) => i.addr));
    const targets = new Set<string>();
    for (const i of listing.instructions) {
      if (i.flow.kind === 'fallthrough' || i.flow.kind === 'call') continue;
      for (const t of i.flow.targets) if (local.has(t)) targets.add(t);
    }
    const insns = listing.instructions
      .filter((i) => {
        const a = BigInt(i.addr);
        return a >= item.start && a < item.end;
      })
      .sort((a, b) => (BigInt(a.addr) < BigInt(b.addr) ? -1 : 1));
    let pos = item.start;
    let prev: Instruction | null = null;
    for (const insn of insns) {
      const a = BigInt(insn.addr);
      if (a < pos) continue; // overlapping decode
      if (a > pos) rows.push(...(await this.#byteRows(pos, a, null)));
      // A line after a jump, branch or return starts a block: a blank line separates it.
      if (prev && a !== item.start) {
        if (prev.flow.kind !== 'fallthrough' && prev.flow.kind !== 'call') rows.push({ kind: 'blank', addr: insn.addr });
        if (targets.has(insn.addr)) rows.push({ kind: 'label', addr: insn.addr, name: `loc_${insn.addr.slice(2)}`, fnId: fn.id });
      }
      const refsLocal = insn.refs.filter((r) => local.has(r.addr) && r.kind !== 'function').map((r) => r.addr);
      rows.push({ kind: 'insn', addr: insn.addr, size: insn.size, fnId: fn.id, insn, local: refsLocal });
      pos = a + BigInt(Math.max(1, insn.size));
      prev = insn;
    }
    if (pos < item.end) rows.push(...(await this.#byteRows(pos, item.end, null)));
    return rows;
  }

  /** Undefined bytes in [start, end) as `db` rows, cut at 16-byte boundaries. */
  async #byteRows(start: bigint, end: bigint, unit: bigint | null): Promise<LinearRow[]> {
    const rows: LinearRow[] = [];
    const bytes = await this.#src.read(start, Number(end - start));
    for (let a = start; a < end; ) {
      const next = a - (a % ROW) + ROW < end ? a - (a % ROW) + ROW : end;
      const b = bytes.subarray(Number(a - start), Number(next - start));
      rows.push(bytesRow(hex(a), hex(unit ?? a), b));
      a = next;
    }
    return rows;
  }

  async #undefinedRows(u: Unit): Promise<LinearRow[]> {
    const at = hex(u.start);
    const size = Number(u.end - u.start);
    if (u.fill === 'zero')
      return [{ kind: 'data', addr: at, size, unit: at, directive: 'db', text: `${hex(size)} dup(?)`, ref: null, comment: null, def: null }];
    if (u.fill === 'run')
      return [{ kind: 'data', addr: at, size, unit: at, directive: 'db', text: `${hex(size)} dup(0)`, ref: null, comment: null, def: null }];
    return [bytesRow(at, at, await this.#src.read(u.start, size))];
  }

  async #pointerRow(item: Extract<LayoutItem, { kind: 'pointer' }>): Promise<LinearRow> {
    const at = hex(item.start);
    const size = Number(item.end - item.start);
    const directive = DIRECTIVE[size] ?? 'db';
    let ref: DataRef | null = null;
    let text: string;
    let comment: string | null = null;
    if (item.symbol) {
      text = item.symbol;
      ref = item.target !== null ? (this.#src.refAt(item.target) ?? null) : null;
      comment = 'import';
    } else if (item.target !== null) {
      ref = this.#src.refAt(item.target);
      text = ref?.label || hex(item.target);
      if (!ref) ref = { addr: hex(item.target), kind: 'data', label: '' };
    } else text = hex(readUint(await this.#src.read(item.start, size)));
    return { kind: 'data', addr: at, size, unit: at, directive, text, ref, comment, def: 'auto' };
  }

  async #defRows(item: Extract<LayoutItem, { kind: 'def' }>): Promise<LinearRow[]> {
    const { def } = item;
    const unit = hex(item.start);
    const total = Number(item.end - item.start);
    const bytes = await this.#src.read(item.start, total);
    if (def.type === 'string') {
      const text = cString(bytes.subarray(0, bytes[total - 1] === 0 ? total - 1 : total));
      return [{ kind: 'data', addr: unit, size: total, unit, directive: 'db', text: `${text}${bytes[total - 1] === 0 ? ', 0' : ''}`, ref: null, comment: null, def: 'string' }];
    }
    const size = elementSize(def.type);
    const perRow = def.type === 'ptr' ? 1 : Math.max(1, 16 / size);
    const rows: LinearRow[] = [];
    for (let i = 0; i < def.count; i += perRow) {
      const n = Math.min(perRow, def.count - i);
      const values: string[] = [];
      let ref: DataRef | null = null;
      for (let k = 0; k < n; k++) {
        const v = readUint(bytes.subarray((i + k) * size, (i + k + 1) * size));
        if (def.type === 'ptr') {
          ref = this.#src.refAt(v);
          values.push(ref?.label || hex(v));
          if (!ref && v !== 0n) ref = { addr: hex(v), kind: 'data', label: '' };
        } else values.push(hex(v));
      }
      rows.push({
        kind: 'data',
        addr: hex(item.start + BigInt(i * size)),
        size: n * size,
        unit,
        directive: DIRECTIVE[size]!,
        text: values.join(', '),
        ref,
        comment: i === 0 && def.count > 1 ? `${def.type}[${def.count}]` : null,
        def: def.type,
      });
    }
    return rows;
  }

  /**
   * Rows around `addr`: up to `before` rows before the first row of `addr` and up to
   * `after` rows from it, never splitting the rows of one address. `quick`: besides the unit
   * holding `addr`, stop at the first function whose listing is not at hand (the window then
   * just ends there, and extending it fetches the rest).
   */
  async window(addr: bigint, before: number, after: number, quick = false): Promise<LinearWindow> {
    const pending = (u: Unit) => quick && u.item?.kind === 'code' && !this.#src.listed(u.item.fnId);
    before = Math.max(0, Math.min(MAX_WINDOW_ROWS, before));
    after = Math.max(0, Math.min(MAX_WINDOW_ROWS, after));
    const first = await this.unitAt(addr);
    if (!first) return { rows: [], atStart: true, atEnd: true };
    if (addr < first.start) addr = first.start; // snapped to a section
    const rows = await this.rows(first);
    const split = rows.findIndex((r) => BigInt(r.addr) >= addr);
    const at = split < 0 ? rows.length : split;
    let tail = rows.slice(at);
    let head = rows.slice(0, at);
    let atEnd = false;
    let atStart = false;
    if (after > 0) {
      let u: Unit | null = first;
      while (tail.length < after) {
        u = await this.next(u);
        if (!u) {
          atEnd = true;
          break;
        }
        if (pending(u)) break;
        tail = tail.concat(await this.rows(u));
      }
      if (tail.length > after) {
        let n = after;
        while (n < tail.length && tail[n]!.addr === tail[n - 1]!.addr) n++;
        tail = tail.slice(0, n);
      }
    } else tail = [];
    if (before > 0) {
      let u: Unit | null = first;
      while (head.length < before) {
        u = await this.prev(u);
        if (!u) {
          atStart = true;
          break;
        }
        if (pending(u)) break;
        head = (await this.rows(u)).concat(head);
      }
      if (head.length > before) {
        let s = head.length - before;
        while (s > 0 && head[s - 1]!.addr === head[s]!.addr) s--;
        head = head.slice(s);
      }
    } else head = [];
    return { rows: head.concat(tail), atStart, atEnd };
  }
}

// ------------------------------------------------------------------ rows

/** Basic blocks of a function from its instructions' flow: the entry, branch targets, and lines after a transfer. */
export function blockCount(insns: Instruction[]): number {
  if (!insns.length) return 0;
  const local = new Set(insns.map((i) => i.addr));
  const starts = new Set([insns[0]!.addr]);
  insns.forEach((i, k) => {
    if (i.flow.kind === 'fallthrough' || i.flow.kind === 'call') return;
    for (const t of i.flow.targets) if (local.has(t)) starts.add(t);
    const next = insns[k + 1];
    if (next) starts.add(next.addr);
  });
  return starts.size;
}

function permString(perms: string[]): string {
  return `${perms.includes('read') ? 'r' : '-'}${perms.includes('write') ? 'w' : '-'}${perms.includes('execute') ? 'x' : '-'}`;
}

function readUint(b: Uint8Array): bigint {
  let v = 0n;
  for (let i = b.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(b[i]!);
  return v;
}

function bytesRow(addr: string, unit: string, b: Uint8Array): LinearRow {
  let text = '';
  let ascii = '';
  let printable = 0;
  for (const x of b) {
    text += `${text ? ' ' : ''}${x.toString(16).padStart(2, '0')}`;
    const p = x >= 0x20 && x < 0x7f;
    if (p) printable++;
    ascii += p ? String.fromCharCode(x) : '.';
  }
  // Their characters, when the row holds some text.
  return { kind: 'data', addr, size: b.length, unit, directive: 'db', text, ref: null, comment: printable >= 4 ? ascii : null, def: null };
}

const MAX_TEXT = 200;

/** A C string literal for display, cut after MAX_TEXT characters. */
export function quoteC(text: string): string {
  let out = '';
  for (const ch of text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) : text) {
    const c = ch.codePointAt(0)!;
    if (ch === '"' || ch === '\\') out += `\\${ch}`;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\t') out += '\\t';
    else if (ch === '\r') out += '\\r';
    else if (c < 0x20 || c === 0x7f) out += `\\x${c.toString(16).padStart(2, '0')}`;
    else out += ch;
  }
  return `"${out}${text.length > MAX_TEXT ? '…' : ''}"`;
}

function cString(b: Uint8Array): string {
  return quoteC(new TextDecoder('utf-8', { fatal: false }).decode(b));
}

function stringRow(item: Extract<LayoutItem, { kind: 'string' }>, at: string): LinearRow {
  const wide = item.encoding === 'utf16le';
  return {
    kind: 'data',
    addr: at,
    size: Number(item.end - item.start),
    unit: at,
    directive: wide ? 'du' : 'db',
    text: `${quoteC(item.text)}${item.terminated ? ', 0' : ''}`,
    ref: null,
    comment: null,
    def: 'auto',
  };
}

/** The byte length of the NUL-terminated string at the start of `bytes` (with its NUL), or null without one. */
export function cStringLength(bytes: Uint8Array): number | null {
  const n = bytes.indexOf(0);
  return n < 0 ? null : n + 1;
}
