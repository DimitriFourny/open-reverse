// The whole-image linear listing (IDA's disassembly view): every mapped section in address
// order, functions as disassembly and everything else as data. Rows are fetched from the
// engine by address window and kept as one contiguous slice of the image, extended at either
// end while scrolling (the far end is dropped past MAX_ROWS), so any image scrolls smoothly.

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { api, type LinearRow, type LinearWindow } from '../api.ts';
import { getState, navigate, setCursor, setState, toast, useStore, type Selection } from '../store.ts';
import { padAddr } from '../util.ts';
import { FindBar, onCodeMouseDown, useCodeKeys, useFindPaint, useFindQuery } from './codeui.tsx';
import { AutoComment, Mnemonic, Operands, autoComment, displayOperands, followFrom } from './disasm.tsx';

type InsnRow = Extract<LinearRow, { kind: 'insn' }>;
type DataRow = Extract<LinearRow, { kind: 'data' }>;

const ROW_H = 20;
const LANE_W = 6;
const MAX_LANES = 14;
/**
 * Rows fetched around a navigation target: about a screen, usually just the cursor's function,
 * so it shows as soon as that function's data exists; the rest of the slice fills in by
 * extensions at the edges. Then rows per extension.
 */
const AROUND = { before: 40, after: 80 };
const EXTEND = 400;
/** Extend when the viewport is this many rows from an edge of the slice. */
const EDGE = 150;
const MAX_ROWS = 6000;

const isContent = (r: LinearRow): r is InsnRow | DataRow => r.kind === 'insn' || r.kind === 'data';
const hex = (v: bigint) => `0x${v.toString(16)}`;

interface Arrow {
  from: number;
  to: number;
  lo: number;
  hi: number;
  lane: number;
  cond: boolean;
  src: string;
  dst: string;
}

/**
 * Jump arrows between branches and their targets in the same function. Arrows to the
 * same target share one trunk; each trunk gets a lane (0 = nearest the code) that no
 * overlapping trunk uses, shorter trunks first so they nest inside longer ones.
 */
function layoutArrows(rows: LinearRow[], insnAt: Map<string, number>): { arrows: Arrow[]; lanes: number } {
  const groups = new Map<string, { lo: number; hi: number; arrows: Arrow[] }>();
  rows.forEach((row, from) => {
    if (row.kind !== 'insn') return;
    const k = row.insn.flow.kind;
    if (k === 'fallthrough' || k === 'call' || k === 'return') return;
    for (const t of new Set(row.insn.flow.targets)) {
      const to = insnAt.get(t);
      if (to === undefined || (rows[to] as InsnRow).fnId !== row.fnId) continue;
      const a: Arrow = { from, to, lo: Math.min(from, to), hi: Math.max(from, to), lane: 0, cond: row.insn.flow.conditional, src: row.addr, dst: t };
      const key = `${row.fnId}>${t}`;
      const g = groups.get(key);
      if (g) {
        g.arrows.push(a);
        g.lo = Math.min(g.lo, a.lo);
        g.hi = Math.max(g.hi, a.hi);
      } else groups.set(key, { lo: a.lo, hi: a.hi, arrows: [a] });
    }
  });
  const order = [...groups.values()].sort((a, b) => a.hi - a.lo - (b.hi - b.lo) || a.lo - b.lo);
  const lanes: { lo: number; hi: number }[][] = [];
  let used = 0;
  for (const g of order) {
    let lane = MAX_LANES - 1;
    for (let l = 0; l < MAX_LANES; l++) {
      const iv = (lanes[l] ??= []);
      let lo = 0;
      let hi = iv.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (iv[mid]!.hi < g.lo) lo = mid + 1;
        else hi = mid;
      }
      if (lo < iv.length && iv[lo]!.lo <= g.hi) continue;
      iv.splice(lo, 0, { lo: g.lo, hi: g.hi });
      lane = l;
      break;
    }
    for (const a of g.arrows) a.lane = lane;
    used = Math.max(used, lane + 1);
  }
  return { arrows: [...groups.values()].flatMap((g) => g.arrows), lanes: used };
}

/** Index of the last row starting at or before `a`, or -1. */
function lastAtOrBefore(starts: bigint[], a: bigint): number {
  let lo = 0;
  let hi = starts.length - 1;
  let out = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid]! <= a) {
      out = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return out;
}

/** Index of the first row of the first address at or after `a` (headers and labels included). */
function firstAtOrAfter(starts: bigint[], a: bigint): number {
  let lo = 0;
  let hi = starts.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid]! < a) lo = mid + 1;
    else hi = mid;
  }
  return Math.min(lo, Math.max(0, starts.length - 1));
}

/** The content row (instruction or data) holding `a`, or -1. */
function rowHolding(rows: LinearRow[], starts: bigint[], a: bigint): number {
  const i = lastAtOrBefore(starts, a);
  const r = rows[i];
  return r && isContent(r) && a < starts[i]! + BigInt(Math.max(1, r.size)) ? i : -1;
}

function sectionText(r: Extract<LinearRow, { kind: 'section' }>): string {
  return `; section ${r.name}  ${r.perms}  ${r.addr}–${hex(BigInt(r.addr) + BigInt(r.size))} (0x${r.size.toString(16)} bytes)`;
}

function functionNote(r: Extract<LinearRow, { kind: 'function' }>): string {
  return r.chunk ? ` ; chunk of ${r.name}` : ` ; ${r.size} bytes, ${r.blocks} blocks${r.note ? `, ${r.note}` : ''}`;
}

function rowText(row: LinearRow, width: number, showBytes: boolean, comments: Record<string, string>): string {
  const at = padAddr(row.addr, width);
  switch (row.kind) {
    case 'blank':
      return '';
    case 'section':
      return `${at} ${sectionText(row)}`;
    case 'function':
      return `${at} ${row.chunk ? '' : row.name}${functionNote(row)}`;
    case 'label':
      return `${at} ${row.name}:`;
    case 'insn': {
      const i = row.insn;
      const parts = [at];
      if (showBytes) parts.push(i.bytes.replace(/(..)/g, '$1 ').trim());
      parts.push(i.mnemonic, displayOperands(i, new Set(row.local)));
      const auto = autoComment(i);
      const user = comments[i.addr];
      if (auto || user) parts.push(` ; ${user ?? ''}${user && auto ? '  ' : ''}${auto ?? ''}`);
      return parts.join(' ');
    }
    case 'data': {
      const user = comments[row.addr];
      const note = [user, row.comment].filter(Boolean).join('  ');
      return `${at} ${row.directive} ${row.text}${note ? ` ; ${note}` : ''}`;
    }
  }
}

/**
 * The selection of a data item: its address, its label (N's current name) and, as a global,
 * its C type (Y retypes it like a global of the pseudocode).
 */
function dataSelection(rows: LinearRow[], index: number, unit: string): Selection {
  const name = labelOf(rows, index, unit);
  let type = '';
  for (let i = index; i >= 0 && i > index - 64; i--) {
    const r = rows[i]!;
    if (r.kind === 'data' && r.addr === unit) type = r.ctype ?? '';
    if (BigInt(r.addr) < BigInt(unit)) break;
  }
  return { kind: 'addr', addr: unit, ...(name ? { name } : {}), global: { name: name ?? '', type } };
}

/** The data label naming the item of `row` (for N's current name), searched just above it. */
function labelOf(rows: LinearRow[], index: number, unit: string): string | undefined {
  for (let i = index; i >= 0 && i > index - 64; i--) {
    const r = rows[i]!;
    if (r.kind === 'label' && r.addr === unit && !r.fnId) return r.name;
    if (BigInt(r.addr) < BigInt(unit)) break;
  }
  return undefined;
}

export function LinearView() {
  const bid = useStore((s) => s.bid)!;
  /** A new object on every navigation or cursor move: Go to the cursor's own address scrolls back to it. */
  const loc = useStore((s) => s.loc);
  const cursor = loc?.addr;
  const fnId = useStore((s) => s.loc?.fnId ?? null);
  const linked = useStore((s) => s.linked);
  const comments = useStore((s) => s.comments);
  const showBytes = useStore((s) => s.showBytes);
  const versionKey = useStore((s) => `${s.revision}/${s.dataVersion}`);
  const addressBits = useStore((s) => s.info?.image.target.address_bits ?? 64);
  const parentRef = useRef<HTMLDivElement>(null);
  const query = useFindQuery('main');
  const [win, setWin] = useState<LinearWindow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const winRef = useRef(win);
  winRef.current = win;
  /** Bumped by every full reload: extensions and reloads from before it are dropped. */
  const gen = useRef(0);
  const extending = useRef(false);
  /** Scroll to apply once the next window is rendered. */
  const pending = useRef<{ addr: string; align: 'top' | 'center' | 'keep'; offset: number } | null>(null);
  /** Rows added (+) or dropped (-) above the viewport by the last extension. */
  const shift = useRef(0);

  const rows = useMemo(() => win?.rows ?? [], [win]);
  const { starts, insnAt } = useMemo(() => {
    const starts = rows.map((r) => BigInt(r.addr));
    const insnAt = new Map<string, number>();
    rows.forEach((r, i) => r.kind === 'insn' && insnAt.set(r.addr, i));
    return { starts, insnAt };
  }, [rows]);
  const { arrows, lanes } = useMemo(() => layoutArrows(rows, insnAt), [rows, insnAt]);
  const gutter = lanes ? lanes * LANE_W + 16 : 6;
  const width = addressBits > 32 && rows.some((r) => r.addr.length - 2 > 8) ? 12 : 8;

  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => ROW_H, overscan: 30 });

  const reload = async (addr: string, align: 'top' | 'center' | 'keep', offset = 0) => {
    const g = ++gen.current;
    try {
      const w = await api.linear(bid, addr, AROUND.before, AROUND.after, true);
      if (g !== gen.current) return;
      pending.current = { addr, align, offset };
      shift.current = 0;
      setError(null);
      setWin(w);
    } catch (e) {
      if (g !== gen.current) return;
      const text = e instanceof Error ? e.message : String(e);
      if (winRef.current) toast(`Listing: ${text}`, 'error');
      else setError(text);
    }
  };

  /** Extends the slice when the viewport nears one of its edges. */
  const checkEdges = async () => {
    const el = parentRef.current;
    const w = winRef.current;
    if (!el || !w || !w.rows.length || extending.current || pending.current) return;
    const first = Math.floor(el.scrollTop / ROW_H);
    const last = first + Math.ceil(el.clientHeight / ROW_H);
    const dir = first < EDGE && !w.atStart ? 'before' : last > w.rows.length - EDGE && !w.atEnd ? 'after' : null;
    if (!dir) return;
    extending.current = true;
    const g = gen.current;
    let retry = 0;
    try {
      const anchor = dir === 'before' ? w.rows[0]!.addr : hex(BigInt(w.rows.at(-1)!.addr) + 1n);
      const r = await api.linear(bid, anchor, dir === 'before' ? EXTEND : 0, dir === 'after' ? EXTEND : 0);
      if (g !== gen.current || winRef.current !== w) return;
      let next: LinearWindow;
      if (dir === 'before') {
        let all = [...r.rows, ...w.rows];
        let atEnd = w.atEnd;
        if (all.length > MAX_ROWS) {
          let n = MAX_ROWS;
          while (n < all.length && all[n]!.addr === all[n - 1]!.addr) n++;
          all = all.slice(0, n);
          atEnd = false;
        }
        next = { rows: all, atStart: r.atStart, atEnd };
        shift.current += r.rows.length;
      } else {
        let all = [...w.rows, ...r.rows];
        let atStart = w.atStart;
        if (all.length > MAX_ROWS) {
          let k = all.length - MAX_ROWS;
          while (k < all.length && all[k]!.addr === all[k - 1]!.addr) k++;
          all = all.slice(k);
          shift.current -= k;
          atStart = false;
        }
        next = { rows: all, atStart, atEnd: r.atEnd || (r.rows.length === 0) };
      }
      setWin(next);
      retry = 0;
    } catch {
      retry = 1000;
    } finally {
      extending.current = false;
      // Again: a reload may have replaced the slice meanwhile (this result was then dropped),
      // and a slice shorter than the viewport gets no scroll event to ask.
      setTimeout(() => void checkEdges(), retry);
    }
  };

  // Apply the pending scroll (a reload) or the shift of an extension, before paint.
  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el || !win) return;
    if (shift.current) {
      el.scrollTop += shift.current * ROW_H;
      shift.current = 0;
    }
    const p = pending.current;
    if (p) {
      pending.current = null;
      const a = BigInt(p.addr);
      if (p.align === 'keep') el.scrollTop = firstAtOrAfter(starts, a) * ROW_H - p.offset;
      else if (p.align === 'top') el.scrollTop = Math.max(0, firstAtOrAfter(starts, a) * ROW_H);
      else {
        const i = rowHolding(rows, starts, a);
        el.scrollTop = Math.max(0, (i >= 0 ? i : firstAtOrAfter(starts, a)) * ROW_H - el.clientHeight / 2);
      }
    }
    void checkEdges();
  }, [win]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the cursor (or the first linked instruction) in view; fetch its rows when it is outside the slice.
  const focus = linked.size > 0 ? [...linked].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))[0] : cursor;
  useEffect(() => {
    if (!focus) return;
    const w = winRef.current;
    const el = parentRef.current;
    const idx = w ? rowHolding(w.rows, starts, BigInt(focus)) : -1;
    if (idx < 0 || !el) {
      // A function entry starts at the top (with its header); anything else is centered.
      void reload(focus, getState().byEntry.has(focus) ? 'top' : 'center');
      return;
    }
    const top = idx * ROW_H;
    const h = el.clientHeight;
    if (top >= el.scrollTop && top + ROW_H <= el.scrollTop + h) return;
    const near = top > el.scrollTop - h && top < el.scrollTop + 2 * h;
    virt.scrollToIndex(idx, { align: near ? 'auto' : 'center' });
  }, [focus, bid, loc]); // eslint-disable-line react-hooks/exhaustive-deps

  // A new revision (rename, discovery) or data definition: reload in place.
  const lastKey = useRef(versionKey);
  useEffect(() => {
    if (lastKey.current === versionKey) return;
    lastKey.current = versionKey;
    const el = parentRef.current;
    const w = winRef.current;
    if (!el || !w?.rows.length) return;
    const top = Math.min(w.rows.length - 1, Math.floor(el.scrollTop / ROW_H));
    const row = w.rows[top]!;
    void reload(row.addr, 'keep', firstAtOrAfter(starts, BigInt(row.addr)) * ROW_H - el.scrollTop);
  }, [versionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------- cursor
  const cursorRow = cursor !== undefined ? rowHolding(rows, starts, BigInt(cursor)) : -1;
  const select = (row: InsnRow | DataRow, index: number) => {
    if (row.kind === 'insn') setCursor(row.addr, null, row.fnId);
    else setCursor(row.addr, dataSelection(rows, index, row.unit));
  };
  // A cursor that lands on data (Go to, history) selects that item, so N, X and Y act on it;
  // a redefinition or rename of the item refreshes it (its label and C type).
  const selection = useStore((s) => s.selection);
  useEffect(() => {
    const row = rows[cursorRow];
    if (row?.kind !== 'data') return;
    if (selection !== null && !(selection.kind === 'addr' && selection.addr === row.unit && 'global' in selection)) return;
    const next = dataSelection(rows, cursorRow, row.unit);
    if (JSON.stringify(next) !== JSON.stringify(selection)) setState({ selection: next });
  }, [cursorRow, rows, selection]); // eslint-disable-line react-hooks/exhaustive-deps
  const moveTo = (i: number, dir: 1 | -1) => {
    for (let k = Math.max(0, Math.min(rows.length - 1, i)); k >= 0 && k < rows.length; k += dir) {
      const r = rows[k]!;
      if (isContent(r)) {
        if (k !== cursorRow) select(r, k);
        return;
      }
    }
  };

  useCodeKeys((e) => {
    const el = parentRef.current;
    if (!rows.length) return;
    const page = Math.max(1, Math.floor((el?.clientHeight ?? 400) / ROW_H) - 2);
    const i = cursorRow;
    const row = i >= 0 ? rows[i] : undefined;
    switch (e.key) {
      case 'ArrowDown':
        moveTo(i + 1, 1);
        return true;
      case 'ArrowUp':
        moveTo(i < 0 ? 0 : i - 1, -1);
        return true;
      case 'PageDown':
      case 'PageUp': {
        const dir = e.key === 'PageDown' ? 1 : -1;
        if (el) el.scrollTop += dir * page * ROW_H;
        moveTo((i < 0 ? Math.floor((el?.scrollTop ?? 0) / ROW_H) : i) + dir * page, dir);
        return true;
      }
      case 'Home':
      case 'End': {
        // The first / last instruction of the current function.
        const listing = getState().listing.data;
        const insns = listing && listing.function.id === fnId ? listing.instructions : [];
        const target = e.key === 'Home' ? insns[0] : insns.at(-1);
        if (target) setCursor(target.addr, null, listing!.function.id);
        return true;
      }
      case 'Enter':
        if (row?.kind === 'insn') followFrom(row.insn, new Set(row.local));
        else if (row?.kind === 'data' && row.ref) void navigate(row.ref.addr);
        return true;
    }
  });

  // ---------------------------------------------------------------- find
  const texts = useMemo(() => (query ? rows.map((r) => rowText(r, width, showBytes, comments).toLowerCase()) : null), [query !== null, rows, width, showBytes, comments]); // eslint-disable-line react-hooks/exhaustive-deps
  const matches = useMemo(() => {
    if (!query || !texts) return [];
    const q = query.toLowerCase();
    const out: number[] = [];
    texts.forEach((t, r) => t.includes(q) && out.push(r));
    return out;
  }, [texts, query]);
  const [findRow, setFindRow] = useState<number | null>(null);
  const goMatch = (r: number) => {
    setFindRow(r);
    const k = rows.findIndex((x, j) => j >= r && isContent(x));
    const target = rows[k];
    if (target && isContent(target)) select(target, k);
    virt.scrollToIndex(r, { align: 'center' });
  };
  const base = findRow !== null && cursorRow >= findRow && rows.slice(findRow, cursorRow).every((r) => !isContent(r)) ? findRow : cursorRow;
  const step = (dir: 1 | -1) => {
    if (!matches.length) return;
    const next = dir > 0 ? (matches.find((r) => r > base) ?? matches[0]!) : (matches.findLast((r) => r < base) ?? matches.at(-1)!);
    goMatch(next);
  };
  useEffect(() => {
    if (!query || !matches.length) return setFindRow(null);
    goMatch(matches.find((r) => r >= cursorRow) ?? matches[0]!);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps
  const findIndex = findRow !== null && base === findRow ? matches.indexOf(findRow) : -1;
  useFindPaint(parentRef, '.row', query, true, (ranges) => {
    if (findRow === null || base !== findRow) return null;
    return ranges.find((r) => (r.startContainer.parentElement?.closest('[data-row]') as HTMLElement | null)?.dataset.row === String(findRow)) ?? null;
  }, findRow);

  // ---------------------------------------------------------------- render
  const items = virt.getVirtualItems();
  const first = items[0]?.index ?? 0;
  const last = items.at(-1)?.index ?? 0;
  if (error && !win) return <div className="placeholder error">{error}</div>;
  if (!win) return <div className="placeholder">Loading the listing…</div>;
  return (
    <div className="code-wrap" onMouseDown={onCodeMouseDown('main', '.row')}>
      <FindBar pane="main" count={matches.length} index={findIndex} onStep={step} />
      <div ref={parentRef} className="code-scroll" tabIndex={-1} onScroll={() => void checkEdges()}>
        <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
          {lanes > 0 && items.length > 0 && <Arrows arrows={arrows} first={first} last={last} gutter={gutter} cursor={cursor} />}
          {items.map((v) => {
            const index = v.index;
            const row = rows[index]!;
            const style = { position: 'absolute' as const, top: 0, left: gutter, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` };
            const at = <span className="addr">{padAddr(row.addr, width)}</span>;
            if (row.kind === 'blank') return <div key={v.key} data-row={index} style={style} className="row" />;
            if (row.kind === 'section')
              return (
                <div key={v.key} data-row={index} style={style} className="row row-section">
                  {at}
                  <span>{sectionText(row)}</span>
                </div>
              );
            if (row.kind === 'function')
              return (
                <div
                  key={v.key}
                  data-row={index}
                  style={style}
                  className={`row row-header${row.fnId === fnId ? ' cur-fn' : ''}`}
                  onClick={() => setCursor(row.addr, { kind: 'function', fnId: row.fnId }, row.fnId)}
                >
                  {at}
                  {!row.chunk && (
                    <span className="fn-title" data-k={`i:${row.name}`}>
                      {row.name}
                    </span>
                  )}
                  <span className="dim">{functionNote(row)}</span>
                </div>
              );
            if (row.kind === 'label') {
              const selected = !row.fnId && selection?.kind === 'addr' && selection.addr === row.addr;
              return (
                <div
                  key={v.key}
                  data-row={index}
                  style={style}
                  className={`row${row.fnId && row.fnId === fnId ? ' cur-fn' : ''}`}
                  onClick={row.fnId ? undefined : () => setCursor(row.addr, dataSelection(rows, Math.min(rows.length - 1, index + 1), row.addr))}
                >
                  {at}
                  <span className={`label${row.fnId ? '' : ' label-data'}${selected ? ' selected' : ''}`} data-k={`i:${row.name}`}>
                    {row.name}:
                  </span>
                </div>
              );
            }
            const isCursor = index === cursorRow;
            const user = comments[row.addr];
            if (row.kind === 'data') {
              const cls = `row data${isCursor ? ' cursor' : ''}${row.def === null ? ' undefined' : ''}`;
              const note = row.comment;
              const ref = row.ref;
              return (
                <div key={v.key} data-row={index} style={style} className={cls} onClick={() => select(row, index)}>
                  {at}
                  <span className="mn mn-data">{row.directive}</span>
                  <span className="op">
                    {ref ? (
                      <span
                        className={`ref ref-${ref.kind === 'import' ? 'function' : ref.kind}${selection?.kind === 'addr' && selection.addr === ref.addr ? ' selected' : ''}`}
                        data-k={ref.kind === 'function' ? `i:${ref.label}` : `n:${BigInt(ref.addr).toString(16)}`}
                        title={`${ref.addr}${ref.label ? ` ${ref.label}` : ''} — double-click or Enter to follow`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCursor(row.addr, { kind: 'addr', addr: ref.addr });
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          void navigate(ref.addr);
                        }}
                      >
                        {row.text}
                      </span>
                    ) : (
                      row.text
                    )}
                  </span>
                  {(user || note) && (
                    <span className="comment">
                      {' ; '}
                      {user && <span className="user-comment">{user}</span>}
                      {user && note ? '  ' : ''}
                      {note}
                    </span>
                  )}
                </div>
              );
            }
            const insn = row.insn;
            const auto = autoComment(insn);
            const cls = `row insn${isCursor ? ' cursor' : ''}${linked.has(insn.addr) ? ' linked' : ''}${row.fnId === fnId ? ' cur-fn' : ''}`;
            return (
              <div key={v.key} data-row={index} style={style} className={cls} onClick={() => select(row, index)}>
                {at}
                {showBytes && <span className="bytes">{insn.bytes.replace(/(..)/g, '$1 ').trim()}</span>}
                <Mnemonic insn={insn} />
                <Operands insn={insn} local={new Set(row.local)} />
                {(auto || user) && (
                  <span className="comment">
                    {' ; '}
                    {user && <span className="user-comment">{user}</span>}
                    {user && auto ? '  ' : ''}
                    {auto && <AutoComment insn={insn} />}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The branch-arrow gutter for the rendered rows [first, last]. */
function Arrows({ arrows, first, last, gutter, cursor }: { arrows: Arrow[]; first: number; last: number; gutter: number; cursor: string | undefined }) {
  const height = (last - first + 1) * ROW_H;
  const xr = gutter - 3;
  const y = (row: number) => (row - first) * ROW_H + ROW_H / 2;
  const visible: Arrow[] = [];
  const hot: Arrow[] = [];
  for (const a of arrows) {
    if (a.hi < first || a.lo > last) continue;
    (a.src === cursor || a.dst === cursor ? hot : visible).push(a);
  }
  const path = (a: Arrow) => {
    const x = xr - 8 - a.lane * LANE_W;
    return `M${xr - 1},${y(a.from)} H${x} V${y(a.to)} H${xr - 1}`;
  };
  const draw = (a: Arrow, isHot: boolean) => {
    const kind = a.cond ? 'cond' : 'jump';
    return (
      <path
        key={`${a.src}>${a.dst}`}
        d={path(a)}
        className={`larrow larrow-${kind}${a.to < a.from ? ' up' : ''}${isHot ? ' hot' : ''}`}
        markerEnd={`url(#la-${kind}${isHot ? '-hot' : ''})`}
      />
    );
  };
  return (
    <svg className="arrow-gutter" width={gutter} height={height} style={{ transform: `translateY(${first * ROW_H}px)` }}>
      <defs>
        {(['cond', 'jump'] as const).flatMap((k) =>
          ['', '-hot'].map((h) => (
            <marker key={k + h} id={`la-${k}${h}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" className={`larrow-head larrow-${k}${h ? ' hot' : ''}`} />
            </marker>
          )),
        )}
      </defs>
      {visible.map((a) => draw(a, false))}
      {hot.map((a) => draw(a, true))}
    </svg>
  );
}
