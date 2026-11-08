// The engine's public methods (what the UI calls through the worker RPC).
// One AnalysisSession per open binary.

import { ArchiveError, archiveFileName, decodeProjectArchive, encodeProjectArchive } from './archive.ts';
import { canon, parseAddress } from './hex.ts';
import { AnalysisSession, ApiError, type AnnotationSnapshot, type DataAction } from './session.ts';
import { vfs } from './vfs.ts';
import type { SearchQuery } from './search.ts';
import type { TaskContext } from './tasks.ts';
import { exportPseudocode, snapshotProject, storageUsage } from './transfer.ts';
import { autoThreads, deviceMemory, jsHeapUsed, type EngineMemory } from './memory.ts';
import { sqliteHeapBytes } from './shims/sqlite.ts';
import type { DataDef } from './linear.ts';
import { Workspace, type BinaryRecord } from './workspace.ts';
import { alignLines, DIFFSIG_VERSION, diffRows, matchFunctions, type DiffResult, type DiffSide, type FunctionSig } from './bindiff.ts';

type Target = { id?: string; addr?: string };
type DecompileOptions = { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' };

function addr(value: string | undefined, name = 'addr'): string {
  const parsed = value === undefined ? null : parseAddress(value);
  if (parsed === null) throw new ApiError(400, `Invalid or missing ${name}`);
  return canon(parsed);
}

export class Engine {
  readonly workspace = new Workspace();
  readonly #sessions = new Map<string, Promise<AnalysisSession>>();
  /** Closes in progress: opening the binary again waits for its close (one owner per project). */
  readonly #closing = new Map<string, Promise<void>>();
  /** Exports running per binary: closing the binary waits for them. */
  readonly #tasks = new Map<string, Set<Promise<unknown>>>();
  /** `info` calls per binary (the UI opening it): a close that waited skips a binary opened again. */
  readonly #opens = new Map<string, number>();

  async init(): Promise<void> {
    await this.workspace.init();
  }

  /** Parallel decompile workers for binaries opened from now on (1 = all in the engine thread). */
  threads = Engine.defaultThreads();

  static defaultThreads(): number {
    if (typeof Worker === 'undefined') return 1; // no nested workers (older Safari)
    const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2;
    return autoThreads(cores, deviceMemory());
  }

  /** What the engine worker holds in memory (the helper workers are not included). */
  engineMemory(): EngineMemory {
    return { sqlite: sqliteHeapBytes(), files: vfs.memoryBytes(), js: jsHeapUsed() };
  }

  /** Set the number of decompile workers (0 = automatic). Applies when a binary is next opened. */
  setThreads(n: number): { threads: number; applies: 'next-open' } {
    const max = typeof Worker === 'undefined' ? 1 : 8;
    this.threads = n > 0 ? Math.max(1, Math.min(max, Math.floor(n))) : Engine.defaultThreads();
    return { threads: this.threads, applies: 'next-open' };
  }

  #session(id: string, threads = this.threads): Promise<AnalysisSession> {
    let s = this.#sessions.get(id);
    if (!s) {
      const closing = this.#closing.get(id);
      s = (async () => {
        await closing;
        const record = this.workspace.get(id);
        if (!record) throw new ApiError(404, `Unknown binary ${id}`);
        await this.workspace.load(id);
        return AnalysisSession.open(this.workspace, record, threads);
      })();
      this.#sessions.set(id, s);
      s.catch(() => this.#sessions.delete(id));
    }
    return s;
  }

  async #closeSession(id: string, unload = false): Promise<void> {
    await this.#closing.get(id);
    const s = this.#sessions.get(id);
    if (!s && !unload) return;
    this.#sessions.delete(id);
    const done = (async () => {
      await (await s?.catch(() => null))?.close();
      if (!unload) return;
      await vfs.flush();
      await this.workspace.unload(id);
    })();
    this.#closing.set(id, done);
    try {
      await done;
    } finally {
      if (this.#closing.get(id) === done) this.#closing.delete(id);
    }
  }

  /** Runs a long task on a binary (an export); closing the binary waits for it. */
  async #task<T>(bid: string, fn: () => Promise<T>): Promise<T> {
    const p = fn();
    let set = this.#tasks.get(bid);
    if (!set) this.#tasks.set(bid, (set = new Set()));
    set.add(p);
    try {
      return await p;
    } finally {
      set.delete(p);
      if (!set.size) this.#tasks.delete(bid);
    }
  }

  // ------------------------------------------------------------ binaries

  binaries(): { binaries: BinaryRecord[]; open: string[] } {
    return { binaries: this.workspace.list(), open: [...this.#sessions.keys()] };
  }

  async upload(name: string, bytes: Uint8Array): Promise<BinaryRecord> {
    if (bytes.byteLength === 0) throw new ApiError(400, 'The file is empty');
    return this.workspace.add(name, bytes);
  }

  async remove(bid: string): Promise<{ ok: true }> {
    await this.#closeSession(bid);
    await this.workspace.remove(bid);
    return { ok: true };
  }

  /**
   * The UI left the binary: stop its OpenDecomp project (owner and request workers) and drop
   * its files from memory. An export still running on it finishes first, and a binary opened
   * again meanwhile stays open.
   */
  async close(bid: string): Promise<{ ok: true }> {
    const tasks = this.#tasks.get(bid);
    if (tasks) {
      const opens = this.#opens.get(bid);
      await Promise.allSettled([...tasks]);
      if (this.#opens.get(bid) !== opens || this.#tasks.has(bid)) return { ok: true };
    }
    await this.#closeSession(bid, true);
    return { ok: true };
  }

  /** The raw bytes of a stored binary (download). */
  async download(bid: string): Promise<{ name: string; bytes: Uint8Array }> {
    const record = this.workspace.get(bid);
    if (!record) throw new ApiError(404, `Unknown binary ${bid}`);
    await this.workspace.load(bid);
    return { name: record.name, bytes: vfs.read(this.workspace.binaryPath(record)).slice() };
  }

  async flush(): Promise<void> {
    await vfs.flush();
  }

  // ------------------------------------------- data in / out, storage

  /** A project archive (see archive.ts). Works whether or not the binary is open. */
  exportArchive(bid: string, ctx: TaskContext): Promise<{ name: string; bytes: Uint8Array }> {
    return this.#task(bid, () => this.#exportArchive(bid, ctx));
  }

  async #exportArchive(bid: string, ctx: TaskContext): Promise<{ name: string; bytes: Uint8Array }> {
    const record = this.workspace.get(bid);
    if (!record) throw new ApiError(404, `Unknown binary ${bid}`);
    const wasLoaded = vfs.isMounted(this.workspace.dir(bid));
    await this.workspace.load(bid);
    const snapshot = await snapshotProject(this.workspace, record, ctx);
    if (!wasLoaded && !this.#sessions.has(bid)) await this.workspace.unload(bid);
    const bytes = await encodeProjectArchive(snapshot, {
      signal: ctx.signal,
      onEntry: (done, total) => ctx.progress({ phase: 'zip', done, total }),
    });
    return { name: archiveFileName(record), bytes };
  }

  /** Restore a project archive. An existing binary with the same sha256 is a conflict unless `replace`. */
  async importArchive(
    bytes: Uint8Array,
    opts: { replace?: boolean },
    ctx: TaskContext,
  ): Promise<{ status: 'imported'; record: BinaryRecord; replaced: boolean } | { status: 'conflict'; record: BinaryRecord; existing: BinaryRecord }> {
    ctx.progress({ phase: 'read', done: 0, total: null });
    let archive;
    try {
      archive = await decodeProjectArchive(bytes, undefined, ctx.signal);
    } catch (e) {
      if (e instanceof ArchiveError) throw new ApiError(400, e.message);
      throw e;
    }
    const record: BinaryRecord = { ...archive.record, addedAt: new Date().toISOString() };
    const existing = this.workspace.get(record.id);
    if (existing && !opts?.replace) return { status: 'conflict', record, existing };
    ctx.signal.throwIfAborted();
    ctx.progress({ phase: 'write', done: 0, total: null });
    if (existing) await this.remove(record.id);
    await this.workspace.restore(record, archive.binary, archive.comments, archive.project, archive.bookmarks, archive.data);
    await this.workspace.unload(record.id);
    return { status: 'imported', record, replaced: !!existing };
  }

  /** Every function's pseudocode as a zip (OpenDecomp `export` layout). */
  async exportPseudocode(bid: string, options: { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely' }, ctx: TaskContext) {
    const language = options?.language === 'python-like' ? 'python-like' : 'c-like';
    const inference = options?.inference === 'likely' ? 'likely' : 'proven';
    return this.#task(bid, async () => exportPseudocode(await this.#session(bid), { language, inference }, ctx));
  }

  async storage() {
    return { binaries: await storageUsage(this.workspace) };
  }

  /**
   * Delete a binary's OpenDecomp project directory: the analysis cache and the
   * annotations stored in it (renames). The binary, comments and bookmarks stay; the
   * next open re-imports the binary into a fresh project.
   */
  async resetProject(bid: string): Promise<{ ok: true }> {
    if (!this.workspace.get(bid)) throw new ApiError(404, `Unknown binary ${bid}`);
    await this.#closeSession(bid);
    await vfs.flush();
    await vfs.removeTree(this.workspace.projectRoot(bid));
    for (const sig of await this.workspace.diffSigs(bid)) await vfs.removeTree(sig.path);
    // Names and declared types were annotations in that project; data definitions stay in the listing.
    const data = await this.workspace.data(bid);
    await this.workspace.setData(bid, { defs: Object.fromEntries(Object.entries(data.defs).map(([k, d]) => [k, { type: d.type, count: d.count }])), names: {} });
    await this.workspace.unload(bid);
    return { ok: true };
  }

  // ----------------------------------------------------------- analysis

  async info(bid: string) {
    this.#opens.set(bid, (this.#opens.get(bid) ?? 0) + 1);
    return (await this.#session(bid)).info();
  }

  async functions(bid: string) {
    const s = await this.#session(bid);
    const index = await s.functions();
    return { revision: index.revision, indexState: index.indexState, discovery: s.discovery, functions: index.list };
  }

  async functionAt(bid: string, a: string) {
    return { function: await (await this.#session(bid)).functionAt(addr(a)) };
  }

  async listing(bid: string, fid: string) {
    return (await this.#session(bid)).listing(fid);
  }

  /** Rows of the whole-image listing around an address. */
  async linear(bid: string, a: string, before: number, after: number, quick?: boolean) {
    return (await this.#session(bid)).linear(addr(a), Number(before) || 0, Number(after) || 0, quick === true);
  }

  async dataAt(bid: string, a: string) {
    return (await this.#session(bid)).dataAt(addr(a));
  }

  async defineData(bid: string, a: string, action: DataAction, count?: number) {
    if (!['cycle', 'string', 'ptr', 'array', 'undefine'].includes(action)) throw new ApiError(400, `Unknown data action ${action}`);
    const result = await (await this.#session(bid)).defineData(addr(a), action, Number(count) || 0);
    void vfs.flush();
    return result;
  }

  /** Undo/redo of data definitions: those overlapping [start, end) become exactly `defs`. */
  async restoreData(bid: string, start: string, end: string, defs: Record<string, DataDef>) {
    if (!defs || typeof defs !== 'object') throw new ApiError(400, 'Missing definitions');
    const result = await (await this.#session(bid)).restoreData(addr(start, 'start'), addr(end, 'end'), defs);
    void vfs.flush();
    return result;
  }

  async decompile(bid: string, fid: string, options: DecompileOptions, signal?: AbortSignal) {
    const s = await this.#session(bid);
    // OpenDecomp cancels a running job by restarting the project owner. With helper
    // workers the owner is not blocked, so a decompile the UI navigated away from just
    // finishes in the background (and fills the cache) instead.
    return s.decompile(fid, options, s.threads > 1 ? undefined : signal);
  }

  async calls(bid: string, fid: string) {
    return (await this.#session(bid)).calls(fid);
  }

  async xrefs(bid: string, target: Target, direction: 'incoming' | 'outgoing' | 'both' = 'incoming') {
    const s = await this.#session(bid);
    return { xrefs: await s.xrefs(target.id ? { id: target.id } : { addr: addr(target.addr) }, direction) };
  }

  async strings(bid: string) {
    return { strings: await (await this.#session(bid)).strings() };
  }

  async symbols(bid: string) {
    return { symbols: await (await this.#session(bid)).symbols() };
  }

  async sections(bid: string) {
    return { sections: await (await this.#session(bid)).sections() };
  }

  async headers(bid: string) {
    return { headers: await (await this.#session(bid)).headers() };
  }

  async types(bid: string) {
    return (await this.#session(bid)).types();
  }

  async memory(bid: string, a: string, length: number) {
    return (await this.#session(bid)).memory(addr(a), Number(length) || 4096);
  }

  /** Search the image's bytes (pattern, text) or every function's operands (immediate). Hits stream as progress items. */
  async search(bid: string, query: SearchQuery, ctx: TaskContext) {
    if (!query || typeof query.text !== 'string' || !['bytes', 'text', 'immediate'].includes(query.mode)) throw new ApiError(400, 'Invalid search');
    return (await this.#session(bid)).search(query, ctx);
  }

  /** The navigation strip's map of the image. */
  async navMap(bid: string) {
    return (await this.#session(bid)).navMap();
  }

  // ---------------------------------------------------------- binary diff

  /** The signature tables of the last diff, by binary id. */
  readonly #sigTables = new Map<string, { revision: number; sigs: FunctionSig[] }>();

  /**
   * Diff the functions of two stored binaries: each one's signature table (from the cache, or
   * built from every function's listing), then the matching (bindiff.ts).
   */
  async diff(bidA: string, bidB: string, ctx: TaskContext): Promise<DiffResult> {
    if (bidA === bidB) throw new ApiError(400, 'Pick two different binaries');
    // Closing either binary meanwhile waits for its side (as for an export).
    const a = await this.#task(bidA, () => this.#diffSide(bidA, ctx, 'A'));
    const b = await this.#task(bidB, () => this.#diffSide(bidB, ctx, 'B'));
    for (const id of this.#sigTables.keys()) if (id !== bidA && id !== bidB) this.#sigTables.delete(id);
    ctx.progress({ phase: 'match', done: 0, total: null });
    const started = Date.now();
    const result = matchFunctions(a.sigs, b.sigs);
    return { a: a.side, b: b.side, ...diffRows(a.sigs, b.sigs, result), matchMs: Date.now() - started };
  }

  /** Two functions of the last diff side by side (either may be null: a function only one binary has). */
  async diffFunction(bidA: string, fidA: string | null, bidB: string, fidB: string | null) {
    const lines = (bid: string, fid: string | null) => {
      if (fid === null) return [];
      const table = this.#sigTables.get(bid);
      if (!table) throw new ApiError(409, 'The diff is gone (the engine restarted): run it again');
      const sig = table.sigs.find((f) => f.id === fid);
      if (!sig) throw new ApiError(404, `Unknown function ${fid}`);
      return sig.lines;
    };
    const a = lines(bidA, fidA);
    const b = lines(bidB, fidB);
    return { a, b, rows: alignLines(a, b) };
  }

  /**
   * One binary's signature table. A binary that is not open is opened only when no table
   * is stored, with one worker, and closed again after: two projects are never kept open
   * for a diff. A stored table is valid for its revision: the session drops the others.
   */
  async #diffSide(bid: string, ctx: TaskContext, label: string): Promise<{ sigs: FunctionSig[]; side: DiffSide }> {
    const record = this.workspace.get(bid);
    if (!record) throw new ApiError(404, `Unknown binary ${bid}`);
    const started = Date.now();
    const side = (sigs: FunctionSig[], cached: boolean) => ({
      sigs,
      side: { bid, name: record.name, functions: sigs.length, cached, ms: Date.now() - started },
    });
    const wasOpen = this.#sessions.has(bid);
    if (!wasOpen) {
      ctx.progress({ phase: `load ${label}`, done: 0, total: null, detail: record.name });
      const stored = (await this.workspace.diffSigs(bid)).find((t) => t.version === DIFFSIG_VERSION);
      const sigs = stored && (await this.#readSigs(bid, stored.path, stored.revision, false));
      if (sigs) return side(sigs, true);
    }
    ctx.progress({ phase: `open ${label}`, done: 0, total: null, detail: record.name });
    const s = await this.#session(bid, wasOpen ? this.threads : 1);
    try {
      // Whole-image discovery first: the signatures are of the complete function list.
      while (s.discovery.state === 'running' || s.discovery.state === 'idle') {
        ctx.signal.throwIfAborted();
        ctx.progress({ phase: `discover ${label}`, done: (await s.functions()).list.length, total: null, detail: record.name });
        await new Promise((r) => setTimeout(r, 500));
      }
      const revision = s.binary.revision;
      const path = this.workspace.diffSigPath(bid, DIFFSIG_VERSION, revision);
      const cached = await this.#readSigs(bid, path, revision, true);
      if (cached) return side(cached, true);
      const sigs = await s.diffSignatures(ctx, `signatures ${label}`);
      if (s.binary.revision === revision) {
        vfs.write(path, new TextEncoder().encode(JSON.stringify(sigs)));
        this.#sigTables.set(bid, { revision, sigs });
      }
      return side(sigs, false);
    } finally {
      if (!wasOpen) await this.#closeSession(bid, true);
    }
  }

  /** A stored signature table (null when absent or unreadable); `loaded`: the binary's files are in memory. */
  async #readSigs(bid: string, path: string, revision: number, loaded: boolean): Promise<FunctionSig[] | null> {
    const held = this.#sigTables.get(bid);
    if (held?.revision === revision) return held.sigs;
    loaded ||= vfs.isMounted(path);
    if (!loaded) await vfs.mount(path);
    try {
      if (!vfs.get(path)) return null;
      const sigs = JSON.parse(new TextDecoder().decode(vfs.read(path))) as FunctionSig[];
      this.#sigTables.set(bid, { revision, sigs });
      return sigs;
    } catch {
      return null;
    } finally {
      if (!loaded) await vfs.unmount(path);
    }
  }

  async comments(bid: string) {
    return { comments: await (await this.#session(bid)).comments() };
  }

  async rename(bid: string, target: Target, name: string) {
    if (typeof name !== 'string') throw new ApiError(400, 'Missing name');
    const s = await this.#session(bid);
    const result = target.id ? { ...(await s.rename({ id: target.id }, name)), note: null } : await s.renameGlobal(addr(target.addr), name);
    void vfs.flush();
    return result;
  }

  // ------------------------------------------------- types and signatures

  async declareTypes(bid: string, source: string) {
    if (typeof source !== 'string') throw new ApiError(400, 'Missing source');
    const result = await (await this.#session(bid)).declareTypes(source);
    void vfs.flush();
    return result;
  }

  async removeLibraryTypes(bid: string, annotationIds: string[]) {
    if (!Array.isArray(annotationIds)) throw new ApiError(400, 'Missing annotation ids');
    const result = await (await this.#session(bid)).removeLibraryTypes(annotationIds.map(String));
    void vfs.flush();
    return result;
  }

  /** This app's annotations on a function, for undo. */
  async annotationSnapshot(bid: string, fid: string) {
    return { snapshot: await (await this.#session(bid)).annotationSnapshot(fid) };
  }

  async restoreAnnotations(bid: string, fid: string, snapshot: AnnotationSnapshot) {
    if (!Array.isArray(snapshot)) throw new ApiError(400, 'Missing snapshot');
    const result = await (await this.#session(bid)).restoreAnnotations(fid, snapshot);
    void vfs.flush();
    return result;
  }

  async prototype(bid: string, fid: string) {
    return (await this.#session(bid)).prototype(fid);
  }

  async setSignature(bid: string, fid: string, text: string) {
    if (typeof text !== 'string') throw new ApiError(400, 'Missing prototype');
    const result = await (await this.#session(bid)).setSignature(fid, text);
    void vfs.flush();
    return result;
  }

  async renameVariable(bid: string, fid: string, valueId: string, name: string, options: DecompileOptions) {
    if (typeof name !== 'string') throw new ApiError(400, 'Missing name');
    const result = await (await this.#session(bid)).renameVariable(fid, String(valueId), name, options);
    void vfs.flush();
    return result;
  }

  async setVariableType(bid: string, fid: string, valueId: string, text: string, options: DecompileOptions) {
    if (typeof text !== 'string') throw new ApiError(400, 'Missing type');
    const result = await (await this.#session(bid)).setVariableType(fid, String(valueId), text, options);
    void vfs.flush();
    return result;
  }

  async setGlobalType(bid: string, a: string, text: string) {
    if (typeof text !== 'string') throw new ApiError(400, 'Missing type');
    const result = await (await this.#session(bid)).setGlobalType(addr(a), text);
    void vfs.flush();
    return result;
  }

  async structFromVariable(bid: string, fid: string, variable: string, name: string, options: DecompileOptions) {
    return (await this.#session(bid)).structFromVariable(fid, String(variable), String(name), options);
  }

  async layoutStructure(bid: string, source: string, name: string, library: string[]) {
    if (typeof source !== 'string' || !Array.isArray(library)) throw new ApiError(400, 'Missing source');
    return (await this.#session(bid)).layoutStructure(source, String(name), library.map(String));
  }

  async comment(bid: string, a: string, text: string) {
    const comments = await (await this.#session(bid)).comment(addr(a), String(text ?? ''));
    void vfs.flush();
    return { comments };
  }

  async bookmarks(bid: string) {
    return { bookmarks: await (await this.#session(bid)).bookmarks() };
  }

  /** Bookmark an address (description may be empty); null removes it. */
  async bookmark(bid: string, a: string, description: string | null) {
    const bookmarks = await (await this.#session(bid)).bookmark(addr(a), description === null ? null : String(description));
    void vfs.flush();
    return { bookmarks };
  }
}
