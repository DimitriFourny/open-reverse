// Workspace: where uploaded binaries, their OpenDecomp projects and UI-side
// annotations (address comments) are stored.
//
//   <root>/binaries/<id>/meta.json      BinaryRecord
//   <root>/binaries/<id>/<file name>    copy of the binary
//   <root>/binaries/<id>/project/       OpenDecomp cache root (SQLite projects)
//   <root>/binaries/<id>/comments.json  { "<va hex>": "comment" }

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile, rename } from 'node:fs/promises';
import { basename, join } from 'node:path';

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
}

const ID_RE = /^[0-9a-f]{16}$/;

export function sanitizeFileName(name: string): string {
  const base = basename(name).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '');
  return (base || 'binary').slice(0, 128);
}

async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  const tmp = `${path}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(value, null, 2));
  await rename(tmp, path);
}

export class Workspace {
  readonly root: string;
  constructor(root: string) {
    this.root = root;
  }

  get binariesDir(): string {
    return join(this.root, 'binaries');
  }

  dir(id: string): string {
    if (!ID_RE.test(id)) throw new Error(`Invalid binary id: ${id}`);
    return join(this.binariesDir, id);
  }

  async init(): Promise<void> {
    await mkdir(this.binariesDir, { recursive: true });
  }

  async list(): Promise<BinaryRecord[]> {
    const out: BinaryRecord[] = [];
    for (const entry of await readdir(this.binariesDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !ID_RE.test(entry.name)) continue;
      const record = await this.get(entry.name);
      if (record) out.push(record);
    }
    return out.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }

  async get(id: string): Promise<BinaryRecord | null> {
    try {
      return JSON.parse(await readFile(join(this.dir(id), 'meta.json'), 'utf8')) as BinaryRecord;
    } catch {
      return null;
    }
  }

  binaryPath(record: BinaryRecord): string {
    return join(this.dir(record.id), record.name);
  }

  projectRoot(id: string): string {
    return join(this.dir(id), 'project');
  }

  /** Store a binary; identical contents map to the same record. */
  async add(name: string, bytes: Uint8Array): Promise<BinaryRecord> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const id = sha256.slice(0, 16);
    const existing = await this.get(id);
    if (existing) return existing;
    const record: BinaryRecord = {
      id,
      name: sanitizeFileName(name),
      sha256,
      size: bytes.byteLength,
      addedAt: new Date().toISOString(),
    };
    const dir = this.dir(id);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, record.name), bytes);
    await writeJsonAtomic(join(dir, 'meta.json'), record);
    return record;
  }

  async remove(id: string): Promise<void> {
    await rm(this.dir(id), { recursive: true, force: true });
  }

  async comments(id: string): Promise<Record<string, string>> {
    try {
      return JSON.parse(await readFile(join(this.dir(id), 'comments.json'), 'utf8')) as Record<
        string,
        string
      >;
    } catch {
      return {};
    }
  }

  async setComment(id: string, address: string, text: string): Promise<Record<string, string>> {
    const comments = await this.comments(id);
    if (text.trim() === '') delete comments[address];
    else comments[address] = text;
    await writeJsonAtomic(join(this.dir(id), 'comments.json'), comments);
    return comments;
  }
}
