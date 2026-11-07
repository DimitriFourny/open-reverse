// node:sqlite (DatabaseSync / StatementSync) over the official SQLite WASM
// build. Every database is an in-memory SQLite connection whose bytes back a
// VFS file: opened from the file's contents (sqlite3_deserialize) and written
// back when the VFS persists or the last connection closes (sqlite3_serialize).
// Connections to the same path share one SQLite handle, as connections to one
// file would share its contents.

import type { Database, PreparedStatement, Sqlite3Static } from '@sqlite.org/sqlite-wasm';
import { vfs } from '../vfs.ts';

let sqlite3: Sqlite3Static | null = null;

/** Must run (and resolve) before OpenDecomp opens a project. */
export async function initSqlite(): Promise<void> {
  if (sqlite3) return;
  const { default: init } = await import('@sqlite.org/sqlite-wasm');
  sqlite3 = await init();
}

function api(): Sqlite3Static {
  if (!sqlite3) throw new Error('SQLite WASM is not initialized');
  return sqlite3;
}

type Value = null | number | bigint | string | Uint8Array;

class Shared {
  path: string | null;
  readonly db: Database;
  refs = 0;
  #exported = -1;
  #execs = 0;
  #exportedExecs = -1;
  constructor(path: string | null) {
    this.path = path;
    const s = api();
    this.db = new s.oo1.DB(':memory:', 'c');
    if (!path) return;
    const existing = vfs.get(path);
    if (existing && existing.kind === 'file' && existing.data.length > 0) {
      const bytes = existing.data;
      const p = s.wasm.allocFromTypedArray(bytes);
      const rc = s.capi.sqlite3_deserialize(
        this.db.pointer!,
        'main',
        p,
        bytes.length,
        bytes.length,
        s.capi.SQLITE_DESERIALIZE_FREEONCLOSE | s.capi.SQLITE_DESERIALIZE_RESIZEABLE,
      );
      this.db.checkRc(rc);
      this.#exported = this.#total();
      this.#exportedExecs = 0;
    }
    vfs.attachLive(path, {
      bytes: () => this.export(),
      size: () => this.#size(),
      changed: () => this.changed(),
      renamed: (to) => {
        live.delete(this.path!);
        this.path = to;
        live.set(to, this);
      },
      unlinked: () => {
        live.delete(this.path!);
        this.path = null;
      },
      busy: () => s.capi.sqlite3_get_autocommit(this.db.pointer!) === 0,
      peek: () => s.capi.sqlite3_js_db_export(this.db.pointer!),
    });
  }
  #total(): number {
    return api().capi.sqlite3_total_changes(this.db.pointer!);
  }
  #size(): number {
    const pages = this.db.selectValue('PRAGMA page_count') as number;
    const size = this.db.selectValue('PRAGMA page_size') as number;
    return pages * size;
  }
  noteExec(): void {
    this.#execs++;
  }
  changed(): boolean {
    return this.#total() !== this.#exported || this.#execs !== this.#exportedExecs;
  }
  export(): Uint8Array {
    const bytes = api().capi.sqlite3_js_db_export(this.db.pointer!);
    this.#exported = this.#total();
    this.#exportedExecs = this.#execs;
    return bytes;
  }
  release(): void {
    if (--this.refs > 0) return;
    if (this.path) {
      live.delete(this.path);
      vfs.detachLive(this.path, this.changed() ? this.export() : (vfs.get(this.path)?.data.length ? null : this.export()));
    }
    this.db.close();
  }
}

const live = new Map<string, Shared>();

function locationPath(location: string | URL | Uint8Array): string | null {
  let text = location instanceof Uint8Array ? new TextDecoder().decode(location) : typeof location === 'string' ? location : location.href;
  if (text === ':memory:' || text === '') return null;
  if (text.startsWith('file:')) text = decodeURIComponent(new URL(text).pathname);
  return vfs.norm(text);
}

export interface DatabaseSyncOptions {
  open?: boolean;
  readOnly?: boolean;
  timeout?: number;
  enableForeignKeyConstraints?: boolean;
}

export class DatabaseSync {
  #shared: Shared | null = null;
  #location: string | null;
  constructor(location: string | URL | Uint8Array, options: DatabaseSyncOptions = {}) {
    this.#location = locationPath(location);
    if (options.open !== false) this.open();
  }
  open(): void {
    if (this.#shared) throw new Error('database is already open');
    const path = this.#location;
    let shared = path ? live.get(path) : undefined;
    if (!shared) {
      shared = new Shared(path);
      if (path) live.set(path, shared);
    }
    shared.refs++;
    this.#shared = shared;
  }
  #db(): Database {
    if (!this.#shared) throw new Error('database is not open');
    return this.#shared.db;
  }
  get isOpen(): boolean {
    return !!this.#shared;
  }
  get isTransaction(): boolean {
    return api().capi.sqlite3_get_autocommit(this.#db().pointer!) === 0;
  }
  exec(sql: string): void {
    this.#db().exec(sql);
    this.#shared!.noteExec();
  }
  prepare(sql: string): StatementSync {
    return new StatementSync(this, this.#db().prepare(sql), sql);
  }
  close(): void {
    if (!this.#shared) throw new Error('database is not open');
    const s = this.#shared;
    this.#shared = null;
    s.release();
  }
  /** @internal */
  _changes(): { changes: number; lastInsertRowid: number | bigint } {
    const { capi } = api();
    const p = this.#db().pointer!;
    return { changes: capi.sqlite3_changes(p), lastInsertRowid: Number(capi.sqlite3_last_insert_rowid(p)) };
  }
  [Symbol.dispose](): void {
    if (this.#shared) this.close();
  }
}

function bindValue(v: unknown): Value {
  if (v === null || typeof v === 'number' || typeof v === 'bigint' || typeof v === 'string' || v instanceof Uint8Array) return v as Value;
  if (ArrayBuffer.isView(v)) return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  throw new TypeError(`Provided value cannot be bound to SQLite parameter: ${typeof v}`);
}

export class StatementSync {
  readonly #owner: DatabaseSync;
  readonly #stmt: PreparedStatement;
  readonly sourceSQL: string;
  #readBigInts = false;
  constructor(owner: DatabaseSync, stmt: PreparedStatement, sql: string) {
    this.#owner = owner;
    this.#stmt = stmt;
    this.sourceSQL = sql;
  }
  #bind(params: unknown[]): void {
    const st = this.#stmt;
    st.reset(true);
    if (params.length === 0) return;
    if (params.length === 1 && params[0] !== null && typeof params[0] === 'object' && !ArrayBuffer.isView(params[0])) {
      const named: Record<string, Value> = {};
      for (const [k, v] of Object.entries(params[0] as Record<string, unknown>)) named[/^[:@$]/.test(k) ? k : `:${k}`] = bindValue(v);
      st.bind(named);
      return;
    }
    st.bind(params.map(bindValue));
  }
  #row(): Record<string, Value> {
    const row = this.#stmt.get({}) as Record<string, Value>;
    if (this.#readBigInts) for (const k in row) if (typeof row[k] === 'number' && Number.isInteger(row[k])) row[k] = BigInt(row[k] as number);
    return row;
  }
  setReadBigInts(enabled: boolean): void {
    this.#readBigInts = enabled;
  }
  setAllowBareNamedParameters(): void {}
  run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint } {
    this.#bind(params);
    try {
      while (this.#stmt.step()) {
        /* drain */
      }
    } finally {
      this.#stmt.reset();
    }
    return this.#owner._changes();
  }
  get(...params: unknown[]): Record<string, Value> | undefined {
    this.#bind(params);
    try {
      return this.#stmt.step() ? this.#row() : undefined;
    } finally {
      this.#stmt.reset();
    }
  }
  all(...params: unknown[]): Record<string, Value>[] {
    this.#bind(params);
    const rows: Record<string, Value>[] = [];
    try {
      while (this.#stmt.step()) rows.push(this.#row());
    } finally {
      this.#stmt.reset();
    }
    return rows;
  }
  /** Rows are collected eagerly: OpenDecomp caches and reuses statements. */
  iterate(...params: unknown[]): IterableIterator<Record<string, Value>> {
    return this.all(...params)[Symbol.iterator]();
  }
  columns(): { name: string }[] {
    return this.#stmt.getColumnNames().map((name) => ({ name }));
  }
}

export const constants = {};
export default { DatabaseSync, StatementSync, constants };
