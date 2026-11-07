import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';
import type { Instruction, Listing } from '../api.ts';
import { setCursor, useStore } from '../store.ts';
import { padAddr } from '../util.ts';
import { Operands, autoComment, branchTargets, labelFor, mnemonicClass } from './disasm.tsx';

type Row =
  | { kind: 'header' }
  | { kind: 'blank' }
  | { kind: 'label'; addr: string }
  | { kind: 'insn'; insn: Instruction };

const ROW_H = 20;

export function LinearView({ listing }: { listing: Listing }) {
  const cursor = useStore((s) => s.loc?.addr);
  const linked = useStore((s) => s.linked);
  const comments = useStore((s) => s.comments);
  const showBytes = useStore((s) => s.showBytes);
  const parentRef = useRef<HTMLDivElement>(null);

  const { rows, indexOf, local, width } = useMemo(() => {
    const targets = branchTargets(listing);
    const blockStarts = new Set(listing.blocks.map((b) => b.start));
    const rows: Row[] = [{ kind: 'header' }];
    const indexOf = new Map<string, number>();
    listing.instructions.forEach((insn, i) => {
      if (i > 0 && (blockStarts.has(insn.addr) || targets.has(insn.addr))) {
        const prev = listing.instructions[i - 1]!;
        if (prev.flow.kind !== 'fallthrough' && prev.flow.kind !== 'call') rows.push({ kind: 'blank' });
        if (targets.has(insn.addr)) rows.push({ kind: 'label', addr: insn.addr });
      }
      indexOf.set(insn.addr, rows.length);
      rows.push({ kind: 'insn', insn });
    });
    const last = listing.instructions.at(-1)?.addr ?? '0x0';
    return { rows, indexOf, local: new Set(listing.instructions.map((i) => i.addr)), width: last.length - 2 > 8 ? 12 : 8 };
  }, [listing]);

  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => ROW_H, overscan: 30 });

  // Keep the cursor (or the first linked instruction) in view.
  const focus = linked.size > 0 ? [...linked].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))[0] : cursor;
  useEffect(() => {
    if (!focus) return;
    const idx = indexOf.get(focus);
    if (idx === undefined) return;
    const el = parentRef.current;
    if (!el) return;
    const top = idx * ROW_H;
    if (top < el.scrollTop + ROW_H || top > el.scrollTop + el.clientHeight - 2 * ROW_H) virt.scrollToIndex(idx, { align: 'center' });
  }, [focus, indexOf, virt]);

  const fn = listing.function;
  return (
    <div ref={parentRef} className="code-scroll" tabIndex={-1}>
      <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
        {virt.getVirtualItems().map((v) => {
          const row = rows[v.index]!;
          const style = { position: 'absolute' as const, top: 0, left: 0, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` };
          if (row.kind === 'header')
            return (
              <div key={v.key} style={style} className="row row-header">
                <span className="addr">{padAddr(fn.entry, width)}</span>
                <span className="fn-title">{fn.name}</span>
                <span className="dim">
                  {' '}
                  ; {fn.size} bytes, {listing.blocks.length} blocks
                  {fn.renamed && fn.originalName ? `, originally ${fn.originalName}` : ''}
                </span>
              </div>
            );
          if (row.kind === 'blank') return <div key={v.key} style={style} className="row" />;
          if (row.kind === 'label')
            return (
              <div key={v.key} style={style} className="row">
                <span className="addr">{padAddr(row.addr, width)}</span>
                <span className="label">{labelFor(row.addr)}:</span>
              </div>
            );
          const insn = row.insn;
          const auto = autoComment(insn);
          const user = comments[insn.addr];
          const cls = `row insn${insn.addr === cursor ? ' cursor' : ''}${linked.has(insn.addr) ? ' linked' : ''}`;
          return (
            <div key={v.key} style={style} className={cls} onClick={() => setCursor(insn.addr)}>
              <span className="addr">{padAddr(insn.addr, width)}</span>
              {showBytes && <span className="bytes">{insn.bytes.replace(/(..)/g, '$1 ').trim()}</span>}
              <span className={mnemonicClass(insn)}>{insn.mnemonic}</span>
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
  );
}
