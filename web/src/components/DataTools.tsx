// Owning your data: project archives (export/import), pseudocode export,
// binary download and storage management. Long tasks run in the engine
// worker and report progress here; the UI stays responsive and can cancel.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { api, type BinaryRecord, type BinaryUsage, type TaskProgress } from '../api.ts';
import { closeBinary, getState, openBinary, refreshBinaries, toast, useStore } from '../store.ts';

const ARCHIVE_EXTENSION = '.orproj.zip';

export function isProjectArchive(file: File): boolean {
  return file.name.toLowerCase().endsWith(ARCHIVE_EXTENSION);
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ['KiB', 'MiB', 'GiB', 'TiB'];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
}

/** Hands bytes to the user as a file download. */
export function saveBytes(name: string, bytes: Uint8Array, type = 'application/octet-stream'): void {
  const url = URL.createObjectURL(new Blob([bytes as Uint8Array<ArrayBuffer>], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

// ---------------------------------------------------------- task + usage store

interface Task {
  title: string;
  progress: TaskProgress | null;
  abort: AbortController;
  startedAt: number;
}

interface DataState {
  task: Task | null;
  usage: Map<string, BinaryUsage>;
  estimate: { usage: number; quota: number } | null;
  persisted: boolean | null;
}

let data: DataState = { task: null, usage: new Map(), estimate: null, persisted: null };
const listeners = new Set<() => void>();
function set(patch: Partial<DataState>): void {
  data = { ...data, ...patch };
  for (const l of listeners) l();
}
function useData<T>(selector: (s: DataState) => T): T {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => selector(data),
  );
}

/** Runs one long task at a time with a progress dialog; null when cancelled or failed. */
async function runTask<T>(title: string, fn: (onProgress: (p: TaskProgress) => void, signal: AbortSignal) => Promise<T>): Promise<T | null> {
  if (data.task) {
    toast(`Wait for "${data.task.title}" to finish`, 'error');
    return null;
  }
  const abort = new AbortController();
  const task: Task = { title, progress: null, abort, startedAt: Date.now() };
  set({ task });
  try {
    return await fn((progress) => data.task?.abort === abort && set({ task: { ...task, progress } }), abort.signal);
  } catch (e) {
    if (isAbort(e)) toast(`${title}: cancelled`);
    else toast(`${title} failed: ${errorText(e)}`, 'error');
    return null;
  } finally {
    set({ task: null });
  }
}

export async function refreshStorage(): Promise<void> {
  try {
    const { binaries } = await api.storage();
    set({ usage: new Map(binaries.map((b) => [b.id, b])) });
  } catch {
    // Accounting is informative only.
  }
  const storage = navigator.storage;
  if (!storage) return;
  try {
    const [estimate, persisted] = await Promise.all([storage.estimate?.(), storage.persisted?.()]);
    set({
      estimate: estimate ? { usage: estimate.usage ?? 0, quota: estimate.quota ?? 0 } : null,
      persisted: persisted ?? null,
    });
  } catch {
    // Not available (e.g. some private modes).
  }
}

// ---------------------------------------------------------------- actions

export async function exportArchive(bid: string, name: string): Promise<void> {
  const result = await runTask(`Exporting ${name}`, (onProgress, signal) => api.exportArchive(bid, onProgress, signal));
  if (!result) return;
  saveBytes(result.name, result.bytes, 'application/zip');
  toast(`Saved ${result.name} (${fmtBytes(result.bytes.byteLength)})`);
}

export async function importArchive(file: File): Promise<void> {
  let replace = false;
  for (;;) {
    const result = await runTask(`Importing ${file.name}`, (onProgress, signal) => api.importArchive(file, { replace }, onProgress, signal));
    if (!result) return;
    if (result.status === 'conflict') {
      const ok = confirm(
        `"${result.existing.name}" (sha256 ${result.existing.sha256.slice(0, 16)}…) is already in your workspace.\n\n` +
          `Replace it with the archive's copy? Its current analysis, renames and comments will be replaced by the archive's.`,
      );
      if (!ok) return toast('Import cancelled: the binary is already in your workspace');
      if (getState().bid === result.existing.id) closeBinary();
      replace = true;
      continue;
    }
    toast(`Imported ${result.record.name}${result.replaced ? ' (replaced)' : ''}`);
    await refreshBinaries();
    void refreshStorage();
    await openBinary(result.record.id);
    return;
  }
}

export async function exportPseudocode(bid: string, name: string): Promise<void> {
  const { language, inference } = getState().options;
  const result = await runTask(`Exporting pseudocode of ${name}`, (onProgress, signal) =>
    api.exportPseudocode(bid, { language, inference }, onProgress, signal),
  );
  if (!result) return;
  saveBytes(result.name, result.bytes, 'application/zip');
  const s = result.summary;
  toast(`Saved ${result.name}: ${s.functions} functions (${s.complete} complete, ${s.partial} partial, ${s.failed} failed)`);
}

export async function downloadBinary(bid: string): Promise<void> {
  try {
    const { name, bytes } = await api.download(bid);
    saveBytes(name, bytes);
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

export async function resetProject(b: BinaryRecord): Promise<void> {
  const ok = confirm(
    `Reset the analysis project of ${b.name}?\n\n` +
      `This deletes its OpenDecomp project: the analysis cache and the renames stored in it (OpenDecomp keeps renames as annotations in the same database, ` +
      `and its cache cannot be dropped separately). The binary and your comments are kept; the next open analyses it again from scratch.\n\n` +
      `Tip: export a project archive first to keep a backup.`,
  );
  if (!ok) return;
  try {
    await api.resetProject(b.id);
    toast(`Reset ${b.name}: the project will be rebuilt on the next open`);
  } catch (e) {
    toast(errorText(e), 'error');
  }
  void refreshStorage();
}

async function requestPersistence(): Promise<void> {
  try {
    const granted = await navigator.storage?.persist?.();
    if (granted) toast('Storage is now persistent: the browser will not evict your projects automatically');
    else
      toast(
        'The browser declined persistent storage. Chromium grants it to sites you use often, bookmark or install; Firefox asks you. Export archives to keep backups.',
        'error',
      );
  } catch (e) {
    toast(errorText(e), 'error');
  }
  void refreshStorage();
}

// ------------------------------------------------------------- components

const PHASES: Record<string, string> = {
  snapshot: 'Taking a consistent snapshot',
  zip: 'Compressing',
  read: 'Reading and validating the archive',
  write: 'Writing the project',
  prepare: 'Collecting functions, symbols and strings',
  decompile: 'Decompiling',
};

/** The progress panel of the running task (non-modal: the app stays usable). */
export function TaskDialog() {
  const task = useData((s) => s.task);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!task) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [task?.startedAt]);
  if (!task) return null;
  const p = task.progress;
  const pct = p && p.total ? Math.min(100, (100 * p.done) / p.total) : null;
  const elapsed = Math.round((Date.now() - task.startedAt) / 1000);
  return (
    <div className="task-panel" role="status" aria-label={task.title}>
      <div>
        <div className="modal-title">{task.title}</div>
        <div className="task-phase">
          {p ? (PHASES[p.phase] ?? p.phase) : 'Starting'}
          {p?.total ? (
            <span className="dim">
              {' '}
              · {p.done} / {p.total}
            </span>
          ) : null}
        </div>
        <div className={`progress${pct === null ? ' indeterminate' : ''}`}>
          <div className="progress-bar" style={pct === null ? undefined : { width: `${pct}%` }} />
        </div>
        <div className="task-detail dim" title={p?.detail}>
          {p?.detail ?? ' '}
        </div>
        <div className="modal-foot">
          <span className="dim">
            {elapsed}s{p?.phase === 'decompile' ? ' · other views wait for the current function' : ''}
          </span>
          <button className="task-cancel" onClick={() => task.abort.abort()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/** Topbar menu for the open binary. */
export function ExportMenu() {
  const info = useStore((s) => s.info);
  const language = useStore((s) => s.options.language);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [open]);
  if (!info) return null;
  const { id, name } = info.record;
  const item = (label: string, title: string, fn: () => void, cls: string) => (
    <button
      className={`menu-item ${cls}`}
      title={title}
      onClick={() => {
        setOpen(false);
        fn();
      }}
    >
      {label}
    </button>
  );
  return (
    <div className="menu" ref={ref}>
      <button className={`export-menu${open ? ' active' : ''}`} onClick={() => setOpen((o) => !o)} title="Export data of this binary">
        Export ▾
      </button>
      {open && (
        <div className="menu-pop">
          {item(
            `All pseudocode (.zip, ${language === 'python-like' ? 'Python' : 'C'})`,
            'One file per function plus types.h and index files, like `open-decomp export`. Uses the current dialect and inference.',
            () => void exportPseudocode(id, name),
            'export-pseudo',
          )}
          {item('Project archive (.orproj.zip)', 'Binary + OpenDecomp project (cache, renames) + comments; import it in any browser', () => void exportArchive(id, name), 'export-archive')}
          {item('Original binary', 'Download the binary as uploaded', () => void downloadBinary(id), 'export-binary')}
        </div>
      )}
    </div>
  );
}

/** Per-binary buttons in the recent list. */
export function RecentActions({ b }: { b: BinaryRecord }) {
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };
  return (
    <span className="recent-actions">
      <button title="Download the original binary" className="act-download" onClick={stop(() => void downloadBinary(b.id))}>
        ⬇
      </button>
      <button title="Export a project archive (binary, analysis, renames, comments)" className="act-export" onClick={stop(() => void exportArchive(b.id, b.name))}>
        Export
      </button>
      <button title="Reset project: delete the analysis cache and renames, keep the binary and comments" className="act-reset" onClick={stop(() => void resetProject(b))}>
        Reset
      </button>
    </span>
  );
}

export function UsageCell({ id }: { id: string }) {
  const u = useData((s) => s.usage.get(id));
  if (!u) return <span className="dim usage">…</span>;
  return (
    <span className="dim usage" title={`binary ${fmtBytes(u.binary)} · project ${fmtBytes(u.project)} · comments/metadata ${fmtBytes(u.meta)}`}>
      {fmtBytes(u.total)} stored
    </span>
  );
}

export function ImportArchiveButton() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button className="import-archive" onClick={() => ref.current?.click()} title="Restore a project archive exported from OpenReverse">
        Import project archive…
      </button>
      <input
        ref={ref}
        type="file"
        className="import-input"
        accept=".zip,application/zip"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importArchive(f);
          e.target.value = '';
        }}
      />
    </>
  );
}

/** Home screen: storage used, quota, persistence. */
export function StoragePanel() {
  const binaries = useStore((s) => s.binaries);
  const estimate = useData((s) => s.estimate);
  const persisted = useData((s) => s.persisted);
  const usage = useData((s) => s.usage);
  useEffect(() => {
    void refreshStorage();
  }, [binaries]);
  const ours = [...usage.values()].reduce((n, u) => n + u.total, 0);
  return (
    <div className="storage-panel">
      <div className="storage-line">
        <span>
          Projects: <b>{fmtBytes(ours)}</b>
          <span className="dim"> uncompressed</span>
          {estimate && (
            <span className="dim" title="navigator.storage.estimate(): what the browser charges this site (it may compress, and lags behind recent writes)">
              {' '}
              · the browser reports {fmtBytes(estimate.usage)} used of a {fmtBytes(estimate.quota)} quota
            </span>
          )}
        </span>
        <span className="spacer" />
        {persisted === true && <span className="persist-ok" title="The browser will not evict this site's data under storage pressure">Persistent storage ✓</span>}
        {persisted === false && (
          <button className="persist-btn" onClick={() => void requestPersistence()}>
            Make storage persistent
          </button>
        )}
      </div>
      {estimate && estimate.quota > 0 && (
        <div className="progress storage-meter" title={`${((100 * estimate.usage) / estimate.quota).toFixed(1)}% of quota`}>
          <div className="progress-bar" style={{ width: `${Math.min(100, (100 * estimate.usage) / estimate.quota)}%` }} />
        </div>
      )}
      <p className="dim storage-hint">
        Everything stays in this browser (IndexedDB); nothing is uploaded.
        {persisted === false && ' Without persistent storage the browser may delete it when the disk runs low.'} Export project archives to back up
        your work or move it to another browser.
      </p>
    </div>
  );
}
