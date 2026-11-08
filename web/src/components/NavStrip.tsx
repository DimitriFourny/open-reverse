// The navigation band (IDA's colour navigation bar): the image's mapped sections laid
// end to end, coloured by what each stretch is, with the cursor and bookmarks marked.
// Click or drag to go to the address under the pointer.

import { useEffect, useMemo, useRef, useState } from 'react';
import { api, type NavMap } from '../api.ts';
import { NAV_KINDS, navAddress, navFraction } from '../engine/search.ts';
import { navigate, useStore } from '../store.ts';
import { cmpAddr, functionOffset } from '../util.ts';

const COLORS: Record<(typeof NAV_KINDS)[number], string> = {
  unexplored: '#6e6436',
  data: '#7d8696',
  code: '#3f86d8',
  import: '#c792ea',
  string: '#d99a4e',
};
const LABELS: Record<(typeof NAV_KINDS)[number], string> = {
  unexplored: 'unexplored code',
  data: 'data',
  code: 'function',
  import: 'import stub',
  string: 'string',
};

const HIDE_KEY = 'open-reverse.navstrip';

export function navStripHidden(): boolean {
  try {
    return localStorage.getItem(HIDE_KEY) === 'hidden';
  } catch {
    return false;
  }
}

export function NavStrip() {
  const bid = useStore((s) => s.bid);
  const revision = useStore((s) => s.revision);
  const cursor = useStore((s) => s.loc?.addr ?? null);
  const bookmarks = useStore((s) => s.bookmarks);
  const functions = useStore((s) => s.functions);
  const [map, setMap] = useState<NavMap | null>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<{ x: number; text: string } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sorted = useMemo(() => [...functions].sort((a, b) => cmpAddr(a.entry, b.entry)), [functions]);

  // The map changes with the function index; during discovery the revision moves every
  // few seconds, so reloads are spaced out.
  useEffect(() => {
    if (!bid) return;
    let live = true;
    const t = setTimeout(
      () =>
        void api.navMap(bid).then(
          (m) => live && setMap(m),
          () => undefined,
        ),
      map ? 1500 : 0,
    );
    return () => {
      live = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bid, revision]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map || width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.round(canvas.clientHeight * dpr) || 12;
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext('2d');
    if (!g) return;
    g.clearRect(0, 0, w, h);
    // Each device pixel shows the most common kind of the buckets under it.
    const n = map.kinds.length;
    const votes = new Array<number>(NAV_KINDS.length);
    let runStart = 0;
    let runKind = -1;
    const flush = (to: number) => {
      if (runKind >= 0) {
        g.fillStyle = COLORS[NAV_KINDS[runKind]!];
        g.fillRect(runStart, 0, to - runStart, h);
      }
    };
    for (let x = 0; x < w; x++) {
      const b0 = Math.floor((x * n) / w);
      const b1 = Math.max(b0 + 1, Math.floor(((x + 1) * n) / w));
      votes.fill(0);
      for (let b = b0; b < b1 && b < n; b++) votes[map.kinds[b]!]!++;
      let best = 0;
      for (let k = 1; k < votes.length; k++) if (votes[k]! > votes[best]!) best = k;
      if (best !== runKind) {
        flush(x);
        runStart = x;
        runKind = best;
      }
    }
    flush(w);
    // Section boundaries.
    g.fillStyle = 'rgba(0,0,0,0.55)';
    for (const r of map.regions.slice(1)) g.fillRect(Math.round((r.offset / map.total) * w), 0, Math.max(1, Math.round(dpr)), h);
    // Bookmarks: small ticks at the top; the cursor: a bright bar.
    g.fillStyle = '#9ccc65';
    for (const a of Object.keys(bookmarks)) {
      const f = navFraction(map, a);
      if (f !== null) g.fillRect(Math.round(f * w) - Math.round(dpr), 0, Math.round(3 * dpr), Math.round(h / 2));
    }
    const fc = cursor ? navFraction(map, cursor) : null;
    if (fc !== null) {
      const x = Math.round(fc * w);
      g.fillStyle = '#000';
      g.fillRect(x - Math.round(2 * dpr), 0, Math.round(5 * dpr), h);
      g.fillStyle = '#ffeb3b';
      g.fillRect(x - Math.round(dpr), 0, Math.round(3 * dpr), h);
    }
  }, [map, width, cursor, bookmarks]);

  const at = (clientX: number) => {
    const el = canvasRef.current;
    if (!el || !map) return null;
    const box = el.getBoundingClientRect();
    return navAddress(map, (clientX - box.left) / box.width);
  };
  const kindAt = (clientX: number) => {
    const el = canvasRef.current;
    if (!el || !map) return null;
    const box = el.getBoundingClientRect();
    const b = Math.min(map.kinds.length - 1, Math.max(0, Math.floor(((clientX - box.left) / box.width) * map.kinds.length)));
    return NAV_KINDS[map.kinds[b]!]!;
  };

  // Dragging goes to each address once the previous navigation finished (one history entry).
  const drag = useRef<{ busy: boolean; pending: string | null; first: boolean } | null>(null);
  const goTo = (addr: string) => {
    const d = drag.current;
    if (!d) return;
    if (d.busy) {
      d.pending = addr;
      return;
    }
    d.busy = true;
    const replace = !d.first;
    d.first = false;
    void navigate(addr, { replace }).finally(() => {
      d.busy = false;
      const next = d.pending;
      d.pending = null;
      if (next) goTo(next);
    });
  };

  if (!map) return <div className="navstrip" ref={wrapRef} />;
  return (
    <div className="navstrip" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="navstrip-canvas"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { busy: false, pending: null, first: true };
          const hit = at(e.clientX);
          if (hit) goTo(hit.addr);
        }}
        onPointerMove={(e) => {
          const hit = at(e.clientX);
          const box = e.currentTarget.getBoundingClientRect();
          if (hit) {
            const where = functionOffset(sorted, hit.addr);
            const kind = kindAt(e.clientX);
            setHover({ x: e.clientX - box.left, text: `${hit.addr} · ${hit.region.name}${kind ? ` · ${LABELS[kind]}` : ''}${where ? ` · ${where}` : ''}` });
          }
          if (drag.current && hit) goTo(hit.addr);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onPointerLeave={() => setHover(null)}
      />
      {hover && (
        <div className="navstrip-tip" style={{ left: Math.min(hover.x + 12, Math.max(0, width - 420)) }}>
          {hover.text}
        </div>
      )}
    </div>
  );
}

/** Legend for the band's colours (the band's tooltip). */
export const NAV_LEGEND = NAV_KINDS.map((k) => LABELS[k]).join(' · ');
