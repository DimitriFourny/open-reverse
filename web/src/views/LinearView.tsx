import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Instruction, Listing } from '../api.ts';
import { setCursor, useStore } from '../store.ts';
import { padAddr } from '../util.ts';
import { FindBar, onCodeMouseDown, useCodeKeys, useFindPaint, useFindQuery } from './codeui.tsx';
import { Mnemonic, Operands, autoComment, branchTargets, displayOperands, followFrom, labelFor } from './disasm.tsx';

type Row =
  | { kind: 'header' }
  | { kind: 'blank' }
  | { kind: 'label'; addr: string }
  | { kind: 'insn'; insn: Instruction };

const ROW_H = 20;
const LANE_W = 6;
const MAX_LANES = 14;

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
 * Jump arrows between in-function branches and their targets. Arrows to the
 * same target share one trunk; each trunk gets a lane (0 = nearest the code)
 * that no overlapping trunk uses, shorter trunks first so they nest inside
 * longer ones. Lanes keep their intervals sorted, so each placement is a
 * binary search per lane: O(n log n · lanes).
 */
function layoutArrows(listing: Listing, indexOf: Map<string, number>): { arrows: Arrow[]; lanes: number } {
  const groups = new Map<string, { lo: number; hi: number; arrows: Arrow[] }>();
  for (const insn of listing.instructions) {
    const k = insn.flow.kind;
    if (k === 'fallthrough' || k === 'call' || k === 'return') continue;
    const from = indexOf.get(insn.addr);
    if (from === undefined) continue;
    for (const t of new Set(insn.flow.targets)) {
      const to = indexOf.get(t);
      if (to === undefined) continue;
      const a: Arrow = { from, to, lo: Math.min(from, to), hi: Math.max(from, to), lane: 0, cond: insn.flow.conditional, src: insn.addr, dst: t };
      const g = groups.get(t);
      if (g) {
        g.arrows.push(a);
        g.lo = Math.min(g.lo, a.lo);
        g.hi = Math.max(g.hi, a.hi);
      } else groups.set(t, { lo: a.lo, hi: a.hi, arrows: [a] });
    }
  }
  const order = [...groups.values()].sort((a, b) => a.hi - a.lo - (b.hi - b.lo) || a.lo - b.lo);
  const lanes: { lo: number; hi: number }[][] = [];
  let used = 0;
  for (const g of order) {
    let lane = MAX_LANES - 1;
    for (let l = 0; l < MAX_LANES; l++) {
      const iv = (lanes[l] ??= []);
      // First interval ending at or after g.lo; the lane is free if it starts after g.hi.
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

function rowText(row: Row, width: number, showBytes: boolean, local: Set<string>, comments: Record<string, string>, header: string): string {
  if (row.kind === 'header') return header;
  if (row.kind === 'blank') return '';
  if (row.kind === 'label') return `${padAddr(row.addr, width)} ${labelFor(row.addr)}:`;
  const i = row.insn;
  const parts = [padAddr(i.addr, width)];
  if (showBytes) parts.push(i.bytes.replace(/(..)/g, '$1 ').trim());
  parts.push(i.mnemonic, displayOperands(i, local));
  const auto = autoComment(i);
  const user = comments[i.addr];
  if (auto || user) parts.push(` ; ${user ?? ''}${user && auto ? '  ' : ''}${auto ?? ''}`);
  return parts.join(' ');
}

export function LinearView({ listing }: { listing: Listing }) {
  const cursor = useStore((s) => s.loc?.addr);
  const linked = useStore((s) => s.linked);
  const comments = useStore((s) => s.comments);
  const showBytes = useStore((s) => s.showBytes);
  const parentRef = useRef<HTMLDivElement>(null);
  const query = useFindQuery('main');

  const { rows, indexOf, insnIndex, rowToInsn, local, width } = useMemo(() => {
    const targets = branchTargets(listing);
    const blockStarts = new Set(listing.blocks.map((b) => b.start));
    const rows: Row[] = [{ kind: 'header' }];
    const indexOf = new Map<string, number>();
    const insnIndex = new Map<string, number>();
    listing.instructions.forEach((insn, i) => {
      if (i > 0 && (blockStarts.has(insn.addr) || targets.has(insn.addr))) {
        const prev = listing.instructions[i - 1]!;
        if (prev.flow.kind !== 'fallthrough' && prev.flow.kind !== 'call') rows.push({ kind: 'blank' });
        if (targets.has(insn.addr)) rows.push({ kind: 'label', addr: insn.addr });
      }
      indexOf.set(insn.addr, rows.length);
      insnIndex.set(insn.addr, i);
      rows.push({ kind: 'insn', insn });
    });
    // For each row, the instruction at or after it (the last one past the end).
    const rowToInsn = new Int32Array(rows.length);
    let next = listing.instructions.length - 1;
    for (let r = rows.length - 1; r >= 0; r--) {
      const row = rows[r]!;
      if (row.kind === 'insn') next = insnIndex.get(row.insn.addr)!;
      rowToInsn[r] = Math.max(0, next);
    }
    const last = listing.instructions.at(-1)?.addr ?? '0x0';
    return { rows, indexOf, insnIndex, rowToInsn, local: new Set(listing.instructions.map((i) => i.addr)), width: last.length - 2 > 8 ? 12 : 8 };
  }, [listing]);

  const { arrows, lanes } = useMemo(() => layoutArrows(listing, indexOf), [listing, indexOf]);
  const gutter = lanes ? lanes * LANE_W + 16 : 6;

  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => ROW_H, overscan: 30 });

  // Keep the cursor (or the first linked instruction) in view: minimal scroll when it is near, centered when far.
  const focus = linked.size > 0 ? [...linked].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))[0] : cursor;
  useEffect(() => {
    if (!focus) return;
    const idx = indexOf.get(focus);
    if (idx === undefined) return;
    const el = parentRef.current;
    if (!el) return;
    const top = idx * ROW_H;
    const h = el.clientHeight;
    if (top >= el.scrollTop && top + ROW_H <= el.scrollTop + h) return;
    const near = top > el.scrollTop - h && top < el.scrollTop + 2 * h;
    virt.scrollToIndex(idx, { align: near ? 'auto' : 'center' });
  }, [focus, indexOf, virt]);

  const cursorInsn = cursor !== undefined ? insnIndex.get(cursor) : undefined;
  const cursorRow = cursor !== undefined ? (indexOf.get(cursor) ?? 0) : 0;
  const moveTo = (i: number) => {
    const insn = listing.instructions[Math.max(0, Math.min(listing.instructions.length - 1, i))];
    if (insn && insn.addr !== cursor) setCursor(insn.addr);
  };

  useCodeKeys((e) => {
    const el = parentRef.current;
    const n = listing.instructions.length;
    if (!n) return;
    const page = Math.max(1, Math.floor((el?.clientHeight ?? 400) / ROW_H) - 2);
    const i = cursorInsn ?? -1;
    switch (e.key) {
      case 'ArrowDown':
        moveTo(i + 1);
        return true;
      case 'ArrowUp':
        moveTo(i < 0 ? 0 : i - 1);
        return true;
      case 'PageDown':
      case 'PageUp': {
        const dir = e.key === 'PageDown' ? 1 : -1;
        if (el) el.scrollTop += dir * page * ROW_H;
        moveTo(rowToInsn[Math.max(0, Math.min(rows.length - 1, cursorRow + dir * page))]!);
        return true;
      }
      case 'Home':
        moveTo(0);
        return true;
      case 'End':
        moveTo(n - 1);
        return true;
      case 'Enter':
        followFrom(i >= 0 ? listing.instructions[i] : undefined, local);
        return true;
    }
  });

  // ---------------------------------------------------------------- find
  const texts = useMemo(() => {
    if (!query) return null;
    const fn = listing.function;
    const header = `${padAddr(fn.entry, width)} ${fn.name}  ; ${fn.size} bytes, ${listing.blocks.length} blocks${fn.renamed && fn.originalName ? `, originally ${fn.originalName}` : ''}`;
    return rows.map((r) => rowText(r, width, showBytes, local, comments, header).toLowerCase());
  }, [query !== null, rows, width, showBytes, local, comments, listing]); // eslint-disable-line react-hooks/exhaustive-deps
  const matches = useMemo(() => {
    if (!query || !texts) return [];
    const q = query.toLowerCase();
    const out: number[] = [];
    texts.forEach((t, r) => t.includes(q) && out.push(r));
    return out;
  }, [texts, query]);
  const [findRow, setFindRow] = useState<number | null>(null);
  useEffect(() => setFindRow(null), [listing]);
  const goMatch = (r: number) => {
    setFindRow(r);
    const insn = listing.instructions[rowToInsn[r]!];
    if (insn) setCursor(insn.addr);
    virt.scrollToIndex(r, { align: 'center' });
  };
  // The current match is the find position while the cursor is still on it, else the cursor row.
  const base = findRow !== null && rowToInsn[findRow] === cursorInsn ? findRow : cursorRow;
  const step = (dir: 1 | -1) => {
    if (!matches.length) return;
    const next = dir > 0 ? (matches.find((r) => r > base) ?? matches[0]!) : (matches.findLast((r) => r < base) ?? matches.at(-1)!);
    goMatch(next);
  };
  // Typing jumps to the first match at or after the cursor.
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
  const fn = listing.function;
  return (
    <div className="code-wrap" onMouseDown={onCodeMouseDown('main', '.row')}>
      <FindBar pane="main" count={matches.length} index={findIndex} onStep={step} />
      <div ref={parentRef} className="code-scroll" tabIndex={-1}>
        <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
          {lanes > 0 && items.length > 0 && <Arrows arrows={arrows} first={first} last={last} gutter={gutter} cursor={cursor} />}
          {items.map((v) => {
            const row = rows[v.index]!;
            const style = { position: 'absolute' as const, top: 0, left: gutter, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` };
            if (row.kind === 'header')
              return (
                <div key={v.key} data-row={v.index} style={style} className="row row-header">
                  <span className="addr">{padAddr(fn.entry, width)}</span>
                  <span className="fn-title" data-k={`i:${fn.name}`}>
                    {fn.name}
                  </span>
                  <span className="dim">
                    {' '}
                    ; {fn.size} bytes, {listing.blocks.length} blocks
                    {fn.renamed && fn.originalName ? `, originally ${fn.originalName}` : ''}
                  </span>
                </div>
              );
            if (row.kind === 'blank') return <div key={v.key} data-row={v.index} style={style} className="row" />;
            if (row.kind === 'label')
              return (
                <div key={v.key} data-row={v.index} style={style} className="row">
                  <span className="addr">{padAddr(row.addr, width)}</span>
                  <span className="label" data-k={`i:${labelFor(row.addr)}`}>
                    {labelFor(row.addr)}:
                  </span>
                </div>
              );
            const insn = row.insn;
            const auto = autoComment(insn);
            const user = comments[insn.addr];
            const cls = `row insn${insn.addr === cursor ? ' cursor' : ''}${linked.has(insn.addr) ? ' linked' : ''}`;
            return (
              <div key={v.key} data-row={v.index} style={style} className={cls} onClick={() => setCursor(insn.addr)}>
                <span className="addr">{padAddr(insn.addr, width)}</span>
                {showBytes && <span className="bytes">{insn.bytes.replace(/(..)/g, '$1 ').trim()}</span>}
                <Mnemonic insn={insn} />
                <Operands insn={insn} local={local} />
                {(auto || user) && (
                  <span className="comment">
                    {' ; '}
                    {user && <span className="user-comment">{user}</span>}
                    {user && auto ? '  ' : ''}
                    {auto}
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
