// Workspace in the browser: binaries, their OpenDecomp projects and comments,
// all in the VFS (persisted to IndexedDB).
//
//   /workspace/meta/<id>.json            BinaryRecord        (always loaded)
//   /workspace/meta/<id>.comments.json   { "<va>": "text" }  (always loaded)
//   /workspace/meta/<id>.data.json       WorkspaceData: data definitions and listing names
//   /workspace/binaries/<id>/<name>      the binary          (loaded on open)
//   /workspace/binaries/<id>/project/    OpenDecomp cache root

import { sha256 } from '@noble/hashes/sha2.js';
import type { DataDef } from './linear.ts';
import { vfs } from './vfs.ts';

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
}

/** What the listing keeps per binary besides comments. */
export interface WorkspaceData {
  /** Data definitions by address; `od`: declared to OpenDecomp as a `type` annotation too. */
  defs: Record<string, DataDef & { od?: boolean }>;
  /** Global names by address, as the listing's labels (OpenDecomp keeps its own `name` annotations). */
  names: Record<string, string>;
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
   * Write a binary, its comments and its OpenDecomp project files (paths
   * relative to the project root, already validated) as a new record.
   * The caller removes any existing record first.
   */
  async restore(
    record: BinaryRecord,
    binary: Uint8Array,
    comments: Record<string, string>,
    project: Map<string, Uint8Array>,
    data: WorkspaceData = emptyData(),
  ): Promise<void> {
    const dir = this.dir(record.id);
    if (this.get(record.id) || vfs.get(dir)) throw new Error(`Binary ${record.id} already exists`);
    const root = this.projectRoot(record.id);
    vfs.mkdir(dir, true);
    vfs.write(this.binaryPath(record), binary);
    for (const [rel, data] of project) {
      const path = vfs.norm(`${root}/${rel}`);
      // Defense in depth: the archive reader already rejects unsafe paths.
      if (!path.startsWith(`${root}/`)) throw new Error(`Refusing to write outside the project: ${rel}`);
      vfs.mkdir(path.slice(0, path.lastIndexOf('/')), true);
      vfs.write(path, data);
    }
    if (Object.keys(comments).length) writeJson(`${META}/${record.id}.comments.json`, comments);
    if (!isEmptyData(data)) writeJson(`${META}/${record.id}.data.json`, data);
    writeJson(`${META}/${record.id}.json`, record);
    await vfs.flush();
  }

  /** Paths of a binary's metadata files (record, comments, data definitions). */
  metaPaths(id: string): string[] {
    return [`${META}/${check(id)}.json`, `${META}/${id}.comments.json`, `${META}/${id}.data.json`];
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
}

export function isEmptyData(data: WorkspaceData): boolean {
  return Object.keys(data.defs).length === 0 && Object.keys(data.names).length === 0;
}

/** SHA-256 of `bytes` as hex. `crypto.subtle` exists only in secure contexts (HTTPS or
 * localhost); a site served over plain HTTP hashes in JavaScript instead. */
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = globalThis.crypto?.subtle
    ? new Uint8Array(await crypto.subtle.digest('SHA-256', bytes as Uint8Array<ArrayBuffer>))
    : sha256(bytes);
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}
