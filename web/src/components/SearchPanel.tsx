// The search panel (Alt+B bytes, Alt+T text, Alt+I immediate): one query line with
// its mode and options, then the hits; click or Enter goes to one.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SearchHit } from '../api.ts';
import { cancelSearch, closeSearch, openSearch, setSearch, startSearch, useSearch, type SearchMode } from '../search.ts';
import { navigate, useStore } from '../store.ts';
import { cmpAddr, functionOffset, padAddr } from '../util.ts';

const MODES: [SearchMode, string, string, string][] = [
  ['bytes', 'Bytes', 'Alt+B', '48 8B ?? 05  or  488B??05'],
  ['text', 'Text', 'Alt+T', 'Text (ASCII and/or UTF-16LE)'],
  ['immediate', 'Immediate', 'Alt+I', '0x862, 862h or 2146 (decimal)'],
];

const KIND_LABEL: Record<SearchHit['kind'], string> = { bytes: 'bytes', ascii: 'ASCII', utf16: 'UTF-16', insn: 'insn' };

function go(hit: SearchHit): void {
  void navigate(hit.addr, hit.fn ? { fnId: hit.fn.id } : {});
}

export function SearchPanel() {
  const s = useSearch((x) => x);
  const bid = useStore((x) => x.bid);
  const functions = useStore((x) => x.functions);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(0);
  const sorted = useMemo(() => [...functions].sort((a, b) => cmpAddr(a.entry, b.entry)), [functions]);

  useEffect(() => {
    if (!s.open) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [s.open, s.focus]);
  useEffect(() => setSel(0), [s.ran]);
  useEffect(() => {
    bodyRef.current?.querySelector('tr.active')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!s.open || s.bid !== bid) return null;
  const mode = MODES.find((m) => m[0] === s.mode)!;
  const running = s.status === 'running';
  const p = s.progress;
  const pct = p && p.total ? Math.min(100, (100 * p.done) / p.total) : null;
  const rows = s.hits;
  const current = Math.min(sel, rows.length - 1);
  const onKeys = (e: React.KeyboardEvent) => {
    const other = e.altKey && !e.ctrlKey && !e.metaKey ? ({ KeyB: 'bytes', KeyT: 'text', KeyI: 'immediate' } as const)[e.code as 'KeyB'] : undefined;
    if (other) {
      // The app's Alt+B / T / I do not reach here from the input: switch mode in place.
      e.preventDefault();
      e.stopPropagation();
      openSearch(other);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      if (running) cancelSearch();
      else closeSearch();
    } else if (e.target !== inputRef.current || e.altKey) return;
    else if (e.key === 'Enter') {
      e.preventDefault();
      void startSearch();
    } else if (e.key === 'ArrowDown' && rows.length) {
      e.preventDefault();
      bodyRef.current?.focus();
      setSel(0);
    }
  };
  const onResultKeys = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    let handled = true;
    if (e.key === 'ArrowDown') setSel(Math.min(current + 1, rows.length - 1));
    else if (e.key === 'ArrowUp') {
      if (current <= 0) inputRef.current?.focus();
      else setSel(current - 1);
    } else if (e.key === 'PageDown') setSel(Math.min(current + 20, rows.length - 1));
    else if (e.key === 'PageUp') setSel(Math.max(current - 20, 0));
    else if (e.key === 'Home') setSel(0);
    else if (e.key === 'End') setSel(rows.length - 1);
    else if (e.key === 'Enter' && rows[current]) go(rows[current]);
    else handled = false;
    // The disassembly's own keys (arrows, Enter) must not act on it as well.
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const ran = s.ran;
  const summary =
    s.status === 'running'
      ? `${rows.length} hit${rows.length === 1 ? '' : 's'} so far${p?.detail ? ` · ${p.detail}` : ''}`
      : s.status === 'done'
        ? `${rows.length}${s.truncated ? '+' : ''} hit${rows.length === 1 ? '' : 's'}${s.truncated ? ` (first ${rows.length})` : ''} · ${((s.elapsedMs ?? 0) / 1000).toFixed(2)} s`
        : s.status === 'cancelled'
          ? `cancelled · ${rows.length} hit${rows.length === 1 ? '' : 's'}`
          : '';
  return (
    <div className="bottom-panel search-panel" onKeyDown={onKeys}>
      <div className="panel-head search-head">
        <span className="seg">
          {MODES.map(([m, label, key]) => (
            <button key={m} className={s.mode === m ? 'active' : ''} title={`${label} search (${key})`} onClick={() => (setSearch({ mode: m }), inputRef.current?.focus())}>
              {label}
            </button>
          ))}
        </span>
        <input
          ref={inputRef}
          className="search-input"
          value={s.text[s.mode]}
          placeholder={mode[3]}
          spellCheck={false}
          onChange={(e) => setSearch({ text: { ...s.text, [s.mode]: e.target.value } })}
        />
        {s.mode === 'text' && (
          <span className="search-opts">
            <label title="Match case exactly">
              <input type="checkbox" checked={s.caseSensitive} onChange={(e) => setSearch({ caseSensitive: e.target.checked })} /> Aa
            </label>
            <label>
              <input type="checkbox" checked={s.ascii} onChange={(e) => setSearch({ ascii: e.target.checked })} /> ASCII
            </label>
            <label>
              <input type="checkbox" checked={s.utf16} onChange={(e) => setSearch({ utf16: e.target.checked })} /> UTF-16
            </label>
          </span>
        )}
        {running ? (
          <button onClick={cancelSearch} title="Cancel (Esc)">Cancel</button>
        ) : (
          <button className="primary" onClick={() => void startSearch()} disabled={!s.text[s.mode].trim()} title="Search (Enter)">
            Search
          </button>
        )}
        <span className="dim search-summary">{summary}</span>
        <button className="close" onClick={closeSearch} title="Close (Esc); the results stay until the next search">
          ×
        </button>
      </div>
      {running && (
        <div className={`progress search-progress${pct === null ? ' indeterminate' : ''}`}>
          <div className="progress-bar" style={pct === null ? undefined : { width: `${pct}%` }} />
        </div>
      )}
      <div className="panel-body" ref={bodyRef} tabIndex={0} onKeyDown={onResultKeys}>
        {s.status === 'error' && <div className="placeholder error">{s.error}</div>}
        {s.status === 'idle' && (
          <div className="placeholder">
            {s.mode === 'bytes'
              ? 'Hex bytes, ?? for any byte. Searches every mapped section of the image.'
              : s.mode === 'text'
                ? 'Text in the image bytes, as ASCII and UTF-16LE.'
                : 'Instructions with this constant among their operands (immediates and displacements), in every function. Runs in the background.'}
          </div>
        )}
        {ran && s.status !== 'error' && rows.length === 0 && s.status !== 'running' && <div className="placeholder">No match.</div>}
        {rows.length > 0 && (
          <table className="xref-table search-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Function</th>
                {ran?.mode === 'text' && <th>Encoding</th>}
                <th>{ran?.mode === 'immediate' ? 'Instruction' : ran?.mode === 'text' ? 'String' : 'Bytes'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h, i) => (
                <tr
                  key={`${h.addr}-${h.kind}`}
                  className={i === current ? 'active' : ''}
                  onClick={() => {
                    setSel(i);
                    bodyRef.current?.focus();
                    go(h);
                  }}
                  title={`Go to ${h.addr}`}
                >
                  <td className="addr">{padAddr(h.addr)}</td>
                  <td>{functionOffset(sorted, h.addr) ?? <span className="dim">—</span>}</td>
                  {ran?.mode === 'text' && <td className="dim">{KIND_LABEL[h.kind]}</td>}
                  <td className={`search-preview search-${h.kind}`}>{h.preview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
