// Typed client for the OpenReverse server API (server/app.ts).

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
}

export interface FunctionSummary {
  id: string;
  name: string;
  originalName: string | null;
  renamed: boolean;
  entry: string;
  size: number;
  boundary: string;
  analysis: string;
  importStub: boolean;
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
}

export interface Variable {
  name: string;
  id: string;
  parameter: boolean;
}

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

export type { TaskProgress };

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

function call<T>(method: string, args: unknown[], signal?: AbortSignal, transfer: Transferable[] = [], onProgress?: (p: TaskProgress) => void): Promise<T> {
  const w = boot();
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, ...(onProgress ? { onProgress } : {}) });
    signal?.addEventListener(
      'abort',
      () => {
        w.postMessage({ cancel: id });
        pending.delete(id);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
    w.postMessage({ id, method, args }, transfer);
  });
}

export const api = {
  setThreads: (n: number) => call<{ threads: number }>('setThreads', [n]),
  binaries: () => call<{ binaries: BinaryRecord[]; open: string[] }>('binaries', []),
  upload: async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return call<BinaryRecord>('upload', [file.name, bytes], undefined, [bytes.buffer]);
  },
  remove: (bid: string) => call<{ ok: true }>('remove', [bid]),
  close: (bid: string) => call<{ ok: true }>('close', [bid]),
  download: (bid: string) => call<{ name: string; bytes: Uint8Array }>('download', [bid]),
  info: (bid: string) => call<ImageInfo>('info', [bid]),
  functions: (bid: string) =>
    call<{ revision: number; indexState: string; discovery: Discovery; functions: FunctionSummary[] }>('functions', [bid]),
  functionAt: (bid: string, addr: string) => call<{ function: FunctionSummary | null }>('functionAt', [bid, addr]),
  listing: (bid: string, fid: string) => call<Listing>('listing', [bid, fid]),
  decompile: (bid: string, fid: string, o: DecompileOptions, signal?: AbortSignal) => call<Decompilation>('decompile', [bid, fid, o], signal),
  xrefs: (bid: string, target: { id?: string; addr?: string }, direction: XrefDirection = 'incoming') => call<{ xrefs: Xref[] }>('xrefs', [bid, target, direction]),
  calls: (bid: string, fid: string) => call<{ callers: CallNode[]; callees: CallNode[] }>('calls', [bid, fid]),
  strings: (bid: string) => call<{ strings: StringItem[] }>('strings', [bid]),
  symbols: (bid: string) => call<{ symbols: SymbolItem[] }>('symbols', [bid]),
  sections: (bid: string) => call<{ sections: Section[] }>('sections', [bid]),
  types: (bid: string) => call<TypesInfo>('types', [bid]),
  memory: (bid: string, addr: string, length: number) => call<MemoryChunk>('memory', [bid, addr, length]),
  comments: (bid: string) => call<{ comments: Record<string, string> }>('comments', [bid]),
  rename: (bid: string, target: { id?: string; addr?: string }, name: string) => call<{ revision: number }>('rename', [bid, target, name]),
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
  comment: (bid: string, addr: string, text: string) => call<{ comments: Record<string, string> }>('comment', [bid, addr, text]),
  bookmarks: (bid: string) => call<{ bookmarks: Record<string, string> }>('bookmarks', [bid]),
  /** Bookmark an address (empty description is fine); null removes the bookmark. */
  bookmark: (bid: string, addr: string, description: string | null) => call<{ bookmarks: Record<string, string> }>('bookmark', [bid, addr, description]),

  // ------------------------------------------------- data in / out, storage
  /** A project archive (.orproj.zip) of a binary: the binary, its OpenDecomp project, comments, bookmarks. */
  exportArchive: (bid: string, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<{ name: string; bytes: Uint8Array }>('exportArchive', [bid], signal, [], onProgress),
  /** Restore an archive. A binary that already exists is a `conflict` unless `replace`. */
  importArchive: async (file: File, opts: { replace?: boolean } = {}, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return call<ImportResult>('importArchive', [bytes, opts], signal, [bytes.buffer], onProgress);
  },
  /** A zip of every function's pseudocode plus types.h and indexes (OpenDecomp `export` layout). */
  exportPseudocode: (bid: string, o: Pick<DecompileOptions, 'language' | 'inference'>, onProgress?: (p: TaskProgress) => void, signal?: AbortSignal) =>
    call<{ name: string; bytes: Uint8Array; summary: PseudocodeExportSummary }>('exportPseudocode', [bid, o], signal, [], onProgress),
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
