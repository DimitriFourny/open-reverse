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

/** Size of the SQLite WASM memory (0 before initialization). */
export function sqliteHeapBytes(): number {
  return sqlite3 ? sqlite3.wasm.heap8u().byteLength : 0;
}

function api(): Sqlite3Static {
  if (!sqlite3) throw new Error('SQLite WASM is not initialized');
  return sqlite3;
}

type Value = null | number | bigint | string | Uint8Array;

const SQLITE_SERIALIZE_NOCOPY = 1;

/**
 * The bytes of `db`'s main database. A deserialized (memdb) database is copied straight
 * out of its own buffer; `sqlite3_js_db_export` would first copy it inside WASM memory,
 * which then never shrinks, so each export would ratchet the heap up by a database size.
 */
function exportDb(db: Database): Uint8Array {
  const s = api();
  const scope = s.wasm.scopedAllocPush();
  try {
    const pSize = s.wasm.scopedAlloc(8);
    const p = s.capi.sqlite3_serialize(db.pointer!, 'main', pSize, SQLITE_SERIALIZE_NOCOPY);
    if (p) {
      const n = Number(s.wasm.peek(pSize, 'i64'));
      return s.wasm.heap8u().slice(Number(p), Number(p) + n);
    }
  } finally {
    s.wasm.scopedAllocPop(scope);
  }
  // Not a memdb (a database created empty in this session): SQLite serializes a copy.
  return s.capi.sqlite3_js_db_export(db.pointer!);
}

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
      peek: () => exportDb(this.db),
    });
    // While live, the VFS takes the file's bytes from the database, never from the node:
    // drop the node's copy so an open database is held once (in WASM memory), not twice.
    // `release` exports the bytes back when the node is empty.
    if (existing && existing.kind === 'file') existing.data = new Uint8Array(0);
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
    const bytes = exportDb(this.db);
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
  /** @internal Throws the error of a failed SQLite call on this database. */
  _check(rc: number): void {
    this.#db().checkRc(rc);
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

/** Raw SQLite exports, used where the oo1 wrappers cost more than the call (binding and
 * reading every column of every row: OpenDecomp reads and writes records in bulk). */
interface Raw {
  sqlite3_bind_null(stmt: number, index: number): number;
  sqlite3_bind_int(stmt: number, index: number, value: number): number;
  sqlite3_bind_int64(stmt: number, index: number, value: bigint): number;
  sqlite3_bind_double(stmt: number, index: number, value: number): number;
  sqlite3_bind_text(stmt: number, index: number, text: number, bytes: number, destructor: number): number;
  sqlite3_bind_blob(stmt: number, index: number, data: number, bytes: number, destructor: number): number;
  sqlite3_column_type(stmt: number, index: number): number;
  sqlite3_column_int64(stmt: number, index: number): bigint;
  sqlite3_column_double(stmt: number, index: number): number;
  sqlite3_column_text(stmt: number, index: number): number;
  sqlite3_column_blob(stmt: number, index: number): number;
  sqlite3_column_bytes(stmt: number, index: number): number;
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class StatementSync {
  readonly #owner: DatabaseSync;
  readonly #stmt: PreparedStatement;
  readonly sourceSQL: string;
  #readBigInts = false;
  #names: string[] | null = null;
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
      const { capi } = api();
      for (const [k, v] of Object.entries(params[0] as Record<string, unknown>)) {
        const index = capi.sqlite3_bind_parameter_index(st.pointer!, /^[:@$]/.test(k) ? k : `:${k}`);
        if (!index) throw new RangeError(`Invalid bind() parameter name: ${k}`);
        this.#bindAt(index, bindValue(v));
      }
      return;
    }
    params.forEach((v, i) => this.#bindAt(i + 1, bindValue(v)));
  }
  #bindAt(index: number, value: Value): void {
    const s = api();
    const raw = s.wasm.exports as unknown as Raw;
    const p = this.#stmt.pointer as number;
    let rc: number;
    if (value === null) rc = raw.sqlite3_bind_null(p, index);
    else if (typeof value === 'string') {
      // UTF-8 straight into WASM memory (at most 3 bytes per UTF-16 unit); SQLite frees it.
      const room = value.length * 3 + 1;
      const ptr = s.wasm.alloc(room) as number;
      const { written } = encoder.encodeInto(value, s.wasm.heap8u().subarray(ptr, ptr + room));
      rc = raw.sqlite3_bind_text(p, index, ptr, written, s.capi.SQLITE_WASM_DEALLOC as number);
    } else if (typeof value === 'number')
      rc = (value | 0) === value ? raw.sqlite3_bind_int(p, index, value) : Number.isInteger(value) ? raw.sqlite3_bind_int64(p, index, BigInt(value)) : raw.sqlite3_bind_double(p, index, value);
    else if (typeof value === 'bigint') {
      if (value < -(1n << 63n) || value >= 1n << 63n) throw new RangeError(`BigInt value is too big to store without precision loss: ${value}`);
      rc = raw.sqlite3_bind_int64(p, index, value);
    } else {
      const ptr = s.wasm.alloc(value.byteLength || 1) as number;
      s.wasm.heap8u().set(value, ptr);
      rc = raw.sqlite3_bind_blob(p, index, ptr, value.byteLength, s.capi.SQLITE_WASM_DEALLOC as number);
    }
    if (rc) this.#owner._check(rc);
  }
  #row(): Record<string, Value> {
    const s = api();
    const raw = s.wasm.exports as unknown as Raw;
    const { capi } = s;
    const p = this.#stmt.pointer as number;
    const names = (this.#names ??= this.#stmt.getColumnNames());
    const row: Record<string, Value> = {};
    for (let i = 0; i < names.length; i++) {
      let v: Value;
      switch (raw.sqlite3_column_type(p, i)) {
        case capi.SQLITE_NULL:
          v = null;
          break;
        case capi.SQLITE_INTEGER: {
          const n = raw.sqlite3_column_int64(p, i);
          v = this.#readBigInts ? n : n >= -9007199254740991n && n <= 9007199254740991n ? Number(n) : n;
          break;
        }
        case capi.SQLITE_FLOAT:
          v = raw.sqlite3_column_double(p, i);
          break;
        case capi.SQLITE_TEXT: {
          const ptr = raw.sqlite3_column_text(p, i);
          v = ptr ? decoder.decode(s.wasm.heap8u().subarray(ptr, ptr + raw.sqlite3_column_bytes(p, i))) : '';
          break;
        }
        default: {
          const ptr = raw.sqlite3_column_blob(p, i);
          const n = raw.sqlite3_column_bytes(p, i);
          v = ptr ? s.wasm.heap8u().slice(ptr, ptr + n) : new Uint8Array(0);
        }
      }
      row[names[i]!] = v;
    }
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
