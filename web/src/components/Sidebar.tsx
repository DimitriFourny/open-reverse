import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { loadSidebar, navigate, setState, showXrefs, useStore, type SidebarTab } from '../store.ts';
import { cmpAddr, padAddr } from '../util.ts';

const ROW_H = 22;

interface Item {
  key: string;
  primary: string;
  secondary: string;
  addr: string | null;
  cls?: string;
  title?: string;
  onOpen: () => void;
  onXrefs?: () => void;
}

function VList({ items, activeKey }: { items: Item[]; activeKey: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const virt = useVirtualizer({ count: items.length, getScrollElement: () => ref.current, estimateSize: () => ROW_H, overscan: 20 });
  const activeIndex = activeKey ? items.findIndex((i) => i.key === activeKey) : -1;
  // Scroll to the active item when it changes (or first appears), not when the
  // list is re-sorted, filtered or refreshed by background discovery.
  const scrolledTo = useRef<string | null>(null);
  useEffect(() => {
    if (activeIndex < 0 || scrolledTo.current === activeKey) return;
    scrolledTo.current = activeKey;
    virt.scrollToIndex(activeIndex, { align: 'auto' });
  }, [activeKey, activeIndex, virt]);
  return (
    <div ref={ref} className="side-list">
      <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
        {virt.getVirtualItems().map((v) => {
          const it = items[v.index]!;
          return (
            <div
              key={it.key}
              className={`side-item${it.key === activeKey ? ' active' : ''}${it.cls ? ` ${it.cls}` : ''}`}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW_H, transform: `translateY(${v.start}px)` }}
              onClick={it.onOpen}
              onContextMenu={(e) => {
                if (!it.onXrefs) return;
                e.preventDefault();
                it.onXrefs();
              }}
              title={it.title ?? it.primary}
            >
              <span className="side-primary">{it.primary}</span>
              <span className="side-secondary">{it.secondary}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Sort = 'addr' | 'name' | 'size';

export function Sidebar() {
  const tab = useStore((s) => s.sidebarTab);
  const functions = useStore((s) => s.functions);
  const strings = useStore((s) => s.strings);
  const symbols = useStore((s) => s.symbols);
  const sections = useStore((s) => s.sections);
  const loc = useStore((s) => s.loc);
  const indexState = useStore((s) => s.indexState);
  const discovery = useStore((s) => s.discovery);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<Sort>('addr');

  useEffect(() => void loadSidebar(tab), [tab]);

  const f = filter.trim().toLowerCase();
  const items: Item[] = useMemo(() => {
    if (tab === 'functions') {
      const list = functions.filter((fn) => !f || fn.name.toLowerCase().includes(f) || fn.entry.includes(f) || fn.originalName?.toLowerCase().includes(f));
      const sorted = [...list].sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'size' ? b.size - a.size : cmpAddr(a.entry, b.entry)));
      return sorted.map((fn) => ({
        key: fn.id,
        primary: fn.name,
        secondary: sort === 'size' ? String(fn.size) : padAddr(fn.entry),
        addr: fn.entry,
        cls: fn.importStub ? 'stub' : fn.renamed ? 'renamed' : fn.originalName ? '' : 'unnamed',
        title: `${fn.name} @ ${fn.entry} · ${fn.size} bytes · ${fn.boundary}${fn.importStub ? ' · import stub' : ''}${fn.renamed ? ` · originally ${fn.originalName ?? 'unnamed'}` : ''}`,
        onOpen: () => void navigate(fn.entry, { fnId: fn.id }),
        onXrefs: () => void showXrefs({ id: fn.id }, `Xrefs to ${fn.name}`),
      }));
    }
    if (tab === 'strings')
      return (strings.data ?? [])
        .filter((s) => !f || s.text.toLowerCase().includes(f) || s.addr.includes(f))
        .map((s) => ({
          key: s.addr,
          primary: s.text,
          secondary: padAddr(s.addr),
          addr: s.addr,
          title: `${s.addr} (${s.encoding}) — click: xrefs · right-click: go to`,
          onOpen: () => void showXrefs({ addr: s.addr }, `Xrefs to "${s.text.slice(0, 40)}"`),
          onXrefs: () => void navigate(s.addr),
        }));
    if (tab === 'symbols')
      return (symbols.data ?? [])
        .filter((s) => s.name && (!f || s.name.toLowerCase().includes(f)))
        .map((s) => ({
          key: s.id,
          primary: s.name,
          secondary: s.addr ? padAddr(s.addr) : s.kind,
          addr: s.addr,
          title: `${s.name} · ${s.kind}${s.binding ? ` · ${s.binding}` : ''}${s.addr ? ` @ ${s.addr}` : ''}`,
          onOpen: () => {
            if (s.addr && s.addr !== '0x0') void navigate(s.addr);
          },
        }));
    return (sections.data ?? [])
      .filter((s) => !f || s.name.toLowerCase().includes(f))
      .map((s) => ({
        key: s.id,
        primary: `${s.name}`,
        secondary: `${s.permissions.map((p) => p[0]).join('') || '-'} ${s.start ? padAddr(s.start) : ''}`,
        addr: s.start,
        cls: s.kind === 'segment' ? 'segment' : '',
        title: `${s.kind} ${s.name}: ${s.start ?? 'unmapped'} size 0x${s.size.toString(16)} · file ${s.fileOffset ?? '-'} size 0x${s.fileSize.toString(16)} · ${s.permissions.join(', ') || 'no permissions'}`,
        onOpen: () => {
          if (s.start && s.size > 0) void navigate(s.start);
        },
      }));
  }, [tab, functions, strings.data, symbols.data, sections.data, f, sort]);

  const state = tab === 'functions' ? null : tab === 'strings' ? strings : tab === 'symbols' ? symbols : sections;
  const activeKey = tab === 'functions' ? (loc?.fnId ?? null) : null;

  const tabs: [SidebarTab, string][] = [
    ['functions', 'Functions'],
    ['strings', 'Strings'],
    ['symbols', 'Symbols'],
    ['sections', 'Sections'],
  ];
  return (
    <div className="sidebar">
      <div className="tabs">
        {tabs.map(([t, label]) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setState({ sidebarTab: t })}>
            {label}
          </button>
        ))}
      </div>
      <div className="side-filter">
        <input placeholder={`Filter ${tab}…`} value={filter} onChange={(e) => setFilter(e.target.value)} spellCheck={false} />
        {tab === 'functions' && (
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} title="Sort">
            <option value="addr">addr</option>
            <option value="name">name</option>
            <option value="size">size</option>
          </select>
        )}
      </div>
      <div className="side-count dim">
        {items.length.toLocaleString()} {tab}
        {tab === 'functions' && indexState !== 'complete' && (discovery?.state === 'running' ? ' · discovering…' : ' · partial index')}
        {tab === 'functions' && ' · right-click: xrefs'}
        {tab === 'strings' && ' · click: xrefs · right-click: go to'}
      </div>
      {state && state.status === 'loading' && <div className="placeholder">Loading…</div>}
      {state && state.status === 'error' && <div className="placeholder error">{state.error}</div>}
      <VList items={items} activeKey={activeKey} />
    </div>
  );
}
