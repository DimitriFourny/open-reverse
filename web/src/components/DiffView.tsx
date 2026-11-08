// Binary diff (BinDiff / Diaphora style): pick another stored binary, then a table of the
// matched and unmatched functions and the selected pair's disassembly side by side.

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Line } from '../api.ts';
import { cancelDiff, selectDiffRow, showDiff, startDiff, useDiff, type DiffCategory, type DiffTableRow } from '../diff.ts';
import { navigate, setState, useStore } from '../store.ts';
import { fmtSize, padAddr } from '../util.ts';

const close = () => setState({ dialog: null });

/** "Diff with…": the other stored binaries; picking one diffs the open binary with it. */
export function DiffPicker() {
  const binaries = useStore((s) => s.binaries);
  const bid = useStore((s) => s.bid);
  const name = useStore((s) => s.info?.record.name ?? '');
  const others = binaries.filter((b) => b.id !== bid);
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => listRef.current?.focus(), []);
  const pick = (i: number) => {
    const b = others[i];
    if (!b) return;
    close();
    void startDiff(b.id);
  };
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        className="modal diff-picker"
        onKeyDown={(e) => {
          if (e.key === 'Escape') (e.stopPropagation(), close());
          else if (e.key === 'ArrowDown') (e.preventDefault(), setSel(Math.min(sel + 1, others.length - 1)));
          else if (e.key === 'ArrowUp') (e.preventDefault(), setSel(Math.max(sel - 1, 0)));
          else if (e.key === 'Enter') (e.preventDefault(), pick(sel));
        }}
      >
        <div className="modal-title">Diff {name} with…</div>
        <div className="goto-list" ref={listRef} tabIndex={0}>
          {others.length === 0 && <div className="goto-hint dim">Open another binary first (for instance the other version): it then shows here.</div>}
          {others.map((b, i) => (
            <div key={b.id} className={`goto-item diff-pick${i === sel ? ' active' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => pick(i)}>
              <span>{b.name}</span>
              <span className="dim">
                {fmtSize(b.size)} · {new Date(b.addedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <span className="dim">
            Matches every function of {name || 'this binary'} (A) with the other binary's (B). The first diff of a binary disassembles each of its functions (in the
            background, cancellable); later ones reuse the signatures.
          </span>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES: [DiffCategory | 'all', string][] = [
  ['all', 'All'],
  ['changed', 'Changed'],
  ['identical', 'Identical'],
  ['onlyA', 'Only in A'],
  ['onlyB', 'Only in B'],
];

type SortKey = 'a' | 'b' | 'similarity' | 'reason' | 'size' | 'blocks' | 'insns';

const COLUMNS: [SortKey, string, string][] = [
  ['a', 'A function', 'Function of the open binary (A)'],
  ['b', 'B function', 'Matched function of the other binary (B)'],
  ['similarity', 'Similarity', '1.00: identical code (addresses aside)'],
  ['reason', 'Matched by', 'The round that matched the pair'],
  ['size', 'Δ size', 'Size in bytes, B − A'],
  ['blocks', 'Δ blocks', 'Basic blocks, B − A'],
  ['insns', 'Δ insns', 'Instructions, B − A'],
];

const delta = (r: DiffTableRow, k: 'size' | 'blocks' | 'insns') => (r.a && r.b ? r.b[k] - r.a[k] : null);

function sortValue(r: DiffTableRow, k: SortKey): string | number | null {
  if (k === 'a') return r.a?.name ?? null;
  if (k === 'b') return r.b?.name ?? null;
  if (k === 'similarity') return r.similarity;
  if (k === 'reason') return r.reason || null;
  return delta(r, k);
}

function fmtDelta(n: number | null): React.ReactNode {
  if (n === null) return <span className="dim">—</span>;
  if (n === 0) return <span className="dim">0</span>;
  return <span className={n > 0 ? 'diff-plus' : 'diff-minus'}>{n > 0 ? `+${n}` : n}</span>;
}

const ROW_H = 22;

function goToA(r: DiffTableRow | undefined): void {
  if (!r?.a) return;
  showDiff(false);
  void navigate(r.a.entry, { fnId: r.a.id });
}

export function DiffView() {
  const d = useDiff((s) => s);
  const aName = useStore((s) => s.info?.record.name ?? 'A');
  const bName = useStore((s) => s.binaries.find((b) => b.id === d.other)?.name ?? 'B');
  const [category, setCategory] = useState<DiffCategory | 'all'>('all');
  const [text, setText] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'similarity', dir: 1 });
  const listRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<DiffCategory, number> = { identical: 0, changed: 0, onlyA: 0, onlyB: 0 };
    for (const r of d.rows) c[r.category]++;
    return c;
  }, [d.rows]);
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    const out = d.rows.filter(
      (r) =>
        (category === 'all' || r.category === category) &&
        (!t || [r.a?.name, r.a?.entry, r.b?.name, r.b?.entry, r.reason].some((v) => v?.toLowerCase().includes(t))),
    );
    // Rows without the value (unmatched functions) first: they are what changed most.
    return out.sort((x, y) => {
      const a = sortValue(x, sort.key);
      const b = sortValue(y, sort.key);
      if (a === b) return 0;
      if (a === null) return -1;
      if (b === null) return 1;
      return (a < b ? -1 : 1) * sort.dir;
    });
  }, [d.rows, category, text, sort]);
  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => listRef.current, estimateSize: () => ROW_H, overscan: 20 });
  const current = rows.findIndex((r) => r.key === d.selected);
  useEffect(() => {
    if (current >= 0) virt.scrollToIndex(current, { align: 'auto' });
  }, [current, virt]);

  const onKeys = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    let handled = true;
    const at = (i: number) => rows[Math.max(0, Math.min(rows.length - 1, i))];
    const go = (i: number) => {
      const r = at(i);
      if (r) void selectDiffRow(r.key);
    };
    if (e.key === 'Escape') {
      if (d.status === 'running') cancelDiff();
      else showDiff(false);
    } else if (e.target instanceof HTMLInputElement) handled = false;
    else if (e.key === 'ArrowDown') go(current + 1);
    else if (e.key === 'ArrowUp') go(current - 1);
    else if (e.key === 'PageDown') go(current + 20);
    else if (e.key === 'PageUp') go(current - 20);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(rows.length - 1);
    else if (e.key === 'Enter') goToA(rows[current]);
    else handled = false;
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const p = d.progress;
  const pct = p && p.total ? Math.min(100, (100 * p.done) / p.total) : null;
  const r = d.result;
  const selected = current >= 0 ? rows[current] : d.rows.find((x) => x.key === d.selected);
  return (
    <div className="diff-view" onKeyDown={onKeys}>
      <div className="panel-head diff-head">
        <span className="diff-title">
          Diff <b className="diff-a">A</b> {aName} <span className="dim">↔</span> <b className="diff-b">B</b> {bName}
        </span>
        {d.status === 'done' && r && (
          <span className="diff-counts">
            <span className="diff-count c-identical">{counts.identical} identical</span>
            <span className="diff-count c-changed">{counts.changed} changed</span>
            <span className="diff-count c-onlyA">{counts.onlyA} only in A</span>
            <span className="diff-count c-onlyB">{counts.onlyB} only in B</span>
          </span>
        )}
        {d.status === 'done' && r && (
          <span className="dim diff-timing" title={`Signatures: A ${(r.a.ms / 1000).toFixed(1)} s${r.a.cached ? ' (cached)' : ''}, B ${(r.b.ms / 1000).toFixed(1)} s${r.b.cached ? ' (cached)' : ''} · matching ${r.matchMs} ms`}>
            {r.a.functions} / {r.b.functions} functions · {((r.a.ms + r.b.ms + r.matchMs) / 1000).toFixed(1)} s
          </span>
        )}
        {d.status === 'running' && (
          <span className="dim">
            {p ? `${p.phase}${p.total ? ` ${p.done}/${p.total}` : ''}${p.detail ? ` · ${p.detail}` : ''}` : 'starting…'}
          </span>
        )}
        <span className="spacer" />
        {d.status === 'running' ? (
          <button onClick={cancelDiff} title="Cancel (Esc)">
            Cancel
          </button>
        ) : (
          d.other && (
            <button onClick={() => void startDiff(d.other!)} title="Run the diff again (signatures are reused unless a binary changed)">
              Rerun
            </button>
          )
        )}
        <button onClick={() => setState({ dialog: { kind: 'diffWith' } })} title="Diff with another binary">
          Diff with…
        </button>
        <button className="close" onClick={() => showDiff(false)} title="Back to the code (Esc); the diff stays (Diff in the top bar)">
          ×
        </button>
      </div>
      {d.status === 'running' && (
        <div className={`progress search-progress${pct === null ? ' indeterminate' : ''}`}>
          <div className="progress-bar" style={pct === null ? undefined : { width: `${pct}%` }} />
        </div>
      )}
      {d.status === 'error' && <div className="placeholder error">{d.error}</div>}
      {d.status === 'cancelled' && <div className="placeholder">Cancelled. Rerun to continue: the functions already disassembled are not cached, the finished side is.</div>}
      {d.status === 'running' && <div className="placeholder">Computing function signatures (size, blocks, mnemonics, CFG shape, strings, callees)…</div>}
      {d.status === 'done' && (
        <>
          <div className="diff-filter">
            <span className="seg">
              {CATEGORIES.map(([c, label]) => (
                <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
                  {label}
                  {c !== 'all' && <span className="dim"> {counts[c]}</span>}
                </button>
              ))}
            </span>
            <input className="side-filter diff-search" placeholder="Filter by name or address…" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} />
            <span className="dim">{rows.length} rows</span>
          </div>
          <div className="diff-table">
            <div className="diff-row diff-th">
              {COLUMNS.map(([k, label, title]) => (
                <span
                  key={k}
                  className={`diff-col-${k}${sort.key === k ? ' sorted' : ''}`}
                  title={`${title} (click to sort)`}
                  onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (-s.dir as 1 | -1) : 1 }))}
                >
                  {label}
                  {sort.key === k ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                </span>
              ))}
            </div>
            <div className="diff-body" ref={listRef} tabIndex={0}>
              <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
                {virt.getVirtualItems().map((v) => {
                  const row = rows[v.index]!;
                  return (
                    <div
                      key={row.key}
                      className={`diff-row cat-${row.category}${row.key === d.selected ? ' active' : ''}`}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` }}
                      onClick={() => {
                        listRef.current?.focus();
                        void selectDiffRow(row.key);
                      }}
                      onDoubleClick={() => goToA(row)}
                      title={row.a ? `Double-click or Enter: go to ${row.a.name} in A` : undefined}
                    >
                      <span className="diff-col-a">{row.a ? <FnCell f={row.a} /> : <span className="dim">—</span>}</span>
                      <span className="diff-col-b">{row.b ? <FnCell f={row.b} /> : <span className="dim">—</span>}</span>
                      <span className="diff-col-similarity">{row.similarity === null ? <span className="dim">—</span> : <Similarity v={row.similarity} />}</span>
                      <span className="diff-col-reason dim">{row.reason || (row.category === 'onlyA' ? 'only in A' : 'only in B')}</span>
                      <span className="diff-col-size">{fmtDelta(delta(row, 'size'))}</span>
                      <span className="diff-col-blocks">{fmtDelta(delta(row, 'blocks'))}</span>
                      <span className="diff-col-insns">{fmtDelta(delta(row, 'insns'))}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <SideBySide row={selected} />
        </>
      )}
    </div>
  );
}

function FnCell({ f }: { f: { name: string; entry: string } }) {
  return (
    <>
      <span className="diff-fn">{f.name}</span> <span className="addr">{f.entry}</span>
    </>
  );
}

function Similarity({ v }: { v: number }) {
  return (
    <span className="diff-sim" title={v === 1 ? 'Identical code (addresses aside)' : `Similarity ${v.toFixed(3)}`}>
      <span className="diff-sim-bar" style={{ width: `${Math.round(v * 100)}%`, background: v === 1 ? 'var(--edge-true)' : v >= 0.8 ? 'var(--warn)' : 'var(--mn-call)' }} />
      <span className="diff-sim-text">{v.toFixed(2)}</span>
    </span>
  );
}

function mnClass(m: string): string {
  if (/^(call|bl|blr|blx)$/.test(m)) return 'mn mn-call';
  if (/^(ret|retn|retq|retab|retaa)$/.test(m)) return 'mn mn-ret';
  if (/^(j|b\.|b$|br$|cb|tb)/.test(m)) return 'mn mn-jmp';
  return 'mn';
}

function Cell({ line }: { line: Line | undefined }) {
  if (!line) return <span className="diff-cell empty" />;
  return (
    <span className="diff-cell">
      <span className="addr">{padAddr(line[0])}</span>
      <span className={mnClass(line[1])}>{line[1]}</span>
      <span className="op">{line[2]}</span>
    </span>
  );
}

/** The selected pair's disassembly, aligned by mnemonics; changed, removed and added lines are tinted. */
function SideBySide({ row }: { row: DiffTableRow | undefined }) {
  const pair = useDiff((s) => s.pair);
  if (!row) return <div className="diff-pair placeholder">Select a row to compare its two functions.</div>;
  const loaded = pair && pair.key === row.key ? pair : null;
  const stats = loaded && 'rows' in loaded ? loaded.rows.reduce((n, r) => (r.kind === 'same' ? n : n + 1), 0) : null;
  return (
    <div className="diff-pair">
      <div className="diff-pair-head">
        <span className="diff-side">
          <b className="diff-a">A</b> {row.a ? row.a.name : <span className="dim">no counterpart</span>}
          {row.a && (
            <button className="link" onClick={() => goToA(row)} title="Go to this function in the open binary (Enter)">
              go to
            </button>
          )}
        </span>
        <span className="diff-side">
          <b className="diff-b">B</b> {row.b ? row.b.name : <span className="dim">no counterpart</span>}
          {stats !== null && <span className="dim"> · {stats === 0 ? 'no line differs' : `${stats} line${stats === 1 ? '' : 's'} differ`}</span>}
        </span>
      </div>
      {!loaded && <div className="placeholder">Loading…</div>}
      {loaded && 'error' in loaded && <div className="placeholder error">{loaded.error}</div>}
      {loaded && 'rows' in loaded && (
        <div className="diff-lines code-scroll">
          {loaded.rows.map((r, i) => (
            <div key={i} className={`diff-line k-${r.kind}`}>
              <Cell line={r.a === null ? undefined : loaded.a[r.a]} />
              <Cell line={r.b === null ? undefined : loaded.b[r.b]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
