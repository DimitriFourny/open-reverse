// Typed client for the OpenReverse server API (server/app.ts).

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
  /** The companion debug file stored with the binary. */
  debug?: DebugFileRecord;
}

/** A binary's companion debug file: `dsym` (the DWARF file of a .dSYM), `elf` (separate ELF
 * debug file); `pdb` is recognised but not read yet. */
export interface DebugFileRecord {
  name: string;
  sha256: string;
  size: number;
  kind: 'dsym' | 'elf' | 'pdb';
  addedAt: string;
}

/** What OpenDecomp's debug recovery found (binary_info summary). */
export interface DebugSummary {
  source: 'none' | 'embedded' | 'companion';
  status: 'absent' | 'complete' | 'partial';
  matched_by: 'uuid' | 'build-id' | 'debuglink' | 'guid-age' | null;
  uuid: string | null;
  build_id: string | null;
  /** The matched PDB's identity (a PE image's RSDS record). Absent from older engines. */
  pdb?: { guid: string; age: number } | null;
  companion_sha256: string | null;
  functions: number;
  types: number;
  variables: number;
  lines: number;
  diagnostics: string[];
}

export interface FunctionSummary {
  id: string;
  name: string;
  originalName: string | null;
  /** The linkage name when it is mangled (the name shown is OpenDecomp's demangling, or a rename). */
  mangled: string | null;
  renamed: boolean;
  entry: string;
  size: number;
  boundary: string;
  analysis: string;
  importStub: boolean;
  /** Named by a library signature match: the signature library's id. */
  library: string | null;
}

/** A signature library the Signatures panel lists (see engine/signatures.ts). */
export interface SignatureInfo {
  id: string;
  title: string;
  kind: 'bundled' | 'user';
  architecture: 'x86_64' | 'arm64';
  signatures: number;
  bytes: number;
  source: string;
  contracts: string | null;
}

/** What applying signature libraries did. `edits` put the names back after an undo. */
export interface SignatureApplication {
  revision: number;
  edits: unknown[];
  /** Functions named, per library id. */
  matched: Record<string, number>;
  /** Of those, x86-64 IFUNC PLT entries named after their resolver. */
  stubs: number;
  /** Bodies left unnamed because several names fit ("one of N"). */
  ambiguous: { entry: string; candidates: string[] }[];
  /** Functions without a name before the application. */
  unnamed: number;
  ms: number;
}

export interface Discovery {
  state: 'idle' | 'running' | 'done' | 'failed';
  message: string | null;
}

export interface ImageInfo {
  record: BinaryRecord;
  image: {
    id: string;
    sha256: string;
    byte_length: string;
    image_base: string | null;
    target: { format: string; architecture: string; abi: string; endian: string; address_bits: number };
    entry_points: { value: string }[];
    capabilities: { layer: string; feature: string; status: string; limitations: string[] }[];
    debug?: DebugSummary;
  };
  revision: number;
  projectPath: string;
  functionCount: number;
  functionIndex: string;
  discovery: Discovery;
  /** Decompile workers this binary was opened with (1 = in the engine thread). */
  threads?: number;
}

export interface OperandRef {
  text: string;
  addr: string;
  kind: 'function' | 'string' | 'code' | 'data';
  label: string;
}

export interface Instruction {
  addr: string;
  size: number;
  bytes: string;
  mnemonic: string;
  operands: string;
  valid: boolean;
  flow: { kind: string; targets: string[]; conditional: boolean };
  refs: OperandRef[];
  /** Addresses computed beyond the operand text (ADRP+ADD/LDR pairs, GOT/import slots, RIP-relative loads). */
  resolved?: ResolvedTarget[];
}

export interface ResolvedTarget {
  /** Empty for an import known only by name (a call through a stub). */
  addr: string;
  kind: 'function' | 'string' | 'import' | 'data' | 'code';
  label: string;
  /** How the instruction uses it: address, read, write, call, branch... */
  access: string;
}

export interface Block {
  id: string;
  start: string;
  insns: string[];
  edges: { to: string | null; target: string | null; kind: string; conditional: boolean }[];
}

export interface Listing {
  function: FunctionSummary;
  instructions: Instruction[];
  blocks: Block[];
  comments: Record<string, string>;
}

export interface Mapping {
  start: number;
  end: number;
  addrs: string[];
}

export interface Decompilation {
  function: FunctionSummary;
  text: string;
  language: string;
  state: string;
  cache: string;
  diagnostics: { severity: string; code: string; message: string }[];
  declarationSpan: { start: number; end: number } | null;
  mappings: Mapping[];
  /** Parameters and locals the text declares, with the value subject a rename annotates. */
  variables: Variable[];
  /** Globals the C-like text declares (its `extern` lines), with their addresses. */
  globals: GlobalRef[];
}

export interface Variable {
  name: string;
  id: string;
  parameter: boolean;
  /** Its C type as the text declares it; null in python-like. */
  type: string | null;
}

export interface GlobalRef {
  name: string;
  addr: string;
  type: string;
}

/** Offsets and sizes of a structure's fields, laid out by OpenDecomp's C declaration parser. */
export type StructLayout =
  | { union: boolean; size: number | null; alignment: number | null; fields: { name: string; offset: number; size: number | null }[] }
  | { errors: string[] };

/** One declaration of the image's type library (OpenDecomp `types_declare`). */
export interface LibraryType {
  /** Null for the anonymous helper types (builtins, pointers) declarations need. */
  name: string | null;
  typeId: string;
  annotationId: string;
  status: string;
  declaration: string;
}

export interface TypesInfo {
  /** Merged recovered structure types, as C. */
  text: string;
  state: string;
  libraryId: string | null;
  library: LibraryType[];
}

export interface Xref {
  from: string | null;
  to: string | null;
  fromFunction: { id: string; name: string; entry: string } | null;
  /** The function the reference goes to (its entry, or the entity it names). */
  toFunction: { id: string; name: string; entry: string } | null;
  toName: string | null;
  kind: string;
  status: string;
  role: string;
}

export type XrefDirection = 'incoming' | 'outgoing';

/** A caller or callee: a function (id set), or an import known only by name. */
export interface CallNode {
  id: string | null;
  name: string;
  entry: string | null;
  sites: number;
}

/** This app's annotations on one function, as stored (opaque to the UI; undo restores them). */
export type AnnotationSnapshot = { id: string; value: unknown; status: string }[];

export interface StringItem {
  addr: string;
  text: string;
  encoding: string;
  id: string;
}

export interface SymbolItem {
  id: string;
  name: string;
  /** The linkage name when the name shown is a demangling. */
  mangled: string | null;
  kind: string;
  addr: string | null;
  size: number;
  binding: string | null;
}

export interface Section {
  id: string;
  name: string;
  kind: string;
  start: string | null;
  size: number;
  fileOffset: string | null;
  fileSize: number;
  permissions: string[];
  /** Holds code (Mach-O: by its section flags, not its segment's permissions). */
  exec: boolean;
}

export interface MemoryChunk {
  addr: string;
  length: number;
  segments: { kind: string; start: string; size: number; hex: string | null }[];
}

export interface DecompileOptions {
  language: 'c-like' | 'python-like';
  inference: 'proven' | 'likely';
  view: 'source' | 'checked';
}

// ------------------------------------------------------------ engine RPC
// Everything runs in a Web Worker in this tab (engine/worker.ts): OpenDecomp,
// SQLite and the projects in IndexedDB. Nothing is sent to a server.

import type { RpcResponse } from './engine/engine-worker.ts';
import type { TaskProgress } from './engine/tasks.ts';
import type { NavMap, SearchHit, SearchQuery, SearchResult } from './engine/search.ts';
import type { DataDef, DataType, LinearRow, LinearWindow } from './engine/linear.ts';
import type { DataAction } from './engine/session.ts';
import type { EngineMemory } from './engine/memory.ts';
import type { AlignedRow, DiffFunction, DiffResult, DiffRow, Line } from './engine/bindiff.ts';

export type { AlignedRow, DiffFunction, DiffResult, DiffRow, Line };
export type { DataAction, DataDef, DataType, LinearRow, LinearWindow, NavMap, SearchHit, SearchQuery, SearchResult, TaskProgress };

type Pending = { resolve: (v: unknown) => void; reject: (e: Error) => void; onProgress?: (p: TaskProgress) => void };
let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, Pending>();
let readyState: { resolve: () => void; reject: (e: Error) => void; promise: Promise<void> } | null = null;

function boot(): Worker {
  if (worker) return worker;
  let resolve!: () => void;
  let reject!: (e: Error) => void;
  const promise = new Promise<void>((a, b) => {
    resolve = a;
    reject = b;
  });
  readyState = { resolve, reject, promise };
  worker = new Worker(new URL('./engine/worker.ts', import.meta.url), { type: 'module', name: 'open-reverse-engine' });
  worker.onmessage = (event: MessageEvent<RpcResponse>) => {
    const msg = event.data;
    if ('event' in msg) {
      if (msg.event === 'progress') pending.get(msg.id)?.onProgress?.(msg.progress);
      else if (msg.event === 'ready') readyState?.resolve();
      else if (msg.event === 'log') console[msg.level](`[engine] ${msg.text}`);
      else if (msg.event === 'storage-error') {
        console.warn(`[engine] ${msg.text}`);
        dispatchEvent(new CustomEvent('open-reverse:storage-error', { detail: msg.text }));
      }
      else readyState?.reject(new Error(msg.error));
      return;
    }
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.ok) p.resolve(msg.value);
    else p.reject(new Error(msg.error));
  };
  worker.onerror = (e) => {
    const err = new Error(`Analysis engine crashed: ${e.message || 'unknown error'}`);
    readyState?.reject(err);
    for (const p of pending.values()) p.reject(err);
    pending.clear();
  };
  return worker;
}

/** Resolves once the engine (WASM, SQLite, workspace) is initialized. */
export function engineReady(): Promise<void> {
  boot();
  return readyState!.promise;
}

/** Ask the engine to persist pending changes now (e.g. before the page is hidden). */
export function flushEngine(): void {
  if (worker) void call('flush', []).catch(() => undefined);
}

/**
 * `settle`: on abort, reject only once the engine has stopped the call. A cancelled export
 * restarts the project's owner in OpenDecomp; the next task must not start before that ends.
 */
function call<T>(
  method: string,
  args: unknown[],
  signal?: AbortSignal,
  transfer: Transferable[] = [],
  onProgress?: (p: TaskProgress) => void,
  settle = false,
): Promise<T> {
  const w = boot();
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    const aborted = () => reject(new DOMException('Aborted', 'AbortError'));
    if (signal?.aborted) return aborted();
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, ...(onProgress ? { onProgress } : {}) });
    signal?.addEventListener(
      'abort',
      () => {
        w.postMessage({ cancel: id });
        if (settle && pending.has(id)) pending.set(id, { resolve: aborted, reject: aborted });
        else {
          pending.delete(id);
          aborted();
        }
      },
      { once: true },
    );
    w.postMessage({ id, method, args }, transfer);
  });
}

export const api = {
  setThreads: (n: number) => call<{ threads: number }>('setThreads', [n]),
  /** Bytes the engine worker holds (SQLite heap, in-memory files, JS heap where reported). */
  engineMemory: () => call<EngineMemory>('engineMemory', []),
  binaries: () => call<{ binaries: BinaryRecord[]; open: string[] }>('binaries', []),
  upload: async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return call<BinaryRecord>('upload', [file.name, bytes], undefined, [bytes.buffer]);
  },
  remove: (bid: string) => call<{ ok: true }>('remove', [bid]),
  /** Add or replace the binary's debug file (dSYM DWARF file or zipped .dSYM, ELF debug file).
   * Rejects with OpenDecomp's reason when it does not match the binary. */
  addDebugFile: async (bid: string, file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return call<{ record: BinaryRecord }>('addDebugFile', [bid, file.name, bytes], undefined, [bytes.buffer]);
  },
  removeDebugFile: (bid: string) => call<{ record: BinaryRecord }>('removeDebugFile', [bid]),
  close: (bid: string) => call<{ ok: true }>('close', [bid]),
  download: (bid: string) => call<{ name: string; bytes: Uint8Array }>('download', [bid]),
  info: (bid: string) => call<ImageInfo>('info', [bid]),
  functions: (bid: string) =>
    call<{ revision: number; indexState: string; discovery: Discovery; functions: FunctionSummary[] }>('functions', [bid]),
  functionAt: (bid: string, addr: string) => call<{ function: FunctionSummary | null }>('functionAt', [bid, addr]),
  /** Source file and line of an address from the binary's debug line table (null without one). */
  sourceLine: (bid: string, addr: string) => call<{ source: { file: string; line: number; column: number | null } | null }>('sourceLine', [bid, addr]),
  listing: (bid: string, fid: string) => call<Listing>('listing', [bid, fid]),
  /** Rows of the whole-image listing: up to `before` rows before `addr` and `after` from it. */
  /** `quick`: stop at neighbouring functions not listed yet (a first paint; extensions fetch the rest). */
  linear: (bid: string, addr: string, before: number, after: number, quick = false) =>
    call<LinearWindow>('linear', [bid, addr, before, after, quick]),
  dataAt: (bid: string, addr: string) => call<{ start: string; def: DataDef | null; type: DataType; maxCount: number }>('dataAt', [bid, addr]),
  defineData: (bid: string, addr: string, action: DataAction, count?: number) =>
    call<{
      revision: number;
      start: string;
      def: DataDef | null;
      note: string | null;
      /** The definitions it replaced, and the range an undo restores. */
      replaced: Record<string, DataDef>;
      range: { start: string; end: string };
    }>('defineData', [bid, addr, action, count]),
  restoreData: (bid: string, start: string, end: string, defs: Record<string, DataDef>) =>
    call<{ revision: number; note: string | null }>('restoreData', [bid, start, end, defs]),
  decompile: (bid: string, fid: string, o: DecompileOptions, signal?: AbortSignal) => call<Decompilation>('decompile', [bid, fid, o], signal),
  xrefs: (bid: string, target: { id?: string; addr?: string }, direction: XrefDirection = 'incoming') => call<{ xrefs: Xref[] }>('xrefs', [bid, target, direction]),
  calls: (bid: string, fid: string) => call<{ callers: CallNode[]; callees: CallNode[] }>('calls', [bid, fid]),
  strings: (bid: string) => call<{ strings: StringItem[] }>('strings', [bid]),
  symbols: (bid: string) => call<{ symbols: SymbolItem[] }>('symbols', [bid]),
  sections: (bid: string) => call<{ sections: Section[] }>('sections', [bid]),
  types: (bid: string) => call<TypesInfo>('types', [bid]),
  memory: (bid: string, addr: string, length: number) => call<MemoryChunk>('memory', [bid, addr, length]),
  /** Binary-wide search; hits also arrive in batches as progress `items` while it runs. */
  search: (bid: string, query: SearchQuery, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<SearchResult>('search', [bid, query], signal, [], onProgress),
  navMap: (bid: string) => call<NavMap>('navMap', [bid]),
  /** Diff two stored binaries' functions (a background task: signatures of each, then matching). */
  diff: (bidA: string, bidB: string, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<DiffResult>('diff', [bidA, bidB], signal, [], onProgress),
  /** Two functions of the last diff, aligned line by line (null: a function only one side has). */
  diffFunction: (bidA: string, fidA: string | null, bidB: string, fidB: string | null) =>
    call<{ a: Line[]; b: Line[]; rows: AlignedRow[] }>('diffFunction', [bidA, fidA, bidB, fidB]),
  // ------------------------------------------------- library signatures
  /** Bundled (from `base`, the site's signatures/ URL) and user signature libraries; with a binary, the ones it suggests. */
  signatureLibraries: (base: string, bid?: string) =>
    call<{ libraries: SignatureInfo[]; suggested: Record<string, string> }>('signatureLibraries', [base, bid]),
  applySignatures: (bid: string, ids: string[]) => call<SignatureApplication>('applySignatures', [bid, ids]),
  removeSignatureMatches: (bid: string, annotationIds: string[]) => call<{ revision: number }>('removeSignatureMatches', [bid, annotationIds]),
  restoreSignatureMatches: (bid: string, edits: unknown[]) => call<{ revision: number }>('restoreSignatureMatches', [bid, edits]),
  /** A user library from the binary's named functions (a background task). */
  makeSignatures: (bid: string, title: string, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<{ library: SignatureInfo; stats: { bodies: number; signatures: number; shared: number; skipped: number } }>('makeSignatures', [bid, title], signal, [], onProgress),
  /** A user library from dropped static libraries / objects (ELF x86-64 .a / .o). */
  makeObjectSignatures: async (title: string, files: File[]) => {
    const list = await Promise.all(files.map(async (f) => ({ name: f.name, bytes: new Uint8Array(await f.arrayBuffer()) })));
    return call<{ library: SignatureInfo; stats: { bodies: number; signatures: number; shared: number; skipped: number } }>(
      'makeObjectSignatures', [title, list], undefined, list.map((f) => f.bytes.buffer));
  },
  deleteSignatures: (id: string) => call<{ ok: true }>('deleteSignatures', [id]),
  exportSignatures: (id: string) => call<{ name: string; bytes: Uint8Array }>('exportSignatures', [id]),
  comments: (bid: string) => call<{ comments: Record<string, string> }>('comments', [bid]),
  rename: (bid: string, target: { id?: string; addr?: string }, name: string) => call<{ revision: number; note: string | null }>('rename', [bid, target, name]),
  /** `annotations`: the library annotation of each declared name. */
  declareTypes: (bid: string, source: string) =>
    call<{ revision: number; declared: string[]; annotations: Record<string, string> }>('declareTypes', [bid, source]),
  removeLibraryTypes: (bid: string, annotationIds: string[]) => call<{ revision: number }>('removeLibraryTypes', [bid, annotationIds]),
  annotationSnapshot: (bid: string, fid: string) => call<{ snapshot: AnnotationSnapshot }>('annotationSnapshot', [bid, fid]),
  restoreAnnotations: (bid: string, fid: string, snapshot: AnnotationSnapshot) => call<{ revision: number }>('restoreAnnotations', [bid, fid, snapshot]),
  prototype: (bid: string, fid: string) => call<{ text: string; declared: boolean }>('prototype', [bid, fid]),
  setSignature: (bid: string, fid: string, text: string) => call<{ revision: number; confirmed: boolean }>('setSignature', [bid, fid, text]),
  renameVariable: (bid: string, fid: string, valueId: string, name: string, o: DecompileOptions) =>
    call<{ revision: number }>('renameVariable', [bid, fid, valueId, name, o]),
  setVariableType: (bid: string, fid: string, valueId: string, text: string, o: DecompileOptions) =>
    call<{ revision: number; shown: string | null }>('setVariableType', [bid, fid, valueId, text, o]),
  setGlobalType: (bid: string, addr: string, text: string) => call<{ revision: number }>('setGlobalType', [bid, addr, text]),
  /** The C declaration of a new structure with the members OpenDecomp recovered behind a pointer variable. */
  structFromVariable: (bid: string, fid: string, variable: string, name: string, o: DecompileOptions) =>
    call<{ declaration: string; recovered: string }>('structFromVariable', [bid, fid, variable, name, o]),
  layoutStructure: (bid: string, source: string, name: string, library: string[]) => call<StructLayout>('layoutStructure', [bid, source, name, library]),
  comment: (bid: string, addr: string, text: string) => call<{ comments: Record<string, string> }>('comment', [bid, addr, text]),
  bookmarks: (bid: string) => call<{ bookmarks: Record<string, string> }>('bookmarks', [bid]),
  /** Bookmark an address (empty description is fine); null removes the bookmark. */
  bookmark: (bid: string, addr: string, description: string | null) => call<{ bookmarks: Record<string, string> }>('bookmark', [bid, addr, description]),

  // ------------------------------------------------- data in / out, storage
  /** A project archive (.orproj.zip) of a binary: the binary, its OpenDecomp project, comments, bookmarks. */
  exportArchive: (bid: string, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<{ name: string; bytes: Uint8Array }>('exportArchive', [bid], signal, [], onProgress, true),
  /** Restore an archive. A binary that already exists is a `conflict` unless `replace`. */
  importArchive: async (file: File, opts: { replace?: boolean } = {}, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return call<ImportResult>('importArchive', [bytes, opts], signal, [bytes.buffer], onProgress, true);
  },
  /** A zip of every function's pseudocode plus types.h and indexes (OpenDecomp `export` layout). */
  exportPseudocode: (bid: string, o: Pick<DecompileOptions, 'language' | 'inference'>, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<{ name: string; bytes: Uint8Array; summary: PseudocodeExportSummary }>('exportPseudocode', [bid, o], signal, [], onProgress, true),
  /** Bytes stored per binary (IndexedDB), split into binary, project and metadata. */
  storage: () => call<{ binaries: BinaryUsage[] }>('storage', []),
  /** Delete a binary's OpenDecomp project (analysis cache and annotations); keeps the binary and comments. */
  resetProject: (bid: string) => call<{ ok: true }>('resetProject', [bid]),
};

export interface BinaryUsage {
  id: string;
  binary: number;
  project: number;
  meta: number;
  total: number;
}

export type ImportResult =
  | { status: 'imported'; record: BinaryRecord; replaced: boolean }
  | { status: 'conflict'; record: BinaryRecord; existing: BinaryRecord };

export interface PseudocodeExportSummary {
  functions: number;
  complete: number;
  partial: number;
  failed: number;
  files: number;
}
