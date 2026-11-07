// Control-flow graph: dagre layout, HTML blocks over an SVG edge layer, pan/zoom.

import dagre from '@dagrejs/dagre';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Instruction, Listing } from '../api.ts';
import { setCursor, useStore } from '../store.ts';
import { padAddr } from '../util.ts';
import { FindBar, onCodeMouseDown, useCodeKeys, useDomFind } from './codeui.tsx';
import { Mnemonic, Operands, autoComment, displayOperands, followFrom, labelFor } from './disasm.tsx';

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
  from: string;
  to: string;
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
  const edgeKinds = new Map<string, EdgeLayout['color']>();
  for (const b of blocks) {
    const succ = b.edges.filter((e) => e.to && ids.has(e.to));
    const last = byAddr.get(b.insns.at(-1)!);
    const fall = last ? `0x${(BigInt(last.addr) + BigInt(last.size)).toString(16)}` : null;
    succ.forEach((e, k) => {
      const color: EdgeLayout['color'] = succ.length > 1 ? (e.target === fall || e.kind === 'fallthrough' ? 'false' : 'true') : 'jump';
      g.setEdge(b.id, e.to!, {}, `${b.id}-${k}`);
      edgeKinds.set(`${b.id}-${k}`, color);
    });
  }
  dagre.layout(g);
  const placed: NodeLayout[] = [];
  for (const [id, n] of nodes) {
    const p = g.node(id);
    placed.push({ ...n, x: p.x - n.w / 2, y: p.y - n.h / 2 });
  }
  const edges: EdgeLayout[] = g.edges().map((e) => {
    const kind = edgeKinds.get(e.name ?? '') ?? 'jump';
    const pts = (g.edge(e) as { points: { x: number; y: number }[] }).points;
    const back = g.node(e.w).y <= g.node(e.v).y;
    return { from: e.v, to: e.w, points: pts, color: back && kind === 'jump' ? 'back' : kind };
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

const MINI_W = 200;
const MINI_H = 150;

export function GraphView({ listing }: { listing: Listing }) {
  const cursor = useStore((s) => s.loc?.addr);
  const linked = useStore((s) => s.linked);
  const comments = useStore((s) => s.comments);
  const width = (listing.instructions.at(-1)?.addr.length ?? 10) - 2 > 8 ? 12 : 8;
  const g = useMemo(() => layout(listing, width, comments), [listing, width, comments]);
  const local = useMemo(() => new Set(listing.instructions.map((i) => i.addr)), [listing]);
  const viewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState({ x: 0, y: 0, k: 1 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  // Instruction → (block, line) and the block graph, for keyboard moves.
  const { nodeOf, nodeById, succ, pred } = useMemo(() => {
    const nodeOf = new Map<string, { node: NodeLayout; line: number }>();
    const nodeById = new Map<string, NodeLayout>();
    for (const n of g.nodes) {
      nodeById.set(n.id, n);
      n.insns.forEach((insn, line) => nodeOf.set(insn.addr, { node: n, line }));
    }
    const succ = new Map<string, EdgeLayout[]>();
    const pred = new Map<string, EdgeLayout[]>();
    for (const e of g.edges) {
      (succ.get(e.from) ?? succ.set(e.from, []).get(e.from)!).push(e);
      (pred.get(e.to) ?? pred.set(e.to, []).get(e.to)!).push(e);
    }
    return { nodeOf, nodeById, succ, pred };
  }, [g]);

  const at = cursor ? nodeOf.get(cursor) : undefined;
  const focusNode = at?.node ?? g.nodes[0];
  const focusLine = at?.line ?? -1;

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep the cursor line in view: the top of the entry block on first display,
  // then pan only when the cursor line (or its block's left edge) leaves the view.
  const lastFn = useRef<string | null>(null);
  useLayoutEffect(() => {
    const el = viewRef.current;
    if (!el || !focusNode) return;
    const firstTime = lastFn.current !== listing.function.id;
    lastFn.current = listing.function.id;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const ly = focusNode.y + PAD_Y + (focusLine + 1) * LINE_H;
    setTf((t) => {
      const k = firstTime ? 1 : t.k;
      const vx = t.x + focusNode.x * k;
      const vy = t.y + ly * k;
      const hVisible = !firstTime && vx >= 0 && (vx + focusNode.w * k <= w || vx <= 40);
      const vVisible = !firstTime && vy >= 0 && vy + LINE_H * k <= h;
      if (hVisible && vVisible) return t;
      const x = hVisible ? t.x : Math.min(w / 2 - (focusNode.x + focusNode.w / 2) * k, 20 - focusNode.x * k);
      let y = t.y;
      if (!vVisible) {
        y = firstTime ? 40 - focusNode.y * k : h / 3 - ly * k;
        if (firstTime && y + ly * k > h - 2 * LINE_H) y = h / 3 - ly * k;
      }
      return { k, x, y };
    });
  }, [focusNode, focusLine, listing.function.id]);

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

  // ------------------------------------------------------------- keyboard
  const firstOf = (id: string | undefined) => (id ? nodeById.get(id)?.insns[0] : undefined);
  const lastOf = (id: string | undefined) => (id ? nodeById.get(id)?.insns.at(-1) : undefined);
  useCodeKeys((e) => {
    if (!at) {
      if (['ArrowDown', 'ArrowUp', 'Home'].includes(e.key) && g.nodes[0]?.insns[0]) {
        setCursor(g.nodes[0].insns[0].addr);
        return true;
      }
      return;
    }
    const { node, line } = at;
    let target: Instruction | undefined;
    switch (e.key) {
      case 'ArrowDown': {
        if (line < node.insns.length - 1) target = node.insns[line + 1];
        else {
          // Leaving the block: the fall-through (false) successor first, then any.
          const out = succ.get(node.id) ?? [];
          target = firstOf((out.find((x) => x.color === 'false') ?? out.find((x) => x.color !== 'back') ?? out[0])?.to);
        }
        break;
      }
      case 'ArrowUp': {
        if (line > 0) target = node.insns[line - 1];
        else {
          // Entering from above: the predecessor that falls through here, else any.
          const ins = pred.get(node.id) ?? [];
          const fall = ins.find((x) => {
            const last = lastOf(x.from);
            return !!last && BigInt(last.addr) + BigInt(last.size) === BigInt(node.insns[0]!.addr);
          });
          target = lastOf((fall ?? ins.find((x) => x.color !== 'back') ?? ins[0])?.from);
        }
        break;
      }
      case 'Home':
        target = listing.instructions[0];
        break;
      case 'End':
        target = listing.instructions.at(-1);
        break;
      case 'Enter':
        followFrom(node.insns[line], local);
        return true;
      default:
        return;
    }
    if (target && target.addr !== cursor) setCursor(target.addr);
    return true;
  });

  // ----------------------------------------------------------------- find
  const find = useDomFind(
    canvasRef,
    'main',
    '.gline',
    true,
    g,
    (r) => {
      const line = r.startContainer.parentElement?.closest<HTMLElement>('[data-addr]');
      if (line?.dataset.addr) setCursor(line.dataset.addr);
    },
    () => canvasRef.current?.querySelector('.gline.cursor') ?? null,
  );

  // Rendering every block is the expensive part: keep it out of pan/zoom renders.
  const hotBlock = at?.node.id;
  const content = useMemo(
    () => (
      <>
        <svg width={g.width} height={g.height} className="graph-edges">
          <defs>
            {(['true', 'false', 'jump', 'back'] as const).map((c) => (
              <marker key={c} id={`arrow-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={`edge-head edge-${c}`} />
              </marker>
            ))}
          </defs>
          {g.edges.map((e, i) =>
            e.from === hotBlock ? null : (
              <path key={i} d={edgePath(e.points)} className={`edge edge-${e.color}${e.to === hotBlock ? ' warm' : ''}`} markerEnd={`url(#arrow-${e.color})`} />
            ),
          )}
          {/* The cursor block's outgoing edges, on top. */}
          {g.edges.map((e, i) =>
            e.from === hotBlock ? <path key={i} d={edgePath(e.points)} className={`edge edge-${e.color} hot`} markerEnd={`url(#arrow-${e.color})`} /> : null,
          )}
        </svg>
        {g.nodes.map((n) => (
          <GNode key={n.id} n={n} current={n.id === hotBlock} cursor={n.id === hotBlock ? cursor : undefined} linked={linked} comments={comments} local={local} width={width} />
        ))}
      </>
    ),
    [g, hotBlock, cursor, linked, comments, local, width],
  );

  return (
    <div
      ref={viewRef}
      className="graph-view"
      onMouseDown={(e) => {
        onCodeMouseDown('main', '.gline')(e);
        if ((e.target as HTMLElement).closest('.gnode, .minimap, .find-bar, .graph-tools')) return;
        drag.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y };
      }}
      onMouseMove={(e) => {
        const d = drag.current;
        if (d) setTf((t) => ({ ...t, x: d.tx + e.clientX - d.x, y: d.ty + e.clientY - d.y }));
      }}
      onMouseUp={() => (drag.current = null)}
      onMouseLeave={() => (drag.current = null)}
    >
      <FindBar pane="main" count={find.count} index={find.index} onStep={find.step} />
      <div className="graph-tools">
        <button onClick={() => setTf((t) => ({ ...t, k: Math.min(2.5, t.k * 1.2) }))} title="Zoom in (Ctrl+wheel)">+</button>
        <button onClick={() => setTf((t) => ({ ...t, k: Math.max(0.1, t.k / 1.2) }))} title="Zoom out (Ctrl+wheel)">−</button>
        <button onClick={fit} title="Fit graph">Fit</button>
        <span className="dim">{Math.round(tf.k * 100)}%</span>
      </div>
      <div ref={canvasRef} className="graph-canvas" style={{ transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.k})`, width: g.width, height: g.height }}>
        {content}
      </div>
      {g.nodes.length > 1 && size.w > 0 && (
        <Minimap g={g} tf={tf} view={size} current={hotBlock} onJump={(x, y) => setTf((t) => ({ ...t, x: size.w / 2 - x * t.k, y: size.h / 2 - y * t.k }))} />
      )}
    </div>
  );
}

/** One block. Memoized: moving the cursor re-renders only the blocks it leaves and enters. */
const GNode = memo(function GNode({
  n,
  current,
  cursor,
  linked,
  comments,
  local,
  width,
}: {
  n: NodeLayout;
  current: boolean;
  cursor: string | undefined;
  linked: Set<string>;
  comments: Record<string, string>;
  local: Set<string>;
  width: number;
}) {
  return (
    <div className={`gnode${current ? ' current' : ''}`} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
      <div className="gline glabel" data-addr={n.insns[0]?.addr}>
        <span>
          <span data-k={`i:${n.label}`}>{n.label}</span>:
        </span>
      </div>
      {n.insns.map((insn) => {
        const auto = autoComment(insn);
        const user = comments[insn.addr];
        return (
          <div
            key={insn.addr}
            data-addr={insn.addr}
            className={`gline insn${insn.addr === cursor ? ' cursor' : ''}${linked.has(insn.addr) ? ' linked' : ''}`}
            onClick={() => setCursor(insn.addr)}
          >
            <span className="addr">{padAddr(insn.addr, width)}</span>
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
  );
});

/** Overview of the whole graph with the visible area; click or drag to move there. */
function Minimap({
  g,
  tf,
  view,
  current,
  onJump,
}: {
  g: ReturnType<typeof layout>;
  tf: { x: number; y: number; k: number };
  view: { w: number; h: number };
  current: string | undefined;
  onJump: (x: number, y: number) => void;
}) {
  const s = Math.min(MINI_W / g.width, MINI_H / g.height);
  const w = Math.max(20, g.width * s);
  const h = Math.max(20, g.height * s);
  const shapes = useMemo(
    () => (
      <>
        {g.edges.map((e, i) => (
          <path key={i} d={edgePath(e.points)} className={`mini-edge edge-${e.color}`} />
        ))}
        {g.nodes.map((n) => (
          <rect key={n.id} x={n.x} y={n.y} width={n.w} height={n.h} className={n.id === current ? 'mini-node current' : 'mini-node'} />
        ))}
      </>
    ),
    [g, current],
  );
  const toGraph = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onJump(((e.clientX - r.left) / r.width) * g.width, ((e.clientY - r.top) / r.height) * g.height);
  };
  // The visible area, in graph coordinates.
  const vx = -tf.x / tf.k;
  const vy = -tf.y / tf.k;
  return (
    <svg
      className="minimap"
      width={w}
      height={h}
      viewBox={`0 0 ${g.width} ${g.height}`}
      preserveAspectRatio="none"
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        toGraph(e);
        const svg = e.currentTarget;
        const move = (ev: MouseEvent) => {
          const r = svg.getBoundingClientRect();
          onJump(((ev.clientX - r.left) / r.width) * g.width, ((ev.clientY - r.top) / r.height) * g.height);
        };
        const up = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      }}
    >
      {shapes}
      <rect x={vx} y={vy} width={view.w / tf.k} height={view.h / tf.k} className="mini-view" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
