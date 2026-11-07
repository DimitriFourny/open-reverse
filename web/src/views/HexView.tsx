// Hex dump of the section around the cursor, fetched lazily in 4 KiB pages.

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.ts';
import { loadSidebar, setCursor, useStore } from '../store.ts';
import { padAddr } from '../util.ts';

const ROW_H = 20;
const PAGE = 4096;

export function HexView() {
  const bid = useStore((s) => s.bid)!;
  const cursor = useStore((s) => s.loc?.addr ?? '0x0');
  const sections = useStore((s) => s.sections);
  const [pages, setPages] = useState<Map<string, (number | null)[]>>(new Map());
  const pending = useRef(new Set<string>());
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => void loadSidebar('sections'), []);
  useEffect(() => {
    setPages(new Map());
    pending.current.clear();
  }, [bid]);

  // The view spans the mapped section holding the cursor, else a 64 KiB window.
  const range = useMemo(() => {
    const c = BigInt(cursor);
    const sec = (sections.data ?? [])
      .filter((s) => s.start && s.size > 0 && s.kind === 'section')
      .find((s) => c >= BigInt(s.start!) && c < BigInt(s.start!) + BigInt(s.size));
    if (sec) return { start: BigInt(sec.start!) & ~0xfn, end: BigInt(sec.start!) + BigInt(sec.size), name: sec.name };
    const start = c > 0x8000n ? (c - 0x8000n) & ~0xfn : 0n;
    return { start, end: start + 0x10000n, name: null as string | null };
  }, [cursor, sections.data]);
  const rows = Number((range.end - range.start + 15n) / 16n);
  const virt = useVirtualizer({ count: rows, getScrollElement: () => parentRef.current, estimateSize: () => ROW_H, overscan: 20 });

  useEffect(() => {
    const idx = Number((BigInt(cursor) - range.start) / 16n);
    if (idx >= 0 && idx < rows) virt.scrollToIndex(idx, { align: 'center' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start, range.end]);

  const items = virt.getVirtualItems();
  useEffect(() => {
    if (items.length === 0) return;
    const first = range.start + BigInt(items[0]!.index) * 16n;
    const last = range.start + BigInt(items.at(-1)!.index + 1) * 16n;
    for (let p = first - (first % BigInt(PAGE)); p < last; p += BigInt(PAGE)) {
      const key = `0x${p.toString(16)}`;
      if (pages.has(key) || pending.current.has(key)) continue;
      pending.current.add(key);
      api
        .memory(bid, key, PAGE)
        .then((chunk) => {
          const bytes: (number | null)[] = new Array(PAGE).fill(null);
          for (const seg of chunk.segments) {
            if (!seg.hex) continue;
            const off = Number(BigInt(seg.start) - p);
            for (let i = 0; i < seg.size; i++) bytes[off + i] = parseInt(seg.hex.slice(i * 2, i * 2 + 2), 16);
          }
          setPages((m) => new Map(m).set(key, bytes));
        })
        .catch(() => setPages((m) => new Map(m).set(key, new Array(PAGE).fill(null))));
    }
  }, [items, range.start, bid, pages]);

  const byteAt = (a: bigint): number | null | undefined => {
    const p = a - (a % BigInt(PAGE));
    return pages.get(`0x${p.toString(16)}`)?.[Number(a - p)];
  };
  const width = range.end > 0xffffffffn ? 12 : 8;
  const cur = BigInt(cursor);

  return (
    <div className="hex-wrap">
      <div className="hex-head dim">
        {range.name ? `Section ${range.name}` : 'Memory'} · {`0x${range.start.toString(16)}`}–{`0x${range.end.toString(16)}`}
      </div>
      <div ref={parentRef} className="code-scroll">
        <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
          {items.map((v) => {
            const base = range.start + BigInt(v.index) * 16n;
            const cells: React.ReactNode[] = [];
            let ascii = '';
            for (let i = 0; i < 16; i++) {
              const a = base + BigInt(i);
              const b = byteAt(a);
              const isCur = a === cur;
              cells.push(
                <span key={i} className={`hb${isCur ? ' cursor' : ''}${b === 0 ? ' zero' : ''}${i === 8 ? ' gap' : ''}`} onClick={() => setCursor(`0x${a.toString(16)}`)}>
                  {b === undefined ? '  ' : b === null ? '??' : b.toString(16).padStart(2, '0')}
                </span>,
              );
              ascii += b === undefined || b === null ? ' ' : b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '.';
            }
            return (
              <div key={v.key} className="row hex-row" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` }}>
                <span className="addr">{padAddr(`0x${base.toString(16)}`, width)}</span>
                <span className="hex-bytes">{cells}</span>
                <span className="hex-ascii">{ascii}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
