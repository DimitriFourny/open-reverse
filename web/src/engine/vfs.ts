// In-memory POSIX-like filesystem for OpenDecomp running in a Web Worker,
// persisted to IndexedDB.
//
// Sync `node:fs` calls need their data in memory, so subtrees are loaded from
// IndexedDB up front (`mount`) and written back in batches (`flush`). Files
// that back an open SQLite database are "live": their bytes are produced by
// the database on demand (see shims/sqlite.ts).

import { posix } from './shims/path.ts';

export interface VNode {
  kind: 'file' | 'dir';
  data: Uint8Array;
  mtimeMs: number;
  mode: number;
  ino: number;
}

/** A file whose current bytes live elsewhere (an open in-memory SQLite database). */
export interface LiveSource {
  bytes(): Uint8Array;
  size(): number;
  /** True when the database changed since its bytes were last taken. */
  changed(): boolean;
  renamed(to: string): void;
  unlinked(): void;
  /** True while a transaction is open: its bytes would not be a consistent snapshot. */
  busy?(): boolean;
  /** The current bytes, without marking them as persisted (exports). */
  peek?(): Uint8Array;
}

export class FsError extends Error {
  readonly code: string;
  readonly errno: number;
  readonly syscall: string;
  readonly path: string;
  constructor(code: string, syscall: string, path: string) {
    super(`${code}: ${syscall} '${path}'`);
    this.code = code;
    this.syscall = syscall;
    this.path = path;
    this.errno = { ENOENT: -2, EEXIST: -17, ENOTDIR: -20, EISDIR: -21, ENOTEMPTY: -39, EBADF: -9, EINVAL: -22 }[code] ?? -1;
  }
}

const EMPTY = new Uint8Array(0);
/** Scratch space (e.g. pseudocode exports): kept in memory only, never persisted. */
const VOLATILE = '/tmp';
const isVolatile = (p: string) => p === VOLATILE || p.startsWith(`${VOLATILE}/`);
const DB_NAME = 'open-reverse-fs';
const STORE = 'files';

interface StoredFile {
  path: string;
  kind: 'file' | 'dir';
  data?: Uint8Array;
  mtimeMs: number;
  mode: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'path' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export class VFS {
  readonly nodes = new Map<string, VNode>();
  readonly live = new Map<string, LiveSource>();
  #dirty = new Set<string>();
  #deleted = new Set<string>();
  #ino = 1;
  #db: Promise<IDBDatabase> | null = null;
  #persist: boolean;
  #flushTimer: ReturnType<typeof setTimeout> | null = null;
  #flushing: Promise<void> | null = null;
  /** Subtrees whose files are in memory; everything else is only known to IndexedDB. */
  #mounted = new Set<string>();

  constructor(persist = typeof indexedDB !== 'undefined') {
    this.#persist = persist;
    this.nodes.set('/', this.#node('dir'));
  }

  #node(kind: "file" | "dir", data: Uint8Array = EMPTY, mode = kind === "dir" ? 0o755 : 0o644): VNode {
    return { kind, data, mtimeMs: Date.now(), mode, ino: this.#ino++ };
  }

  norm(path: string | URL): string {
    let p = typeof path === 'string' ? path : path.pathname;
    if (p.startsWith('file:')) p = decodeURIComponent(new URL(p).pathname);
    return posix.resolve('/', p);
  }

  // ------------------------------------------------------------ persistence

  #idb(): Promise<IDBDatabase> {
    this.#db ??= openDb();
    return this.#db;
  }

  /** Load a subtree from IndexedDB into memory (idempotent). */
  async mount(prefix: string): Promise<void> {
    const root = this.norm(prefix);
    if ([...this.#mounted].some((m) => root === m || root.startsWith(`${m}/`))) return;
    if (!this.#persist) {
      this.#mounted.add(root);
      return;
    }
    const db = await this.#idb();
    const tx = db.transaction(STORE, 'readonly');
    const range = IDBKeyRange.bound(root, `${root}/￿`);
    const rows = await new Promise<StoredFile[]>((resolve, reject) => {
      const req = tx.objectStore(STORE).getAll(range);
      req.onsuccess = () => resolve(req.result as StoredFile[]);
      req.onerror = () => reject(req.error);
    });
    for (const row of rows.sort((a, b) => a.path.length - b.path.length)) {
      if (this.#dirty.has(row.path) || this.#deleted.has(row.path) || this.nodes.has(row.path)) continue;
      this.#ensureParents(row.path, false);
      this.nodes.set(row.path, { kind: row.kind, data: row.data ?? EMPTY, mtimeMs: row.mtimeMs, mode: row.mode, ino: this.#ino++ });
    }
    this.#mounted.add(root);
  }

  /** Paths of the direct children of a directory as stored in IndexedDB plus memory. */
  async listStored(dir: string): Promise<string[]> {
    const root = this.norm(dir);
    const out = new Set<string>();
    if (this.#persist) {
      const db = await this.#idb();
      const tx = db.transaction(STORE, 'readonly');
      const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
        const req = tx.objectStore(STORE).getAllKeys(IDBKeyRange.bound(`${root}/`, `${root}/￿`));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      for (const k of keys) {
        const rest = String(k).slice(root.length + 1);
        if (rest && !rest.includes('/')) out.add(rest);
      }
    }
    for (const p of this.nodes.keys()) {
      if (p.startsWith(`${root}/`)) {
        const rest = p.slice(root.length + 1);
        if (rest && !rest.includes('/')) out.add(rest);
      }
    }
    for (const p of this.#deleted) if (p.startsWith(`${root}/`)) out.delete(p.slice(root.length + 1));
    return [...out];
  }

  isMounted(prefix: string): boolean {
    const root = this.norm(prefix);
    return [...this.#mounted].some((m) => root === m || root.startsWith(`${m}/`));
  }

  /**
   * Sizes of the files under a directory, by path: the in-memory size for
   * loaded files (live databases included), else the size stored in IndexedDB.
   */
  async usage(prefix: string): Promise<Map<string, number>> {
    const root = this.norm(prefix);
    const out = new Map<string, number>();
    const inside = (p: string) => p.startsWith(`${root}/`);
    if (this.#persist && !this.isMounted(root)) {
      const db = await this.#idb();
      const tx = db.transaction(STORE, 'readonly');
      await new Promise<void>((resolve, reject) => {
        const req = tx.objectStore(STORE).openCursor(IDBKeyRange.bound(`${root}/`, `${root}/\uffff`));
        req.onsuccess = () => {
          const cursor = req.result;
          if (!cursor) return resolve();
          const row = cursor.value as StoredFile;
          if (row.kind === 'file') out.set(row.path, row.data?.byteLength ?? 0);
          cursor.continue();
        };
        req.onerror = () => reject(req.error);
      });
    }
    for (const [p, n] of this.nodes) if (inside(p) && n.kind === 'file') out.set(p, this.size(p));
    for (const p of this.#deleted) if (inside(p) && !this.nodes.has(p)) out.delete(p);
    return out;
  }

  /** True while a live database under `prefix` has an open transaction. */
  liveBusy(prefix: string): boolean {
    const root = this.norm(prefix);
    for (const [p, src] of this.live) if ((p === root || p.startsWith(`${root}/`)) && src.busy?.()) return true;
    return false;
  }

  /** Drop an unmounted subtree from memory (after flushing it). */
  async unmount(prefix: string): Promise<void> {
    const root = this.norm(prefix);
    await this.flush();
    for (const p of [...this.nodes.keys()]) if ((p === root || p.startsWith(`${root}/`)) && !this.live.has(p)) this.nodes.delete(p);
    this.#mounted.delete(root);
  }

  #touch(path: string): void {
    if (isVolatile(path)) return;
    this.#dirty.add(path);
    this.#deleted.delete(path);
    this.#schedule();
  }

  #schedule(): void {
    if (!this.#persist || this.#flushTimer) return;
    this.#flushTimer = setTimeout(() => {
      this.#flushTimer = null;
      void this.flush();
    }, 3000);
  }

  /** Write dirty files (and the current bytes of live databases) to IndexedDB. */
  async flush(): Promise<void> {
    if (!this.#persist) return;
    if (this.#flushing) await this.#flushing;
    for (const [path, src] of this.live) if (src.changed()) this.#dirty.add(path);
    if (this.#dirty.size === 0 && this.#deleted.size === 0) return;
    const dirty = [...this.#dirty];
    const deleted = [...this.#deleted];
    this.#dirty.clear();
    this.#deleted.clear();
    const rows: StoredFile[] = [];
    for (const path of dirty) {
      const n = this.nodes.get(path);
      if (!n) continue;
      const live = this.live.get(path);
      rows.push({ path, kind: n.kind, mtimeMs: n.mtimeMs, mode: n.mode, ...(n.kind === 'file' ? { data: live ? live.bytes() : n.data } : {}) });
    }
    this.#flushing = (async () => {
      const db = await this.#idb();
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      for (const p of deleted) store.delete(p);
      for (const r of rows) store.put(r);
      await done(tx);
    })();
    try {
      await this.#flushing;
    } catch (error) {
      for (const p of dirty) this.#dirty.add(p);
      for (const p of deleted) this.#deleted.add(p);
      throw error;
    } finally {
      this.#flushing = null;
    }
  }

  /** Remove a subtree from memory and IndexedDB. */
  async removeTree(prefix: string): Promise<void> {
    const root = this.norm(prefix);
    for (const p of [...this.nodes.keys()]) if (p === root || p.startsWith(`${root}/`)) {
      this.live.get(p)?.unlinked();
      this.live.delete(p);
      this.nodes.delete(p);
      this.#dirty.delete(p);
    }
    if (!this.#persist) return;
    const db = await this.#idb();
    const tx = db.transaction(STORE, 'readwrite');
    // Exactly the subtree: a sibling such as `${root}.x` sorts inside [root, root/￿].
    tx.objectStore(STORE).delete(root);
    tx.objectStore(STORE).delete(IDBKeyRange.bound(`${root}/`, `${root}/￿`));
    await done(tx);
  }

  // --------------------------------------------------------------- queries

  #ensureParents(path: string, track: boolean): void {
    const parts = path.split('/').filter(Boolean);
    let cur = '';
    for (let i = 0; i < parts.length - 1; i++) {
      cur += `/${parts[i]}`;
      if (!this.nodes.has(cur)) {
        this.nodes.set(cur, this.#node('dir'));
        if (track) this.#touch(cur);
      }
    }
  }

  get(path: string): VNode | undefined {
    return this.nodes.get(this.norm(path));
  }

  stat(path: string, syscall = 'stat'): VNode {
    const n = this.get(path);
    if (!n) throw new FsError('ENOENT', syscall, String(path));
    return n;
  }

  size(path: string): number {
    const p = this.norm(path);
    const live = this.live.get(p);
    return live ? live.size() : (this.nodes.get(p)?.data.length ?? 0);
  }

  read(path: string): Uint8Array {
    const p = this.norm(path);
    const n = this.nodes.get(p);
    if (!n) throw new FsError('ENOENT', 'open', p);
    if (n.kind === 'dir') throw new FsError('EISDIR', 'read', p);
    const live = this.live.get(p);
    return live ? live.bytes() : n.data;
  }

  /** A copy of a file's current bytes that does not affect persistence (live databases included). */
  snapshot(path: string): Uint8Array {
    const p = this.norm(path);
    const live = this.live.get(p);
    if (live?.peek) return live.peek();
    if (live) {
      // A source without peek: take its bytes and persist them on the next flush.
      const bytes = live.bytes();
      this.#touch(p);
      return bytes;
    }
    return this.read(p).slice();
  }

  readdir(path: string): string[] {
    const p = this.norm(path);
    const n = this.stat(p, 'scandir');
    if (n.kind !== 'dir') throw new FsError('ENOTDIR', 'scandir', p);
    const prefix = p === '/' ? '/' : `${p}/`;
    const out: string[] = [];
    for (const k of this.nodes.keys()) if (k !== p && k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) out.push(k.slice(prefix.length));
    return out.sort();
  }

  // ------------------------------------------------------------- mutations

  write(path: string, data: Uint8Array, opts: { exclusive?: boolean; mode?: number } = {}): void {
    const p = this.norm(path);
    const parent = this.nodes.get(posix.dirname(p));
    if (!parent) throw new FsError('ENOENT', 'open', p);
    if (parent.kind !== 'dir') throw new FsError('ENOTDIR', 'open', p);
    const existing = this.nodes.get(p);
    if (existing && opts.exclusive) throw new FsError('EEXIST', 'open', p);
    if (existing?.kind === 'dir') throw new FsError('EISDIR', 'open', p);
    if (existing) {
      existing.data = data;
      existing.mtimeMs = Date.now();
    } else this.nodes.set(p, this.#node('file', data, opts.mode));
    this.#touch(p);
  }

  mkdir(path: string, recursive = false): string | undefined {
    const p = this.norm(path);
    const existing = this.nodes.get(p);
    if (existing) {
      if (recursive && existing.kind === 'dir') return undefined;
      throw new FsError('EEXIST', 'mkdir', p);
    }
    const parent = this.nodes.get(posix.dirname(p));
    if (!parent) {
      if (!recursive) throw new FsError('ENOENT', 'mkdir', p);
      let first: string | undefined;
      const parts = p.split('/').filter(Boolean);
      let cur = '';
      for (const part of parts) {
        cur += `/${part}`;
        if (!this.nodes.has(cur)) {
          first ??= cur;
          this.nodes.set(cur, this.#node('dir'));
          this.#touch(cur);
        }
      }
      return first;
    }
    if (parent.kind !== 'dir') throw new FsError('ENOTDIR', 'mkdir', p);
    this.nodes.set(p, this.#node('dir'));
    this.#touch(p);
    return p;
  }

  unlink(path: string): void {
    const p = this.norm(path);
    const n = this.stat(p, 'unlink');
    if (n.kind === 'dir') throw new FsError('EISDIR', 'unlink', p);
    this.nodes.delete(p);
    this.live.get(p)?.unlinked();
    this.live.delete(p);
    this.#dirty.delete(p);
    this.#deleted.add(p);
    this.#schedule();
  }

  rm(path: string, opts: { recursive?: boolean; force?: boolean } = {}): void {
    const p = this.norm(path);
    const n = this.nodes.get(p);
    if (!n) {
      if (opts.force) return;
      throw new FsError('ENOENT', 'rm', p);
    }
    if (n.kind === 'dir') {
      const children = [...this.nodes.keys()].filter((k) => k.startsWith(`${p}/`));
      if (children.length && !opts.recursive) throw new FsError('ENOTEMPTY', 'rm', p);
      for (const c of children.sort((a, b) => b.length - a.length)) {
        this.live.get(c)?.unlinked();
        this.live.delete(c);
        this.nodes.delete(c);
        this.#dirty.delete(c);
        this.#deleted.add(c);
      }
    } else {
      this.live.get(p)?.unlinked();
      this.live.delete(p);
    }
    this.nodes.delete(p);
    this.#dirty.delete(p);
    this.#deleted.add(p);
    this.#schedule();
  }

  rename(from: string, to: string): void {
    const a = this.norm(from);
    const b = this.norm(to);
    const n = this.stat(a, 'rename');
    if (!this.nodes.get(posix.dirname(b))) throw new FsError('ENOENT', 'rename', b);
    const moves = n.kind === 'dir' ? [...this.nodes.keys()].filter((k) => k === a || k.startsWith(`${a}/`)) : [a];
    for (const src of moves.sort((x, y) => x.length - y.length)) {
      const dst = b + src.slice(a.length);
      const node = this.nodes.get(src)!;
      const replaced = this.live.get(dst);
      if (replaced && dst !== src) {
        replaced.unlinked();
        this.live.delete(dst);
      }
      this.nodes.delete(src);
      this.nodes.set(dst, node);
      const live = this.live.get(src);
      if (live) {
        this.live.delete(src);
        this.live.set(dst, live);
        live.renamed(dst);
      }
      this.#deleted.add(src);
      this.#dirty.delete(src);
      this.#touch(dst);
    }
  }

  copy(from: string, to: string, recursive = false): void {
    const a = this.norm(from);
    const n = this.stat(a, 'cp');
    if (n.kind === 'file') return this.write(to, this.read(a).slice());
    if (!recursive) throw new FsError('EISDIR', 'cp', a);
    this.mkdir(to, true);
    for (const child of this.readdir(a)) this.copy(`${a}/${child}`, `${this.norm(to)}/${child}`, true);
  }

  attachLive(path: string, source: LiveSource): void {
    const p = this.norm(path);
    if (!this.nodes.has(p)) {
      this.#ensureParents(p, true);
      this.nodes.set(p, this.#node('file'));
    }
    this.live.set(p, source);
    this.#touch(p);
  }

  /** A live database closed: its final bytes become the file's contents. */
  detachLive(path: string, bytes: Uint8Array | null): void {
    const p = this.norm(path);
    this.live.delete(p);
    const n = this.nodes.get(p);
    if (n && bytes) {
      n.data = bytes;
      n.mtimeMs = Date.now();
      this.#touch(p);
    }
  }
}

export const vfs = new VFS();
