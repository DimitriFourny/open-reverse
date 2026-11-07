// Control-flow graph: dagre layout, HTML blocks over an SVG edge layer, pan/zoom.

import dagre from '@dagrejs/dagre';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Instruction, Listing } from '../api.ts';
import { setCursor, useStore } from '../store.ts';
import { padAddr } from '../util.ts';
import { Operands, autoComment, displayOperands, labelFor, mnemonicClass } from './disasm.tsx';

const LINE_H = 18;
const PAD_X = 10;
const PAD_Y = 6;

let charWidth = 0;
function measureChar(): number {
  if (charWidth) return charWidth;
  const ctx = document.createElement('canvas').getContext('2d');
  if (ctx) {
    ctx.font = getComputedStyle(document.body).getPropertyValue('--mono-font-spec') || '12px monospace';
    charWidth = ctx.measureText('0123456789abcdef').width / 16;
  }
  return charWidth || 7.2;
}

interface NodeLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string | null;
  insns: Instruction[];
}
interface EdgeLayout {
  points: { x: number; y: number }[];
  color: 'true' | 'false' | 'jump' | 'back';
}

function layout(listing: Listing, width: number, comments: Record<string, string>) {
  const byAddr = new Map(listing.instructions.map((i) => [i.addr, i]));
  const local = new Set(byAddr.keys());
  const blocks = listing.blocks.filter((b) => b.insns.length > 0);
  const ids = new Set(blocks.map((b) => b.id));
  const cw = measureChar();
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: 'TB', nodesep: 30, ranksep: 40, edgesep: 15, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  const startIds = new Set<string>();
  const nodes = new Map<string, Omit<NodeLayout, 'x' | 'y'>>();
  for (const b of blocks) {
    const insns = b.insns.map((a) => byAddr.get(a)).filter((i): i is Instruction => !!i);
    const label = b.start === listing.function.entry ? listing.function.name : labelFor(b.start);
    let chars = label.length + 1;
    for (const i of insns) {
      const extra = (autoComment(i)?.length ?? 0) + (comments[i.addr]?.length ?? 0);
      chars = Math.max(chars, width + 2 + Math.max(8, i.mnemonic.length + 1) + 2 + displayOperands(i, local).length + (extra ? extra + 4 : 0) + 2);
    }
    const w = Math.min(1100, Math.ceil(chars * cw) + PAD_X * 2 + 4);
    const h = (insns.length + 1) * LINE_H + PAD_Y * 2;
    nodes.set(b.id, { id: b.id, w, h, label, insns });
    g.setNode(b.id, { width: w, height: h });
    if (b.start === listing.function.entry) startIds.add(b.id);
  }
  const edgeKinds: { from: string; to: string; color: EdgeLayout['color'] }[] = [];
  for (const b of blocks) {
    const succ = b.edges.filter((e) => e.to && ids.has(e.to));
    const last = byAddr.get(b.insns.at(-1)!);
    const fall = last ? `0x${(BigInt(last.addr) + BigInt(last.size)).toString(16)}` : null;
    succ.forEach((e, k) => {
      const color: EdgeLayout['color'] = succ.length > 1 ? (e.target === fall || e.kind === 'fallthrough' ? 'false' : 'true') : 'jump';
      g.setEdge(b.id, e.to!, {}, `${b.id}-${k}`);
      edgeKinds.push({ from: b.id, to: e.to!, color });
    });
  }
  dagre.layout(g);
  const placed: NodeLayout[] = [];
  for (const [id, n] of nodes) {
    const p = g.node(id);
    placed.push({ ...n, x: p.x - n.w / 2, y: p.y - n.h / 2 });
  }
  const edges: EdgeLayout[] = g.edges().map((e, idx) => {
    const kind = edgeKinds[idx];
    const pts = (g.edge(e) as { points: { x: number; y: number }[] }).points;
    const back = g.node(e.w).y <= g.node(e.v).y;
    return { points: pts, color: back && kind?.color === 'jump' ? 'back' : (kind?.color ?? 'jump') };
  });
  const gg = g.graph();
  return { nodes: placed, edges, width: gg.width ?? 0, height: gg.height ?? 0 };
}

function edgePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  let d = `M${points[0]!.x},${points[0]!.y}`;
  for (let i = 1; i < points.length; i++) d += ` L${points[i]!.x},${points[i]!.y}`;
  return d;
}

export function GraphView({ listing }: { listing: Listing }) {
  const cursor = useStore((s) => s.loc?.addr);
  const linked = useStore((s) => s.linked);
  const comments = useStore((s) => s.comments);
  const width = (listing.instructions.at(-1)?.addr.length ?? 10) - 2 > 8 ? 12 : 8;
  const g = useMemo(() => layout(listing, width, comments), [listing, width, comments]);
  const local = useMemo(() => new Set(listing.instructions.map((i) => i.addr)), [listing]);
  const viewRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  // Center on the block holding the cursor whenever the function or cursor block changes.
  const focusNode = useMemo(() => g.nodes.find((n) => n.insns.some((i) => i.addr === cursor)) ?? g.nodes[0], [g, cursor]);
  const lastFocus = useRef<string | null>(null);
  useLayoutEffect(() => {
    const el = viewRef.current;
    if (!el || !focusNode) return;
    const key = `${listing.function.id}:${focusNode.id}`;
    if (lastFocus.current === key) return;
    const firstTime = !lastFocus.current?.startsWith(listing.function.id);
    lastFocus.current = key;
    setTf((t) => {
      const k = firstTime ? 1 : t.k;
      const sx = (focusNode.x + focusNode.w / 2) * k;
      const sy = (focusNode.y + Math.min(focusNode.h / 2, 150)) * k;
      // Only re-center when the block is off-screen (or on first display).
      const vx = t.x + focusNode.x * t.k;
      const vy = t.y + focusNode.y * t.k;
      const visible = !firstTime && vx > 0 && vy > 0 && vx + focusNode.w * t.k < el.clientWidth && vy + Math.min(focusNode.h, 200) * t.k < el.clientHeight;
      if (visible) return t;
      return { k, x: el.clientWidth / 2 - sx, y: firstTime ? 40 - focusNode.y * k : el.clientHeight / 3 - sy };
    });
  }, [focusNode, listing.function.id]);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        setTf((t) => {
          const k = Math.min(2.5, Math.max(0.1, t.k * Math.exp(-e.deltaY * 0.0015)));
          return { k, x: mx - ((mx - t.x) * k) / t.k, y: my - ((my - t.y) * k) / t.k };
        });
      } else setTf((t) => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const fit = () => {
    const el = viewRef.current;
    if (!el) return;
    const k = Math.min(1, el.clientWidth / g.width, el.clientHeight / g.height);
    setTf({ k, x: (el.clientWidth - g.width * k) / 2, y: (el.clientHeight - g.height * k) / 2 });
  };

  return (
    <div
      ref={viewRef}
      className="graph-view"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('.gnode')) return;
        drag.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y };
      }}
      onMouseMove={(e) => {
        const d = drag.current;
        if (d) setTf((t) => ({ ...t, x: d.tx + e.clientX - d.x, y: d.ty + e.clientY - d.y }));
      }}
      onMouseUp={() => (drag.current = null)}
      onMouseLeave={() => (drag.current = null)}
    >
      <div className="graph-tools">
        <button onClick={() => setTf((t) => ({ ...t, k: Math.min(2.5, t.k * 1.2) }))} title="Zoom in (Ctrl+wheel)">+</button>
        <button onClick={() => setTf((t) => ({ ...t, k: Math.max(0.1, t.k / 1.2) }))} title="Zoom out (Ctrl+wheel)">−</button>
        <button onClick={fit} title="Fit graph">Fit</button>
        <span className="dim">{Math.round(tf.k * 100)}%</span>
      </div>
      <div className="graph-canvas" style={{ transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.k})`, width: g.width, height: g.height }}>
        <svg width={g.width} height={g.height} className="graph-edges">
          <defs>
            {(['true', 'false', 'jump', 'back'] as const).map((c) => (
              <marker key={c} id={`arrow-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={`edge-head edge-${c}`} />
              </marker>
            ))}
          </defs>
          {g.edges.map((e, i) => (
            <path key={i} d={edgePath(e.points)} className={`edge edge-${e.color}`} markerEnd={`url(#arrow-${e.color})`} />
          ))}
        </svg>
        {g.nodes.map((n) => (
          <div key={n.id} className="gnode" style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
            <div className="gline glabel">{n.label}:</div>
            {n.insns.map((insn) => {
              const auto = autoComment(insn);
              const user = comments[insn.addr];
              return (
                <div
                  key={insn.addr}
                  className={`gline insn${insn.addr === cursor ? ' cursor' : ''}${linked.has(insn.addr) ? ' linked' : ''}`}
                  onClick={() => setCursor(insn.addr)}
                >
                  <span className="addr">{padAddr(insn.addr, width)}</span>
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
        ))}
      </div>
    </div>
  );
}
