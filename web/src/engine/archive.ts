// OpenReverse project archive (`<name>.orproj.zip`), format versions 1 to 3.
//
// A plain ZIP file holding one binary and everything OpenReverse keeps for it:
//
//   open-reverse.json     manifest: { format: "open-reverse-project", version,
//                         generator, createdAt, record: BinaryRecord }
//   binary/<record.name>  the binary itself (its SHA-256 must equal record.sha256)
//   debug/<record.debug.name>  (version 3) the binary's companion debug file (dSYM DWARF,
//                         ELF debug file), described by record.debug { name, sha256, size,
//                         kind, addedAt }; written only when the binary has one
//   comments.json         { "<0xaddr>": "text" } user comments
//   bookmarks.json        (version 2) { "<0xaddr>": "description" } bookmarks
//   data.json             (version 2) { "defs": { "<0xaddr>": { "type", "count", "od"? } },
//                         "names": { "<0xaddr>": "name" } }: data definitions and listing
//                         names
//
// Both version 2 entries are optional and written only when there is something to
// write; an archive with neither says version 1, so older readers still open it.
//   project/<path>        the OpenDecomp project directory (cache root) as stored
//                         under /workspace/binaries/<id>/project/: project.sqlite
//                         (analysis cache, annotations such as renames), images/,
//                         artifacts/
//
// Decoding validates everything before anything is written: known entries
// only, no duplicate, absolute, `..`, backslash or control-character paths,
// size limits, the binary hash, the record and the comments.

import type { DebugFileRecord } from './debugfile.ts';
import { DATA_TYPES } from './linear.ts';
import { emptyData, isEmptyData, sanitizeFileName, sha256Hex, type WorkspaceData } from './workspace.ts';

export { sha256Hex };
import { DEFAULT_ZIP_LIMITS, ZipError, zipDecode, zipEncode, type ZipEntry, type ZipLimits } from './zip.ts';

export const ARCHIVE_FORMAT = 'open-reverse-project';
/** The newest version this code reads and writes. */
export const ARCHIVE_VERSION = 3;
export const ARCHIVE_MANIFEST = 'open-reverse.json';
export const ARCHIVE_EXTENSION = '.orproj.zip';

export interface ArchiveRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
  debug?: DebugFileRecord;
}

export interface ProjectArchive {
  record: ArchiveRecord;
  binary: Uint8Array;
  /** The companion debug file (exactly when `record.debug` is set). */
  debug?: Uint8Array;
  comments: Record<string, string>;
  /** Bookmarked addresses and their descriptions (empty when the archive has none). */
  bookmarks?: Record<string, string>;
  /** Data definitions and listing names (empty when the archive has none). */
  data?: WorkspaceData;
  /** Files of the OpenDecomp project directory, keyed by path relative to it. */
  project: Map<string, Uint8Array>;
}

export interface ArchiveManifest {
  format: typeof ARCHIVE_FORMAT;
  version: number;
  generator: string;
  createdAt: string;
  record: ArchiveRecord;
}

export interface ArchiveLimits extends ZipLimits {
  /** Largest archive file accepted. */
  maxArchiveBytes: number;
}

export const DEFAULT_ARCHIVE_LIMITS: ArchiveLimits = {
  ...DEFAULT_ZIP_LIMITS,
  maxArchiveBytes: 2 * 1024 * 1024 * 1024 - 1,
};

export class ArchiveError extends Error {}

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: true });
const MAX_COMMENTS = 1_000_000;
const MAX_COMMENT_CHARS = 65_536;

/**
 * A safe relative path (`a/b/c`): non-empty segments of printable characters,
 * no `.`/`..`, no backslash, colon or leading slash, bounded depth and length.
 * Returns null when unsafe.
 */
export function safeRelativePath(path: string): string | null {
  if (path.length === 0 || path.length > 1024) return null;
  const segments = path.split('/');
  if (segments.length > 32) return null;
  for (const s of segments) {
    if (s === '' || s === '.' || s === '..' || s.length > 255) return null;
    if (/[\\:\x00-\x1f\x7f]/.test(s)) return null;
  }
  return segments.join('/');
}


/** File name to save an archive under. */
export function archiveFileName(record: { name: string }): string {
  return `${record.name}${ARCHIVE_EXTENSION}`;
}

export async function encodeProjectArchive(
  archive: ProjectArchive,
  opts: { createdAt?: Date; signal?: AbortSignal; onEntry?: (index: number, total: number) => void } = {},
): Promise<Uint8Array> {
  const createdAt = opts.createdAt ?? new Date();
  const bookmarks = archive.bookmarks ?? {};
  const hasBookmarks = Object.keys(bookmarks).length > 0;
  const data = archive.data ?? emptyData();
  const hasData = !isEmptyData(data);
  const manifest: ArchiveManifest = {
    format: ARCHIVE_FORMAT,
    // The oldest version that holds everything: older readers reject unknown entries.
    version: archive.record.debug ? 3 : hasBookmarks || hasData ? 2 : 1,
    generator: 'OpenReverse',
    createdAt: createdAt.toISOString(),
    record: archive.record,
  };
  if (!!archive.record.debug !== !!archive.debug) throw new ArchiveError('A debug file record needs its bytes');
  const entries: ZipEntry[] = [
    { path: ARCHIVE_MANIFEST, data: enc.encode(`${JSON.stringify(manifest, null, 2)}\n`) },
    { path: `binary/${archive.record.name}`, data: archive.binary },
    ...(archive.record.debug && archive.debug ? [{ path: `debug/${archive.record.debug.name}`, data: archive.debug }] : []),
    { path: 'comments.json', data: enc.encode(JSON.stringify(archive.comments)) },
    ...(hasBookmarks ? [{ path: 'bookmarks.json', data: enc.encode(JSON.stringify(bookmarks)) }] : []),
  ];
  if (hasData) entries.push({ path: 'data.json', data: enc.encode(JSON.stringify(data)) });
  for (const [rel, data] of [...archive.project].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const safe = safeRelativePath(rel);
    if (safe === null) throw new ArchiveError(`Unsafe project path ${JSON.stringify(rel)}`);
    entries.push({ path: `project/${safe}`, data });
  }
  return zipEncode(entries, {
    date: createdAt,
    ...(opts.signal ? { signal: opts.signal } : {}),
    onEntry: (i) => opts.onEntry?.(i + 1, entries.length),
  });
}

function parseJson(data: Uint8Array, what: string): unknown {
  try {
    return JSON.parse(dec.decode(data));
  } catch {
    throw new ArchiveError(`${what} is not valid JSON`);
  }
}

function validateRecord(value: unknown): ArchiveRecord {
  const r = value as Partial<ArchiveRecord> | null;
  if (!r || typeof r !== 'object') throw new ArchiveError('The manifest has no binary record');
  if (typeof r.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(r.sha256)) throw new ArchiveError('Invalid sha256 in the manifest');
  if (r.id !== r.sha256.slice(0, 16)) throw new ArchiveError('The binary id does not match its sha256');
  if (typeof r.name !== 'string' || r.name === '' || sanitizeFileName(r.name) !== r.name) throw new ArchiveError('Invalid binary name in the manifest');
  if (typeof r.size !== 'number' || !Number.isSafeInteger(r.size) || r.size <= 0) throw new ArchiveError('Invalid binary size in the manifest');
  if (typeof r.addedAt !== 'string' || Number.isNaN(Date.parse(r.addedAt))) throw new ArchiveError('Invalid date in the manifest');
  const debug = r.debug === undefined ? undefined : validateDebugRecord(r.debug);
  return { id: r.id, name: r.name, sha256: r.sha256, size: r.size, addedAt: r.addedAt, ...(debug ? { debug } : {}) };
}

function validateDebugRecord(value: unknown): DebugFileRecord {
  const d = value as Partial<DebugFileRecord> | null;
  if (
    !d ||
    typeof d !== 'object' ||
    typeof d.name !== 'string' ||
    d.name === '' ||
    sanitizeFileName(d.name) !== d.name ||
    typeof d.sha256 !== 'string' ||
    !/^[0-9a-f]{64}$/.test(d.sha256) ||
    typeof d.size !== 'number' ||
    !Number.isSafeInteger(d.size) ||
    d.size <= 0 ||
    !['dsym', 'elf', 'pdb'].includes(d.kind as string) ||
    typeof d.addedAt !== 'string' ||
    Number.isNaN(Date.parse(d.addedAt))
  )
    throw new ArchiveError('Invalid debug file record in the manifest');
  return { name: d.name, sha256: d.sha256, size: d.size, kind: d.kind!, addedAt: d.addedAt };
}

/** comments.json and bookmarks.json: `{ "<0xaddr>": "text" }`. */
function validateAddressTexts(value: unknown, what: 'comment' | 'bookmark'): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ArchiveError(`${what}s.json must be an object`);
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > MAX_COMMENTS) throw new ArchiveError(`Too many ${what}s`);
  const out: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (!/^0x[0-9a-f]{1,16}$/.test(k)) throw new ArchiveError(`Invalid ${what} address ${JSON.stringify(k.slice(0, 40))}`);
    if (typeof v !== 'string' || v.length > MAX_COMMENT_CHARS) throw new ArchiveError(`Invalid ${what} at ${k}`);
    out[k] = v;
  }
  return out;
}

const ADDR_RE = /^0x[0-9a-f]{1,16}$/;

function validateData(value: unknown): WorkspaceData {
  const v = value as Partial<Record<keyof WorkspaceData, unknown>> | null;
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new ArchiveError('data.json must be an object');
  const out = emptyData();
  const defs = v.defs ?? {};
  const names = v.names ?? {};
  if (typeof defs !== 'object' || Array.isArray(defs) || typeof names !== 'object' || Array.isArray(names)) throw new ArchiveError('Invalid data.json');
  if (Object.keys(defs).length + Object.keys(names).length > MAX_COMMENTS) throw new ArchiveError('Too many data definitions');
  for (const [k, d] of Object.entries(defs as Record<string, unknown>)) {
    const def = d as { type?: unknown; count?: unknown; od?: unknown } | null;
    if (
      !ADDR_RE.test(k) ||
      !def ||
      !DATA_TYPES.includes(def.type as never) ||
      typeof def.count !== 'number' ||
      !Number.isSafeInteger(def.count) ||
      def.count < 1 ||
      def.count > 1 << 24 ||
      (def.od !== undefined && typeof def.od !== 'boolean')
    )
      throw new ArchiveError(`Invalid data definition at ${JSON.stringify(k.slice(0, 40))}`);
    out.defs[k] = { type: def.type as WorkspaceData['defs'][string]['type'], count: def.count, ...(def.od ? { od: true } : {}) };
  }
  for (const [k, n] of Object.entries(names as Record<string, unknown>)) {
    if (!ADDR_RE.test(k) || typeof n !== 'string' || !/^[A-Za-z_][A-Za-z0-9_:$.@]{0,1023}$/.test(n))
      throw new ArchiveError(`Invalid name at ${JSON.stringify(k.slice(0, 40))}`);
    out.names[k] = n;
  }
  return out;
}

const SQLITE_MAGIC = enc.encode('SQLite format 3\0');

/** Decodes and validates an archive. Throws ArchiveError describing the first problem. */
export async function decodeProjectArchive(bytes: Uint8Array, limits: ArchiveLimits = DEFAULT_ARCHIVE_LIMITS, signal?: AbortSignal): Promise<ProjectArchive> {
  if (bytes.byteLength > limits.maxArchiveBytes) throw new ArchiveError('The archive is too large');
  let entries: ZipEntry[];
  try {
    entries = await zipDecode(bytes, limits, signal);
  } catch (e) {
    if (e instanceof ZipError) throw new ArchiveError(`Not a valid OpenReverse archive: ${e.message}`);
    throw e;
  }
  const byPath = new Map<string, Uint8Array>();
  for (const e of entries) {
    if (byPath.has(e.path)) throw new ArchiveError(`Duplicate entry ${JSON.stringify(e.path)}`);
    byPath.set(e.path, e.data);
  }
  const manifestBytes = byPath.get(ARCHIVE_MANIFEST);
  if (!manifestBytes) throw new ArchiveError(`Not an OpenReverse project archive (no ${ARCHIVE_MANIFEST})`);
  const manifest = parseJson(manifestBytes, ARCHIVE_MANIFEST) as Partial<ArchiveManifest> | null;
  if (!manifest || manifest.format !== ARCHIVE_FORMAT) throw new ArchiveError('Not an OpenReverse project archive (unknown format)');
  if (typeof manifest.version !== 'number' || !Number.isInteger(manifest.version) || manifest.version < 1)
    throw new ArchiveError('Invalid archive version');
  if (manifest.version > ARCHIVE_VERSION)
    throw new ArchiveError(`This archive has format version ${manifest.version}; this OpenReverse reads versions 1 to ${ARCHIVE_VERSION}. Update OpenReverse.`);
  const record = validateRecord(manifest.record);
  if (record.debug && manifest.version < 3) throw new ArchiveError('A debug file record needs archive version 3');

  const binaryPath = `binary/${record.name}`;
  const debugPath = record.debug ? `debug/${record.debug.name}` : null;
  let debug: Uint8Array | null = null;
  let binary: Uint8Array | null = null;
  let comments: Record<string, string> = {};
  let bookmarks: Record<string, string> = {};
  let workspaceData = emptyData();
  const project = new Map<string, Uint8Array>();
  for (const [path, data] of byPath) {
    if (path === ARCHIVE_MANIFEST) continue;
    if (path === binaryPath) binary = data;
    else if (path === debugPath) debug = data;
    else if (path === 'debug/' && debugPath) continue;
    else if (path === 'comments.json') comments = validateAddressTexts(parseJson(data, 'comments.json'), 'comment');
    else if (path === 'bookmarks.json' && manifest.version >= 2) bookmarks = validateAddressTexts(parseJson(data, 'bookmarks.json'), 'bookmark');
    else if (path === 'data.json' && manifest.version >= 2) workspaceData = validateData(parseJson(data, 'data.json'));
    else if (path === 'project/' || path === 'binary/') continue;
    else if (path.startsWith('project/')) {
      const isDir = path.endsWith('/');
      const rel = safeRelativePath(path.slice('project/'.length, isDir ? -1 : undefined));
      if (rel === null) throw new ArchiveError(`Unsafe path in archive: ${JSON.stringify(path.slice(0, 200))}`);
      if (isDir) continue;
      if (/(^|\/)project\.sqlite$/.test(rel) && (data.length < 16 || SQLITE_MAGIC.some((b, i) => data[i] !== b)))
        throw new ArchiveError(`${path} is not a SQLite database`);
      project.set(rel, data);
    } else throw new ArchiveError(`Unexpected entry in archive: ${JSON.stringify(path.slice(0, 200))}`);
  }
  // A project file and a directory of the same name cannot both exist.
  for (const rel of project.keys()) {
    const parts = rel.split('/');
    for (let i = 1; i < parts.length; i++)
      if (project.has(parts.slice(0, i).join('/'))) throw new ArchiveError(`Conflicting paths in archive: ${rel}`);
  }
  if (!binary) throw new ArchiveError(`The archive has no binary (${binaryPath})`);
  if (binary.byteLength !== record.size) throw new ArchiveError('The binary size does not match the manifest');
  if ((await sha256Hex(binary)) !== record.sha256) throw new ArchiveError('The binary does not match its sha256 (corrupt archive)');
  if (record.debug) {
    if (!debug) throw new ArchiveError(`The archive has no debug file (${debugPath})`);
    if (debug.byteLength !== record.debug.size || (await sha256Hex(debug)) !== record.debug.sha256)
      throw new ArchiveError('The debug file does not match its sha256 (corrupt archive)');
  }
  return { record, binary, ...(debug ? { debug } : {}), comments, bookmarks, data: workspaceData, project };
}
