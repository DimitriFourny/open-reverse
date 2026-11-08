// The Calls sidebar tab: callers and callees of the current function, as trees
// that expand lazily (each level is one engine call, cached per revision).

import { useEffect, useState } from 'react';
import type { CallNode } from '../api.ts';
import { loadCalls, navigate, showXrefs, useStore } from '../store.ts';
import { padAddr, mangledNote } from '../util.ts';

type Direction = 'callers' | 'callees';
type Children = { status: 'loading' } | { status: 'ready'; nodes: CallNode[] } | { status: 'error'; error: string };

const MAX_DEPTH = 12;

export function CallTree() {
  const fnId = useStore((s) => s.loc?.fnId ?? null);
  const revision = useStore((s) => s.revision);
  const fn = useStore((s) => (fnId ? s.byId.get(fnId) : undefined));
  if (!fnId || !fn) return <div className="placeholder">No function at the cursor.</div>;
  // Another function starts a fresh tree; a new revision (a rename...) reloads the open levels.
  return <Tree key={fnId} root={fnId} name={fn.name} revision={revision} />;
}

function Tree({ root, name, revision }: { root: string; name: string; revision: number }) {
  // Children by path: "callers" or "callees", then the function IDs expanded below it.
  const [children, setChildren] = useState<Map<string, Children>>(() => new Map());
  const [open, setOpen] = useState<Set<string>>(() => new Set(['callers', 'callees']));
  const byId = useStore((s) => s.byId);

  const load = (path: string) => {
    const parts = path.split('/');
    const dir = parts[0] as Direction;
    const fnId = parts.length > 1 ? parts.at(-1)! : root;
    setChildren((m) => new Map(m).set(path, { status: 'loading' }));
    loadCalls(fnId).then(
      (c) => setChildren((m) => new Map(m).set(path, { status: 'ready', nodes: c[dir] })),
      (e: unknown) => setChildren((m) => new Map(m).set(path, { status: 'error', error: e instanceof Error ? e.message : String(e) })),
    );
  };
  useEffect(() => {
    setChildren(new Map());
    for (const path of open) load(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  const toggle = (path: string) => {
    const next = new Set(open);
    if (next.has(path)) next.delete(path);
    else {
      next.add(path);
      if (!children.has(path)) load(path);
    }
    setOpen(next);
  };

  const rows: React.ReactNode[] = [];
  const walk = (path: string, dir: Direction, depth: number, ancestors: string[]) => {
    const c = children.get(path);
    if (!c || c.status === 'loading') rows.push(<Note key={`${path}#`} depth={depth} text="Loading…" />);
    else if (c.status === 'error') rows.push(<Note key={`${path}#`} depth={depth} text={c.error} error />);
    else if (c.nodes.length === 0) rows.push(<Note key={`${path}#`} depth={depth} text={dir === 'callers' ? 'No known callers' : 'No direct calls'} />);
    else
      for (const n of c.nodes) {
        const p = `${path}/${n.id ?? n.name}`;
        const recursive = !!n.id && ancestors.includes(n.id);
        // An import stub calls nothing worth listing (it jumps to the import).
        const leaf = dir === 'callees' && (!n.id || !!byId.get(n.id)?.importStub);
        const expandable = !!n.id && !recursive && !leaf && depth < MAX_DEPTH;
        const isOpen = expandable && open.has(p);
        rows.push(
          <NodeRow key={p} node={n} depth={depth} recursive={recursive} expandable={expandable} open={isOpen} onToggle={() => toggle(p)} />,
        );
        if (isOpen) walk(p, dir, depth + 1, [...ancestors, n.id!]);
      }
  };
  for (const dir of ['callers', 'callees'] as const) {
    const c = children.get(dir);
    const count = c?.status === 'ready' ? ` (${c.nodes.length})` : '';
    rows.push(
      <div key={dir} className="side-item call-head" onClick={() => toggle(dir)} title={dir === 'callers' ? `Functions that call ${name}` : `Functions ${name} calls`}>
        <span className="call-twisty">{open.has(dir) ? '▾' : '▸'}</span>
        <span className="side-primary">
          {dir === 'callers' ? 'Callers' : 'Callees'}
          {count}
        </span>
      </div>,
    );
    if (open.has(dir)) walk(dir, dir, 1, [root]);
  }
  return (
    <>
      <div className="side-count dim call-root" title={name}>
        Direct calls of <span className="call-root-name">{name}</span> · click: go to · right-click: xrefs
      </div>
      <div className="side-list call-tree">{rows}</div>
    </>
  );
}

function NodeRow({
  node,
  depth,
  recursive,
  expandable,
  open,
  onToggle,
}: {
  node: CallNode;
  depth: number;
  recursive: boolean;
  expandable: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const stub = useStore((s) => (node.id ? !!s.byId.get(node.id)?.importStub : true));
  const mangled = useStore((s) => (node.id ? s.byId.get(node.id) : s.byName.get(node.name))?.mangled);
  const go = () => {
    if (node.entry) void navigate(node.entry, node.id ? { fnId: node.id } : {});
  };
  return (
    <div
      className={`side-item call-node${stub ? ' stub' : ''}${node.entry ? '' : ' unnamed'}`}
      style={{ paddingLeft: 8 + depth * 14 }}
      onClick={go}
      onContextMenu={(e) => {
        if (!node.id) return;
        e.preventDefault();
        void showXrefs({ id: node.id }, node.name);
      }}
      title={`${node.name}${node.entry ? ` @ ${node.entry}` : ' (import)'} · ${node.sites} call site${node.sites === 1 ? '' : 's'}${recursive ? ' · recursive' : ''}${mangledNote(mangled)}`}
    >
      <span
        className="call-twisty"
        onClick={(e) => {
          e.stopPropagation();
          if (expandable) onToggle();
        }}
      >
        {expandable ? (open ? '▾' : '▸') : recursive ? '↻' : ''}
      </span>
      <span className="side-primary">{node.name}</span>
      {node.sites > 1 && <span className="dim call-sites">×{node.sites}</span>}
      <span className="side-secondary">{node.entry ? padAddr(node.entry) : ''}</span>
    </div>
  );
}

function Note({ depth, text, error }: { depth: number; text: string; error?: boolean }) {
  return (
    <div className={`side-item call-note ${error ? 'error' : 'dim'}`} style={{ paddingLeft: 8 + depth * 14 + 14 }}>
      {text}
    </div>
  );
}
