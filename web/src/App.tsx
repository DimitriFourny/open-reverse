import { useEffect, useRef, useState } from 'react';
import { ExportMenu, ImportArchiveButton, importArchive, isProjectArchive, RecentActions, StoragePanel, TaskDialog, UsageCell } from './components/DataTools.tsx';
import { api } from './api.ts';
import type { EngineMemory } from './engine/memory.ts';
import { Dialogs } from './components/Dialogs.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { XrefsPanel } from './components/XrefsPanel.tsx';
import {
  back,
  beginArray,
  beginBookmark,
  beginComment,
  beginCreateStruct,
  beginRename,
  beginSignature,
  beginXrefs,
  closeBinary,
  createFunction,
  defineData,
  deleteBinary,
  forward,
  getState,
  openBinary,
  parseHash,
  redo,
  refreshBinaries,
  setOptions,
  setState,
  setView,
  togglePseudo,
  toast,
  undo,
  uploadAndOpen,
  useStore,
  type ViewMode,
} from './store.ts';
import { fmtSize, isEditableTarget } from './util.ts';
import { GraphView } from './views/GraphView.tsx';
import { HexView } from './views/HexView.tsx';
import { LinearView } from './views/LinearView.tsx';
import { PseudoView } from './views/PseudoView.tsx';
import { TypesView } from './views/TypesView.tsx';
import { HighlightStyle, getUi, openFind, setUi } from './views/codeui.tsx';

function useKeyboard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = getState();
      if (s.dialog || isEditableTarget(e.target) || !s.bid) return;
      const k = e.key;
      const plain = !e.ctrlKey && !e.metaKey && !e.altKey;
      const ctrl = (e.ctrlKey || e.metaKey) && !e.altKey;
      const lower = k.toLowerCase();
      if (ctrl && lower === 'z') void (e.shiftKey ? redo() : undo());
      else if (ctrl && lower === 'y' && !e.shiftKey) void redo();
      else if (ctrl && lower === 'm' && !e.shiftKey) setState({ dialog: { kind: 'bookmarks' } });
      // Alt+M types "µ" on macOS: match the physical key too.
      else if (e.altKey && !e.ctrlKey && !e.metaKey && (lower === 'm' || e.code === 'KeyM')) beginBookmark();
      else if ((e.ctrlKey || e.metaKey) && (k === 'p' || k === 'k')) {
        e.preventDefault();
        setState({ dialog: { kind: 'goto' } });
      } else if ((e.ctrlKey || e.metaKey) && k === 'f') {
        const main = s.loc?.view === 'linear' || s.loc?.view === 'graph';
        const pseudo = s.showPseudo && main && !!s.loc?.fnId;
        if (!main) return;
        e.preventDefault();
        openFind(pseudo);
      } else if (e.altKey && k === 'ArrowLeft') back();
      else if (e.altKey && k === 'ArrowRight') forward();
      else if (!plain) return;
      else if (k === 'g' || k === 'G') setState({ dialog: { kind: 'goto' } });
      else if (k === 'n' || k === 'N') beginRename();
      else if (k === 'X' && e.shiftKey) beginXrefs('outgoing');
      else if (k === 'x' || k === 'X') beginXrefs();
      else if (k === 'y' || k === 'Y') void beginSignature();
      else if (k === 's' || k === 'S') beginCreateStruct();
      else if (k === ';' || k === '/') beginComment();
      else if (dataKeys(s.loc?.view) && (k === 'd' || k === 'D')) void defineData('cycle');
      else if (dataKeys(s.loc?.view) && (k === 'a' || k === 'A')) void defineData('string');
      else if (dataKeys(s.loc?.view) && (k === 'o' || k === 'O')) void defineData('ptr');
      else if (dataKeys(s.loc?.view) && (k === 'u' || k === 'U')) void defineData('undefine');
      else if (dataKeys(s.loc?.view) && k === '*') void beginArray();
      else if (dataKeys(s.loc?.view) && (k === 'p' || k === 'P')) createFunction();
      else if (k === 'Escape') {
        if (getUi().find) setUi({ find: null });
        else if (s.xrefs) setState({ xrefs: null });
        else back();
      } else if (k === ' ') setView(s.loc?.view === 'graph' ? 'linear' : 'graph');
      else if (k === 'Tab') togglePseudo();
      else if (k === 'h' || k === 'H') setView(s.loc?.view === 'hex' ? 'linear' : 'hex');
      else if (k === 'b' || k === 'B') setState({ showBytes: !s.showBytes });
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/** The data keys (D A O * U P) act on the cursor of the listing and the hex view. */
const dataKeys = (view: ViewMode | undefined) => view === 'linear' || view === 'hex';

function FilePicker({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button className={className} onClick={() => ref.current?.click()}>
        {children}
      </button>
      <input
        ref={ref}
        type="file"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void (isProjectArchive(f) ? importArchive(f) : uploadAndOpen(f));
          e.target.value = '';
        }}
      />
    </>
  );
}

function Home() {
  const binaries = useStore((s) => s.binaries);
  const [drag, setDrag] = useState(false);
  return (
    <div
      className={`home${drag ? ' drag' : ''}`}
      onDragOver={(e) => (e.preventDefault(), setDrag(true))}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) void (isProjectArchive(f) ? importArchive(f) : uploadAndOpen(f));
      }}
    >
      <div className="home-card">
        <h1>
          <span className="logo">⟩_</span> OpenReverse
        </h1>
        <p className="dim">Reverse engineering in the browser, powered by OpenDecomp. Mach-O ARM64, PE x86-64 and ELF x86-64.</p>
        <div className="dropzone">
          Drop a binary or a project archive here or <FilePicker className="primary">Open file…</FilePicker>
        </div>
        <div className="home-actions">
          <ImportArchiveButton />
        </div>
        {binaries.length > 0 && (
          <>
            <h2>Recent binaries</h2>
            <div className="recent">
              {binaries.map((b) => (
                <div key={b.id} className="recent-item" onClick={() => void openBinary(b.id)}>
                  <span className="recent-name">{b.name}</span>
                  <span className="dim">{fmtSize(b.size)}</span>
                  <UsageCell id={b.id} />
                  <span className="dim">{new Date(b.addedAt).toLocaleString()}</span>
                  <RecentActions b={b} />
                  <button
                    className="close"
                    title="Delete binary and its analysis"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${b.name} and its analysis project?`)) void deleteBinary(b.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <h2>Storage</h2>
        <StoragePanel />
        <h2>Performance</h2>
        <ThreadsPanel />
      </div>
    </div>
  );
}

const THREADS_KEY = 'open-reverse.threads';

/** Saved decompile worker count (0 = automatic). */
export function savedThreads(): number {
  try {
    return Number(localStorage.getItem(THREADS_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** What the engine holds in memory, polled every `ms` (null until known, or when it cannot be read). */
function useEngineMemory(ms: number): EngineMemory | null {
  const [memory, setMemory] = useState<EngineMemory | null>(null);
  useEffect(() => {
    let live = true;
    const poll = () => void api.engineMemory().then((m) => live && setMemory(m), () => undefined);
    poll();
    const t = setInterval(poll, ms);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [ms]);
  return memory;
}

/** Bytes the whole tab uses (every worker included): only in cross-origin isolated pages (Chrome). */
function useTabMemory(ms: number): number | null {
  const [bytes, setBytes] = useState<number | null>(null);
  useEffect(() => {
    const measure = (performance as Performance & { measureUserAgentSpecificMemory?: () => Promise<{ bytes: number }> }).measureUserAgentSpecificMemory;
    if (!window.crossOriginIsolated || !measure) return;
    let live = true;
    const poll = () => void measure.call(performance).then((r) => live && setBytes(r.bytes), () => undefined);
    poll();
    const t = setInterval(poll, ms);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [ms]);
  return bytes;
}

const engineTotal = (m: EngineMemory) => m.sqlite + m.files + (m.js ?? 0);

function memoryTitle(m: EngineMemory, tab: number | null): string {
  return [
    `Engine worker: ${fmtSize(engineTotal(m))}`,
    `  SQLite heap ${fmtSize(m.sqlite)} (project databases; it never shrinks)`,
    `  in-memory files ${fmtSize(m.files)} (binaries, artifacts)`,
    `  JavaScript heap ${m.js === null ? 'not reported by this browser' : fmtSize(m.js)}`,
    tab === null ? 'Decompile workers and the decompiler WASM heaps are not included.' : `Whole tab (all workers): ${fmtSize(tab)}`,
  ].join('\n');
}

function ThreadsPanel() {
  const [choice, setChoice] = useState(savedThreads);
  const [effective, setEffective] = useState<number | null>(null);
  const memory = useEngineMemory(5000);
  const tab = useTabMemory(10000);
  useEffect(() => {
    void api.setThreads(choice).then((r) => setEffective(r.threads), () => undefined);
  }, [choice]);
  const cores = navigator.hardwareConcurrency || 2;
  const deviceGiB = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return (
    <div className="storage-panel">
      <div className="storage-line">
        <span>Decompile workers</span>
        <select
          value={choice}
          onChange={(e) => {
            const n = Number(e.target.value);
            try {
              localStorage.setItem(THREADS_KEY, String(n));
            } catch {
              // preference only
            }
            setChoice(n);
          }}
        >
          <option value={0}>Automatic{effective !== null && choice === 0 ? ` (${effective})` : ''}</option>
          <option value={1}>1 (engine thread only)</option>
          {[2, 3, 4, 6, 8].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="dim">
          {cores} logical cores · {deviceGiB ? `${deviceGiB >= 8 ? '8+' : deviceGiB} GB memory` : 'memory not reported'}
        </span>
      </div>
      {memory && (
        <div className="storage-line engine-memory" title={memoryTitle(memory, tab)}>
          <span>Engine memory</span>
          <span className="dim">
            {fmtSize(engineTotal(memory))} (SQLite {fmtSize(memory.sqlite)}, files {fmtSize(memory.files)}
            {memory.js !== null ? `, JS ${fmtSize(memory.js)}` : ''}){tab !== null ? ` · whole tab ${fmtSize(tab)}` : ''}
          </span>
        </div>
      )}
      <p className="storage-hint dim">
        Decompiles run in parallel Web Workers, so navigation stays responsive while a large function decompiles and exports use every worker.
        Each worker keeps its own copy of the project database and its own decompiler heaps, so a large binary can take a few GB per worker.
        Automatic uses one less than the cores (2 to 4), but only 1 (the engine thread) when the browser reports less than 8 GB of memory, and at most
        2 otherwise (browsers report at most 8 GB, or nothing at all); pick more by hand on a machine with plenty of memory. Applies when a binary is next opened.
      </p>
    </div>
  );
}

function TopBar() {
  const info = useStore((s) => s.info);
  const loc = useStore((s) => s.loc);
  const options = useStore((s) => s.options);
  const showPseudo = useStore((s) => s.showPseudo);
  const canBack = useStore((s) => s.history.length > 0);
  const canFwd = useStore((s) => s.future.length > 0);
  const discovery = useStore((s) => s.discovery);
  const views: [ViewMode, string, string][] = [
    ['linear', 'Linear', 'The whole image in address order: code, data and undefined bytes (Space toggles graph)'],
    ['graph', 'Graph', 'Control-flow graph (Space)'],
    ['hex', 'Hex', 'Hex view (H)'],
    ['types', 'Types', 'Type library editor and recovered structure types'],
  ];
  return (
    <div className="topbar">
      <button className="brand" onClick={closeBinary} title="Close binary">
        <span className="logo">⟩_</span> OpenReverse
      </button>
      {info && (
        <span className="binary-name" title={info.record.sha256}>
          {info.record.name}
          <span className="dim">
            {' '}
            {info.image.target.format.toUpperCase()} · {info.image.target.architecture}
          </span>
        </span>
      )}
      {info && (
      <>
      <div className="nav-buttons">
        <button disabled={!canBack} onClick={back} title="Back (Esc, Alt+←)">←</button>
        <button disabled={!canFwd} onClick={forward} title="Forward (Alt+→)">→</button>
        <button onClick={() => setState({ dialog: { kind: 'goto' } })} title="Go to (G, Ctrl+P)">Go to…</button>
      </div>
      <div className="seg">
        {views.map(([v, label, title]) => (
          <button key={v} className={loc?.view === v ? 'active' : ''} onClick={() => setView(v)} title={title}>
            {label}
          </button>
        ))}
      </div>
      <div className="seg">
        <button className={showPseudo ? 'active' : ''} onClick={togglePseudo} title="Show decompiled code (Tab)">
          Pseudo
        </button>
        <select value={options.language} onChange={(e) => setOptions({ language: e.target.value as 'c-like' | 'python-like' })} title="Output dialect">
          <option value="c-like">C</option>
          <option value="python-like">Python</option>
        </select>
        <select value={options.inference} onChange={(e) => setOptions({ inference: e.target.value as 'proven' | 'likely' })} title="proven: only established facts · likely: heuristic argument closing, marked in the text">
          <option value="proven">proven</option>
          <option value="likely">likely</option>
        </select>
        <select value={options.view} onChange={(e) => setOptions({ view: e.target.value as 'source' | 'checked' })} title="source: readable rewrites · checked: every machine-level fact">
          <option value="source">source</option>
          <option value="checked">checked</option>
        </select>
      </div>
      </>
      )}
      <div className="spacer" />
      {discovery?.state === 'running' && <span className="busy">Discovering functions…</span>}
      <ExportMenu />
      <FilePicker>Open…</FilePicker>
    </div>
  );
}

function StatusBar() {
  const loc = useStore((s) => s.loc);
  const fn = useStore((s) => (s.loc?.fnId ? s.byId.get(s.loc.fnId) : undefined));
  const revision = useStore((s) => s.revision);
  const count = useStore((s) => s.functions.length);
  const open = useStore((s) => !!s.info);
  const threads = useStore((s) => s.info?.threads ?? 1);
  const toast = useStore((s) => s.toast);
  const memory = useEngineMemory(10000);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => tick((n) => n + 1), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  const showToast = toast && Date.now() - toast.at < 4000;
  return (
    <div className="statusbar">
      <span>{loc ? loc.addr : ''}</span>
      {fn && loc && (
        <span className="dim">
          {fn.name}
          {loc.addr !== fn.entry && BigInt(loc.addr) > BigInt(fn.entry) && BigInt(loc.addr) < BigInt(fn.entry) + BigInt(fn.size)
            ? `+0x${(BigInt(loc.addr) - BigInt(fn.entry)).toString(16)}`
            : ''}
        </span>
      )}
      {open && (
        <span className="dim">
          {count} functions · rev {revision}
          {threads > 1 ? ` · ${threads} workers` : ''}
        </span>
      )}
      {open && memory && (
        <span className="dim status-memory" title={memoryTitle(memory, null)}>
          engine {fmtSize(engineTotal(memory))}
        </span>
      )}
      {showToast && <span className={`toast toast-${toast.kind}`}>{toast.text}</span>}
      <span className="spacer" />
      <span className="dim keys">G go · ↑↓ move · Enter follow · Ctrl+F find · N rename · Y type/signature · S create struct · X xrefs · Shift+X xrefs from · ; comment · D A O * U data · Ctrl+Z undo · Alt+M mark · Ctrl+M marks · Space graph · Tab pseudo · H hex · B bytes · Esc back</span>
    </div>
  );
}

function Resizer({ onDrag }: { onDrag: (dx: number) => void }) {
  return (
    <div
      className="resizer"
      onMouseDown={(e) => {
        e.preventDefault();
        let last = e.clientX;
        const move = (ev: MouseEvent) => {
          onDrag(ev.clientX - last);
          last = ev.clientX;
        };
        const up = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      }}
    />
  );
}

function MainView() {
  const loc = useStore((s) => s.loc);
  const listing = useStore((s) => s.listing);
  if (!loc) return <div className="placeholder">Select a function.</div>;
  if (loc.view === 'hex') return <HexView />;
  if (loc.view === 'types') return <TypesView />;
  if (loc.view === 'linear') return <LinearView />;
  if (!loc.fnId) return <div className="placeholder">No function here (Space: linear view).</div>;
  if (listing.status === 'error') return <div className="placeholder error">{listing.error}</div>;
  if (!listing.data) return <div className="placeholder">Disassembling…</div>;
  return <GraphView listing={listing.data} />;
}

function PseudoPane() {
  const decomp = useStore((s) => s.decomp);
  const loc = useStore((s) => s.loc);
  const fnName = useStore((s) => (s.loc?.fnId ? s.byId.get(s.loc.fnId)?.name : undefined));
  if (!loc?.fnId) return <div className="placeholder">No function at this address.</div>;
  const d = decomp.data;
  const warnings = d?.diagnostics.filter((x) => x.severity !== 'info') ?? [];
  return (
    <div className="pane-col">
      <div className="pane-head">
        <span>Pseudo-{d?.language === 'python-like' ? 'Python' : 'C'}</span>
        {fnName && <span className="dim"> · {fnName}</span>}
        {decomp.status === 'loading' && <span className="busy"> decompiling…</span>}
        {d && decomp.status !== 'loading' && (
          <span className="dim">
            {' '}
            · {d.state}
            {d.cache === 'hit' ? ' · cached' : ''}
          </span>
        )}
        {warnings.length > 0 && (
          <span className="warn" title={warnings.map((w) => `${w.severity}: ${w.message}`).join('\n')}>
            {' '}
            ⚠ {warnings.length}
          </span>
        )}
      </div>
      {decomp.status === 'error' && <div className="placeholder error">{decomp.error}</div>}
      {d ? <PseudoView decomp={d} /> : decomp.status === 'loading' && <div className="placeholder">Decompiling…</div>}
    </div>
  );
}

export function App() {
  const bid = useStore((s) => s.bid);
  const openError = useStore((s) => s.openError);
  const info = useStore((s) => s.info);
  const showPseudo = useStore((s) => s.showPseudo);
  const view = useStore((s) => s.loc?.view);
  const [sideW, setSideW] = useState(280);
  const [pseudoW, setPseudoW] = useState(() => Math.round(window.innerWidth * 0.42));
  useKeyboard();
  useEffect(() => {
    const onStorageError = (e: Event) => toast((e as CustomEvent<string>).detail, 'error');
    addEventListener('open-reverse:storage-error', onStorageError);
    return () => removeEventListener('open-reverse:storage-error', onStorageError);
  }, []);

  useEffect(() => {
    void (async () => {
      await api.setThreads(savedThreads()).catch(() => undefined);
      void refreshBinaries();
      const h = parseHash();
      if (h.bid) void openBinary(h.bid, { addr: h.addr, view: h.view });
    })();
  }, []);

  if (!bid)
    return (
      <div className="app">
        <TopBar />
        <Home />
        <TaskDialog />
        <StatusBar />
      </div>
    );

  const splitPseudo = showPseudo && view !== 'hex' && view !== 'types';
  return (
    <div className="app">
      <TopBar />
      {openError ? (
        <div className="placeholder error">Could not open binary: {openError}</div>
      ) : !info ? (
        <div className="placeholder">Opening binary… (first open imports it and builds the indexes)</div>
      ) : (
        <div className="workspace">
          <div style={{ width: sideW }} className="side-wrap">
            <Sidebar />
          </div>
          <Resizer onDrag={(dx) => setSideW((w) => Math.max(160, Math.min(700, w + dx)))} />
          <div className="center">
            <div className="panes">
              <div className="pane-main">
                <MainView />
              </div>
              {splitPseudo && (
                <>
                  <Resizer onDrag={(dx) => setPseudoW((w) => Math.max(240, Math.min(window.innerWidth - 400, w - dx)))} />
                  <div className="pane-pseudo" style={{ width: pseudoW }}>
                    <PseudoPane />
                  </div>
                </>
              )}
            </div>
            <XrefsPanel />
          </div>
        </div>
      )}
      <Dialogs />
      <TaskDialog />
      <HighlightStyle />
      <StatusBar />
    </div>
  );
}
