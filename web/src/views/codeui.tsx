// UI state shared by the code views (linear, graph, pseudocode): the
// highlighted token, the find bar, and which pane keyboard commands target.
// Kept apart from the main store: none of it is navigation or analysis state.

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getState as getAppState } from '../store.ts';
import { isEditableTarget } from '../util.ts';

export type Pane = 'main' | 'pseudo';

interface CodeUi {
  /** Token key (see tokens.ts) highlighted in every code view. */
  highlight: string | null;
  /** Open find bar: which pane it searches and the query. */
  find: { pane: Pane; query: string; focus: number } | null;
  /** Pane last clicked: Ctrl+F searches it. */
  activePane: Pane;
}

let ui: CodeUi = { highlight: null, find: null, activePane: 'main' };
const listeners = new Set<() => void>();

export function getUi(): CodeUi {
  return ui;
}
export function setUi(patch: Partial<CodeUi>): void {
  ui = { ...ui, ...patch };
  for (const l of listeners) l();
}
export function useUi<T>(selector: (s: CodeUi) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(ui),
  );
}

/** Open (or refocus) the find bar on the active pane. */
export function openFind(pseudoVisible: boolean): void {
  const pane: Pane = ui.activePane === 'pseudo' && pseudoVisible ? 'pseudo' : 'main';
  const query = ui.find?.query ?? '';
  setUi({ find: { pane, query, focus: (ui.find?.focus ?? 0) + 1 } });
}

// ------------------------------------------------------------ highlighting

/**
 * Mouse-down handler for a code view container: the clicked token (an element
 * with data-k) becomes the highlight; a click elsewhere on a code line clears it.
 */
export function onCodeMouseDown(pane: Pane, lineSelector: string) {
  return (e: React.MouseEvent) => {
    if (ui.activePane !== pane) setUi({ activePane: pane });
    if (e.button !== 0) return;
    const t = e.target as HTMLElement;
    const tok = t.closest<HTMLElement>('[data-k]');
    if (tok) {
      if (ui.highlight !== tok.dataset.k) setUi({ highlight: tok.dataset.k ?? null });
    } else if (t.closest(lineSelector) && ui.highlight) setUi({ highlight: null });
  };
}

/** A single style rule highlights every token with the current key: no re-render of the views. */
export function HighlightStyle() {
  const key = useUi((s) => s.highlight);
  if (!key) return null;
  const sel = `[data-k="${key.replace(/["\\]/g, '\\$&')}"]`;
  return (
    <style>{`.code-scroll ${sel}, .graph-view ${sel} { background: var(--tok-hl); box-shadow: 0 0 0 1px var(--tok-hl-edge); border-radius: 2px; }`}</style>
  );
}

// ------------------------------------------------------------ keyboard

/** Window key handler for a code view, skipped while typing or in a dialog. */
export function useCodeKeys(handler: (e: KeyboardEvent) => boolean | void): void {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (getAppState().dialog || isEditableTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (ref.current(e) === true) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

// ------------------------------------------------------------ find

interface CssHighlights {
  set(name: string, h: unknown): void;
  delete(name: string): void;
}
const highlights = (): CssHighlights | null => (globalThis.CSS as unknown as { highlights?: CssHighlights })?.highlights ?? null;
const HighlightCtor = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;

/**
 * Text ranges matching `query` (case-insensitive) in the lines under `root`,
 * in document order. With `fields`, the direct children of a line (address,
 * mnemonic, operands, comment) are joined with one space, as they read.
 */
export function findRanges(root: HTMLElement, lineSelector: string, query: string, fields: boolean): Range[] {
  const q = query.toLowerCase();
  const out: Range[] = [];
  if (!q) return out;
  for (const line of root.querySelectorAll<HTMLElement>(lineSelector)) {
    const nodes: { node: Text; at: number }[] = [];
    let text = '';
    const walk = (el: Element) => {
      for (const c of el.childNodes) {
        if (c.nodeType === Node.TEXT_NODE) {
          nodes.push({ node: c as Text, at: text.length });
          text += (c as Text).data;
        } else if (c.nodeType === Node.ELEMENT_NODE) walk(c as Element);
      }
    };
    if (fields) {
      for (const child of line.children) {
        if (text) text += ' ';
        walk(child);
      }
    } else walk(line);
    const lower = text.toLowerCase();
    // Offsets in a separator snap to the neighbouring text node.
    const startPos = (off: number): [Text, number] | null => {
      for (const n of nodes) if (off < n.at + n.node.data.length) return [n.node, Math.max(0, off - n.at)];
      return null;
    };
    const endPos = (off: number): [Text, number] | null => {
      for (let k = nodes.length - 1; k >= 0; k--) {
        const n = nodes[k]!;
        if (off > n.at) return [n.node, Math.min(off - n.at, n.node.data.length)];
      }
      return null;
    };
    for (let i = lower.indexOf(q); i >= 0; i = lower.indexOf(q, i + q.length)) {
      const a = startPos(i);
      const b = endPos(i + q.length);
      if (!a || !b) continue;
      const r = document.createRange();
      r.setStart(a[0], a[1]);
      r.setEnd(b[0], b[1]);
      out.push(r);
    }
  }
  return out;
}

/**
 * Paint find matches inside `root` with the CSS Custom Highlight API, redone
 * whenever the DOM under it changes (virtualized rows scrolling in).
 * `current` returns the range to paint as the current match, if any.
 */
export function useFindPaint(
  rootRef: React.RefObject<HTMLElement | null>,
  lineSelector: string,
  query: string | null,
  fields: boolean,
  current?: (ranges: Range[]) => Range | null,
  repaint?: unknown,
): void {
  const cur = useRef(current);
  cur.current = current;
  useLayoutEffect(() => {
    const root = rootRef.current;
    const h = highlights();
    if (!root || !h || !HighlightCtor || !query) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const ranges = findRanges(root, lineSelector, query, fields);
      const c = cur.current?.(ranges) ?? null;
      h.set('find', new HighlightCtor(...ranges.filter((r) => r !== c)));
      h.set('find-current', c ? new HighlightCtor(c) : new HighlightCtor());
    };
    paint();
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(paint);
    });
    mo.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    return () => {
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
      h.delete('find');
      h.delete('find-current');
    };
  }, [rootRef, lineSelector, query, fields, repaint]);
}

/** The find bar floating at the top right of a pane. */
export function FindBar({ pane, count, index, onStep }: { pane: Pane; count: number; index: number; onStep: (dir: 1 | -1) => void }) {
  const find = useUi((s) => s.find);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      el.select();
    }
  }, [find?.focus]);
  if (!find || find.pane !== pane) return null;
  const close = () => {
    setUi({ find: null });
    (document.activeElement as HTMLElement | null)?.blur();
  };
  return (
    <div className="find-bar" onMouseDown={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={find.query}
        placeholder="Find…"
        spellCheck={false}
        onChange={(e) => setUi({ find: { ...find, query: e.target.value } })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onStep(e.shiftKey ? -1 : 1);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            close();
          } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            e.currentTarget.select();
          }
        }}
      />
      <span className={`find-count${find.query && count === 0 ? ' none' : ''}`}>
        {find.query ? (count ? `${index >= 0 ? index + 1 : '–'}/${count}` : 'no match') : ''}
      </span>
      <button onClick={() => onStep(-1)} disabled={!count} title="Previous (Shift+Enter)">
        ↑
      </button>
      <button onClick={() => onStep(1)} disabled={!count} title="Next (Enter)">
        ↓
      </button>
      <button className="close" onClick={close} title="Close (Esc)">
        ×
      </button>
    </div>
  );
}

/** The query a pane's find bar is searching, or null. */
export function useFindQuery(pane: Pane): string | null {
  return useUi((s) => (s.find?.pane === pane && s.find.query ? s.find.query : null));
}

/**
 * Find over a fully rendered view (graph, pseudocode): the DOM is the corpus.
 * `onGo` brings a match into view; `start` is the node the first search
 * starts from (the cursor line). `content` changes when the view re-renders
 * with new text.
 */
export function useDomFind(
  rootRef: React.RefObject<HTMLElement | null>,
  pane: Pane,
  lineSelector: string,
  fields: boolean,
  content: unknown,
  onGo: (r: Range) => void,
  start?: () => Node | null,
): { count: number; index: number; step: (dir: 1 | -1) => void } {
  const query = useFindQuery(pane);
  const [state, setState] = useState({ count: 0, index: -1 });
  const idx = useRef(-1);
  const go = useRef(onGo);
  go.current = onGo;
  const from = useRef(start);
  from.current = start;
  const ranges = () => (query && rootRef.current ? findRanges(rootRef.current, lineSelector, query, fields) : []);

  useEffect(() => {
    const rs = ranges();
    let i = -1;
    if (rs.length) {
      const s = from.current?.();
      i = s ? rs.findIndex((r) => s.contains(r.startContainer) || !!(s.compareDocumentPosition(r.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING)) : 0;
      if (i < 0) i = 0;
      go.current(rs[i]!);
    }
    idx.current = i;
    setState({ count: rs.length, index: i });
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const n = ranges().length;
    if (idx.current >= n) idx.current = n ? 0 : -1;
    setState({ count: n, index: idx.current });
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = (dir: 1 | -1) => {
    const rs = ranges();
    if (!rs.length) return;
    const i = idx.current < 0 ? (dir > 0 ? 0 : rs.length - 1) : (idx.current + dir + rs.length) % rs.length;
    idx.current = i;
    setState({ count: rs.length, index: i });
    go.current(rs[i]!);
  };

  useFindPaint(rootRef, lineSelector, query, fields, (rs) => rs[idx.current] ?? null, state.index);
  return { ...state, step };
}
