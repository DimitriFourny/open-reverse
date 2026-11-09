// One open binary: an OpenDecomp BinarySession plus the caches and
// presentation logic the UI needs.

import { openBinary, type BinarySession, type ToolInput, type ToolResult } from '@od/api/index.js';
import type { QueryService } from '@od/service/queries/index.js';
import { entityIdentity, typeLibraryIdentity, userTypeIdentity } from '@od/core/identity.js';
import { encodeTypeDefinition } from '@od/core/serialization.js';
import { parseCDeclarations } from '@od/metadata/c-declarations/index.js';
import { MachOLoader } from '@od/loaders/macho/index.js';
import { recoverRuntimeMetadata } from '@od/metadata/runtime/index.js';
import { recoverDebugInfo } from '@od/metadata/debug/index.js';
import type { DebugLine } from '@od/metadata/dwarf/model.js';
import { elfLoader } from '@od/loaders/elf/index.js';
import { ImmutableBytes } from '@od/core/addresses.js';
import { createOperationContext } from '@od/core/operation.js';
import { demangleName } from '@od/metadata/symbols/index.js';
import { canon, operandConstants } from './hex.ts';
import {
  buildLayout,
  cStringLength,
  DATA_TYPES,
  defSize,
  elementSize,
  itemAt,
  LinearListing,
  quoteC,
  sectionIndex,
  type DataDef,
  type DataRef,
  type DataType,
  type Instruction,
  type LayoutItem,
  type LayoutSection,
} from './linear.ts';
import { compilePrototype, compileType, PrototypeError, type TypeDefinition, type TypeIds } from './prototype.ts';
import { declaredMembers, normalizeType, recoveredDeclaration, structLayout } from './structs.ts';
import { createHash } from './shims/crypto.ts';
import { objcComment, objcItems, objcLabel, objcMessage, objcRelabels, type ObjCItem } from './objc.ts';
import { vfs } from './vfs.ts';
import { buildNavMap, runSearch, SearchError, type NavKind, type NavMap, type Region, type SearchQuery, type SearchResult } from './search.ts';
import type { TaskContext } from './tasks.ts';
import { functionSignature, type FunctionSig } from './bindiff.ts';
import type { BinaryRecord, Workspace } from './workspace.ts';
import { matchSignatures, type MatchTarget, type SignatureLibrary, type SignatureSource } from '@od/metadata/library-signatures/index.js';
import { linkedSource } from './signatures.ts';
import { SUPPORTED_DEBUG_KINDS } from './debugfile.ts';

/** The largest budget OpenDecomp accepts: discovery of a real binary needs it. */
const DISCOVERY_BUDGET = {
  instructions: 1_000_000,
  blocks: 100_000,
  ir_nodes: 10_000_000,
  work: 100_000_000,
  deadline_ms: 300_000,
} as const;
const MAX_LIST_ITEMS = 200_000;

function hexBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length >> 1);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function cmpBig(a: string, b: string): number {
  const x = BigInt(a);
  const y = BigInt(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type AnyResult = { state: string; data?: unknown; error?: { message?: string }; diagnostics?: { message: string; severity: string }[] };

/** The data of a result envelope, or an ApiError carrying its diagnostic. */
type DataOf<R> = R extends { data: infer D } ? NonNullable<D> : never;
function need<R>(envelope: R): DataOf<R> {
  const result = envelope as AnyResult;
  if (result.data !== undefined && result.data !== null) return result.data as DataOf<R>;
  const message =
    result.error?.message ??
    result.diagnostics?.find((d) => d.severity === 'error')?.message ??
    `OpenDecomp request ${result.state}`;
  throw new ApiError(result.state === 'unsupported' ? 422 : 500, message);
}

export interface FunctionSummary {
  id: string;
  name: string;
  originalName: string | null;
  /** The original (linkage) name when it is a mangled name OpenDecomp demangles for display. */
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

export type { Instruction };

export interface Block {
  id: string;
  start: string;
  insns: string[];
  edges: { to: string | null; target: string | null; kind: string; conditional: boolean }[];
}

interface ListingCore {
  function: FunctionSummary;
  instructions: Instruction[];
  blocks: Block[];
  gaps: unknown[];
}

interface Mapping {
  va: bigint;
  memSize: bigint;
  fileOffset: bigint;
  fileSize: bigint;
  perms: string[];
}

export interface DiscoveryStatus {
  state: 'idle' | 'running' | 'done' | 'failed';
  message: string | null;
}

/** Serializes the operations that advance the project revision. */
class Mutex {
  #tail: Promise<unknown> = Promise.resolve();
  run<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.#tail.then(fn, fn);
    this.#tail = next.catch(() => undefined);
    return next;
  }
}

export interface LibraryType {
  /** The C name; null for the anonymous helper types (builtins, pointers) a declaration needs. */
  name: string | null;
  typeId: string;
  annotationId: string;
  status: string;
  declaration: string;
}

/** A parameter or local the pseudocode declares, and the value subject OpenDecomp names it by. */
export interface Variable {
  name: string;
  id: string;
  parameter: boolean;
  /** Its C type as declared in the text (`struct_47fdf8 *`, `uint8_t[16]`); null in python-like. */
  type: string | null;
}

/** A global the C-like text declares: `extern struct Args args;` followed by a VA comment. */
export interface GlobalRef {
  name: string;
  addr: string;
  type: string;
}

/** Globals declared by the `extern` lines of C-like pseudocode, which state their VA. */
function declaredGlobals(text: string): GlobalRef[] {
  const out: GlobalRef[] = [];
  for (const m of text.matchAll(/^extern (.+?) ?\b([A-Za-z_][A-Za-z0-9_]*)((?:\[[^\]]*\])*); \/\* VA (0x[0-9a-f]+)\b/gm))
    out.push({ name: m[2]!, addr: canon(m[4]!), type: normalizeType(m[1]!) + m[3]! });
  return out;
}

/** The C type of a declaration (`uint8_t buf[16];` declares `uint8_t[16]`). */
function declaredType(text: string, name: string): string | null {
  const m = new RegExp(`^(.*?)\\b${name}\\s*((?:\\[[^\\]]*\\])*)\\s*;?$`).exec(text.trim());
  return m && m[1]!.trim() ? normalizeType(m[1]!) + m[2]!.replace(/\s+/g, '') : null;
}

const C_STATEMENT = /^(?:return|goto|break|continue|case|default|if|else|while|do|for|switch)\b/;

/** The identifier a pseudocode declaration (`uint32_t count;`, `const char* s`, `count: uint32_t`) declares. */
function declaredName(text: string, language: string): string | null {
  const t = text.trim();
  if (language.startsWith('python')) return /^([A-Za-z_][A-Za-z0-9_]*): [^=():]+$/.exec(t)?.[1] ?? null;
  if (C_STATEMENT.test(t)) return null;
  return /^(?:[A-Za-z_][A-Za-z0-9_]*[\s*]+)+([A-Za-z_][A-Za-z0-9_]*)(?:\[[^\]]*\])?;?$/.exec(t)?.[1] ?? null;
}

function errorMessages(result: unknown): string {
  const r = result as AnyResult;
  const errors = (r.diagnostics ?? []).filter((d) => d.severity === 'error').map((d) => d.message);
  return [...new Set(errors.length ? errors : [r.error?.message ?? `OpenDecomp request ${r.state}`])].join('\n');
}

const AUTHOR = 'open-reverse';
const NAME_RE = /^[A-Za-z_][A-Za-z0-9_:$.@]*$/;
const NAME_ERROR = 'Names must be identifiers (letters, digits, _ : $ . @)';

/** Reference target names: imports by entity id and by slot, symbols by address. */
interface Names {
  byEntity: Map<string, string>;
  byAddr: Map<string, string>;
  /** Symbols (not imports) by address. */
  symbols: Map<string, string>;
  /** Import slots by address. */
  slots: Map<string, string>;
}

/** What D, A, O, * and U do at an address. */
export type DataAction = 'cycle' | 'string' | 'ptr' | 'array' | 'undefine';

type Definition = Parameters<typeof encodeTypeDefinition>[0];
type DecompileOptions = { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' };

type StoredAnnotation = { id: string; entity_id: string; status: string; value: { kind: string } };
/** Annotations on one function, in the wire form `annotations_apply` takes back. */
export type AnnotationSnapshot = { id: string; value: unknown; status: string }[];

/**
 * Shared/exclusive gate. Decompiles run concurrently in request workers (shared); an
 * image-wide analysis in the project owner (binary_info `types`) publishes the same
 * per-function analyses, so it runs exclusively: two producers of one cache key would
 * collide in OpenDecomp's store.
 */
export class Gate {
  #shared = 0;
  #exclusive: Promise<void> | null = null;
  #drained: (() => void) | null = null;

  async shared<T>(fn: () => Promise<T>): Promise<T> {
    while (this.#exclusive) await this.#exclusive;
    this.#shared++;
    try {
      return await fn();
    } finally {
      if (--this.#shared === 0) this.#drained?.();
    }
  }

  async exclusive<T>(fn: () => Promise<T>): Promise<T> {
    while (this.#exclusive) await this.#exclusive;
    let release!: () => void;
    this.#exclusive = new Promise<void>((r) => (release = r));
    try {
      if (this.#shared > 0) await new Promise<void>((r) => (this.#drained = r));
      this.#drained = null;
      return await fn();
    } finally {
      this.#exclusive = null;
      release();
    }
  }
}

/** The revision part of a decompile cache key (`fid|revision|language|inference|view`). */
function k_rev(key: string): number {
  return Number(key.split('|')[1]);
}

function annotationId(key: string): string {
  return `annotation_${createHash('sha256').update(key).digest('hex')}`;
}

/** One caller or callee in the call tree: a function (id set) or an import known only by name. */
export interface CallNode {
  id: string | null;
  name: string;
  entry: string | null;
  /** Call sites: in the caller (callers) or in this function (callees). */
  sites: number;
}

type BriefFunction = { id: string; name: string; entry: string } | null;

/** Orders references by source address, those without one last. */
function compareFrom(a: string | null, b: string | null): number {
  if (a === null || b === null) return a === b ? 0 : a === null ? 1 : -1;
  const x = BigInt(a), y = BigInt(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

/** Groups established call references by the function at their other end, in first-site order. */
function callNodes<X extends { kind: string; status: string; from: string | null }>(
  refs: X[],
  fnOf: (x: X) => BriefFunction,
  nameOf: ((x: X) => string | null) | null,
): CallNode[] {
  const out = new Map<string, CallNode & { first: bigint }>();
  for (const x of refs) {
    if (x.kind !== 'call' || x.status !== 'established') continue;
    const f = fnOf(x);
    const name = f?.name ?? nameOf?.(x) ?? null;
    if (!name) continue;
    const key = f?.id ?? `name:${name}`;
    const site = x.from ? BigInt(x.from) : 0n;
    const node = out.get(key);
    if (node) {
      node.sites++;
      if (site < node.first) node.first = site;
    } else out.set(key, { id: f?.id ?? null, name, entry: f?.entry ?? null, sites: 1, first: site });
  }
  return [...out.values()].sort((a, b) => (a.first < b.first ? -1 : a.first > b.first ? 1 : 0)).map(({ first: _, ...n }) => n);
}

export class AnalysisSession {
  readonly record: BinaryRecord;
  readonly binary: BinarySession;
  /** Parallel decompile workers this session was opened with. */
  threads = 1;
  readonly gate = new Gate();
  readonly #workspace: Workspace;
  readonly #writes = new Mutex();
  readonly #dataOps = new Mutex();
  discovery: DiscoveryStatus = { state: 'idle', message: null };
  #functions: {
    revision: number;
    list: FunctionSummary[];
    byId: Map<string, FunctionSummary>;
    byEntry: Map<string, FunctionSummary>;
    /** Address ranges of each function, [start, end). */
    ranges: Map<string, [bigint, bigint][]>;
    indexState: string;
  } | null = null;
  #strings: Promise<Map<string, { text: string; encoding: string; id: string; length: number; terminated: boolean }>> | null = null;
  #relocations: Promise<{ addr: bigint; width: number; target: bigint | null; symbol: string | null }[]> | null = null;
  /** Function listings (without comments) at one revision. */
  #listings: { revision: number; map: Map<string, Promise<ListingCore>>; ready: Set<string> } | null = null;
  /** 4 KiB pages of image memory (zero where unmapped). The image never changes. */
  readonly #pages = new Map<bigint, Promise<Uint8Array>>();
  /** Bumped when data definitions or listing names change outside the revision. */
  #dataVersion = 0;
  #linear: { key: string; value: Promise<LinearListing> } | null = null;
  /** The image's sections never change. */
  #sectionsOnce: Promise<LayoutSection[]> | null = null;
  #mappings: Promise<Mapping[]> | null = null;
  /** Names for reference targets at one revision: imports by entity id and by slot, symbols by address. */
  #names: { revision: number; value: Promise<Names> } | null = null;
  /** Type library IDs by C name (and `Name*` for its pointer type), including typedef aliases. */
  readonly #typeNames = new Map<string, string>();
  /** Objective-C runtime items by address (empty without Objective-C metadata). The image never changes. */
  #objc: Promise<Map<string, ObjCItem>> | null = null;

  private constructor(workspace: Workspace, record: BinaryRecord, binary: BinarySession) {
    this.#workspace = workspace;
    this.record = record;
    this.binary = binary;
  }

  static async open(workspace: Workspace, record: BinaryRecord, threads = 1): Promise<AnalysisSession> {
    // A companion debug file OpenDecomp reads is imported with the binary (its own project).
    const debugPath = record.debug && SUPPORTED_DEBUG_KINDS.includes(record.debug.kind) ? workspace.debugPath(record) : null;
    const binary = await openBinary(workspace.binaryPath(record), {
      cachePath: workspace.projectRoot(record.id),
      ...(debugPath ? { debugPath } : {}),
      // Above 1, decompiles run in that many helper Web Workers (OpenDecomp request workers).
      ...(threads > 1 ? { requestWorkers: threads } : {}),
    });
    const session = new AnalysisSession(workspace, record, binary);
    session.threads = threads;
    void session.#discover();
    return session;
  }

  /** BinarySession hides its QueryService; renames, memory and image info need it. */
  get #service(): QueryService {
    return (this.binary as unknown as { service: QueryService }).service;
  }

  get #ctx() {
    return { project_id: this.binary.projectId, revision: this.binary.revision };
  }

  close(): Promise<void> {
    return this.binary.close();
  }

  // ---------------------------------------------------------------- discovery

  /** Interactive requests in flight (listing windows, function listings, decompiles), and started so far. */
  #foreground = 0;
  #started = 0;
  #foregroundWaiters: (() => void)[] = [];

  /** Runs an interactive request: background discovery steps let it go first. */
  async #interactive<T>(fn: () => Promise<T>): Promise<T> {
    this.#foreground++;
    this.#started++;
    for (const wake of this.#foregroundWaiters.splice(0)) wake();
    try {
      return await fn();
    } finally {
      if (--this.#foreground === 0) for (const wake of this.#foregroundWaiters.splice(0)) wake();
    }
  }

  /** Resolves when `ready()` holds (checked on every change of the interactive requests) or after `ms`. */
  #waitFor(ready: () => boolean, ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, Math.max(0, ms));
      const check = () => {
        if (!ready()) return void this.#foregroundWaiters.push(check);
        clearTimeout(timer);
        resolve();
      };
      check();
    });
  }

  /**
   * Before a discovery step: a step is one long OpenDecomp request (seconds to minutes on a
   * large stripped binary) that requests sent after it wait for. On opening, give the UI its
   * first listing and pseudocode first; later, let interactive requests finish (the UI often
   * sends the next one right after an answer, so wait for a short quiet period). The waits
   * are capped so that browsing cannot hold discovery off for long.
   */
  async #yieldToForeground(first: boolean): Promise<void> {
    const deadline = Date.now() + (first ? 8000 : 5000);
    if (first) await this.#waitFor(() => this.#started > 0, 2000);
    while (Date.now() < deadline) {
      await this.#waitFor(() => this.#foreground === 0, deadline - Date.now());
      const started = this.#started;
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (this.#foreground === 0 && this.#started === started) return;
    }
  }

  /** Whole-image function discovery, one committed step at a time, in the background. */
  async #discover(): Promise<void> {
    const index = await this.functions();
    if (index.indexState === 'complete') {
      this.discovery = { state: 'done', message: null };
      return;
    }
    this.discovery = { state: 'running', message: null };
    try {
      for (let step = 0; ; step++) {
        await this.#yieldToForeground(step === 0);
        const progressed = await this.#writes.run(async () => {
          const step = await this.#service.execute('functions_discover', {
            ...this.#ctx,
            image_id: this.binary.image.id,
            budget: DISCOVERY_BUDGET,
          });
          const data = need(step);
          if (data.progressed) this.binary.revision = data.revision;
          return data.progressed;
        });
        if (!progressed) break;
      }
      this.discovery = { state: 'done', message: null };
    } catch (error) {
      this.discovery = { state: 'failed', message: error instanceof Error ? error.message : String(error) };
    }
  }

  // ---------------------------------------------------------------- functions

  async functions() {
    const revision = this.binary.revision;
    if (this.#functions?.revision === revision) return this.#functions;
    const list: FunctionSummary[] = [];
    const ranges = new Map<string, [bigint, bigint][]>();
    let cursor: string | undefined;
    let indexState = 'complete';
    do {
      const data = need(
        await this.binary.findFunctions({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      );
      for (const fn of data.items) {
        const entry = canon(fn.entry.value);
        const size = fn.ranges.reduce((n, r) => n + Number(BigInt(r.size)), 0);
        // OpenDecomp shows a mangled name demangled: that is not a rename. Nor is a library match.
        const match = (fn as { library_match?: { library: string; name: string } }).library_match;
        const linkage = match?.name ?? fn.original_name;
        const demangled = linkage ? await this.#demangled(linkage) : null;
        ranges.set(
          fn.id,
          fn.ranges.map((r) => [BigInt(r.start.value), BigInt(r.start.value) + BigInt(r.size)]),
        );
        list.push({
          id: fn.id,
          name: (match ? demangled : null) ?? fn.display_name ?? demangled ?? fn.original_name ?? `sub_${entry.slice(2)}`,
          originalName: fn.original_name,
          mangled: demangled ? linkage : null,
          renamed: !match && fn.display_name !== null && fn.display_name !== fn.original_name && fn.display_name !== demangled,
          entry,
          size,
          boundary: fn.boundary,
          analysis: fn.analysis,
          importStub: (fn as { kind?: string }).kind === 'import_stub',
          library: match?.library ?? null,
        });
      }
      indexState = data.page.index_state;
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor && list.length < MAX_LIST_ITEMS);
    const index = {
      revision,
      list,
      byId: new Map(list.map((f) => [f.id, f])),
      byEntry: new Map(list.map((f) => [f.entry, f])),
      ranges,
      indexState,
    };
    this.#functions = index;
    this.#dropStaleDiffSigs(revision);
    return index;
  }

  /** Diff signature tables of another revision are stale: an edit or a discovery step changed the functions. */
  #dropStaleDiffSigs(revision: number): void {
    const dir = this.#workspace.dir(this.record.id);
    for (const name of vfs.get(dir) ? vfs.readdir(dir) : []) {
      const m = /^diffsig-v\d+-r(\d+)\.json$/.exec(name);
      if (m && Number(m[1]) !== revision) vfs.unlink(`${dir}/${name}`);
    }
  }

  readonly #demangledNames = new Map<string, string | null>();

  /** OpenDecomp's display demangling of a linkage name (C++ Itanium / MSVC, Swift), or null. */
  async #demangled(name: string): Promise<string | null> {
    if (!/^_{0,2}Z|^_?\?|^_?\$[sS]|^_?_T/.test(name)) return null;
    let d = this.#demangledNames.get(name);
    if (d === undefined) {
      const r = await demangleName(name, this.binary.image.target.format, { checkpoint: () => undefined } as unknown as Parameters<typeof demangleName>[2]);
      d = r.display_name;
      this.#demangledNames.set(name, d);
    }
    return d;
  }

  async functionById(id: string): Promise<FunctionSummary> {
    const fn = (await this.functions()).byId.get(id);
    if (!fn) throw new ApiError(404, `Unknown function ${id}`);
    return fn;
  }

  /** The function whose entry is `addr`, else the indexed function containing it. */
  async functionAt(addr: string): Promise<FunctionSummary | null> {
    const index = await this.functions();
    const exact = index.byEntry.get(canon(addr));
    if (exact) return exact;
    const data = need(
      await this.binary.findFunctions({ address: { image_id: this.binary.image.id, space: 'va', value: canon(addr) }, page: { limit: 2 } }),
    );
    const hit = data.items[0];
    return hit ? (index.byId.get(hit.id) ?? null) : null;
  }

  // ------------------------------------------------------------ image tables

  async info() {
    const index = await this.functions();
    return {
      record: this.record,
      image: this.binary.image,
      revision: this.binary.revision,
      projectPath: this.binary.projectPath,
      functionCount: index.list.length,
      functionIndex: index.indexState,
      discovery: this.discovery,
      threads: this.threads,
    };
  }

  async #binaryInfoList(view: 'sections' | 'mappings' | 'headers' | 'relocations' | 'entry_points') {
    const items: unknown[] = [];
    let cursor: string | undefined;
    do {
      const data = need(
        await this.#service.execute('binary_info', {
          ...this.#ctx,
          view,
          page: { limit: 1000, ...(cursor ? { cursor } : {}) },
        } as ToolInput<'binary_info'>),
      ) as { items?: unknown[]; page?: { next_cursor: string | null } };
      items.push(...(data.items ?? []));
      cursor = data.page?.next_cursor ?? undefined;
    } while (cursor && items.length < MAX_LIST_ITEMS);
    return items;
  }

  async sections() {
    type Section = {
      id: string;
      name: string;
      kind: string;
      virtual_range: { start: { space: string; value: string }; size: string } | null;
      file_range: { start: { value: string }; size: string } | null;
      permissions: string[];
      flags?: string;
    };
    const items = (await this.#binaryInfoList('sections')) as Section[];
    const macho = this.binary.image.target.format === 'macho';
    return items
      .map((s) => {
        // A section that is not loaded (ELF .shstrtab, .symtab...) has a file-space range: no address.
        const va = s.virtual_range?.start.space === 'va' ? s.virtual_range : null;
        return {
          id: s.id,
          name: s.name,
          kind: s.kind,
          start: va ? canon(va.start.value) : null,
          size: va ? Number(BigInt(va.size)) : 0,
          fileOffset: s.file_range ? canon(s.file_range.start.value) : null,
          fileSize: s.file_range ? Number(BigInt(s.file_range.size)) : 0,
          permissions: s.permissions,
          // Mach-O sections carry their segment's permissions: __TEXT,__const is not code.
          exec: macho && s.kind === 'section' ? (Number(s.flags ?? 0) & 0x80000400) !== 0 : s.permissions.includes('execute'),
        };
      })
      .sort((a, b) => (a.start && b.start ? (BigInt(a.start) < BigInt(b.start) ? -1 : 1) : 0));
  }

  async headers() {
    return this.#binaryInfoList('headers');
  }

  #loadMappings(): Promise<Mapping[]> {
    this.#mappings ??= (async () => {
      type Row = { va: string; memory_size: string; file_offset: string; file_size: string; permissions: string[] };
      const rows = (await this.#binaryInfoList('mappings')) as Row[];
      return rows.map((r) => ({
        va: BigInt(r.va),
        memSize: BigInt(r.memory_size),
        fileOffset: BigInt(r.file_offset),
        fileSize: BigInt(r.file_size),
        perms: r.permissions,
      }));
    })();
    return this.#mappings;
  }

  async #fileToVa(offset: bigint): Promise<string | null> {
    for (const m of await this.#loadMappings())
      if (offset >= m.fileOffset && offset < m.fileOffset + m.fileSize) return canon(m.va + offset - m.fileOffset);
    return null;
  }

  async #isMapped(va: bigint): Promise<boolean> {
    for (const m of await this.#loadMappings()) if (va >= m.va && va < m.va + m.memSize) return true;
    return false;
  }

  #loadStrings() {
    this.#strings ??= (async () => {
      const map = new Map<string, { text: string; encoding: string; id: string; length: number; terminated: boolean }>();
      let cursor: string | undefined;
      do {
        const data = need(
          await this.binary.findStrings({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
        );
        for (const s of data.items)
          map.set(canon(s.address.value), {
            text: s.text,
            encoding: s.encoding,
            id: s.id,
            length: Number(BigInt(s.byte_length)),
            terminated: s.terminated,
          });
        cursor = data.page.next_cursor ?? undefined;
      } while (cursor && map.size < MAX_LIST_ITEMS);
      return map;
    })();
    return this.#strings;
  }

  #loadNames() {
    const revision = this.binary.revision;
    if (this.#names?.revision === revision) return this.#names.value;
    const value = (async () => {
      type Named = { id: string; display_name: string | null; original_name: string | null; address?: { value: string } | null; slot?: { value: string } | null };
      const byEntity = new Map<string, string>();
      const byAddr = new Map<string, string>();
      const symbols = new Map<string, string>();
      const slots = new Map<string, string>();
      let cursor: string | undefined;
      do {
        const data = need(await this.binary.findSymbols({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }));
        for (const item of data.items as unknown as { kind: string; symbol?: Named; import?: Named }[]) {
          const e = item.import ?? item.symbol;
          const name = e?.display_name ?? e?.original_name;
          if (!e || !name) continue;
          byEntity.set(e.id, name);
          const at = item.import ? e.slot?.value : e.address?.value;
          if (at && !byAddr.has(canon(at))) byAddr.set(canon(at), name);
          const own = at ? (item.import ? slots : symbols) : null;
          if (at && own && !own.has(canon(at))) own.set(canon(at), name);
        }
        cursor = data.page.next_cursor ?? undefined;
      } while (cursor && byEntity.size < MAX_LIST_ITEMS);
      return { byEntity, byAddr, symbols, slots };
    })();
    this.#names = { revision, value };
    value.catch(() => {
      if (this.#names?.value === value) this.#names = null;
    });
    return value;
  }

  /**
   * OpenDecomp's static Objective-C runtime metadata (selector and class references,
   * selector stubs, CFString objects, classes). Its query tools do not expose these records
   * (they only name methods), so the image is loaded here once more and read with the same
   * recovery OpenDecomp runs on import.
   */
  #loadObjC(): Promise<Map<string, ObjCItem>> {
    this.#objc ??= (async () => {
      if (this.binary.image.target.format !== 'macho') return new Map<string, ObjCItem>();
      const sections = await this.#layoutSections();
      if (!sections.some((s) => s.name.startsWith('__objc_') || s.name === '__cfstring')) return new Map<string, ObjCItem>();
      const context = createOperationContext();
      const image = new MachOLoader().load(
        {
          image_id: this.binary.image.id,
          sha256: this.record.sha256,
          bytes: new ImmutableBytes(vfs.read(this.#workspace.binaryPath(this.record))),
          slice_id: (this.binary.image as { selected_slice_id?: string | null }).selected_slice_id ?? null,
        },
        context,
      );
      return objcItems(recoverRuntimeMetadata({ image, revision: 0 }, context).records);
    })().catch((error: unknown) => {
      console.warn('Objective-C metadata unavailable:', error instanceof Error ? error.message : String(error));
      return new Map<string, ObjCItem>();
    });
    return this.#objc;
  }

  /**
   * The source line of `addr` from the debug line table (embedded DWARF or the binary's debug
   * file), or null. OpenDecomp parses line tables but its query tools do not serve them, so the
   * image is loaded here once more (lazily, only when its debug summary reports line rows) and
   * read with the same debug recovery OpenDecomp runs.
   */
  async sourceLine(addr: string): Promise<{ file: string; line: number; column: number | null } | null> {
    const rows = await this.#loadLines();
    const at = BigInt(addr);
    // Last row starting at or before `at` (rows are sorted by address); half-open interval.
    let lo = 0,
      hi = rows.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (rows[mid]!.address <= at) lo = mid + 1;
      else hi = mid;
    }
    for (let i = lo - 1; i >= 0 && i >= lo - 8; i--) {
      const row = rows[i]!;
      if (row.endAddress !== undefined && at < row.endAddress) return { file: row.file, line: row.line, column: row.column ?? null };
    }
    return null;
  }

  #lines: Promise<DebugLine[]> | null = null;
  #loadLines(): Promise<DebugLine[]> {
    this.#lines ??= (async () => {
      if (!this.binary.image.debug?.lines) return [];
      const context = createOperationContext();
      const format = this.binary.image.target.format;
      const bytes = new ImmutableBytes(vfs.read(this.#workspace.binaryPath(this.record)));
      const input = {
        image_id: this.binary.image.id,
        sha256: this.record.sha256,
        bytes,
        slice_id: (this.binary.image as { selected_slice_id?: string | null }).selected_slice_id ?? null,
      };
      const loaded = format === 'macho' ? new MachOLoader().load(input, context) : format === 'elf' ? elfLoader.load(input, context) : null;
      if (!loaded) return [];
      const debugPath = this.binary.image.debug.companion_sha256 ? this.#workspace.debugPath(this.record) : null;
      const image = debugPath
        ? { ...loaded, companion: { sha256: this.binary.image.debug.companion_sha256!, bytes: new ImmutableBytes(vfs.read(debugPath)) } }
        : loaded;
      const data = recoverDebugInfo(image, context).data;
      return (data?.lines ?? []).filter((row) => !row.endSequence && row.endAddress !== undefined);
    })().catch((error: unknown) => {
      console.warn('Debug line table unavailable:', error instanceof Error ? error.message : String(error));
      return [];
    });
    return this.#lines;
  }

  /** OpenDecomp's established references from the instructions of a function, by instruction address. */
  async #outgoing(functionId: string) {
    type Ref = { from: { value: string } | null; to: { value: string } | null; to_entity: string | null; kind: string; status: string; target_role: string };
    const out = new Map<string, Ref[]>();
    let cursor: string | undefined;
    let n = 0;
    do {
      const data = need(
        await this.binary.getReferences({
          target: { kind: 'entity', id: functionId },
          direction: 'outgoing',
          page: { limit: 1000, ...(cursor ? { cursor } : {}) },
        } as ToolInput<'xrefs_get'>),
      ) as { items: Ref[]; page: { next_cursor: string | null } };
      for (const r of data.items) {
        if (!r.from || r.status !== 'established' || (!r.to && !r.to_entity)) continue;
        const at = canon(r.from.value);
        out.set(at, [...(out.get(at) ?? []), r]);
      }
      n += data.items.length;
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor && n < 20_000);
    return out;
  }

  async strings() {
    const map = await this.#loadStrings();
    return [...map.entries()].map(([addr, s]) => ({ addr, text: s.text, encoding: s.encoding, id: s.id }));
  }

  async symbols() {
    type Item = { kind: string; symbol?: { id: string; display_name: string | null; original_name: string | null; kind: string; address: { value: string } | null; size: string | null; binding?: string } };
    const out: { id: string; name: string; mangled: string | null; kind: string; addr: string | null; size: number; binding: string | null }[] = [];
    let cursor: string | undefined;
    do {
      const data = need(
        await this.binary.findSymbols({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      );
      for (const item of data.items as unknown as Item[]) {
        const s = item.symbol;
        if (!s) continue;
        out.push({
          id: s.id,
          name: s.display_name ?? s.original_name ?? '',
          // Shown demangled: the linkage name stays available (tooltips, filtering).
          mangled: s.display_name && s.original_name && s.display_name !== s.original_name ? s.original_name : null,
          kind: s.kind,
          addr: s.address ? canon(s.address.value) : null,
          size: s.size ? Number(BigInt(s.size)) : 0,
          binding: s.binding ?? null,
        });
      }
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor && out.length < MAX_LIST_ITEMS);
    return out;
  }

  /** Recovered image types (merged `struct_<hex>`) and the image's type library. */
  async types(): Promise<{ text: string; state: string; libraryId: string | null; library: LibraryType[] }> {
    const result = await this.gate.exclusive(() => this.binary.types());
    type Row = { name: string | null; type_id: string; annotation_id: string; status: string; declaration: string };
    const data = need(result) as { text?: string; library_id?: string; library?: Row[] };
    const library = (data.library ?? []).map((r) => ({
      name: r.name,
      typeId: r.type_id,
      annotationId: r.annotation_id,
      status: r.status,
      declaration: r.declaration,
    }));
    for (const t of library) if (t.name) this.#typeNames.set(t.name, t.typeId);
    return { text: data.text ?? '', state: result.state, libraryId: data.library_id ?? null, library };
  }

  // ------------------------------------------------------------------ memory

  async memory(addr: string, length: number) {
    const len = Math.max(1, Math.min(length, 65536));
    const data = need(
      await this.#service.execute('memory_read', {
        ...this.#ctx,
        address: { image_id: this.binary.image.id, space: 'va', value: canon(addr) },
        length: len,
      } as ToolInput<'memory_read'>),
    ) as { segments: { kind: string; range: { start: { value: string }; size: string }; bytes_hex?: string }[] };
    return {
      addr: canon(addr),
      length: len,
      segments: data.segments.map((s) => ({
        kind: s.kind,
        start: canon(s.range.start.value),
        size: Number(BigInt(s.range.size)),
        hex: s.bytes_hex ?? null,
      })),
    };
  }

  // ---------------------------------------------------------------- listing

  /** Disassembly plus CFG of one function, with operand constants resolved to names. */
  async listing(functionId: string) {
    const core = await this.#interactive(() => this.#cachedListing(functionId));
    const comments = await this.#workspace.comments(this.record.id);
    const inRange = new Set(core.instructions.map((i) => i.addr));
    return { ...core, comments: Object.fromEntries(Object.entries(comments).filter(([a]) => inRange.has(a))) };
  }

  /**
   * A function's listing at this revision. `withCfg` false (the whole-image listing): the full
   * listing when cached, else one without the CFG blocks, nor the resolved targets of an
   * import stub (its name says it all) — two OpenDecomp requests fewer per function.
   */
  #cachedListing(functionId: string, withCfg = true): Promise<ListingCore> {
    const revision = this.binary.revision;
    if (this.#listings?.revision !== revision) this.#listings = { revision, map: new Map(), ready: new Set() };
    const { map, ready } = this.#listings;
    const key = withCfg ? functionId : `lite:${functionId}`;
    let p = map.get(functionId) ?? map.get(key);
    if (p) {
      map.delete(key);
      map.set(key, p);
      return p;
    }
    p = this.#buildListing(functionId, withCfg);
    map.set(key, p);
    p.then(() => ready.add(functionId), () => undefined);
    p.catch(() => map.get(key) === p && map.delete(key));
    while (map.size > 512) map.delete(map.keys().next().value!);
    return p;
  }

  async #buildListing(functionId: string, withCfg: boolean): Promise<ListingCore> {
    const fn = await this.functionById(functionId);
    type Compact = {
      id: string;
      address: { value: string };
      size: number;
      validity: string;
      flow: { kind: string; target?: { value: string }; targets?: { value: string }[]; next?: { value: string }; fallthrough?: { value: string } };
      presentation: { mnemonic: string; operands: string };
    };
    const raw: Compact[] = [];
    let gaps: unknown[] = [];
    let cursor: string | undefined;
    do {
      const data = need(
        await this.binary.getFunction(functionId, {
          view: 'disassembly',
          detail: 'compact',
          page: { limit: 1000, ...(cursor ? { cursor } : {}) },
        }),
      ) as { items: Compact[]; gaps: unknown[]; page: { next_cursor: string | null } };
      raw.push(...data.items);
      gaps = gaps.concat(data.gaps);
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor);

    const blocksRaw: { id: string; ranges: { start: { value: string } }[]; instructions: string[]; edges: { to: string | null; target: { value: string } | null; kind: string; conditional: boolean }[] }[] = [];
    cursor = undefined;
    while (withCfg) {
      const data = need(
        await this.binary.getFunction(functionId, { view: 'cfg', page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      ) as { items: typeof blocksRaw; page: { next_cursor: string | null } };
      blocksRaw.push(...data.items);
      cursor = data.page.next_cursor ?? undefined;
      if (!cursor) break;
    }

    const index = await this.functions();
    const strings = await this.#loadStrings();
    // Resolved targets are a nicety: a listing without them is still a listing.
    const [outgoing, names] = await Promise.all([
      withCfg || !fn.importStub ? this.#outgoing(functionId).catch(() => new Map<string, never[]>()) : new Map<string, never[]>(),
      this.#loadNames().catch((): Names => ({ byEntity: new Map(), byAddr: new Map(), symbols: new Map(), slots: new Map() })),
    ]);
    // Globals renamed here: their name is an annotation on the data entity, not on the symbol.
    const globals = (await this.#workspace.data(this.record.id)).names;
    const objc = await this.#loadObjC();
    const bytes = await this.#instructionBytes(raw.map((i) => ({ addr: BigInt(i.address.value), size: i.size })));

    const dataName = (a: string) => {
      const item = objc.get(a);
      const name = names.symbols.get(a);
      return item && objcRelabels(item, name) ? objcLabel(item) : name;
    };
    const idToAddr = new Map<string, string>();
    const insns: Instruction[] = [];
    for (const i of raw) {
      const addr = canon(i.address.value);
      idToAddr.set(i.id, addr);
      const targets = [i.flow.target, ...(i.flow.targets ?? [])].filter((t): t is { value: string } => !!t).map((t) => canon(t.value));
      const refs: Instruction['refs'] = [];
      for (const c of operandConstants(i.presentation.operands)) {
        const a = canon(c.value);
        const f = index.byEntry.get(a);
        const s = strings.get(a);
        if (f) refs.push({ text: c.text, addr: a, kind: 'function', label: f.name });
        else if (s) refs.push({ text: c.text, addr: a, kind: 'string', label: s.text });
        else if (targets.includes(a)) refs.push({ text: c.text, addr: a, kind: 'code', label: '' });
        // A memory operand naming a mapped address, or an immediate that looks like a pointer.
        else if ((c.inMemory || c.value >= 0x10000n) && (await this.#isMapped(c.value)))
          refs.push({ text: c.text, addr: a, kind: 'data', label: globals[a] ?? dataName(a) ?? '' });
      }
      const resolved: Instruction['resolved'] = [];
      for (const r of outgoing.get(addr) ?? []) {
        const to = r.to ? canon(r.to.value) : null;
        // Already shown: an operand constant or a branch/call target.
        if (to && (refs.some((x) => x.addr === to) || targets.includes(to))) continue;
        if (!to && r.kind === 'branch') continue;
        const f = (to ? index.byEntry.get(to) : undefined) ?? (r.to_entity ? index.byId.get(r.to_entity) : undefined);
        const s = to ? strings.get(to) : undefined;
        const name = (to ? globals[to] : undefined) ?? (r.to_entity ? names.byEntity.get(r.to_entity) : undefined) ?? (to ? names.byAddr.get(to) : undefined);
        let item: Instruction['resolved'][number] | null = f
          ? { addr: f.entry, kind: 'function', label: f.name, access: r.kind }
          : s && to
            ? { addr: to, kind: 'string', label: s.text, access: r.kind }
            : name && (r.target_role === 'import_slot' || r.target_role === 'callable_stub' || !to)
              ? { addr: to ?? '', kind: 'import', label: name, access: r.kind }
              : to
                ? { addr: to, kind: r.target_role === 'code' ? 'code' : 'data', label: name ?? '', access: r.kind }
                : null;
        // A selector or class reference, a CFString: what it means, not the import its slot binds.
        const oc = to && !f ? objc.get(to) : undefined;
        if (oc) item = { addr: to!, kind: 'data', label: globals[to!] ?? objcComment(oc), access: r.kind };
        if (item && !resolved.some((x) => x.addr === item.addr && x.label === item.label)) resolved.push(item);
      }
      insns.push({
        addr,
        size: i.size,
        bytes: bytes.get(addr) ?? '',
        mnemonic: i.presentation.mnemonic,
        operands: i.presentation.operands,
        valid: i.validity === 'valid',
        flow: { kind: i.flow.kind, targets, conditional: i.flow.kind === 'branch' && !!(i.flow.next ?? i.flow.fallthrough) },
        refs,
        resolved,
      });
    }
    if (objc.size) this.#objcMessages(fn, insns, objc, index.byEntry, names);
    const blocks: Block[] = blocksRaw.map((b) => ({
      id: b.id,
      start: canon(b.ranges[0]?.start.value ?? '0x0'),
      insns: b.instructions.map((id) => idToAddr.get(id)).filter((a): a is string => !!a),
      edges: b.edges.map((e) => ({ to: e.to, target: e.target ? canon(e.target.value) : null, kind: e.kind, conditional: e.conditional })),
    }));
    return { function: fn, instructions: insns, blocks, gaps };
  }

  /** Puts the message an `objc_msgSend` (or selector stub) call sends first in its comment. */
  #objcMessages(fn: FunctionSummary, insns: Instruction[], objc: Map<string, ObjCItem>, byEntry: Map<string, FunctionSummary>, names: Names): void {
    // A method's x0 on entry is self (the instructions start at the entry when it comes first).
    const method = /^[-+]\[/.test(fn.originalName ?? fn.name) && insns[0]?.addr === fn.entry;
    const targets = new Set(insns.flatMap((i) => (i.flow.kind === 'call' ? [] : i.flow.targets)));
    const itemOf = (insn: Instruction) => {
      for (const r of insn.resolved) if (r.kind === 'data' && objc.has(r.addr)) return { addr: r.addr, ...objc.get(r.addr)! };
      return null;
    };
    const calleeName = (a: string) => byEntry.get(a)?.originalName ?? byEntry.get(a)?.name ?? names.byAddr.get(a) ?? null;
    insns.forEach((insn, i) => {
      const message = objcMessage(insns, i, calleeName, (a) => objc.get(a) ?? null, itemOf, targets, method);
      if (message) insn.resolved.unshift({ addr: message.addr, kind: 'data', label: message.text, access: 'message' });
    });
  }

  /** Each instruction's bytes as hex, read through the page cache. */
  async #instructionBytes(items: { addr: bigint; size: number }[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    for (const it of items) {
      const bytes = await this.#read(it.addr, it.size);
      out.set(canon(it.addr), Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''));
    }
    return out;
  }

  // ------------------------------------------------- whole-image listing

  /** `len` bytes at `start` through a page cache; zero where nothing is mapped. */
  async #read(start: bigint, len: number): Promise<Uint8Array> {
    const out = new Uint8Array(len);
    const end = start + BigInt(len);
    for (let page = start - (start % 4096n); page < end; page += 4096n) {
      let p = this.#pages.get(page);
      if (p) {
        this.#pages.delete(page);
        this.#pages.set(page, p);
      } else {
        p = this.memory(canon(page), 4096).then(
          (mem) => {
            const bytes = new Uint8Array(4096);
            for (const seg of mem.segments) {
              if (!seg.hex) continue;
              const off = Number(BigInt(seg.start) - page);
              for (let i = 0; i < seg.size && off + i < 4096; i++) bytes[off + i] = parseInt(seg.hex.slice(i * 2, i * 2 + 2), 16);
            }
            return bytes;
          },
          () => new Uint8Array(4096),
        );
        this.#pages.set(page, p);
        while (this.#pages.size > 1024) this.#pages.delete(this.#pages.keys().next().value!);
      }
      const bytes = await p;
      const from = page > start ? page : start;
      const to = page + 4096n < end ? page + 4096n : end;
      out.set(bytes.subarray(Number(from - page), Number(to - page)), Number(from - start));
    }
    return out;
  }

  #loadRelocations() {
    this.#relocations ??= (async () => {
      type Row = { address: { space: string; value: string }; width_bits: number; target: { space: string; value: string } | null; symbol_id: string | null };
      const rows = (await this.#binaryInfoList('relocations').catch(() => [])) as Row[];
      return rows
        .filter((r) => r.address.space === 'va' && (r.width_bits === 64 || r.width_bits === 32))
        .map((r) => ({
          addr: BigInt(r.address.value),
          width: r.width_bits / 8,
          target: r.target?.space === 'va' ? BigInt(r.target.value) : null,
          symbol: r.symbol_id,
        }));
    })();
    return this.#relocations;
  }

  /** The image's mapped sections (its segments when it has no sections), for the listing. */
  #layoutSections(): Promise<LayoutSection[]> {
    this.#sectionsOnce ??= this.#readLayoutSections();
    this.#sectionsOnce.catch(() => (this.#sectionsOnce = null));
    return this.#sectionsOnce;
  }

  /** The sections mapped in VA space (the segments when the image has no sections): what the listing, search and navigation band cover. */
  async #mappedSections() {
    const all = (await this.sections()).filter((s) => s.start && s.size > 0 && s.permissions.length > 0);
    const sections = all.filter((s) => s.kind === 'section');
    return sections.length ? sections : all;
  }

  async #readLayoutSections(): Promise<LayoutSection[]> {
    return (await this.#mappedSections()).map((s) => {
      const start = BigInt(s.start!);
      return { name: s.name, start, end: start + BigInt(s.size), fileEnd: start + BigInt(s.fileOffset === null ? 0 : s.fileSize), perms: s.permissions };
    });
  }

  /** The listing at the current revision and data definitions. */
  #linearListing(): Promise<LinearListing> {
    const key = `${this.binary.revision}/${this.#dataVersion}`;
    if (this.#linear?.key === key) return this.#linear.value;
    const value = (async () => {
      const [index, strings, names, relocations, sections, data, objc] = await Promise.all([
        this.functions(),
        this.#loadStrings(),
        this.#loadNames().catch((): Names => ({ byEntity: new Map(), byAddr: new Map(), symbols: new Map(), slots: new Map() })),
        this.#loadRelocations(),
        this.#layoutSections(),
        this.#workspace.data(this.record.id),
        this.#loadObjC(),
      ]);
      const pointerSize = BigInt(this.binary.image.target.address_bits / 8);
      // Priority on overlaps: function entry ranges, other function ranges, user data, pointers, strings.
      const candidates: LayoutItem[] = [];
      const chunks: LayoutItem[] = [];
      for (const fn of index.list)
        for (const [start, end] of index.ranges.get(fn.id) ?? []) {
          const entry = start === BigInt(fn.entry);
          (entry ? candidates : chunks).push({ kind: 'code', start, end, fnId: fn.id, entry });
        }
      candidates.push(...chunks);
      for (const [addr, def] of Object.entries(data.defs)) {
        const start = BigInt(addr);
        candidates.push({ kind: 'def', start, end: start + BigInt(defSize(def)), def: { type: def.type, count: def.count } });
      }
      for (const r of relocations)
        candidates.push({ kind: 'pointer', start: r.addr, end: r.addr + BigInt(r.width), target: r.target, symbol: r.symbol ? (names.byEntity.get(r.symbol) ?? null) : null });
      for (const [addr, name] of names.slots) {
        const start = BigInt(addr);
        candidates.push({ kind: 'pointer', start, end: start + pointerSize, target: null, symbol: name });
      }
      for (const [addr, str] of strings) {
        const start = BigInt(addr);
        const nul = str.terminated ? (str.encoding === 'utf16le' ? 2 : 1) : 0;
        candidates.push({ kind: 'string', start, end: start + BigInt(str.length + nul), text: str.text, encoding: str.encoding, terminated: str.terminated });
      }
      const labels = new Map(names.symbols);
      for (const [addr, item] of objc) if (item.kind !== 'stub' && objcRelabels(item, labels.get(addr))) labels.set(addr, objcLabel(item));
      for (const f of index.list) labels.delete(f.entry);
      for (const [addr, name] of Object.entries(data.names)) labels.set(addr, name);
      const layout = buildLayout(sections, candidates, labels);
      const refAt = (a: bigint): DataRef | null => {
        const k = canon(a);
        const f = index.byEntry.get(k);
        if (f) return { addr: k, kind: 'function', label: f.name };
        const s = strings.get(k);
        if (s) return { addr: k, kind: 'string', label: quoteC(s.text.length > 40 ? `${s.text.slice(0, 40)}…` : s.text) };
        const l = labels.get(k);
        if (l) return { addr: k, kind: 'data', label: l };
        const slot = names.slots.get(k);
        if (slot) return { addr: k, kind: 'import', label: slot };
        const it = itemAt(layout, a);
        const fn = it?.kind === 'code' ? index.byId.get(it.fnId) : undefined;
        if (fn) return { addr: k, kind: 'code', label: `${fn.name}+0x${(a - BigInt(fn.entry)).toString(16)}` };
        return null;
      };
      return new LinearListing(layout, {
        read: (start, len) => this.#read(start, len),
        listing: (fnId) => this.#cachedListing(fnId, false),
        listed: (fnId) => this.#listings?.revision === this.binary.revision && this.#listings.ready.has(fnId),
        refAt,
      });
    })();
    this.#linear = { key, value };
    value.catch(() => {
      if (this.#linear?.value === value) this.#linear = null;
    });
    return value;
  }

  /**
   * Builds the listing around `addr` after a change, before the UI hears of it: the UI's
   * reload is then served from the caches instead of waiting behind the re-decompilation
   * the new revision starts.
   */
  async #warm(addr: string): Promise<void> {
    await this.linear(addr, 40, 80).catch(() => undefined);
  }

  /** Rows of the whole-image listing around an address (see linear.ts). */
  async linear(addr: string, before: number, after: number, quick = false) {
    return this.#interactive(async () => (await this.#linearListing()).window(BigInt(addr), before, after, quick));
  }

  // ------------------------------------------------------- data definitions

  /** The user data definition at `addr` and how many elements an array there can hold. */
  async dataAt(addr: string) {
    const listing = await this.#linearListing();
    const a = BigInt(addr);
    const item = itemAt(listing.layout, a);
    const def = item?.kind === 'def' ? item : null;
    const start = def ? def.start : a;
    const type: DataType = def && def.def.type !== 'string' ? def.def.type : 'u8';
    return { start: canon(start), def: def?.def ?? null, type, maxCount: Number(this.#room(listing, start) / BigInt(elementSize(type))) };
  }

  /** Bytes from `start` to the next function, item or label, or the section end. */
  #room(listing: LinearListing, start: bigint): bigint {
    const { layout } = listing;
    const sec = layout.sections[sectionIndex(layout.sections, start)];
    if (!sec) return 0n;
    let end = sec.end;
    for (const it of layout.items) if (it.start > start && it.start < end && it.kind !== 'def') end = it.start;
    for (const l of layout.labelAt) if (l > start && l < end) end = l;
    return end - start;
  }

  /**
   * IDA's data keys at an address: D cycles byte/word/dword/qword, A makes a C string,
   * O a pointer, * an array of `count` elements, U undefines. Definitions are kept in the
   * workspace (they drive the listing) and declared to OpenDecomp as an asserted `type`
   * annotation on the global, so the decompiler types it too where OpenDecomp accepts the
   * address as data storage.
   */
  defineData(addr: string, action: DataAction, count = 0) {
    // One at a time: each reads the definitions the previous one wrote.
    return this.#dataOps.run(() => this.#defineData(addr, action, count));
  }

  async #defineData(addr: string, action: DataAction, count: number) {
    const listing = await this.#linearListing();
    const { layout } = listing;
    const a = BigInt(addr);
    const sec = layout.sections[sectionIndex(layout.sections, a)];
    if (!sec) throw new ApiError(400, `${addr} is not in a mapped section`);
    const item = itemAt(layout, a);
    if (item?.kind === 'code') {
      const fn = (await this.functions()).byId.get(item.fnId);
      throw new ApiError(400, `${addr} is code of ${fn?.name ?? 'a function'}: OpenDecomp has no way to undefine code`);
    }
    const current = item?.kind === 'def' ? item : null;
    const start = current ? current.start : a;
    let def: DataDef | null;
    if (action === 'undefine') {
      if (!current)
        throw new ApiError(400, item ? 'This item comes from OpenDecomp (a string or a pointer), not from a definition: define another type over it instead' : 'Nothing is defined here');
      def = null;
    } else if (action === 'cycle') {
      const order: DataType[] = ['u8', 'u16', 'u32', 'u64'];
      def = { type: order[((current ? order.indexOf(current.def.type) : -1) + 1) % order.length]!, count: 1 };
    } else if (action === 'ptr') def = { type: 'ptr', count: 1 };
    else if (action === 'string') {
      const room = Number(sec.end - start < 4096n ? sec.end - start : 4096n);
      def = { type: 'string', count: cStringLength(await this.#read(start, room)) ?? room };
    } else {
      if (!Number.isSafeInteger(count) || count < 1) throw new ApiError(400, 'An array needs at least one element');
      def = { type: current && current.def.type !== 'string' ? current.def.type : 'u8', count };
    }
    const end = start + BigInt(def ? defSize(def) : 0);
    if (end > sec.end) throw new ApiError(400, `That runs past the end of ${sec.name}`);
    if (layout.items.some((it) => it.kind === 'code' && it.start < end && it.end > start)) throw new ApiError(400, 'That overlaps a function');

    const key = canon(start);
    const { replaced, note } = await this.#putDefs(start, end > start ? end : (current?.end ?? start + 1n), def ? { [key]: def } : {});
    return { revision: this.binary.revision, start: key, def, note, replaced, range: this.#range(start, end, replaced) };
  }

  /** [start, end) covering a definition and the ones it replaced (what an undo restores). */
  #range(start: bigint, end: bigint, defs: Record<string, DataDef>): { start: string; end: string } {
    let lo = start;
    let hi = end > start ? end : start + 1n;
    for (const [k, d] of Object.entries(defs)) {
      const s = BigInt(k);
      const e = s + BigInt(defSize(d));
      if (s < lo) lo = s;
      if (e > hi) hi = e;
    }
    return { start: canon(lo), end: canon(hi) };
  }

  /** Undo/redo of data definitions: the definitions overlapping [start, end) become exactly `defs`. */
  restoreData(start: string, end: string, defs: Record<string, DataDef>) {
    return this.#dataOps.run(async () => {
      for (const [k, d] of Object.entries(defs))
        if (!DATA_TYPES.includes(d.type) || !Number.isSafeInteger(d.count) || d.count < 1 || BigInt(k) < BigInt(start) || BigInt(k) >= BigInt(end))
          throw new ApiError(400, `Invalid data definition at ${k}`);
      const { note } = await this.#putDefs(BigInt(start), BigInt(end), defs);
      return { revision: this.binary.revision, note };
    });
  }

  /**
   * Replaces the definitions overlapping [start, end) by `defs`, in the workspace and in
   * OpenDecomp (one annotation batch). Returns the replaced definitions.
   */
  async #putDefs(start: bigint, end: bigint, defs: Record<string, DataDef>) {
    const data = await this.#workspace.data(this.record.id);
    const replacedEntries = Object.entries(data.defs).filter(
      ([k, d]) => k in defs || (BigInt(k) < end && BigInt(k) + BigInt(defSize(d)) > start),
    );
    const replaced = Object.fromEntries(replacedEntries.map(([k, d]) => [k, { type: d.type, count: d.count }]));
    for (const [k] of replacedEntries) delete data.defs[k];
    const remove = (ks: string[]) => ks.map((k) => ({ operation: 'remove', id: annotationId(`type:va:${k}`) }));
    // A new type at the same address overwrites the annotation there; the others are removed.
    const declared = replacedEntries.filter(([, d]) => d.od).map(([k]) => k);
    const removes = remove(declared.filter((k) => !(k in defs)));
    const stored = Object.entries(defs).map(([k, d]) => [k, (data.defs[k] = { type: d.type, count: d.count, od: false as boolean })] as const);
    let note: string | null = null;
    if (stored.length) {
      const edits = new Map<string, unknown>();
      for (const e of [...removes, ...stored.flatMap(([k, d]) => this.#dataTypeEdits(k, d))]) edits.set((e as { id: string }).id, e);
      try {
        await this.#writes.run(() => this.#apply([...edits.values()]));
        for (const [, d] of stored) d.od = true;
      } catch (error) {
        note = `kept in the listing only: OpenDecomp did not accept a type here (${error instanceof Error ? error.message.split('\n')[0] : String(error)})`;
        const stale = [...removes, ...remove(declared.filter((k) => k in defs))];
        if (stale.length) await this.#writes.run(() => this.#apply(stale)).catch(() => undefined);
      }
    } else if (removes.length) await this.#writes.run(() => this.#apply(removes)).catch(() => undefined);
    await this.#workspace.setData(this.record.id, data);
    this.#dataVersion++;
    await this.#warm(canon(start));
    return { replaced, note };
  }

  /** `type` annotations declaring the global at `addr` as `def`; the types it refers to go on the type library. */
  #dataTypeEdits(addr: string, def: DataDef): unknown[] {
    type Definition = Parameters<typeof encodeTypeDefinition>[0];
    const slice = this.binary.image.selected_slice_id;
    const idOf = (d: Definition) => entityIdentity(slice, 'open-reverse-type', [JSON.stringify(encodeTypeDefinition(d))]);
    const helpers: Definition[] = [];
    let root: Definition;
    if (def.type === 'ptr') {
      const v = { kind: 'void' } as Definition;
      helpers.push(v);
      root = { kind: 'pointer', to: idOf(v), bits: 64 } as Definition;
    } else root = { kind: 'integer', bits: elementSize(def.type) * 8, signed: def.type === 'string' } as Definition;
    if (def.type === 'string' || def.count > 1) {
      helpers.push(root);
      root = { kind: 'array', element: idOf(root), count: BigInt(def.count) } as Definition;
    }
    const library = typeLibraryIdentity(slice);
    const type = (d: Definition) => ({ kind: 'type', type_id: idOf(d), definition: encodeTypeDefinition(d) });
    return [
      ...helpers.map((d) => ({ operation: 'set', id: annotationId(`library-type:${idOf(d)}`), entity_id: library, value: type(d), status: 'asserted', evidence_ids: [] })),
      {
        operation: 'set',
        id: annotationId(`type:va:${addr}`),
        address: { image_id: this.binary.image.id, space: 'va', value: addr },
        value: type(root),
        status: 'asserted',
        evidence_ids: [],
      },
    ];
  }

  // -------------------------------------------------------------- decompile

  /** Identical decompiles in flight share one job: with request workers two of them would run
   * in parallel and the second publication would collide with the first in the cache. */
  readonly #results = new Map<string, Promise<Awaited<ReturnType<AnalysisSession['decompileOnce']>>>>();
  readonly #inflight = new Map<string, Promise<Awaited<ReturnType<AnalysisSession['decompileOnce']>>>>();

  decompile(
    functionId: string,
    options: { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' },
    signal?: AbortSignal,
  ) {
    const key = `${functionId}|${this.binary.revision}|${options.language}|${options.inference}|${options.view}`;
    // A repeat at the same revision is answered here: a request worker's snapshot predates
    // publications made since its generation started, so OpenDecomp would recompute it and
    // its publication would collide with the first in the store.
    const done = this.#results.get(key);
    if (done) {
      this.#results.delete(key);
      this.#results.set(key, done);
      return done;
    }
    let p = this.#inflight.get(key);
    if (!p) {
      p = this.#interactive(() => this.gate.shared(() => this.decompileOnce(functionId, options, signal)));
      this.#inflight.set(key, p);
      const clear = () => {
        if (this.#inflight.get(key) === p) this.#inflight.delete(key);
      };
      p.then((value) => {
        clear();
        // Keep recent results of the current revision (older revisions are never asked again).
        const prefix = `|${this.binary.revision}|`;
        for (const k of this.#results.keys()) if (!k.includes(prefix)) this.#results.delete(k);
        if (k_rev(key) === this.binary.revision) this.#results.set(key, Promise.resolve(value));
        while (this.#results.size > 256) this.#results.delete(this.#results.keys().next().value!);
      }, clear);
    }
    return p;
  }

  async decompileOnce(
    functionId: string,
    options: { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' },
    signal?: AbortSignal,
  ) {
    const fn = await this.functionById(functionId);
    const result = (await this.binary.decompileFunction(functionId, {
      emitter: options.language,
      inference: options.inference,
      view: options.view,
      budget: { deadline_ms: 120_000 },
      ...(signal ? { signal } : {}),
    })) as ToolResult<'function_decompile'>;
    const data = need(result);
    if (data.delivery !== 'inline') throw new ApiError(500, 'Decompilation was not delivered inline');
    const e = data.emission;
    const ranges: (string | null)[] = [];
    for (const r of e.ranges) {
      const v = BigInt(r.start.value);
      ranges.push(r.start.space === 'va' ? canon(v) : r.start.space === 'file' ? await this.#fileToVa(v) : null);
    }
    const mappings = e.mappings
      .map((m) => ({
        start: m.start,
        end: m.end,
        addrs: [...new Set(m.range_refs.map((k) => ranges[k]).filter((a): a is string => !!a))],
      }))
      .filter((m) => m.addrs.length > 0 && m.end > m.start);
    // Parameters and locals: each declaration's mapped statement is the value subject a
    // `name` annotation renames (the renderer prefers a unique asserted name for it).
    const variables: Variable[] = [];
    const decl = e.declaration_span ?? null;
    const named = new Set<string>();
    // A declaration's refs may start with the storage it was loaded from (a frame field):
    // the value is the first ref OpenDecomp states a parameter or type inference about.
    const valueRefs = new Set<number>();
    for (const i of (e.inferences ?? []) as { subject_refs: number[]; details?: { kind?: string } }[])
      if (i.details?.kind === 'parameter' || i.details?.kind === 'type') for (const k of i.subject_refs) valueRefs.add(k);
    for (const m of e.mappings) {
      const id = e.ids[m.semantic_refs.find((k) => valueRefs.has(k)) ?? m.semantic_refs[0] ?? -1];
      if (!id || id === functionId) continue;
      const name = declaredName(e.text.slice(m.start, m.end), e.language);
      if (!name || named.has(name)) continue;
      named.add(name);
      const parameter = !!decl && m.start >= decl.start && m.end <= decl.end;
      const type = e.language.startsWith('python') ? null : declaredType(e.text.slice(m.start, m.end), name);
      variables.push({ name, id, parameter, type });
    }
    return {
      function: fn,
      text: e.text,
      language: e.language,
      variables,
      globals: e.language.startsWith('python') ? [] : declaredGlobals(e.text),
      state: result.state,
      cache: data.cache,
      diagnostics: (result.diagnostics ?? []).map((d) => ({ severity: d.severity, code: d.code, message: d.message })),
      declarationSpan: e.declaration_span ?? null,
      mappings,
    };
  }

  // ------------------------------------------------------------------- xrefs

  async xrefs(target: { id?: string; addr?: string }, direction: 'incoming' | 'outgoing' | 'both') {
    const index = await this.functions();
    const strings = await this.#loadStrings();
    const names = await this.#loadNames().catch(() => ({ byEntity: new Map<string, string>(), byAddr: new Map<string, string>() }));
    type Ref = { id: string; from: { value: string } | null; to: { value: string } | null; from_function: string | null; to_entity: string | null; kind: string; status: string; target_role: string };
    const items: Ref[] = [];
    const seen = new Set<string>();
    const query = async (on: ToolInput<'xrefs_get'>['target'], dir: typeof direction) => {
      let cursor: string | undefined;
      do {
        const data = need(
          await this.binary.getReferences({ target: on, direction: dir, page: { limit: 1000, ...(cursor ? { cursor } : {}) } } as ToolInput<'xrefs_get'>),
        ) as { items: Ref[]; page: { next_cursor: string | null } };
        for (const r of data.items) {
          if (seen.has(r.id)) continue;
          seen.add(r.id);
          items.push(r);
        }
        cursor = data.page.next_cursor ?? undefined;
      } while (cursor && items.length < 10_000);
    };
    const at = (value: string) => ({ kind: 'address', address: { image_id: this.binary.image.id, space: 'va', value: canon(value) } }) as const;
    await query(target.id ? { kind: 'entity', id: target.id } : at(target.addr!), direction);
    // An incoming query by entity matches `to_entity` only, and a call to an import stub names the
    // import there (target_role 'callable_stub'), not the stub function: also ask by its entry.
    const fn = target.id ? index.byId.get(target.id) : undefined;
    if (fn && direction !== 'outgoing') {
      const before = items.length;
      await query(at(fn.entry), 'incoming');
      // Keep OpenDecomp's order (by source address) across the two answers.
      if (items.length > before) items.sort((a, b) => compareFrom(a.from?.value ?? null, b.from?.value ?? null));
    }
    const brief = (f: FunctionSummary | undefined) => (f ? { id: f.id, name: f.name, entry: f.entry } : null);
    return (
      items
        // A reference with no known target (an unresolved load or store) says nothing about where it goes.
        .filter((r) => direction === 'incoming' || r.to || r.to_entity)
        .map((r) => {
          const from = r.from ? canon(r.from.value) : null;
          const to = r.to ? canon(r.to.value) : null;
          const toFn = (to ? index.byEntry.get(to) : undefined) ?? (r.to_entity ? index.byId.get(r.to_entity) : undefined);
          const s = to ? strings.get(to) : undefined;
          return {
            from,
            to,
            fromFunction: brief(r.from_function ? index.byId.get(r.from_function) : undefined),
            toFunction: brief(toFn),
            toName:
              toFn?.name ??
              (s ? JSON.stringify(s.text) : null) ??
              (r.to_entity ? names.byEntity.get(r.to_entity) : undefined) ??
              (to ? names.byAddr.get(to) : undefined) ??
              null,
            kind: r.kind,
            status: r.status,
            role: r.target_role,
          };
        })
    );
  }

  /** Direct callers and callees of a function (established `call` references). */
  async calls(functionId: string) {
    const incoming = await this.xrefs({ id: functionId }, 'incoming');
    const outgoing = await this.xrefs({ id: functionId }, 'outgoing');
    return { callers: callNodes(incoming, (x) => x.fromFunction, null), callees: callNodes(outgoing, (x) => x.toFunction, (x) => x.toName) };
  }

  // ------------------------------------------------- search and navigation map

  #regions: Promise<Region[]> | null = null;

  /** The mapped sections, as search reads them and the navigation band shows them. */
  regions(): Promise<Region[]> {
    this.#regions ??= (async () =>
      (await this.#mappedSections()).map((s) => ({
        name: s.name,
        start: BigInt(s.start!),
        size: s.size,
        fileSize: s.fileOffset === null ? 0 : Math.min(s.size, s.fileSize),
        exec: s.exec,
      })))();
    this.#regions.catch(() => (this.#regions = null));
    return this.#regions;
  }

  /** Bytes at an address as contiguous runs (unmapped holes left out); at most 64 KiB. */
  async readBytes(addr: bigint, length: number): Promise<{ start: bigint; bytes: Uint8Array }[]> {
    const mem = await this.memory(canon(addr), length);
    return mem.segments.flatMap((s) => (s.hex ? [{ start: BigInt(s.start), bytes: hexBytes(s.hex) }] : []));
  }

  /**
   * Every function's binary diff signature (bindiff.ts), built from its listing (import stubs
   * left out). A listing already made at this revision is reused; the others are not cached,
   * so the walk does not evict what the views show.
   */
  async diffSignatures(ctx: TaskContext, phase: string): Promise<FunctionSig[]> {
    const index = await this.functions();
    const fns = index.list.filter((f) => !f.importStub).sort((a, b) => cmpBig(a.entry, b.entry));
    const out: FunctionSig[] = [];
    for (const [n, fn] of fns.entries()) {
      ctx.signal.throwIfAborted();
      ctx.progress({ phase, done: n, total: fns.length, detail: fn.name });
      const listed = this.#listings?.revision === index.revision ? (this.#listings.map.get(fn.id) ?? null) : null;
      // A function OpenDecomp cannot disassemble still takes part, by its name and size.
      const core = await (listed ?? this.#buildListing(fn.id, true)).catch((): ListingCore => ({ function: fn, instructions: [], blocks: [], gaps: [] }));
      out.push(functionSignature(core, (entry) => index.byEntry.get(entry)));
    }
    ctx.progress({ phase, done: fns.length, total: fns.length });
    return out;
  }

  // ------------------------------------------------------- library signatures

  /** The image as the signature matcher reads it: the indexed functions (a generated name is
   * none), the bytes of the executable sections, and the ELF IRELATIVE slots. */
  async #signatureTarget(): Promise<MatchTarget> {
    const index = await this.functions();
    const chunks: { start: bigint; bytes: Uint8Array }[] = [];
    for (const r of await this.regions()) {
      if (!r.exec || !r.fileSize) continue;
      const bytes = new Uint8Array(r.fileSize);
      for (let off = 0; off < r.fileSize; off += 65536)
        for (const run of await this.readBytes(r.start + BigInt(off), Math.min(65536, r.fileSize - off)))
          bytes.set(run.bytes.subarray(0, r.fileSize - Number(run.start - r.start)), Number(run.start - r.start));
      chunks.push({ start: r.start, bytes });
    }
    const resolvers = new Map<bigint, bigint>();
    type Row = { address: { space: string; value: string }; encoding: string; addend: { negative: boolean; magnitude: string } };
    if (this.binary.image.target.format === 'elf')
      for (const row of (await this.#binaryInfoList('relocations').catch(() => [])) as Row[])
        if (row.encoding === 'R_X86_64_IRELATIVE' && row.address.space === 'va' && !row.addend.negative)
          resolvers.set(BigInt(row.address.value), BigInt(row.addend.magnitude));
    const target = this.binary.image.target;
    return {
      architecture: target.architecture === 'arm64' ? 'arm64' : 'x86_64',
      format: target.format,
      read: (address, length) => {
        const chunk = chunks.find((c) => address >= c.start && address < c.start + BigInt(c.bytes.length));
        if (!chunk) return new Uint8Array(0);
        const at = Number(address - chunk.start);
        return chunk.bytes.subarray(at, Math.min(chunk.bytes.length, at + length));
      },
      functions: index.list
        .filter((f) => !f.importStub || f.originalName)
        .map((f) => ({ id: f.id, entry: BigInt(f.entry), name: f.renamed || f.originalName || f.library ? (f.originalName ?? f.mangled ?? f.name) : null })),
      resolvers,
    };
  }

  /**
   * Match signature libraries against the image and name what they find with `library_match`
   * annotations (its provenance: the library and the declaration it implements). Only functions
   * without a name are named; the returned edits put the names back after an undo.
   */
  async applySignatures(libraries: SignatureLibrary[]) {
    const started = Date.now();
    const target = await this.#signatureTarget();
    const report = matchSignatures(libraries, target);
    const edits = report.matches.map((m) => ({
      operation: 'set',
      id: annotationId(`library-match:${m.function_id}`),
      entity_id: m.function_id,
      value: { kind: 'library_match', library: m.library, name: m.name, contract: m.contract },
      status: 'asserted',
      evidence_ids: [],
    }));
    const revision = await this.restoreSignatureEdits(edits);
    return {
      revision,
      edits,
      matched: Object.fromEntries(report.libraries.map((l) => [l.id, l.matched])),
      stubs: report.matches.filter((m) => m.kind === 'ifunc_stub').length,
      ambiguous: report.ambiguous.map((a) => ({ entry: canon(`0x${a.entry.toString(16)}`), candidates: a.candidates.map((c) => c.name) })),
      unnamed: target.functions.filter((f) => f.name === null).length,
      ms: Date.now() - started,
    };
  }

  /** Apply `library_match` edits (in batches: one revision each). */
  async restoreSignatureEdits(edits: unknown[]): Promise<number> {
    return this.#writes.run(async () => {
      for (let i = 0; i < edits.length; i += 1000) await this.#apply(edits.slice(i, i + 1000));
      return this.binary.revision;
    });
  }

  /** Remove annotations by id (undo of a signature application). */
  async removeAnnotations(ids: string[]): Promise<number> {
    return this.#writes.run(async () => {
      for (let i = 0; i < ids.length; i += 1000) await this.#apply(ids.slice(i, i + 1000).map((id) => ({ operation: 'remove', id })));
      return this.binary.revision;
    });
  }

  /** Signature sources of the functions that have a name of their own (symbols, renames),
   * import stubs and library matches left out: a signature library of this build. */
  async linkedSignatureSources(ctx: TaskContext): Promise<SignatureSource[]> {
    const index = await this.functions();
    const named = index.list.filter((f) => !f.importStub && !f.library && (f.originalName || f.renamed));
    const architecture = this.binary.image.target.architecture === 'arm64' ? 'arm64' : 'x86_64';
    const nameAt = (addr: bigint) => {
      const f = index.byEntry.get(canon(`0x${addr.toString(16)}`));
      return f && (f.originalName || f.renamed || f.library) ? (f.mangled ?? f.originalName ?? f.name) : null;
    };
    const out: SignatureSource[] = [];
    for (const [n, fn] of named.entries()) {
      ctx.signal.throwIfAborted();
      ctx.progress({ phase: 'functions', done: n, total: named.length, detail: fn.name });
      const range = index.ranges.get(fn.id)?.find(([start]) => start === BigInt(fn.entry));
      if (!range) continue;
      const core = await this.#buildListing(fn.id, false).catch(() => null);
      if (!core) continue;
      const bytes = await this.#read(range[0], Number(range[1] - range[0]));
      out.push(
        linkedSource(
          {
            names: [fn.mangled ?? fn.originalName ?? fn.name],
            entry: range[0],
            bytes,
            instructions: core.instructions.map((insn) => ({
              addr: BigInt(insn.addr),
              size: insn.size,
              mnemonic: insn.mnemonic,
              operands: insn.operands,
              flow: insn.flow,
              refs: [...insn.refs.map((r) => r.addr), ...(insn.resolved ?? []).map((r) => r.addr)].filter(Boolean),
            })),
          },
          architecture,
          nameAt,
        ),
      );
    }
    ctx.progress({ phase: 'functions', done: named.length, total: named.length });
    return out;
  }

  /** Per-function instruction text for the immediate search, at one revision (capped). */
  #insnText: { revision: number; byFunction: Map<string, { addr: string; mnemonic: string; operands: string }[]>; units: number } | null = null;

  async instructionText(functionId: string) {
    const revision = this.binary.revision;
    if (this.#insnText?.revision !== revision) this.#insnText = { revision, byFunction: new Map(), units: 0 };
    const cache = this.#insnText;
    const hit = cache.byFunction.get(functionId);
    if (hit) return hit;
    // A function the listing already disassembled at this revision is not fetched again.
    if (this.#listings?.revision === revision && this.#listings.ready.has(functionId)) {
      const listed = this.#listings.map.get(functionId) ?? this.#listings.map.get(`lite:${functionId}`);
      if (listed) return (await listed).instructions;
    }
    type Compact = { address: { value: string }; presentation: { mnemonic: string; operands: string } | null };
    const out: { addr: string; mnemonic: string; operands: string }[] = [];
    let cursor: string | undefined;
    do {
      const data = need(
        await this.binary.getFunction(functionId, { view: 'disassembly', detail: 'compact', page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      ) as { items: Compact[]; page: { next_cursor: string | null } };
      for (const i of data.items)
        if (i.presentation) out.push({ addr: canon(i.address.value), mnemonic: i.presentation.mnemonic, operands: i.presentation.operands });
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor);
    // A second search of the same revision skips OpenDecomp; ~2M instructions at most are kept.
    if (cache.units + out.length <= 2_000_000) {
      cache.byFunction.set(functionId, out);
      cache.units += out.length;
    }
    return out;
  }

  /** Binary search (bytes, text) or operand value search (every function's disassembly). */
  async search(query: SearchQuery, ctx: TaskContext): Promise<SearchResult> {
    try {
      return await runSearch(
        {
          regions: () => this.regions(),
          read: (addr, length) => this.readBytes(addr, length),
          functions: async () =>
            [...(await this.functions()).list].sort((a, b) => cmpBig(a.entry, b.entry)).map((f) => ({ id: f.id, name: f.name, entry: f.entry })),
          instructions: (id) => this.instructionText(id),
        },
        query,
        ctx,
      );
    } catch (error) {
      if (error instanceof SearchError) throw new ApiError(400, error.message);
      throw error;
    }
  }

  #navMap: { revision: string; value: Promise<NavMap> } | null = null;

  /** The navigation strip's map (functions, strings, data symbols over the mapped sections), per revision. */
  navMap(): Promise<NavMap> {
    const revision = `${this.binary.revision}/${this.#dataVersion}`;
    if (this.#navMap?.revision === revision) return this.#navMap.value;
    const value = (async () => {
      const [regions, index, strings, symbols, data] = await Promise.all([
        this.regions(),
        this.functions(),
        this.#loadStrings(),
        this.symbols().catch(() => []),
        this.#workspace.data(this.record.id),
      ]);
      const items: { start: bigint; size: number; kind: NavKind }[] = [];
      for (const s of symbols)
        if (s.kind === 'object' && s.addr && !index.byEntry.has(s.addr)) items.push({ start: BigInt(s.addr), size: s.size || 1, kind: 'data' });
      // Data defined with D / A / O / *: a string definition shows as a string.
      for (const [addr, def] of Object.entries(data.defs)) items.push({ start: BigInt(addr), size: defSize(def), kind: def.type === 'string' ? 'string' : 'data' });
      for (const [addr, s] of strings) items.push({ start: BigInt(addr), size: s.length + (s.terminated ? 1 : 0), kind: 'string' });
      for (const f of index.list)
        for (const [start, end] of index.ranges.get(f.id) ?? []) items.push({ start, size: Number(end - start), kind: f.importStub ? 'import' : f.library ? 'library' : 'code' });
      return buildNavMap(regions, items);
    })();
    this.#navMap = { revision, value };
    value.catch(() => {
      if (this.#navMap?.value === value) this.#navMap = null;
    });
    return value;
  }

  // ------------------------------------------------------------- annotations

  /** Rename a function (by entity id) or a global (by address). An empty name restores the original. */
  async rename(target: { id?: string; addr?: string }, name: string) {
    const trimmed = name.trim();
    if (trimmed !== '' && !NAME_RE.test(trimmed)) throw new ApiError(400, NAME_ERROR);
    const key = target.id ? `name:${target.id}` : `name:va:${canon(target.addr!)}`;
    const id = annotationId(key);
    return this.#writes.run(async () => {
      const edit =
        trimmed === ''
          ? { operation: 'remove' as const, id }
          : {
              operation: 'set' as const,
              id,
              ...(target.id
                ? { entity_id: target.id }
                : { address: { image_id: this.binary.image.id, space: 'va' as const, value: canon(target.addr!) } }),
              value: { kind: 'name' as const, value: trimmed },
              status: 'asserted' as const,
              evidence_ids: [],
            };
      const result = await this.#service.execute('annotations_apply', {
        project_id: this.binary.projectId,
        expected_revision: this.binary.revision,
        author: 'open-reverse',
        origin: 'user',
        edits: [edit],
      } as ToolInput<'annotations_apply'>);
      if (trimmed === '' && result.state !== 'complete') return { revision: this.binary.revision };
      const data = need(result) as { revision: number };
      this.binary.revision = data.revision;
      return { revision: data.revision };
    });
  }

  /**
   * Renames a global (N in the listing). The name is an OpenDecomp annotation where OpenDecomp
   * takes the address as data storage, and is kept for the listing's labels either way.
   */
  renameGlobal(addr: string, name: string) {
    return this.#dataOps.run(() => this.#renameGlobal(addr, name));
  }

  async #renameGlobal(addr: string, name: string) {
    const key = canon(addr);
    if (name.trim() !== '' && !NAME_RE.test(name.trim())) throw new ApiError(400, NAME_ERROR);
    let note: string | null = null;
    let result: { revision: number };
    try {
      result = await this.rename({ addr: key }, name);
    } catch (error) {
      const listing = await this.#linearListing();
      if (!(error instanceof ApiError) || itemAt(listing.layout, BigInt(key))?.kind === 'code' || sectionIndex(listing.layout.sections, BigInt(key)) < 0) throw error;
      note = `kept in the listing only: ${error.message.split('\n')[0]}`;
      result = { revision: this.binary.revision };
    }
    const data = await this.#workspace.data(this.record.id);
    if (name.trim()) data.names[key] = name.trim();
    else delete data.names[key];
    await this.#workspace.setData(this.record.id, data);
    this.#dataVersion++;
    await this.#warm(key);
    return { ...result, note };
  }

  /** Applies one annotation batch at the current revision; every error diagnostic is reported. */
  async #apply(edits: unknown[]): Promise<{ revision: number }> {
    const result = await this.#service.execute('annotations_apply', {
      project_id: this.binary.projectId,
      expected_revision: this.binary.revision,
      author: AUTHOR,
      origin: 'user',
      edits,
    } as ToolInput<'annotations_apply'>);
    if (!('data' in result) || !result.data) throw new ApiError(400, errorMessages(result));
    this.binary.revision = result.data.revision;
    return { revision: result.data.revision };
  }

  async #functionAnnotations(functionId: string) {
    const data = need(
      await this.#service.execute('function_get', { ...this.#ctx, function_id: functionId, view: 'metadata' } as ToolInput<'function_get'>),
    ) as { annotations?: { id: string; entity_id: string; author: string; status: string; value: { kind: string } }[] };
    return data.annotations ?? [];
  }

  /** Declares C types (struct/union/enum/typedef) in the image's type library (`types_declare`). */
  async declareTypes(source: string) {
    if (!source.trim()) throw new ApiError(400, 'Nothing to declare');
    return this.#writes.run(async () => {
      const result = await this.#service.execute('types_declare', {
        project_id: this.binary.projectId,
        expected_revision: this.binary.revision,
        image_id: this.binary.image.id,
        author: AUTHOR,
        origin: 'user',
        source,
      } as ToolInput<'types_declare'>);
      if (!('data' in result) || !result.data) throw new ApiError(400, errorMessages(result));
      const data = result.data;
      this.binary.revision = data.revision;
      for (const t of data.types) {
        if (t.name) this.#typeNames.set(t.name, t.type_id);
        else if (/^[A-Za-z_][A-Za-z0-9_]*\*$/.test(t.key)) this.#typeNames.set(t.key, t.type_id);
      }
      const named = new Map(data.types.flatMap((t) => (t.name ? [[t.name, t.annotation_id] as const] : [])));
      return { revision: data.revision, declared: [...named.keys()], annotations: Object.fromEntries(named) };
    });
  }

  /** Removes declarations from the type library, in one revision. */
  async removeLibraryTypes(annotations: string[]) {
    if (annotations.length === 0) return { revision: this.binary.revision };
    return this.#writes.run(() => this.#apply(annotations.map((id) => ({ operation: 'remove', id }))));
  }

  /**
   * This app's live annotations on a function (its name, signature and the types the
   * signature declares), exactly as stored: what undo restores.
   */
  async annotationSnapshot(functionId: string): Promise<AnnotationSnapshot> {
    const all = (await this.#functionAnnotations(functionId)) as (StoredAnnotation & { author: string })[];
    return all
      .filter((a) => a.author === AUTHOR && a.status !== 'retracted' && a.entity_id === functionId)
      .map((a) => ({ id: a.id, value: a.value, status: a.status }))
      .sort((a, b) => (a.id < b.id ? -1 : 1));
  }

  /** Makes this app's annotations on a function equal to a snapshot, in one revision. */
  async restoreAnnotations(functionId: string, snapshot: AnnotationSnapshot) {
    await this.functionById(functionId);
    return this.#writes.run(async () => {
      const current = new Map((await this.annotationSnapshot(functionId)).map((a) => [a.id, a]));
      const wanted = new Set(snapshot.map((a) => a.id));
      const edits: unknown[] = [];
      for (const id of current.keys()) if (!wanted.has(id)) edits.push({ operation: 'remove', id });
      for (const a of snapshot) {
        if (JSON.stringify(current.get(a.id)) === JSON.stringify(a)) continue;
        // An assertion's evidence is recorded by OpenDecomp itself, as when the edit was first made.
        edits.push({ operation: 'set', id: a.id, entity_id: functionId, value: a.value, status: a.status, evidence_ids: [] });
      }
      return edits.length ? this.#apply(edits) : { revision: this.binary.revision };
    });
  }

  /** The current C prototype of a function (its C-like declaration line) and whether the user declared it. */
  async prototype(functionId: string) {
    const d = await this.decompile(functionId, { language: 'c-like', inference: 'proven', view: 'source' });
    const span = d.declarationSpan;
    const text = (span ? d.text.slice(span.start, span.end) : '').replace(/\s*\{\s*$/, '').trim();
    const declared = (await this.#functionAnnotations(functionId)).some(
      (a) => a.id === annotationId(`signature:${functionId}`) && a.status !== 'retracted',
    );
    return { text, declared };
  }

  /**
   * Declares a function's prototype (IDA's Y) as an asserted `signature` annotation. The
   * anonymous types it needs are declared on the function; named types refer to the type
   * library. A different function name in the prototype renames the function. An empty text
   * removes the signature.
   */
  async setSignature(functionId: string, text: string) {
    const fn = await this.functionById(functionId);
    const slice = this.binary.image.selected_slice_id;
    const signatureId = annotationId(`signature:${functionId}`);
    const result = await this.#writes.run(async () => {
      const ours = (await this.#functionAnnotations(functionId)).filter(
        (a) =>
          a.author === AUTHOR &&
          a.status !== 'retracted' &&
          a.entity_id === functionId &&
          (a.id === signatureId || a.value.kind === 'type'),
      );
      if (!text.trim()) {
        if (ours.length === 0) return { revision: this.binary.revision };
        return this.#apply(ours.map((a) => ({ operation: 'remove', id: a.id })));
      }
      let compiled;
      try {
        compiled = compilePrototype(text, this.#parse, this.#typeIds);
      } catch (error) {
        if (error instanceof PrototypeError) throw new ApiError(400, error.message);
        throw error;
      }
      const set = (id: string, value: unknown) => ({ operation: 'set', id, entity_id: functionId, value, status: 'asserted', evidence_ids: [] });
      const edits: unknown[] = [];
      const typeAnnotations = new Set<string>();
      for (const [typeId, definition] of compiled.declarations) {
        const id = annotationId(`signature-type:${functionId}:${typeId}`);
        typeAnnotations.add(id);
        edits.push(set(id, { kind: 'type', type_id: typeId, definition: encodeTypeDefinition(definition as Definition) }));
      }
      edits.push(
        set(signatureId, {
          kind: 'signature',
          value: {
            abi: this.binary.image.target.abi,
            return_type: compiled.returnType,
            parameters: compiled.parameters.map((p, i) => ({
              id: entityIdentity(slice, 'open-reverse-parameter', [functionId, String(i)]),
              name: p.name,
              type_id: p.type,
            })),
            variadic: compiled.variadic,
            noreturn: false,
            evidence_ids: [],
          },
        }),
      );
      for (const a of ours) if (a.value.kind === 'type' && !typeAnnotations.has(a.id)) edits.push({ operation: 'remove', id: a.id });
      // Mach-O symbols carry a leading underscore that the C spelling drops.
      const spellings = [fn.name, fn.originalName].flatMap((n) => (n ? [n, n.replace(/^_/, '')] : []));
      if (!spellings.includes(compiled.name)) edits.push(set(annotationId(`name:${functionId}`), { kind: 'name', value: compiled.name }));
      return this.#applyNamed(edits, compiled.namedTypes);
    });
    if (!text.trim()) return { ...result, confirmed: true };
    // OpenDecomp binds a declared signature only where the reconstruction confirms it
    // (and only with complete type recovery); the header then says "source interface".
    const d = await this.decompile(functionId, { language: 'c-like', inference: 'proven', view: 'source' });
    return { ...result, confirmed: /source interface/.test(d.text.split('\n', 1)[0] ?? '') };
  }

  /**
   * Renames a parameter or local: a `name` annotation on its value subject. Those are
   * analysis-catalog subjects, so a decompilation must be published at the current revision.
   */
  /** Applies `edits`; a failure from undeclared named types says which ones to declare. */
  async #applyNamed(edits: unknown[], namedTypes: string[]) {
    try {
      return await this.#apply(edits);
    } catch (error) {
      if (error instanceof ApiError && /not a declaration|resolve/.test(error.message) && namedTypes.length) {
        // Names this session saw in the library are known; the others are the likely culprits.
        const unknown = namedTypes.filter((n) => !this.#typeNames.has(n));
        throw new ApiError(
          400,
          `Declare ${(unknown.length ? unknown : namedTypes).join(', ')} in the Types view first: named types refer to the type library.\n${error.message}`,
        );
      }
      throw error;
    }
  }

  readonly #parse = (source: string) => parseCDeclarations(source, { abi: this.binary.image.target.abi });

  /** Type IDs of compiled C types: library names, else content-derived IDs for anonymous types. */
  get #typeIds(): TypeIds {
    const slice = this.binary.image.selected_slice_id;
    return {
      named: (name) => this.#typeNames.get(name) ?? userTypeIdentity(slice, name),
      pointerTo: (name) => this.#typeNames.get(`${name}*`) ?? userTypeIdentity(slice, `${name}*`),
      local: (definition) => entityIdentity(slice, 'open-reverse-type', [JSON.stringify(encodeTypeDefinition(definition as Definition))]),
    };
  }

  /**
   * Sets (or, with an empty text, removes) the C type of a parameter, local or global: an
   * asserted `type` annotation binding its subject to the type. The anonymous types it
   * needs (builtins, pointers, arrays) are declared, nameless, on the image's type library
   * with content-derived IDs, so one declaration serves every subject and a global (whose
   * type OpenDecomp resolves outside any function) finds them too.
   */
  async #setType(subject: { entity_id: string } | { address: { image_id: string; space: 'va'; value: string } }, key: string, text: string) {
    const id = annotationId(`type:${key}`);
    return this.#writes.run(async () => {
      if (!text.trim()) {
        const result = await this.#service.execute('annotations_apply', {
          project_id: this.binary.projectId,
          expected_revision: this.binary.revision,
          author: AUTHOR,
          origin: 'user',
          edits: [{ operation: 'remove', id }],
        } as ToolInput<'annotations_apply'>);
        // Nothing to remove is fine.
        if ('data' in result && result.data) this.binary.revision = result.data.revision;
        return { revision: this.binary.revision };
      }
      let compiled;
      try {
        compiled = compileType(text, this.#parse, this.#typeIds);
      } catch (error) {
        if (error instanceof PrototypeError) throw new ApiError(400, error.message);
        throw error;
      }
      const library = typeLibraryIdentity(this.binary.image.selected_slice_id);
      const edits: unknown[] = [...compiled.declarations].map(([typeId, definition]) => ({
        operation: 'set',
        id: annotationId(`library-type:${typeId}`),
        entity_id: library,
        value: { kind: 'type', type_id: typeId, definition: encodeTypeDefinition(definition as Definition) },
        status: 'asserted',
        evidence_ids: [],
      }));
      edits.push({ operation: 'set', id, ...subject, value: { kind: 'type', type_id: compiled.type }, status: 'asserted', evidence_ids: [] });
      return this.#applyNamed(edits, compiled.namedTypes);
    });
  }

  /**
   * Retypes a parameter or local (Y on a variable); its value subject must be in a
   * decompilation at this revision. Resolves to the type the new pseudocode declares it
   * with (`shown`): OpenDecomp may not honour a type its analysis contradicts.
   */
  async setVariableType(functionId: string, valueId: string, text: string, options: DecompileOptions) {
    let result;
    try {
      result = await this.#setType({ entity_id: valueId }, valueId, text);
    } catch (error) {
      if (!(error instanceof ApiError) || !/absent|subject/i.test(error.message)) throw error;
      // The project moved on since this pseudocode was produced: publish it at this revision.
      await this.decompile(functionId, options);
      result = await this.#setType({ entity_id: valueId }, valueId, text);
    }
    const d = await this.decompile(functionId, { ...options, language: 'c-like' });
    return { ...result, shown: d.variables.find((v) => v.id === valueId)?.type ?? null };
  }

  /** Retypes the global (data entity) at an address. */
  async setGlobalType(addr: string, text: string) {
    const a = canon(addr);
    return this.#setType({ address: { image_id: this.binary.image.id, space: 'va', value: a } }, `va:${a}`, text);
  }

  /**
   * The C declaration of a new structure `name` with the members OpenDecomp recovered for
   * what a pointer variable points to (its `struct_<hex>` in this function's text), at the
   * same offsets.
   */
  async structFromVariable(functionId: string, variable: string, name: string, options: DecompileOptions) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new ApiError(400, 'Structure names must be C identifiers');
    const d = await this.decompile(functionId, { ...options, language: 'c-like' });
    const v = d.variables.find((x) => x.name === variable);
    if (!v) throw new ApiError(404, `No variable ${variable} in this function`);
    const tag = /^(?:const )?(struct_[0-9a-f]+) \*$/.exec(v.type ?? '')?.[1];
    if (!tag)
      throw new ApiError(
        422,
        `${variable} (${v.type ?? 'unknown type'}) is not a pointer to a structure OpenDecomp recovered: no member accesses through it were found`,
      );
    const recovered = declaredMembers(d.text, tag);
    if (!recovered || recovered.members.length === 0) throw new ApiError(422, `OpenDecomp declares no members for ${tag}`);
    try {
      return { declaration: recoveredDeclaration(recovered, name, this.#parse), recovered: tag };
    } catch (error) {
      throw new ApiError(422, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Field offsets and sizes of structure `name` in `source`, laid out by OpenDecomp's C
   * declaration parser (what `types_declare` would store). `library` (the type library's
   * other declarations) is in scope, so members may use them.
   */
  layoutStructure(source: string, name: string, library: string[]) {
    const own = structLayout(source, name, this.#parse);
    if (!('errors' in own) || library.length === 0) return own;
    // Library declarations first, dependencies before use: retry the ones that need others.
    let scope: string[] = [];
    let pending = library;
    while (pending.length) {
      const left = pending.filter((decl) => this.#parse([...scope, decl].join('\n')).diagnostics.length > 0);
      scope = [...scope, ...pending.filter((decl) => !left.includes(decl))];
      if (left.length === pending.length) break;
      pending = left;
    }
    return structLayout([...scope, source].join('\n'), name, this.#parse);
  }

  async renameVariable(
    functionId: string,
    valueId: string,
    name: string,
    options: { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' },
  ) {
    const trimmed = name.trim();
    if (trimmed !== '' && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed)) throw new ApiError(400, 'Variable names must be C identifiers');
    try {
      return await this.rename({ id: valueId }, trimmed);
    } catch {
      // The project moved on since this pseudocode was produced: publish it at this revision.
      await this.decompile(functionId, options);
      return this.rename({ id: valueId }, trimmed);
    }
  }

  async comment(addr: string, text: string) {
    return this.#workspace.setComment(this.record.id, canon(addr), text);
  }

  async comments() {
    return this.#workspace.comments(this.record.id);
  }

  async bookmark(addr: string, description: string | null) {
    return this.#workspace.setBookmark(this.record.id, canon(addr), description);
  }

  async bookmarks() {
    return this.#workspace.bookmarks(this.record.id);
  }
}
