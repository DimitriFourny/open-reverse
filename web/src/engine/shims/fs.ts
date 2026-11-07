// node:fs over the in-memory VFS (the subset OpenDecomp uses).

import { Buffer } from 'buffer';
import { FsError, vfs, type VNode } from '../vfs.ts';

export const constants = {
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  O_CREAT: 0o100,
  O_EXCL: 0o200,
  O_TRUNC: 0o1000,
  O_APPEND: 0o2000,
  O_NOFOLLOW: 0o400000,
  COPYFILE_EXCL: 1,
  COPYFILE_FICLONE: 2,
  COPYFILE_FICLONE_FORCE: 4,
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1,
};

type PathLike = string | URL | Uint8Array;
const pathOf = (p: PathLike): string => (p instanceof Uint8Array ? new TextDecoder().decode(p) : typeof p === 'string' ? p : p.href);

export class Stats {
  readonly dev = 1;
  readonly ino: number | bigint;
  readonly mode: number;
  readonly nlink = 1;
  readonly uid = 0;
  readonly gid = 0;
  readonly size: number | bigint;
  readonly blksize = 4096;
  readonly blocks: number | bigint;
  readonly atimeMs: number | bigint;
  readonly mtimeMs: number | bigint;
  readonly ctimeMs: number | bigint;
  readonly birthtimeMs: number | bigint;
  readonly atime: Date;
  readonly mtime: Date;
  readonly ctime: Date;
  readonly birthtime: Date;
  readonly #kind: 'file' | 'dir';
  constructor(n: VNode, size: number, bigint = false) {
    const B = (v: number) => (bigint ? BigInt(Math.trunc(v)) : v);
    this.#kind = n.kind;
    this.ino = B(n.ino);
    this.mode = (n.kind === 'dir' ? 0o040000 : 0o100000) | n.mode;
    this.size = B(size);
    this.blocks = B(Math.ceil(size / 512));
    this.atimeMs = this.mtimeMs = this.ctimeMs = this.birthtimeMs = B(n.mtimeMs);
    this.atime = this.mtime = this.ctime = this.birthtime = new Date(n.mtimeMs);
    if (bigint) Object.assign(this, { dev: 1n, nlink: 1n, uid: 0n, gid: 0n, blksize: 4096n });
  }
  isFile() {
    return this.#kind === 'file';
  }
  isDirectory() {
    return this.#kind === 'dir';
  }
  isSymbolicLink() {
    return false;
  }
  isFIFO() {
    return false;
  }
  isSocket() {
    return false;
  }
  isBlockDevice() {
    return false;
  }
  isCharacterDevice() {
    return false;
  }
}

function statOf(p: PathLike, opts?: { bigint?: boolean; throwIfNoEntry?: boolean }, syscall = 'stat'): Stats | undefined {
  const path = pathOf(p);
  const n = vfs.get(path);
  if (!n) {
    if (opts?.throwIfNoEntry === false) return undefined;
    throw new FsError('ENOENT', syscall, path);
  }
  return new Stats(n, vfs.size(path), opts?.bigint);
}

export function statSync(p: PathLike, opts?: { bigint?: boolean; throwIfNoEntry?: boolean }) {
  return statOf(p, opts) as Stats;
}
export const lstatSync = (p: PathLike, opts?: { bigint?: boolean; throwIfNoEntry?: boolean }) => statOf(p, opts, 'lstat') as Stats;
export const existsSync = (p: PathLike) => {
  try {
    return !!vfs.get(pathOf(p));
  } catch {
    return false;
  }
};
export function realpathSync(p: PathLike): string {
  const path = vfs.norm(pathOf(p));
  if (!vfs.get(path)) throw new FsError('ENOENT', 'realpath', path);
  return path;
}
realpathSync.native = realpathSync;

export function mkdirSync(p: PathLike, opts?: { recursive?: boolean; mode?: number } | number) {
  return vfs.mkdir(pathOf(p), typeof opts === 'object' && !!opts?.recursive);
}
export function mkdtempSync(prefix: string): string {
  for (;;) {
    const p = `${prefix}${Math.random().toString(36).slice(2, 8)}`;
    if (!vfs.get(p)) {
      vfs.mkdir(p, true);
      return vfs.norm(p);
    }
  }
}
export function readdirSync(p: PathLike, opts?: { withFileTypes?: boolean }) {
  const path = vfs.norm(pathOf(p));
  const names = vfs.readdir(path);
  if (!opts?.withFileTypes) return names;
  return names.map((name) => {
    const n = vfs.get(`${path}/${name}`)!;
    return { name, parentPath: path, path, isFile: () => n.kind === 'file', isDirectory: () => n.kind === 'dir', isSymbolicLink: () => false };
  });
}

function toBytes(data: string | Uint8Array | ArrayBufferView, encoding?: string): Uint8Array {
  if (typeof data === 'string') return Buffer.from(data, (encoding as BufferEncoding | undefined) ?? 'utf8');
  if (data instanceof Uint8Array) return data;
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

function decode(bytes: Uint8Array, opts?: string | { encoding?: string | null; flag?: unknown } | null) {
  const encoding = typeof opts === 'string' ? opts : (opts?.encoding ?? null);
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return encoding ? buf.toString(encoding as BufferEncoding) : Buffer.from(buf);
}

export function readFileSync(p: PathLike | number, opts?: string | { encoding?: string | null; flag?: unknown } | null) {
  if (typeof p === 'number') return decode(fdEntry(p).read(), opts);
  return decode(vfs.read(pathOf(p)), opts);
}
export function writeFileSync(p: PathLike | number, data: string | Uint8Array, opts?: string | { encoding?: string; flag?: string; mode?: number }) {
  const encoding = typeof opts === 'string' ? opts : opts?.encoding;
  if (typeof p === 'number') {
    const e = fdEntry(p);
    e.data = toBytes(data, encoding).slice();
    e.dirty = true;
    return;
  }
  const flag = typeof opts === 'object' ? opts.flag : undefined;
  vfs.write(pathOf(p), toBytes(data, encoding).slice(), { exclusive: flag === 'wx', ...(typeof opts === 'object' && opts.mode ? { mode: opts.mode } : {}) });
}
export function unlinkSync(p: PathLike) {
  vfs.unlink(pathOf(p));
}
export function rmSync(p: PathLike, opts?: { recursive?: boolean; force?: boolean }) {
  vfs.rm(pathOf(p), opts);
}
export function rmdirSync(p: PathLike, opts?: { recursive?: boolean }) {
  vfs.rm(pathOf(p), { recursive: !!opts?.recursive });
}
export function renameSync(a: PathLike, b: PathLike) {
  vfs.rename(pathOf(a), pathOf(b));
}
export function cpSync(a: PathLike, b: PathLike, opts?: { recursive?: boolean }) {
  vfs.copy(pathOf(a), pathOf(b), !!opts?.recursive);
}
export function copyFileSync(a: PathLike, b: PathLike) {
  vfs.copy(pathOf(a), pathOf(b));
}
export function accessSync(p: PathLike) {
  if (!existsSync(p)) throw new FsError('ENOENT', 'access', pathOf(p));
}

// ---------------------------------------------------------- descriptors

class FdEntry {
  readonly path: string;
  readonly writable: boolean;
  data: Uint8Array;
  dirty = false;
  position = 0;
  constructor(path: string, writable: boolean, data: Uint8Array) {
    this.path = path;
    this.writable = writable;
    this.data = data;
  }
  read(): Uint8Array {
    return this.writable ? this.data : vfs.read(this.path);
  }
}
const fds = new Map<number, FdEntry>();
let nextFd = 10;

function fdEntry(fd: number): FdEntry {
  const e = fds.get(fd);
  if (!e) throw new FsError('EBADF', 'fd', String(fd));
  return e;
}

function parseFlags(flags: string | number | undefined): { write: boolean; create: boolean; exclusive: boolean; truncate: boolean; append: boolean } {
  if (flags === undefined) flags = 'r';
  if (typeof flags === 'number') {
    const acc = flags & 3;
    return {
      write: acc !== constants.O_RDONLY,
      create: !!(flags & constants.O_CREAT),
      exclusive: !!(flags & constants.O_EXCL),
      truncate: !!(flags & constants.O_TRUNC),
      append: !!(flags & constants.O_APPEND),
    };
  }
  const f = flags.replace('s', '');
  return {
    write: f !== 'r',
    create: f.startsWith('w') || f.startsWith('a'),
    exclusive: f.includes('x'),
    truncate: f.startsWith('w'),
    append: f.startsWith('a'),
  };
}

export function openSync(p: PathLike, flags?: string | number, mode?: number): number {
  const path = vfs.norm(pathOf(p));
  const f = parseFlags(flags);
  const n = vfs.get(path);
  if (n?.kind === 'dir' && f.write) throw new FsError('EISDIR', 'open', path);
  if (n && f.exclusive && f.create) throw new FsError('EEXIST', 'open', path);
  if (!n && !f.create) throw new FsError('ENOENT', 'open', path);
  if (!n) vfs.write(path, new Uint8Array(0), mode === undefined ? {} : { mode });
  const data = f.write ? (f.truncate ? new Uint8Array(0) : vfs.read(path).slice()) : new Uint8Array(0);
  const e = new FdEntry(path, f.write, data);
  if (f.truncate) e.dirty = true;
  if (f.append) e.position = data.length;
  const fd = nextFd++;
  fds.set(fd, e);
  return fd;
}

export function fstatSync(fd: number, opts?: { bigint?: boolean }) {
  const e = fdEntry(fd);
  const n = vfs.get(e.path);
  if (!n) throw new FsError('ENOENT', 'fstat', e.path);
  return new Stats(n, e.writable ? e.data.length : vfs.size(e.path), opts?.bigint);
}

export function readSync(
  fd: number,
  buffer: Uint8Array,
  offsetOrOpts?: number | { offset?: number; length?: number; position?: number | bigint | null },
  length?: number,
  position?: number | bigint | null,
): number {
  const e = fdEntry(fd);
  let offset = 0;
  if (typeof offsetOrOpts === 'object') {
    offset = offsetOrOpts.offset ?? 0;
    length = offsetOrOpts.length;
    position = offsetOrOpts.position;
  } else offset = offsetOrOpts ?? 0;
  const len = length ?? buffer.byteLength - offset;
  const data = e.read();
  const pos = position === null || position === undefined ? e.position : Number(position);
  const n = Math.max(0, Math.min(len, data.length - pos));
  buffer.set(data.subarray(pos, pos + n), offset);
  if (position === null || position === undefined) e.position += n;
  return n;
}

export function writeSync(fd: number, data: Uint8Array | string, offsetOrPos?: number | null, length?: number | string, position?: number | null): number {
  const e = fdEntry(fd);
  if (!e.writable) throw new FsError('EBADF', 'write', e.path);
  let bytes: Uint8Array;
  let pos: number | null | undefined;
  if (typeof data === 'string') {
    bytes = Buffer.from(data, typeof length === 'string' ? (length as BufferEncoding) : 'utf8');
    pos = offsetOrPos;
  } else {
    const off = offsetOrPos ?? 0;
    const len = typeof length === 'number' ? length : data.byteLength - off;
    bytes = data.subarray(off, off + len);
    pos = position;
  }
  const at = pos === null || pos === undefined ? e.position : pos;
  const end = at + bytes.length;
  if (end > e.data.length) {
    if (end <= e.data.buffer.byteLength - e.data.byteOffset) e.data = new Uint8Array(e.data.buffer, e.data.byteOffset, end);
    else {
      const grown = new Uint8Array(Math.max(end, e.data.length * 2, 4096));
      grown.set(e.data);
      e.data = grown.subarray(0, end);
    }
  }
  e.data.set(bytes, at);
  if (pos === null || pos === undefined) e.position = end;
  e.dirty = true;
  return bytes.length;
}

function commit(e: FdEntry): void {
  if (e.writable && e.dirty && vfs.get(e.path)) {
    vfs.write(e.path, e.data.slice());
    e.dirty = false;
  }
}

export function fsyncSync(fd: number) {
  commit(fdEntry(fd));
}
export const fdatasyncSync = fsyncSync;
export function closeSync(fd: number) {
  const e = fdEntry(fd);
  commit(e);
  fds.delete(fd);
}
export function ftruncateSync(fd: number, len = 0) {
  const e = fdEntry(fd);
  e.data = e.data.slice(0, len);
  e.dirty = true;
}

// Callback form used only by the CLI; kept so imports resolve.
export function write(fd: number, data: Uint8Array | string, cb?: (err: Error | null, n?: number) => void) {
  try {
    const n = writeSync(fd, data);
    cb?.(null, n);
  } catch (e) {
    cb?.(e as Error);
  }
}

// -------------------------------------------------------------- promises

class FileHandle {
  readonly fd: number;
  constructor(fd: number) {
    this.fd = fd;
  }
  async read(
    bufferOrOpts?: Uint8Array | { buffer?: Uint8Array; offset?: number; length?: number; position?: number | bigint | null },
    offset?: number,
    length?: number,
    position?: number | bigint | null,
  ) {
    let buffer: Uint8Array;
    if (bufferOrOpts instanceof Uint8Array) buffer = bufferOrOpts;
    else {
      buffer = bufferOrOpts?.buffer ?? Buffer.alloc(16384);
      offset = bufferOrOpts?.offset;
      length = bufferOrOpts?.length;
      position = bufferOrOpts?.position;
    }
    const bytesRead = readSync(this.fd, buffer, offset ?? 0, length ?? buffer.byteLength - (offset ?? 0), position ?? null);
    return { bytesRead, buffer };
  }
  async write(data: Uint8Array | string, offset?: number, length?: number, position?: number) {
    const bytesWritten = writeSync(this.fd, data, offset ?? null, length, position ?? null);
    return { bytesWritten, buffer: data };
  }
  async stat(opts?: { bigint?: boolean }) {
    return fstatSync(this.fd, opts);
  }
  async readFile(opts?: string | { encoding?: string | null }) {
    return readFileSync(this.fd, opts);
  }
  async writeFile(data: string | Uint8Array) {
    writeFileSync(this.fd, data);
  }
  async sync() {
    fsyncSync(this.fd);
  }
  async datasync() {
    fsyncSync(this.fd);
  }
  async truncate(len = 0) {
    ftruncateSync(this.fd, len);
  }
  async close() {
    if (fds.has(this.fd)) closeSync(this.fd);
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
}

const wrap =
  <A extends unknown[], R>(fn: (...a: A) => R) =>
  async (...a: A): Promise<R> =>
    fn(...a);

export const promises = {
  open: async (p: PathLike, flags?: string | number, mode?: number) => new FileHandle(openSync(p, flags, mode)),
  stat: wrap(statSync),
  lstat: wrap(lstatSync),
  realpath: wrap(realpathSync),
  mkdir: wrap(mkdirSync),
  mkdtemp: wrap(mkdtempSync),
  readdir: wrap(readdirSync),
  readFile: async (p: PathLike | FileHandle, opts?: string | { encoding?: string | null }) =>
    p instanceof FileHandle ? readFileSync(p.fd, opts) : readFileSync(p, opts),
  writeFile: wrap(writeFileSync),
  unlink: wrap(unlinkSync),
  rm: wrap(rmSync),
  rmdir: wrap(rmdirSync),
  rename: wrap(renameSync),
  cp: wrap(cpSync),
  copyFile: wrap(copyFileSync),
  access: wrap(accessSync),
  constants,
};

export default {
  constants,
  Stats,
  statSync,
  lstatSync,
  existsSync,
  realpathSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  rmSync,
  rmdirSync,
  renameSync,
  cpSync,
  copyFileSync,
  accessSync,
  openSync,
  fstatSync,
  readSync,
  writeSync,
  fsyncSync,
  fdatasyncSync,
  closeSync,
  ftruncateSync,
  write,
  promises,
};
