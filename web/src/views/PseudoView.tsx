// Decompiled pseudocode with syntax highlighting and two-way linking to the
// disassembly through OpenDecomp's emission mappings.

import { useEffect, useMemo, useRef } from 'react';
import type { Decompilation, GlobalRef, Mapping, Variable } from '../api.ts';
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
  const variables = useMemo(() => new Map((decomp.variables ?? []).map((v) => [v.name, v])), [decomp]);
  const globals = useMemo(() => new Map((decomp.globals ?? []).map((g) => [g.name, g])), [decomp]);
  /** The parameter, local or global a token names (not a member after `.` or `->`). */
  const nameAt = (line: Token[], i: number): { variable?: Variable; global?: GlobalRef } => {
    const t = line[i]!;
    if (t.kind !== 'ident') return {};
    let j = i - 1;
    while (j >= 0 && line[j]!.kind === 'space') j--;
    const prev = line[j]?.text;
    if (prev === '.' || prev === '->') return {};
    const variable = variables.get(t.text);
    return variable ? { variable } : { global: globals.get(t.text) };
  };

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

  const onToken = (t: Token, variable?: Variable, global?: GlobalRef) => {
    const decl = decomp.declarationSpan;
    const inDecl = !!decl && t.start >= decl.start && t.start < decl.end;
    const m = inDecl ? null : mappingAt(decomp.mappings, t.start, decl);
    const fn = (t.kind === 'call' || t.kind === 'ident') ? byName.get(t.text) : undefined;
    clicked.current = m ? [m.start, m.end] : null;
    const addrs = m ? [...m.addrs].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1)) : [];
    const loc = getState().loc;
    setState({
      linked: new Set(addrs),
      selection: fn
        ? { kind: 'function', fnId: fn.id }
        : variable
          ? { kind: 'variable', fnId: decomp.function.id, id: variable.id, name: variable.name, parameter: variable.parameter, type: variable.type }
          : global
            ? { kind: 'addr', addr: global.addr, global: { name: global.name, type: global.type } }
            : null,
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
                {line.map((t, i) => {
                  const fn = t.kind === 'call' || t.kind === 'ident' ? byName.get(t.text) : undefined;
                  const { variable, global } = fn ? {} : nameAt(line, i);
                  const sel =
                    (fn && selection?.kind === 'function' && selection.fnId === fn.id) ||
                    (variable && selection?.kind === 'variable' && selection.id === variable.id) ||
                    (global && selection?.kind === 'addr' && selection.addr === global.addr);
                  const k = pseudoKey(t.kind, t.text);
                  return (
                    <span
                      key={t.start}
                      data-k={k ?? undefined}
                      className={`tok t-${fn ? 'fn' : t.kind}${variable ? ' t-var' : ''}${global ? ' t-global' : ''}${hot(t) ? ' hot' : ''}${sel ? ' selected' : ''}`}
                      onClick={() => onToken(t, variable, global)}
                      onDoubleClick={fn ? () => void navigate(fn.entry) : undefined}
                      title={
                        fn
                          ? `${fn.name} @ ${fn.entry} — double-click to open`
                          : variable
                            ? `${variable.parameter ? 'parameter' : 'local'} ${variable.type ? `${variable.type} ` : ''}${variable.name} — N rename · Y retype${/^(?:const )?struct_[0-9a-f]+ \*$/.test(variable.type ?? '') ? ' · S create structure' : ''}`
                            : global
                              ? `global ${global.type} ${global.name} @ ${global.addr} — N rename · Y retype · X xrefs`
                              : undefined
                      }
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
