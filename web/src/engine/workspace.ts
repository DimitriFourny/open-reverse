// Workspace in the browser: binaries, their OpenDecomp projects, comments and
// bookmarks, all in the VFS (persisted to IndexedDB).
//
//   /workspace/meta/<id>.json            BinaryRecord               (always loaded)
//   /workspace/meta/<id>.comments.json   { "<va>": "text" }         (always loaded)
//   /workspace/meta/<id>.bookmarks.json  { "<va>": "description" }  (always loaded)
//   /workspace/meta/<id>.data.json       WorkspaceData: data definitions, listing names, enum displays
//   /workspace/binaries/<id>/<name>      the binary          (loaded on open)
//   /workspace/binaries/<id>/debug/<n>   its companion debug file, if any (BinaryRecord.debug)
//   /workspace/binaries/<id>/project/    OpenDecomp cache root (one project per binary, and
//                                        one per binary + debug file pair)
//   /workspace/binaries/<id>/diffsig-v<V>-r<revision>.json   binary diff signatures (bindiff.ts)

import { sha256 } from '@noble/hashes/sha2.js';
import type { DebugFileRecord } from './debugfile.ts';
import type { EnumMember } from './enums.ts';
import type { DataDef } from './linear.ts';
import { vfs } from './vfs.ts';

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
  /** The companion debug file stored with the binary (dSYM DWARF, ELF debug file). */
  debug?: DebugFileRecord;
}

/** What the listing keeps per binary besides comments. */
export interface WorkspaceData {
  /** Data definitions by address; `od`: declared to OpenDecomp as a `type` annotation too. */
  defs: Record<string, DataDef & { od?: boolean }>;
  /** Global names by address, as the listing's labels (OpenDecomp keeps its own `name` annotations). */
  names: Record<string, string>;
  /** Constants displayed as an enumeration (M): `<0xinsn>|<hex value>` -> enum id (`lib:open_flags`, `user:Color`). */
  enums?: Record<string, string>;
  /** Enumerators of the enums declared in the type library (OpenDecomp stores an enum as its integer type). */
  enumTypes?: Record<string, EnumMember[]>;
}

export function emptyData(): WorkspaceData {
  return { defs: {}, names: {} };
}

const ROOT = '/workspace';
const META = `${ROOT}/meta`;
const ID_RE = /^[0-9a-f]{16}$/;
const enc = new TextEncoder();
const dec = new TextDecoder();

export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop()!.replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '');
  return (base || 'binary').slice(0, 128);
}

function check(id: string): string {
  if (!ID_RE.test(id)) throw new Error(`Invalid binary id: ${id}`);
  return id;
}

function readJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(dec.decode(vfs.read(path))) as T;
  } catch {
    return fallback;
  }
}

function writeJson(path: string, value: unknown): void {
  vfs.write(path, enc.encode(JSON.stringify(value)));
}

export class Workspace {
  async init(): Promise<void> {
    await vfs.mount(META);
    vfs.mkdir(META, true);
    vfs.mkdir(`${ROOT}/binaries`, true);
  }

  list(): BinaryRecord[] {
    return vfs
      .readdir(META)
      .filter((n) => /^[0-9a-f]{16}\.json$/.test(n))
      .map((n) => readJson<BinaryRecord | null>(`${META}/${n}`, null))
      .filter((r): r is BinaryRecord => !!r)
      .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }

  get(id: string): BinaryRecord | null {
    return readJson<BinaryRecord | null>(`${META}/${check(id)}.json`, null);
  }

  dir(id: string): string {
    return `${ROOT}/binaries/${check(id)}`;
  }

  binaryPath(record: BinaryRecord): string {
    return `${this.dir(record.id)}/${record.name}`;
  }

  projectRoot(id: string): string {
    return `${this.dir(id)}/project`;
  }

  /** The stored debug file of a binary, or null. */
  debugPath(record: BinaryRecord): string | null {
    return record.debug ? `${this.dir(record.id)}/debug/${record.debug.name}` : null;
  }

  /** Stores `bytes` as the binary's debug file (replacing any previous one's bytes, not its
   * project) and returns the updated record. The binary must be loaded. */
  async setDebugFile(id: string, name: string, bytes: Uint8Array, kind: DebugFileRecord['kind']): Promise<BinaryRecord> {
    const record = this.get(id);
    if (!record) throw new Error(`Unknown binary ${id}`);
    const previous = this.debugPath(record);
    if (previous && vfs.get(previous)) vfs.unlink(previous);
    const debug: DebugFileRecord = {
      name: sanitizeFileName(name),
      sha256: await sha256Hex(bytes),
      size: bytes.byteLength,
      kind,
      addedAt: new Date().toISOString(),
    };
    const updated: BinaryRecord = { ...record, debug };
    vfs.mkdir(`${this.dir(id)}/debug`, true);
    vfs.write(this.debugPath(updated)!, bytes);
    writeJson(`${META}/${id}.json`, updated);
    await vfs.flush();
    return updated;
  }

  /** Forgets the binary's debug file and the OpenDecomp project of the pair. */
  async removeDebugFile(id: string): Promise<BinaryRecord> {
    const record = this.get(id);
    if (!record) throw new Error(`Unknown binary ${id}`);
    if (!record.debug) return record;
    const path = this.debugPath(record)!;
    if (vfs.get(path)) vfs.unlink(path);
    await this.removeDebugProject(id, record.debug.sha256);
    const { debug: _debug, ...updated } = record;
    writeJson(`${META}/${id}.json`, updated);
    await vfs.flush();
    return updated;
  }

  /** Deletes the OpenDecomp project of the binary paired with the debug file `sha256`
   * (OpenDecomp names it `<sha256>.<slice>.debug-<debug sha256>`). */
  async removeDebugProject(id: string, sha256: string): Promise<void> {
    const root = this.projectRoot(id);
    for (const name of await vfs.listStored(root)) if (name.endsWith(`.debug-${sha256}`)) await vfs.removeTree(`${root}/${name}`);
  }

  /** The binary diff signature table of a project revision. */
  diffSigPath(id: string, version: number, revision: number): string {
    return `${this.dir(id)}/diffsig-v${version}-r${revision}.json`;
  }

  /** Stored diff signature tables, newest revision first, whether or not the binary is loaded. */
  async diffSigs(id: string): Promise<{ path: string; version: number; revision: number }[]> {
    const out = [];
    for (const name of await vfs.listStored(this.dir(id))) {
      const m = /^diffsig-v(\d+)-r(\d+)\.json$/.exec(name);
      if (m) out.push({ path: `${this.dir(id)}/${name}`, version: Number(m[1]), revision: Number(m[2]) });
    }
    return out.sort((a, b) => b.revision - a.revision);
  }

  /** Load a binary's files into memory before OpenDecomp opens it. */
  async load(id: string): Promise<void> {
    await vfs.mount(this.dir(id));
  }

  async unload(id: string): Promise<void> {
    await vfs.unmount(this.dir(id));
  }

  /** Store a binary; identical contents map to the same record. */
  async add(name: string, bytes: Uint8Array): Promise<BinaryRecord> {
    const sha256 = await sha256Hex(bytes);
    const id = sha256.slice(0, 16);
    const existing = this.get(id);
    if (existing) return existing;
    const record: BinaryRecord = { id, name: sanitizeFileName(name), sha256, size: bytes.byteLength, addedAt: new Date().toISOString() };
    vfs.mkdir(this.dir(id), true);
    vfs.write(this.binaryPath(record), bytes);
    writeJson(`${META}/${id}.json`, record);
    await vfs.flush();
    return record;
  }

  async remove(id: string): Promise<void> {
    await vfs.removeTree(this.dir(id));
    for (const p of this.metaPaths(id)) if (vfs.get(p)) vfs.unlink(p);
    await vfs.flush();
  }

  /**
   * Write a binary, its comments, bookmarks and OpenDecomp project files (paths
   * relative to the project root, already validated) as a new record.
   * The caller removes any existing record first.
   */
  async restore(
    record: BinaryRecord,
    binary: Uint8Array,
    comments: Record<string, string>,
    project: Map<string, Uint8Array>,
    bookmarks: Record<string, string> = {},
    data: WorkspaceData = emptyData(),
    debug?: Uint8Array,
  ): Promise<void> {
    const dir = this.dir(record.id);
    if (this.get(record.id) || vfs.get(dir)) throw new Error(`Binary ${record.id} already exists`);
    if (!!record.debug !== !!debug) throw new Error('A debug file record needs its bytes, and bytes their record');
    const root = this.projectRoot(record.id);
    vfs.mkdir(dir, true);
    vfs.write(this.binaryPath(record), binary);
    if (debug) {
      vfs.mkdir(`${dir}/debug`, true);
      vfs.write(this.debugPath(record)!, debug);
    }
    for (const [rel, data] of project) {
      const path = vfs.norm(`${root}/${rel}`);
      // Defense in depth: the archive reader already rejects unsafe paths.
      if (!path.startsWith(`${root}/`)) throw new Error(`Refusing to write outside the project: ${rel}`);
      vfs.mkdir(path.slice(0, path.lastIndexOf('/')), true);
      vfs.write(path, data);
    }
    if (Object.keys(comments).length) writeJson(`${META}/${record.id}.comments.json`, comments);
    if (Object.keys(bookmarks).length) writeJson(`${META}/${record.id}.bookmarks.json`, bookmarks);
    if (!isEmptyData(data)) writeJson(`${META}/${record.id}.data.json`, data);
    writeJson(`${META}/${record.id}.json`, record);
    await vfs.flush();
  }

  /** Paths of a binary's metadata files (record, comments, bookmarks, data definitions). */
  metaPaths(id: string): string[] {
    return [`${META}/${check(id)}.json`, `${META}/${id}.comments.json`, `${META}/${id}.bookmarks.json`, `${META}/${id}.data.json`];
  }

  async data(id: string): Promise<WorkspaceData> {
    return { ...emptyData(), ...readJson<Partial<WorkspaceData>>(`${META}/${check(id)}.data.json`, {}) };
  }

  async setData(id: string, data: WorkspaceData): Promise<void> {
    const path = `${META}/${check(id)}.data.json`;
    if (isEmptyData(data)) {
      if (vfs.get(path)) vfs.unlink(path);
    } else writeJson(path, data);
  }

  async comments(id: string): Promise<Record<string, string>> {
    return readJson<Record<string, string>>(`${META}/${check(id)}.comments.json`, {});
  }

  async setComment(id: string, address: string, text: string): Promise<Record<string, string>> {
    const comments = await this.comments(id);
    if (text.trim() === '') delete comments[address];
    else comments[address] = text;
    writeJson(`${META}/${id}.comments.json`, comments);
    return comments;
  }

  async bookmarks(id: string): Promise<Record<string, string>> {
    return readJson<Record<string, string>>(`${META}/${check(id)}.bookmarks.json`, {});
  }

  /** Bookmarks an address with a description (may be empty); null removes the bookmark. */
  async setBookmark(id: string, address: string, description: string | null): Promise<Record<string, string>> {
    const bookmarks = await this.bookmarks(id);
    if (description === null) delete bookmarks[address];
    else bookmarks[address] = description.trim();
    writeJson(`${META}/${id}.bookmarks.json`, bookmarks);
    return bookmarks;
  }
}

export function isEmptyData(data: WorkspaceData): boolean {
  return (
    Object.keys(data.defs).length === 0 &&
    Object.keys(data.names).length === 0 &&
    Object.keys(data.enums ?? {}).length === 0 &&
    Object.keys(data.enumTypes ?? {}).length === 0
  );
}

/** SHA-256 of `bytes` as hex. `crypto.subtle` exists only in secure contexts (HTTPS or
 * localhost); a site served over plain HTTP hashes in JavaScript instead. */
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = globalThis.crypto?.subtle
    ? new Uint8Array(await crypto.subtle.digest('SHA-256', bytes as Uint8Array<ArrayBuffer>))
    : sha256(bytes);
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}
