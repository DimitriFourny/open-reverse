// The engine's public methods (what the UI calls through the worker RPC).
// One AnalysisSession per open binary.

import { ArchiveError, archiveFileName, decodeProjectArchive, encodeProjectArchive } from './archive.ts';
import { canon, parseAddress } from './hex.ts';
import { AnalysisSession, ApiError, type AnnotationSnapshot, type DataAction } from './session.ts';
import { vfs } from './vfs.ts';
import type { TaskContext } from './tasks.ts';
import { exportPseudocode, snapshotProject, storageUsage } from './transfer.ts';
import type { DataDef } from './linear.ts';
import { Workspace, type BinaryRecord } from './workspace.ts';

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

  async init(): Promise<void> {
    await this.workspace.init();
  }

  /** Parallel decompile workers for binaries opened from now on (1 = all in the engine thread). */
  threads = Engine.defaultThreads();

  static defaultThreads(): number {
    if (typeof Worker === 'undefined') return 1; // no nested workers (older Safari)
    const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2;
    return Math.max(2, Math.min(4, cores - 1));
  }

  /** Set the number of decompile workers (0 = automatic). Applies when a binary is next opened. */
  setThreads(n: number): { threads: number; applies: 'next-open' } {
    const max = typeof Worker === 'undefined' ? 1 : 8;
    this.threads = n > 0 ? Math.max(1, Math.min(max, Math.floor(n))) : Engine.defaultThreads();
    return { threads: this.threads, applies: 'next-open' };
  }

  #session(id: string): Promise<AnalysisSession> {
    let s = this.#sessions.get(id);
    if (!s) {
      s = (async () => {
        const record = this.workspace.get(id);
        if (!record) throw new ApiError(404, `Unknown binary ${id}`);
        await this.workspace.load(id);
        return AnalysisSession.open(this.workspace, record, this.threads);
      })();
      this.#sessions.set(id, s);
      s.catch(() => this.#sessions.delete(id));
    }
    return s;
  }

  async #closeSession(id: string): Promise<void> {
    const s = this.#sessions.get(id);
    if (!s) return;
    this.#sessions.delete(id);
    await (await s.catch(() => null))?.close();
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

  async close(bid: string): Promise<{ ok: true }> {
    await this.#closeSession(bid);
    await vfs.flush();
    await this.workspace.unload(bid);
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
  async exportArchive(bid: string, ctx: TaskContext): Promise<{ name: string; bytes: Uint8Array }> {
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
    return exportPseudocode(await this.#session(bid), { language, inference }, ctx);
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
    // Names and declared types were annotations in that project; data definitions stay in the listing.
    const data = await this.workspace.data(bid);
    await this.workspace.setData(bid, { defs: Object.fromEntries(Object.entries(data.defs).map(([k, d]) => [k, { type: d.type, count: d.count }])), names: {} });
    await this.workspace.unload(bid);
    return { ok: true };
  }

  // ----------------------------------------------------------- analysis

  async info(bid: string) {
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
