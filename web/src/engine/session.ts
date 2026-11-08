// One open binary: an OpenDecomp BinarySession plus the caches and
// presentation logic the UI needs.

import { openBinary, type BinarySession, type ToolInput, type ToolResult } from '@od/api/index.js';
import type { QueryService } from '@od/service/queries/index.js';
import { entityIdentity, userTypeIdentity } from '@od/core/identity.js';
import { encodeTypeDefinition } from '@od/core/serialization.js';
import { parseCDeclarations } from '@od/metadata/c-declarations/index.js';
import { canon, operandConstants } from './hex.ts';
import { compilePrototype, PrototypeError, type TypeDefinition } from './prototype.ts';
import { createHash } from './shims/crypto.ts';
import type { BinaryRecord, Workspace } from './workspace.ts';

/** The largest budget OpenDecomp accepts: discovery of a real binary needs it. */
const DISCOVERY_BUDGET = {
  instructions: 1_000_000,
  blocks: 100_000,
  ir_nodes: 10_000_000,
  work: 100_000_000,
  deadline_ms: 300_000,
} as const;
const MAX_LIST_ITEMS = 200_000;

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
  renamed: boolean;
  entry: string;
  size: number;
  boundary: string;
  analysis: string;
  importStub: boolean;
}

export interface Instruction {
  addr: string;
  size: number;
  bytes: string;
  mnemonic: string;
  operands: string;
  valid: boolean;
  flow: { kind: string; targets: string[]; conditional: boolean };
  refs: { text: string; addr: string; kind: 'function' | 'string' | 'code' | 'data'; label: string }[];
}

export interface Block {
  id: string;
  start: string;
  insns: string[];
  edges: { to: string | null; target: string | null; kind: string; conditional: boolean }[];
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

export class AnalysisSession {
  readonly record: BinaryRecord;
  readonly binary: BinarySession;
  /** Parallel decompile workers this session was opened with. */
  threads = 1;
  readonly gate = new Gate();
  readonly #workspace: Workspace;
  readonly #writes = new Mutex();
  discovery: DiscoveryStatus = { state: 'idle', message: null };
  #functions: { revision: number; list: FunctionSummary[]; byId: Map<string, FunctionSummary>; byEntry: Map<string, FunctionSummary>; indexState: string } | null = null;
  #strings: Promise<Map<string, { text: string; encoding: string; id: string }>> | null = null;
  #mappings: Promise<Mapping[]> | null = null;
  /** Type library IDs by C name (and `Name*` for its pointer type), including typedef aliases. */
  readonly #typeNames = new Map<string, string>();

  private constructor(workspace: Workspace, record: BinaryRecord, binary: BinarySession) {
    this.#workspace = workspace;
    this.record = record;
    this.binary = binary;
  }

  static async open(workspace: Workspace, record: BinaryRecord, threads = 1): Promise<AnalysisSession> {
    const binary = await openBinary(workspace.binaryPath(record), {
      cachePath: workspace.projectRoot(record.id),
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

  /** Whole-image function discovery, one committed step at a time, in the background. */
  async #discover(): Promise<void> {
    const index = await this.functions();
    if (index.indexState === 'complete') {
      this.discovery = { state: 'done', message: null };
      return;
    }
    this.discovery = { state: 'running', message: null };
    try {
      for (;;) {
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
    let cursor: string | undefined;
    let indexState = 'complete';
    do {
      const data = need(
        await this.binary.findFunctions({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      );
      for (const fn of data.items) {
        const entry = canon(fn.entry.value);
        const size = fn.ranges.reduce((n, r) => n + Number(BigInt(r.size)), 0);
        list.push({
          id: fn.id,
          name: fn.display_name ?? fn.original_name ?? `sub_${entry.slice(2)}`,
          originalName: fn.original_name,
          renamed: fn.display_name !== null && fn.display_name !== fn.original_name,
          entry,
          size,
          boundary: fn.boundary,
          analysis: fn.analysis,
          importStub: (fn as { kind?: string }).kind === 'import_stub',
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
      indexState,
    };
    this.#functions = index;
    return index;
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
      virtual_range: { start: { value: string }; size: string } | null;
      file_range: { start: { value: string }; size: string } | null;
      permissions: string[];
    };
    const items = (await this.#binaryInfoList('sections')) as Section[];
    return items
      .map((s) => ({
        id: s.id,
        name: s.name,
        kind: s.kind,
        start: s.virtual_range ? canon(s.virtual_range.start.value) : null,
        size: s.virtual_range ? Number(BigInt(s.virtual_range.size)) : 0,
        fileOffset: s.file_range ? canon(s.file_range.start.value) : null,
        fileSize: s.file_range ? Number(BigInt(s.file_range.size)) : 0,
        permissions: s.permissions,
      }))
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
      const map = new Map<string, { text: string; encoding: string; id: string }>();
      let cursor: string | undefined;
      do {
        const data = need(
          await this.binary.findStrings({ page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
        );
        for (const s of data.items) map.set(canon(s.address.value), { text: s.text, encoding: s.encoding, id: s.id });
        cursor = data.page.next_cursor ?? undefined;
      } while (cursor && map.size < MAX_LIST_ITEMS);
      return map;
    })();
    return this.#strings;
  }

  async strings() {
    const map = await this.#loadStrings();
    return [...map.entries()].map(([addr, s]) => ({ addr, ...s }));
  }

  async symbols() {
    type Item = { kind: string; symbol?: { id: string; display_name: string | null; original_name: string | null; kind: string; address: { value: string } | null; size: string | null; binding?: string } };
    const out: { id: string; name: string; kind: string; addr: string | null; size: number; binding: string | null }[] = [];
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
    do {
      const data = need(
        await this.binary.getFunction(functionId, { view: 'cfg', page: { limit: 1000, ...(cursor ? { cursor } : {}) } }),
      ) as { items: typeof blocksRaw; page: { next_cursor: string | null } };
      blocksRaw.push(...data.items);
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor);

    const index = await this.functions();
    const strings = await this.#loadStrings();
    const comments = await this.#workspace.comments(this.record.id);
    const bytes = await this.#instructionBytes(raw.map((i) => ({ addr: BigInt(i.address.value), size: i.size })));

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
          refs.push({ text: c.text, addr: a, kind: 'data', label: '' });
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
      });
    }
    const blocks: Block[] = blocksRaw.map((b) => ({
      id: b.id,
      start: canon(b.ranges[0]?.start.value ?? '0x0'),
      insns: b.instructions.map((id) => idToAddr.get(id)).filter((a): a is string => !!a),
      edges: b.edges.map((e) => ({ to: e.to, target: e.target ? canon(e.target.value) : null, kind: e.kind, conditional: e.conditional })),
    }));
    const inRange = (a: string) => insns.some((i) => i.addr === a);
    return {
      function: fn,
      instructions: insns,
      blocks,
      gaps,
      comments: Object.fromEntries(Object.entries(comments).filter(([a]) => inRange(a))),
    };
  }

  async #instructionBytes(items: { addr: bigint; size: number }[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    if (items.length === 0) return out;
    // Read contiguous runs (functions may be split into several ranges).
    const sorted = [...items].sort((a, b) => (a.addr < b.addr ? -1 : 1));
    let runStart = sorted[0]!.addr;
    let runEnd = runStart;
    const runs: [bigint, bigint][] = [];
    for (const it of sorted) {
      if (it.addr > runEnd + 64n || it.addr + BigInt(it.size) - runStart > 65536n) {
        runs.push([runStart, runEnd]);
        runStart = it.addr;
      }
      runEnd = it.addr + BigInt(it.size) > runEnd ? it.addr + BigInt(it.size) : runEnd;
    }
    runs.push([runStart, runEnd]);
    const chunks: { start: bigint; hex: string }[] = [];
    for (const [s, e] of runs) {
      try {
        const mem = await this.memory(canon(s), Number(e - s));
        for (const seg of mem.segments) if (seg.hex) chunks.push({ start: BigInt(seg.start), hex: seg.hex });
      } catch {
        // Bytes are cosmetic; a failed read leaves them empty.
      }
    }
    for (const it of items) {
      const c = chunks.find((c) => it.addr >= c.start && it.addr + BigInt(it.size) <= c.start + BigInt(c.hex.length / 2));
      if (!c) continue;
      const off = Number(it.addr - c.start) * 2;
      out.set(canon(it.addr), c.hex.slice(off, off + it.size * 2));
    }
    return out;
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
      p = this.gate.shared(() => this.decompileOnce(functionId, options, signal));
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
    for (const m of e.mappings) {
      const id = e.ids[m.semantic_refs[0] ?? -1];
      if (!id || id === functionId) continue;
      const name = declaredName(e.text.slice(m.start, m.end), e.language);
      if (!name || named.has(name)) continue;
      named.add(name);
      variables.push({ name, id, parameter: !!decl && m.start >= decl.start && m.end <= decl.end });
    }
    return {
      function: fn,
      text: e.text,
      language: e.language,
      variables,
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
    type Ref = { from: { value: string } | null; to: { value: string } | null; from_function: string | null; to_entity: string | null; kind: string; status: string; target_role: string };
    const items: Ref[] = [];
    let cursor: string | undefined;
    do {
      const data = need(
        await this.binary.getReferences({
          target: target.id ? { kind: 'entity', id: target.id } : { kind: 'address', address: { image_id: this.binary.image.id, space: 'va', value: canon(target.addr!) } },
          direction,
          page: { limit: 1000, ...(cursor ? { cursor } : {}) },
        } as ToolInput<'xrefs_get'>),
      ) as { items: Ref[]; page: { next_cursor: string | null } };
      items.push(...data.items);
      cursor = data.page.next_cursor ?? undefined;
    } while (cursor && items.length < 10_000);
    const nameOf = (addr: string | null) => {
      if (!addr) return null;
      return index.byEntry.get(addr)?.name ?? (strings.get(addr) ? JSON.stringify(strings.get(addr)!.text) : null);
    };
    return items.map((r) => {
      const from = r.from ? canon(r.from.value) : null;
      const to = r.to ? canon(r.to.value) : null;
      const fromFn = r.from_function ? index.byId.get(r.from_function) : undefined;
      return {
        from,
        to,
        fromFunction: fromFn ? { id: fromFn.id, name: fromFn.name, entry: fromFn.entry } : null,
        toName: nameOf(to),
        kind: r.kind,
        status: r.status,
        role: r.target_role,
      };
    });
  }

  // ------------------------------------------------------------- annotations

  /** Rename a function (by entity id) or a global (by address). An empty name restores the original. */
  async rename(target: { id?: string; addr?: string }, name: string) {
    const trimmed = name.trim();
    if (trimmed !== '' && !/^[A-Za-z_][A-Za-z0-9_:$.@]*$/.test(trimmed))
      throw new ApiError(400, 'Names must be identifiers (letters, digits, _ : $ . @)');
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
      return { revision: data.revision, declared: [...new Set(data.types.flatMap((t) => (t.name ? [t.name] : [])))] };
    });
  }

  /** Removes one declaration from the type library. */
  async removeLibraryType(annotation: string) {
    return this.#writes.run(() => this.#apply([{ operation: 'remove', id: annotation }]));
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
    type Definition = Parameters<typeof encodeTypeDefinition>[0];
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
        compiled = compilePrototype(text, (source) => parseCDeclarations(source, { abi: this.binary.image.target.abi }), {
          named: (name) => this.#typeNames.get(name) ?? userTypeIdentity(slice, name),
          pointerTo: (name) => this.#typeNames.get(`${name}*`) ?? userTypeIdentity(slice, `${name}*`),
          local: (definition) =>
            entityIdentity(slice, 'open-reverse-type', [JSON.stringify(encodeTypeDefinition(definition as Definition))]),
        });
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
      try {
        return await this.#apply(edits);
      } catch (error) {
        if (error instanceof ApiError && /not a declaration/.test(error.message) && compiled.namedTypes.length) {
          // Names this session saw in the library are known; the others are the likely culprits.
          const unknown = compiled.namedTypes.filter((n) => !this.#typeNames.has(n));
          throw new ApiError(
            400,
            `Declare ${(unknown.length ? unknown : compiled.namedTypes).join(', ')} in the Types view first: named types in a prototype refer to the type library.\n${error.message}`,
          );
        }
        throw error;
      }
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
}
