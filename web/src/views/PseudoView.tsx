// Decompiled pseudocode with syntax highlighting and two-way linking to the
// disassembly through OpenDecomp's emission mappings.

import { useEffect, useMemo, useRef } from 'react';
import type { Decompilation, Mapping } from '../api.ts';
import { getState, navigate, setState, useStore } from '../store.ts';
import { splitLines, tokenize, type Token } from '../syntax.ts';
import { FindBar, onCodeMouseDown, useDomFind } from './codeui.tsx';
import { pseudoKey } from './tokens.ts';

/** Most specific mapping containing a text offset: shortest span, then fewest addresses. */
function mappingAt(mappings: Mapping[], offset: number, decl: { start: number; end: number } | null): Mapping | null {
  let best: Mapping | null = null;
  for (const m of mappings) {
    if (offset < m.start || offset >= m.end) continue;
    if (decl && m.start <= decl.start && m.end >= decl.end && !(offset >= decl.start && offset < decl.end)) continue;
    if (!best || m.end - m.start < best.end - best.start || (m.end - m.start === best.end - best.start && m.addrs.length < best.addrs.length)) best = m;
  }
  return best;
}

/** Spans of the statements most specifically produced by an instruction. */
function spansFor(mappings: Mapping[], addr: string): [number, number][] {
  let min = Infinity;
  const hits: Mapping[] = [];
  for (const m of mappings) {
    if (!m.addrs.includes(addr)) continue;
    if (m.addrs.length < min) {
      min = m.addrs.length;
      hits.length = 0;
    }
    if (m.addrs.length === min) hits.push(m);
  }
  // Prefer the narrowest spans among equally specific mappings.
  const minLen = Math.min(...hits.map((m) => m.end - m.start));
  return hits.filter((m) => m.end - m.start <= minLen * 4).map((m) => [m.start, m.end]);
}

export function PseudoView({ decomp }: { decomp: Decompilation }) {
  const cursor = useStore((s) => s.loc?.addr);
  const linked = useStore((s) => s.linked);
  const byName = useStore((s) => s.byName);
  const selection = useStore((s) => s.selection);
  const scrollRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => splitLines(tokenize(decomp.text, decomp.language)), [decomp]);

  // When the cursor moved in the disassembly (not from a click here), highlight its statements.
  const spans = useMemo(() => (cursor && linked.size === 0 ? spansFor(decomp.mappings, cursor) : []), [decomp, cursor, linked]);
  const clicked = useRef<[number, number] | null>(null);
  const active: [number, number][] = linked.size > 0 && clicked.current ? [clicked.current] : spans;
  const hot = (t: Token) => active.some(([s, e]) => t.start < e && t.start + t.text.length > s);

  useEffect(() => {
    if (linked.size > 0) return;
    const el = scrollRef.current?.querySelector('.tok.hot');
    if (!el) return;
    const box = scrollRef.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < box.top || r.bottom > box.bottom) el.scrollIntoView({ block: 'center' });
  }, [spans, linked]);

  const onToken = (t: Token) => {
    const decl = decomp.declarationSpan;
    const inDecl = !!decl && t.start >= decl.start && t.start < decl.end;
    const m = inDecl ? null : mappingAt(decomp.mappings, t.start, decl);
    const fn = (t.kind === 'call' || t.kind === 'ident') ? byName.get(t.text) : undefined;
    clicked.current = m ? [m.start, m.end] : null;
    const addrs = m ? [...m.addrs].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1)) : [];
    const loc = getState().loc;
    setState({
      linked: new Set(addrs),
      selection: fn ? { kind: 'function', fnId: fn.id } : null,
      ...(addrs[0] && loc ? { loc: { ...loc, addr: addrs[0] } } : {}),
    });
  };

  const find = useDomFind(linesRef, 'pseudo', '.ptext', false, lines, (r) => {
    const el = r.startContainer.parentElement;
    const box = scrollRef.current?.getBoundingClientRect();
    const rr = r.getBoundingClientRect();
    if (el && box && (rr.top < box.top || rr.bottom > box.bottom || rr.left < box.left || rr.right > box.right)) el.scrollIntoView({ block: 'center', inline: 'nearest' });
  }, () => linesRef.current?.querySelector('.tok.hot') ?? null);

  return (
    <div className="code-wrap" onMouseDown={onCodeMouseDown('pseudo', '.pline')}>
      <FindBar pane="pseudo" count={find.count} index={find.index} onStep={find.step} />
      <div ref={scrollRef} className="code-scroll pseudo">
        <div ref={linesRef} className="pseudo-lines">
          {lines.map((line, n) => (
            <div key={n} className="pline">
              <span className="lineno">{n + 1}</span>
              <span className="ptext">
                {line.map((t) => {
                  const fn = t.kind === 'call' || t.kind === 'ident' ? byName.get(t.text) : undefined;
                  const sel = fn && selection?.kind === 'function' && selection.fnId === fn.id;
                  const k = pseudoKey(t.kind, t.text);
                  return (
                    <span
                      key={t.start}
                      data-k={k ?? undefined}
                      className={`tok t-${fn ? 'fn' : t.kind}${hot(t) ? ' hot' : ''}${sel ? ' selected' : ''}`}
                      onClick={() => onToken(t)}
                      onDoubleClick={fn ? () => void navigate(fn.entry) : undefined}
                      title={fn ? `${fn.name} @ ${fn.entry} — double-click to open` : undefined}
                    >
                      {t.text}
                    </span>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
