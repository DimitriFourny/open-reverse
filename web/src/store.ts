// Application state: one module-level store, read with useStore(selector).

import { useSyncExternalStore } from 'react';
import {
  api,
  type AnnotationSnapshot,
  type BinaryRecord,
  type CallNode,
  type Decompilation,
  type DecompileOptions,
  type Discovery,
  type FunctionSummary,
  type ImageInfo,
  type Listing,
  type Section,
  type StringItem,
  type SymbolItem,
  type TypesInfo,
  type LibraryType,
  type Xref,
  type DataAction,
  type DataDef,
  type XrefDirection,
  type DebugSummary,
  type SignatureApplication,
  type EnumDef,
} from './api.ts';
import { historyFor, type UndoEntry } from './undo.ts';
import { operandTokens } from './views/tokens.ts';
import { looksLikeDebugFile } from './engine/debugfile.ts';
import { canon, cIdentifier } from './util.ts';

export type ViewMode = 'linear' | 'graph' | 'hex' | 'types';
export type SidebarTab = 'functions' | 'strings' | 'symbols' | 'sections' | 'calls';

export interface Location {
  fnId: string | null;
  addr: string;
  view: ViewMode;
}

/** What N (rename) and X (xrefs) act on. */
export type Selection =
  | { kind: 'function'; fnId: string }
  /**
   * An address: an operand target, or a data item of the listing (`name`: its label);
   * `global`: a global the pseudocode names, with its declared C type (Y retypes it).
   */
  | { kind: 'addr'; addr: string; name?: string; global?: { name: string; type: string } }
  /** A parameter or local of the pseudocode (N renames it, Y retypes it). */
  | { kind: 'variable'; fnId: string; id: string; name: string; parameter: boolean; type: string | null };

/** What Y sets the C type of: a parameter or local (its value subject), or a global by address. */
export type TypeTarget = { fnId: string; valueId: string } | { addr: string };

export type Dialog =
  | { kind: 'goto' }
  | { kind: 'rename'; target: { id?: string; addr?: string }; current: string; what: string }
  | { kind: 'comment'; addr: string; current: string }
  | { kind: 'signature'; fnId: string; name: string; current: string; declared: boolean }
  | { kind: 'renameVar'; fnId: string; valueId: string; current: string; parameter: boolean }
  /** `*`: an array of `type` at `addr`. */
  | { kind: 'array'; addr: string; type: string; current: number; max: number }
  /** Y on a variable or global: its C type. */
  | { kind: 'retype'; target: TypeTarget; what: string; current: string }
  /** S on a pointer variable: a new structure from the members accessed through it. */
  | { kind: 'createStruct'; fnId: string; valueId: string; variable: string; type: string }
  /** Alt+M: bookmark an address (current: its description when already bookmarked). */
  | { kind: 'bookmark'; addr: string; current: string | null }
  /** M on a constant: display it as an enum (`key`: `<0xinsn>|<hex value>`). */
  | { kind: 'enum'; key: string; value: string }
  /** Ctrl+M: the bookmark list. */
  | { kind: 'bookmarks' }
  /** Pick the other binary to diff the open one with. */
  | { kind: 'diffWith' }
  /** The open binary's debug information: what was found, add/replace/remove its debug file. */
  | { kind: 'debugInfo' }
  /** Shift+F5: library signatures (IDA's signatures window). */
  | { kind: 'signatures' }
  | { kind: 'open' };

export type XrefTarget = { id?: string; addr?: string };

export interface Async<T> {
  status: 'idle' | 'loading' | 'ready' | 'error';
  data: T | null;
  error: string | null;
}

const idle = <T,>(): Async<T> => ({ status: 'idle', data: null, error: null });

export interface State {
  binaries: BinaryRecord[];
  bid: string | null;
  info: ImageInfo | null;
  openError: string | null;
  functions: FunctionSummary[];
  byId: Map<string, FunctionSummary>;
  byEntry: Map<string, FunctionSummary>;
  byName: Map<string, FunctionSummary>;
  revision: number;
  indexState: string;
  discovery: Discovery | null;
  loc: Location | null;
  history: Location[];
  future: Location[];
  showPseudo: boolean;
  showBytes: boolean;
  options: DecompileOptions;
  listing: Async<Listing>;
  decomp: Async<Decompilation>;
  comments: Record<string, string>;
  /** Bumped when data definitions or listing names change (the linear view reloads). */
  dataVersion: number;
  bookmarks: Record<string, string>;
  /** Constants displayed as an enum (M): `<0xinsn>|<hex value>` -> enum id. */
  enumDisplays: Record<string, string>;
  /** The enums M can pick from (bundled for the platform, then declared), loaded on first use. */
  enumCatalog: EnumDef[] | null;
  selection: Selection | null;
  /** Instructions highlighted from a pseudo-code click. */
  linked: Set<string>;
  xrefs: {
    target: XrefTarget;
    /** What the target is called in the title: "Xrefs to <name>" / "Xrefs from <name>". */
    name: string;
    direction: XrefDirection;
    status: 'loading' | 'ready' | 'error';
    items: Xref[];
    error: string | null;
  } | null;
  dialog: Dialog | null;
  sidebarTab: SidebarTab;
  strings: Async<StringItem[]>;
  symbols: Async<SymbolItem[]>;
  sections: Async<Section[]>;
  types: Async<TypesInfo>;
  toast: { text: string; kind: 'info' | 'error'; at: number } | null;
}

const PREFS_KEY = 'open-reverse.prefs';
function loadPrefs(): Partial<Pick<State, 'showPseudo' | 'showBytes' | 'options'>> {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

const prefs = loadPrefs();

let state: State = {
  binaries: [],
  bid: null,
  info: null,
  openError: null,
  functions: [],
  byId: new Map(),
  byEntry: new Map(),
  byName: new Map(),
  revision: 0,
  indexState: 'complete',
  discovery: null,
  loc: null,
  history: [],
  future: [],
  showPseudo: prefs.showPseudo ?? true,
  showBytes: prefs.showBytes ?? false,
  options: { language: 'c-like', inference: 'proven', view: 'source', ...prefs.options },
  listing: idle(),
  decomp: idle(),
  comments: {},
  dataVersion: 0,
  bookmarks: {},
  enumDisplays: {},
  enumCatalog: null,
  selection: null,
  linked: new Set(),
  xrefs: null,
  dialog: null,
  sidebarTab: 'functions',
  strings: idle(),
  symbols: idle(),
  sections: idle(),
  types: idle(),
  toast: null,
};

const listeners = new Set<() => void>();

export function getState(): State {
  return state;
}

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)): void {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  if ('showPseudo' in next || 'showBytes' in next || 'options' in next) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ showPseudo: state.showPseudo, showBytes: state.showBytes, options: state.options }));
    } catch {
      // Preferences are a convenience only.
    }
  }
  for (const l of listeners) l();
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
  );
}

// ------------------------------------------------------------------ helpers

export function toast(text: string, kind: 'info' | 'error' = 'info'): void {
  setState({ toast: { text, kind, at: Date.now() } });
}

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

const listingCache = new Map<string, Listing>();
const decompCache = new Map<string, Decompilation>();
let decompAbort: AbortController | null = null;
let pollTimer: ReturnType<typeof setTimeout> | null = null;

function writeHash(): void {
  const { bid, loc } = state;
  const hash = bid ? `#/b/${bid}${loc ? `/${loc.addr}${loc.view !== 'linear' ? `/${loc.view}` : ''}` : ''}` : '#/';
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

export function parseHash(): { bid: string | null; addr: string | null; view: ViewMode | null } {
  const m = /^#\/b\/([0-9a-f]{16})(?:\/(0x[0-9a-f]+))?(?:\/(linear|graph|hex|types))?$/.exec(location.hash);
  return { bid: m?.[1] ?? null, addr: m?.[2] ?? null, view: (m?.[3] as ViewMode | undefined) ?? null };
}

// ------------------------------------------------------------------ binaries

export async function refreshBinaries(): Promise<void> {
  try {
    const { binaries } = await api.binaries();
    setState({ binaries });
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

export async function uploadAndOpen(file: File): Promise<void> {
  try {
    toast(`Uploading ${file.name}…`);
    const record = await api.upload(file);
    await refreshBinaries();
    await openBinary(record.id);
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

/**
 * Several files dropped or picked at once: a binary and its debug file (a dSYM DWARF file or
 * zipped .dSYM, an ELF debug file, a PDB). The binary is stored, paired with the debug file and opened.
 */
export async function uploadFiles(files: File[]): Promise<void> {
  if (files.length === 1) return uploadAndOpen(files[0]!);
  const kinds = await Promise.all(files.map(async (f) => looksLikeDebugFile(f.name, new Uint8Array(await f.arrayBuffer()))));
  const binaries = files.filter((_, i) => !kinds[i]);
  const debugs = files.filter((_, i) => kinds[i]);
  if (binaries.length !== 1 || debugs.length > 1) {
    toast(`Drop one binary, optionally with its debug file (got ${binaries.length} binaries and ${debugs.length} debug files)`, 'error');
    return;
  }
  try {
    toast(`Uploading ${binaries[0]!.name}…`);
    const record = await api.upload(binaries[0]!);
    await refreshBinaries();
    if (debugs[0]) await attachDebugFile(record.id, debugs[0]);
    await openBinary(record.id);
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

/** Pairs `file` with binary `bid`: true when OpenDecomp matched it (a toast says either way). */
async function attachDebugFile(bid: string, file: File): Promise<boolean> {
  toast(`Matching ${file.name}…`);
  try {
    await api.addDebugFile(bid, file);
    await refreshBinaries();
    toast(`Debug file ${file.name} added`);
    return true;
  } catch (e) {
    toast(errorText(e), 'error');
    return false;
  }
}

/** Add (or replace) the open binary's debug file; the binary reopens with it, where it was. */
export async function addDebugFile(file: File): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  const at = state.loc ? { addr: state.loc.addr, view: state.loc.view } : undefined;
  const ok = await attachDebugFile(bid, file);
  await openBinary(bid, at);
  const debug = getState().info?.image.debug;
  if (ok && debug) toast(debugSummaryText(debug));
}

/** Forget the open binary's debug file; it reopens without (its earlier analysis returns). */
export async function removeDebugFile(): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  const at = state.loc ? { addr: state.loc.addr, view: state.loc.view } : undefined;
  try {
    await api.removeDebugFile(bid);
    await refreshBinaries();
    toast('Debug file removed');
  } catch (e) {
    toast(errorText(e), 'error');
  }
  await openBinary(bid, at);
}

/** One line on what debug recovery found: `Debug info: 8 functions, 39 types (dSYM, matched by UUID)`. */
export function debugSummaryText(d: DebugSummary): string {
  if (d.source === 'none') return 'No debug information';
  const by = { uuid: 'UUID', 'build-id': 'build ID', debuglink: 'debuglink CRC', 'guid-age': 'PDB GUID and age' } as const;
  const from = d.source === 'companion' ? `${d.matched_by === 'guid-age' ? 'PDB' : 'debug file'}, matched by ${d.matched_by ? by[d.matched_by] : 'identity'}` : 'embedded';
  return `Debug info (${from}): ${d.functions} functions, ${d.types} types, ${d.variables} variables, ${d.lines} line rows${d.status === 'partial' ? ', partly unsupported' : ''}`;
}

export async function deleteBinary(bid: string): Promise<void> {
  await api.remove(bid);
  // The engine closed its session already.
  if (state.bid === bid) closeBinary(bid);
  await refreshBinaries();
}

/** Leave the open binary. Its engine session closes too (its project owner, request workers and
 * in-memory files), unless `next`, the binary about to open, is the same one. */
export function closeBinary(next?: string): void {
  const left = state.bid;
  if (left && left !== next) void api.close(left).catch(() => undefined);
  if (pollTimer) clearTimeout(pollTimer);
  listingCache.clear();
  decompCache.clear();
  setState({
    bid: null,
    info: null,
    openError: null,
    functions: [],
    byId: new Map(),
    byEntry: new Map(),
    byName: new Map(),
    loc: null,
    history: [],
    future: [],
    listing: idle(),
    decomp: idle(),
    comments: {},
    bookmarks: {},
    enumDisplays: {},
    enumCatalog: null,
    selection: null,
    linked: new Set(),
    xrefs: null,
    strings: idle(),
    symbols: idle(),
    sections: idle(),
    types: idle(),
  });
  writeHash();
}

export async function openBinary(bid: string, at?: { addr: string | null; view: ViewMode | null }): Promise<void> {
  closeBinary(bid);
  setState({ bid, openError: null });
  try {
    const info = await api.info(bid);
    if (getState().bid !== bid) return;
    setState({ info });
    await loadFunctions();
    const [{ comments }, { bookmarks }, { enums }] = await Promise.all([api.comments(bid), api.bookmarks(bid), api.enumDisplays(bid)]);
    setState({ comments, bookmarks, enumDisplays: enums });
    if (Object.keys(enums).length) void loadEnumCatalog();
    const target = at?.addr ?? pickStart();
    if (target) await navigate(target, { view: at?.view ?? 'linear', replace: true });
    schedulePoll();
  } catch (e) {
    setState({ openError: errorText(e) });
  }
}

function pickStart(): string | null {
  const { byName, info, functions } = state;
  for (const name of ['main', '_main', 'wmain', 'WinMain', 'wWinMain', 'DllMain']) {
    const f = byName.get(name);
    if (f) return f.entry;
  }
  const entry = info?.image.entry_points[0]?.value;
  if (entry) return canon(entry);
  return functions[0]?.entry ?? null;
}

async function loadFunctions(): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  const r = await api.functions(bid);
  if (state.bid !== bid) return;
  const byName = new Map<string, FunctionSummary>();
  for (const f of r.functions) {
    byName.set(f.name, f);
    if (f.originalName && !byName.has(f.originalName)) byName.set(f.originalName, f);
  }
  // Mach-O symbols carry a leading underscore that the pseudocode's C spelling drops.
  for (const f of r.functions) {
    for (const n of [f.name, f.originalName]) if (n?.startsWith('_') && !byName.has(n.slice(1))) byName.set(n.slice(1), f);
  }
  // The pseudocode spells a demangled name as a C identifier (`geom__area_int__int_`):
  // map that spelling too, when only one function has it.
  const spelled = new Map<string, FunctionSummary | null>();
  for (const f of r.functions) {
    if (!/[^A-Za-z0-9_]/.test(f.name)) continue;
    const c = cIdentifier(f.name);
    spelled.set(c, spelled.has(c) ? null : f);
  }
  for (const [c, f] of spelled) if (f && !byName.has(c)) byName.set(c, f);
  setState({
    functions: r.functions,
    byId: new Map(r.functions.map((f) => [f.id, f])),
    byEntry: new Map(r.functions.map((f) => [f.entry, f])),
    byName,
    revision: r.revision,
    indexState: r.indexState,
    discovery: r.discovery,
  });
}

/** Poll while background function discovery runs. */
function schedulePoll(): void {
  if (pollTimer) clearTimeout(pollTimer);
  if (state.discovery?.state !== 'running') return;
  pollTimer = setTimeout(async () => {
    const before = state.revision;
    try {
      await loadFunctions();
    } catch {
      // Retry on the next tick.
    }
    if (state.revision !== before) await reloadCurrent();
    if (state.discovery?.state === 'failed') toast(`Function discovery stopped: ${state.discovery.message}`, 'error');
    schedulePoll();
  }, 2000);
}

// ---------------------------------------------------------------- navigation

function sameLoc(a: Location | null, b: Location): boolean {
  return !!a && a.fnId === b.fnId && a.addr === b.addr && a.view === b.view;
}

/** Counts navigations (go to, back, forward): one that waits for the engine yields to a later one. */
let navigations = 0;

/**
 * Go to an address: the function containing it (or the hex view when no
 * function does). Pushes the previous location on the history stack.
 */
export async function navigate(
  addr: string,
  opts: { view?: ViewMode; replace?: boolean; fnId?: string } = {},
): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  const seq = ++navigations;
  const a = canon(addr);
  let fnId = opts.fnId ?? null;
  let view = opts.view ?? (state.loc?.view === 'hex' || state.loc?.view === 'types' ? 'linear' : (state.loc?.view ?? 'linear'));
  if (!fnId && view !== 'hex') {
    const cur = state.listing.data;
    if (cur && cur.instructions.some((i) => i.addr === a)) fnId = cur.function.id;
    else fnId = state.byEntry.get(a)?.id ?? null;
    if (!fnId) {
      try {
        fnId = (await api.functionAt(bid, a)).function?.id ?? null;
      } catch {
        fnId = null;
      }
      // Another navigation started while this one asked the engine: the later one wins.
      if (seq !== navigations || state.bid !== bid) return;
    }
    // Outside every function: the whole-image listing shows it (the graph needs a function).
    if (!fnId && view === 'graph') view = 'linear';
  }
  // Data keeps the last function in the pseudocode pane, as IDA does.
  const loc: Location = { fnId: fnId ?? state.loc?.fnId ?? null, addr: a, view };
  setState((s) => ({
    loc,
    history: opts.replace || !s.loc || sameLoc(s.loc, loc) ? s.history : [...s.history.slice(-199), s.loc],
    future: opts.replace ? s.future : [],
    selection: null,
    linked: new Set(),
  }));
  writeHash();
  await loadCurrent();
}

/**
 * Move the cursor within the current view without a history entry. `fnId`: the function the
 * new cursor line belongs to (the whole-image listing crosses functions); the pseudocode follows.
 */
export function setCursor(addr: string, selection: Selection | null = null, fnId?: string): void {
  const change = fnId !== undefined && fnId !== state.loc?.fnId;
  setState((s) => (s.loc ? { loc: { ...s.loc, addr: canon(addr), ...(change ? { fnId } : {}) }, selection, linked: new Set() } : {}));
  writeHash();
  if (change) void loadCurrent();
}

export function setView(view: ViewMode): void {
  if (!state.loc) return;
  setState((s) => ({ loc: { ...s.loc!, view } }));
  writeHash();
  void loadCurrent();
}

export function back(): void {
  const prev = state.history.at(-1);
  if (!prev) return;
  navigations++;
  setState((s) => ({ loc: prev, history: s.history.slice(0, -1), future: s.loc ? [s.loc, ...s.future] : s.future, selection: null, linked: new Set() }));
  writeHash();
  void loadCurrent();
}

export function forward(): void {
  const next = state.future[0];
  if (!next) return;
  navigations++;
  setState((s) => ({ loc: next, future: s.future.slice(1), history: s.loc ? [...s.history, s.loc] : s.history, selection: null, linked: new Set() }));
  writeHash();
  void loadCurrent();
}

// ---------------------------------------------------------------- loading

async function loadCurrent(): Promise<void> {
  const { bid, loc } = state;
  if (!bid || !loc) return;
  if (loc.view === 'types') void loadTypes();
  if (!loc.fnId) {
    setState({ listing: idle(), decomp: idle() });
    return;
  }
  const fnId = loc.fnId;
  const key = `${fnId}@${state.revision}`;
  const cached = listingCache.get(key);
  if (cached) {
    if (state.listing.data !== cached) setState({ listing: { status: 'ready', data: cached, error: null } });
  } else {
    setState((s) => ({ listing: { status: 'loading', data: s.listing.data?.function.id === fnId ? s.listing.data : null, error: null } }));
    try {
      const listing = await api.listing(bid, fnId);
      listingCache.set(key, listing);
      if (state.loc?.fnId === fnId) setState({ listing: { status: 'ready', data: listing, error: null } });
    } catch (e) {
      if (state.loc?.fnId === fnId) setState({ listing: { status: 'error', data: null, error: errorText(e) } });
    }
  }
  if (state.showPseudo) void loadDecompilation();
}

export async function loadDecompilation(): Promise<void> {
  const { bid, loc, options, revision } = state;
  if (!bid || !loc?.fnId) return;
  const fnId = loc.fnId;
  const key = `${fnId}@${revision}@${options.language}/${options.inference}/${options.view}`;
  const cached = decompCache.get(key);
  if (cached) {
    // A decompile still running for the function left behind must not replace this one when it ends.
    decompAbort?.abort();
    decompAbort = null;
    if (state.decomp.data !== cached) setState({ decomp: { status: 'ready', data: cached, error: null } });
    return;
  }
  if (state.decomp.status === 'loading' && (state.decomp as Async<Decompilation> & { key?: string }).key === key) return;
  decompAbort?.abort();
  const abort = new AbortController();
  decompAbort = abort;
  setState({ decomp: Object.assign({ status: 'loading' as const, data: state.decomp.data?.function.id === fnId ? state.decomp.data : null, error: null }, { key }) });
  try {
    const d = await api.decompile(bid, fnId, options, abort.signal);
    decompCache.set(key, d);
    if (decompAbort === abort) setState({ decomp: { status: 'ready', data: d, error: null } });
  } catch (e) {
    if (abort.signal.aborted) return;
    if (decompAbort === abort) setState({ decomp: { status: 'error', data: null, error: errorText(e) } });
  }
}

async function reloadCurrent(): Promise<void> {
  await loadCurrent();
}

export function setOptions(patch: Partial<DecompileOptions>): void {
  setState((s) => ({ options: { ...s.options, ...patch } }));
  void loadDecompilation();
}

export function togglePseudo(): void {
  setState((s) => ({ showPseudo: !s.showPseudo }));
  if (state.showPseudo) void loadDecompilation();
}

export async function loadTypes(force = false): Promise<void> {
  const bid = state.bid;
  if (!bid || (!force && state.types.status !== 'idle')) return;
  setState({ types: { status: 'loading', data: null, error: null } });
  try {
    setState({ types: { status: 'ready', data: await api.types(bid), error: null } });
  } catch (e) {
    setState({ types: { status: 'error', data: null, error: errorText(e) } });
  }
}

export async function loadSidebar(tab: SidebarTab): Promise<void> {
  const bid = state.bid;
  if (!bid || tab === 'functions' || tab === 'calls' || state[tab].status !== 'idle') return;
  setState({ [tab]: { status: 'loading', data: null, error: null } } as Partial<State>);
  try {
    const data =
      tab === 'strings' ? (await api.strings(bid)).strings : tab === 'symbols' ? (await api.symbols(bid)).symbols : (await api.sections(bid)).sections;
    setState({ [tab]: { status: 'ready', data, error: null } } as Partial<State>);
  } catch (e) {
    setState({ [tab]: { status: 'error', data: null, error: errorText(e) } } as Partial<State>);
  }
}

// ------------------------------------------------------------ annotations

export function xrefsTitle(name: string, direction: XrefDirection): string {
  return `Xrefs ${direction === 'incoming' ? 'to' : 'from'} ${name}`;
}

export async function showXrefs(target: XrefTarget, name: string, direction: XrefDirection = 'incoming'): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  const base = { target, name, direction };
  setState({ xrefs: { ...base, status: 'loading', items: [], error: null } });
  const current = () => state.xrefs?.target === target && state.xrefs.direction === direction;
  try {
    const { xrefs } = await api.xrefs(bid, target, direction);
    if (current()) setState({ xrefs: { ...base, status: 'ready', items: xrefs, error: null } });
  } catch (e) {
    if (current()) setState({ xrefs: { ...base, status: 'error', items: [], error: errorText(e) } });
  }
}

/** The xrefs panel's To / From toggle: the same target, the other direction. */
export function setXrefsDirection(direction: XrefDirection): void {
  const x = state.xrefs;
  if (x && x.direction !== direction) void showXrefs(x.target, x.name, direction);
}

/** Direct callers and callees of a function, per revision (the call tree expands lazily). */
const callsCache = new Map<string, Promise<{ callers: CallNode[]; callees: CallNode[] }>>();

export function loadCalls(fnId: string): Promise<{ callers: CallNode[]; callees: CallNode[] }> {
  const { bid, revision } = state;
  if (!bid) return Promise.reject(new Error('No binary open'));
  const key = `${bid}|${revision}|${fnId}`;
  let p = callsCache.get(key);
  if (!p) {
    for (const k of callsCache.keys()) if (!k.startsWith(`${bid}|${revision}|`)) callsCache.delete(k);
    p = api.calls(bid, fnId);
    callsCache.set(key, p);
    p.catch(() => callsCache.delete(key));
  }
  return p;
}

// --------------------------------------------------------------- undo / redo
// Every edit records how to restore the previous value and how to apply it again,
// both through the same calls as the edit itself, so every view refreshes the same way.

/** Records an edit made on binary `bid` (it may have been closed while the edit ran). */
function record(bid: string, entry: UndoEntry): void {
  if (state.bid === bid) historyFor(bid).record(entry);
}

/** Edits still being applied: undo waits for them, so it never skips the edit just made. */
let editsInFlight: Promise<unknown> = Promise.resolve();

function tracked<A extends unknown[], R>(edit: (...args: A) => Promise<R>): (...args: A) => Promise<R> {
  return (...args) => {
    const p = edit(...args);
    editsInFlight = Promise.all([editsInFlight, p.catch(() => undefined)]);
    return p;
  };
}

/** Names this tab gave globals and variables, for undo: OpenDecomp has no read of a single annotation. */
const knownNames = new Map<string, string>();

async function undoRedo(kind: 'undo' | 'redo'): Promise<void> {
  const bid = state.bid;
  if (!bid) return;
  await editsInFlight;
  const h = historyFor(bid);
  try {
    const entry = await (kind === 'undo' ? h.undo() : h.redo());
    if (state.bid !== bid) return;
    if (entry) toast(`${kind === 'undo' ? 'Undid' : 'Redid'} ${entry.label}`);
    else toast(kind === 'undo' ? 'Nothing to undo' : 'Nothing to redo');
  } catch (e) {
    if (state.bid === bid) toast(`Could not ${kind}: ${errorText(e)}`, 'error');
  }
}

/** Ctrl+Z */
export const undo = () => undoRedo('undo');
/** Ctrl+Shift+Z, Ctrl+Y */
export const redo = () => undoRedo('redo');

async function snapshot(fnId: string): Promise<AnnotationSnapshot> {
  return (await api.annotationSnapshot(state.bid!, fnId)).snapshot;
}

async function restore(fnId: string, snap: AnnotationSnapshot): Promise<void> {
  await api.restoreAnnotations(state.bid!, fnId, snap);
  await refreshAfterAnnotation();
}

async function applyRename(target: XrefTarget, name: string): Promise<string | null> {
  const { note } = await api.rename(state.bid!, target, name);
  if (target.addr) {
    knownNames.set(`${state.bid}|va:${target.addr}`, name.trim());
    // A global's name is also a label of the whole-image listing.
    setState((s) => ({ dataVersion: s.dataVersion + 1 }));
  }
  await refreshAfterAnnotation();
  return note;
}

/** Renames a function or global; resolves to the error text (also toasted), or null. */
export const rename = tracked(async (target: XrefTarget, name: string): Promise<string | null> => {
  const { bid, byId } = state;
  if (!bid) return 'No binary open';
  try {
    const fn = target.id ? byId.get(target.id) : undefined;
    const label = `rename of ${fn?.name ?? target.addr ?? 'symbol'}`;
    if (fn) {
      // A function's name may also come from its signature: restore exactly what was stored.
      const before = await snapshot(fn.id);
      await applyRename(target, name);
      const after = await snapshot(fn.id);
      if (JSON.stringify(before) !== JSON.stringify(after)) record(bid, { label, undo: () => restore(fn.id, before), redo: () => restore(fn.id, after) });
    } else {
      const previous = (target.addr && knownNames.get(`${bid}|va:${target.addr}`)) || '';
      const note = await applyRename(target, name);
      if (previous !== name.trim())
        record(bid, { label, undo: async () => void (await applyRename(target, previous)), redo: async () => void (await applyRename(target, name)) });
      if (note) return (toast(`Renamed to ${name.trim()} (${note})`), null);
    }
    toast(name.trim() ? `Renamed to ${name.trim()}` : 'Name reset');
    return null;
  } catch (e) {
    toast(errorText(e), 'error');
    return errorText(e);
  }
});

async function applyComment(addr: string, text: string): Promise<void> {
  const { comments } = await api.comment(state.bid!, addr, text);
  setState({ comments });
}

/** Resolves to the error text (also toasted), or null. */
export const setComment = tracked(async (addr: string, text: string): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  const previous = state.comments[addr] ?? '';
  try {
    await applyComment(addr, text);
    if (previous.trim() !== text.trim())
      record(bid, { label: `comment at ${addr}`, undo: () => applyComment(addr, previous), redo: () => applyComment(addr, text) });
    return null;
  } catch (e) {
    toast(errorText(e), 'error');
    return errorText(e);
  }
});

// ---------------------------------------------------------------- bookmarks

async function applyBookmark(addr: string, description: string | null): Promise<void> {
  const { bookmarks } = await api.bookmark(state.bid!, addr, description);
  setState({ bookmarks });
}

/** Bookmarks an address (Alt+M); null removes the bookmark. Resolves to the error text (also toasted), or null. */
export const setBookmark = tracked(async (addr: string, description: string | null): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  const previous = state.bookmarks[addr] ?? null;
  const next = description === null ? null : description.trim();
  try {
    await applyBookmark(addr, next);
    if (previous !== next)
      record(bid, {
        label: next === null ? `bookmark removal at ${addr}` : `bookmark at ${addr}`,
        undo: () => applyBookmark(addr, previous),
        redo: () => applyBookmark(addr, next),
      });
    toast(next === null ? `Bookmark at ${addr} removed` : `Bookmarked ${addr}`);
    return null;
  } catch (e) {
    toast(errorText(e), 'error');
    return errorText(e);
  }
});

/** Alt+M: bookmark the cursor's address. */
export function beginBookmark(): void {
  const addr = state.loc?.addr;
  if (!addr) return;
  setState({ dialog: { kind: 'bookmark', addr, current: state.bookmarks[addr] ?? null } });
}

/** The rename dialog for the current selection (N). */
export function beginRename(): void {
  const { selection, byId, byEntry, loc, listing } = state;
  let fn: FunctionSummary | undefined;
  if (selection?.kind === 'variable') {
    setState({ dialog: { kind: 'renameVar', fnId: selection.fnId, valueId: selection.id, current: selection.name, parameter: selection.parameter } });
    return;
  }
  if (selection?.kind === 'function') fn = byId.get(selection.fnId);
  else if (selection?.kind === 'addr') {
    fn = byEntry.get(selection.addr);
    if (!fn && !listing.data?.instructions.some((i) => i.addr === selection.addr)) {
      const name = selection.global?.name || selection.name || '';
      // The name shown is the one an undo of this rename goes back to.
      const known = `${state.bid}|va:${selection.addr}`;
      if (name && !knownNames.has(known)) knownNames.set(known, name);
      setState({ dialog: { kind: 'rename', target: { addr: selection.addr }, current: name, what: `global ${name ? `${name} ` : ''}at ${selection.addr}` } });
      return;
    }
  }
  fn ??= loc?.fnId ? byId.get(loc.fnId) : undefined;
  if (!fn) return;
  // A demangled name (`geom::area(int, int)`) is no valid new name: start from the mangled one, as IDA does.
  const current = fn.mangled && !fn.renamed && !/^[A-Za-z_][A-Za-z0-9_:$.@]*$/.test(fn.name) ? fn.mangled : fn.name;
  setState({ dialog: { kind: 'rename', target: { id: fn.id }, current, what: `function ${fn.name} at ${fn.entry}` } });
}

/**
 * Xrefs (X) to the selected operand or comment target; else, on a disassembly line,
 * to what that line references (a call target, a string, a resolved ADRP pair...) or,
 * referencing nothing, to the line itself (jumps to it); else to the current function.
 * Xrefs from (Shift+X): from the selected function or address, else from the cursor's
 * line, else from the current function.
 */
export function beginXrefs(direction: XrefDirection = 'incoming'): void {
  const t = xrefTarget(direction);
  if (t) void showXrefs(t.target, t.name, direction);
}

function xrefTarget(direction: XrefDirection): { target: XrefTarget; name: string } | null {
  const { selection, byId, byEntry, loc, listing } = state;
  const fnTarget = (f: FunctionSummary) => ({ target: { id: f.id }, name: f.name });
  if (selection?.kind === 'function') {
    const f = byId.get(selection.fnId);
    if (f) return fnTarget(f);
  }
  if (selection?.kind === 'addr') {
    const f = byEntry.get(selection.addr);
    if (f) return fnTarget(f);
    return { target: { addr: selection.addr }, name: selection.name ?? selection.addr };
  }
  const insns = listing.data?.instructions ?? [];
  const insn = loc && (loc.view === 'linear' || loc.view === 'graph') ? insns.find((i) => i.addr === loc.addr) : undefined;
  if (insn && !byEntry.has(insn.addr)) {
    if (direction === 'outgoing') return { target: { addr: insn.addr }, name: insn.addr };
    const local = new Set(insns.map((i) => i.addr));
    // An ADRP operand is a 4 KiB page base, not what the code refers to (that is resolved with its ADD/LDR).
    const page = /^adrp?$/i.test(insn.mnemonic);
    const ref = page ? undefined : insn.refs.find((r) => r.kind !== 'code' && !(local.has(r.addr) && r.kind !== 'function'));
    const resolved = insn.resolved?.find((t) => t.addr);
    const target = ref
      ? { addr: ref.addr, kind: ref.kind, label: ref.kind === 'string' ? JSON.stringify(ref.label.slice(0, 40)) : ref.label }
      : resolved
        ? { addr: resolved.addr, kind: resolved.kind, label: resolved.kind === 'string' ? JSON.stringify(resolved.label.slice(0, 40)) : resolved.label }
        : null;
    if (target) {
      const f = target.kind === 'function' ? byEntry.get(target.addr) : undefined;
      return f ? fnTarget(f) : { target: { addr: target.addr }, name: target.label || target.addr };
    }
    return { target: { addr: insn.addr }, name: insn.addr };
  }
  const f = loc?.fnId ? byId.get(loc.fnId) : undefined;
  return f ? fnTarget(f) : null;
}

// ------------------------------------------------------------ data (D A O * U)

/** Applies a data key at the cursor (D cycles byte/word/dword/qword, A string, O pointer, U undefine). */
const defText = (d: DataDef | null) => (d ? (d.type === 'string' ? `string (${d.count} bytes)` : d.count > 1 ? `${d.type}[${d.count}]` : d.type) : 'undefined');

/** After a data definition change: the listing reloads; a new revision refreshes every view. */
async function afterData(before: number, revision: number): Promise<void> {
  setState((s) => ({ dataVersion: s.dataVersion + 1 }));
  if (revision !== before) await refreshAfterAnnotation();
}

/** Puts back the definitions of [start, end) (undo/redo of a data key). */
async function applyData(range: { start: string; end: string }, defs: Record<string, DataDef>): Promise<void> {
  const before = state.revision;
  const r = await api.restoreData(state.bid!, range.start, range.end, defs);
  await afterData(before, r.revision);
}

/**
 * Applies a data key at the cursor or `at` (D cycles byte/word/dword/qword, A string, O pointer, * array, U undefine).
 * Resolves to what was defined, or the error text (also toasted).
 */
export const defineData = tracked(async (action: DataAction, count?: number, at?: string): Promise<{ start: string; def: DataDef | null; note: string | null } | string> => {
  const { bid, loc } = state;
  const addr = at ?? loc?.addr;
  if (!bid || !addr) return 'No address';
  try {
    const before = state.revision;
    const r = await api.defineData(bid, addr, action, count);
    await afterData(before, r.revision);
    const after = r.def ? { [r.start]: r.def } : {};
    record(bid, {
      label: `${defText(r.def)} at ${r.start}`,
      undo: () => applyData(r.range, r.replaced),
      redo: () => applyData(r.range, after),
    });
    toast(`${r.start}: ${defText(r.def)}${r.note ? ` — ${r.note}` : ''}`, r.note ? 'error' : 'info');
    return { start: r.start, def: r.def, note: r.note };
  } catch (e) {
    toast(errorText(e), 'error');
    return errorText(e);
  }
});

/** `*`: asks how many elements the array at the cursor has. */
export async function beginArray(): Promise<void> {
  const { bid, loc } = state;
  if (!bid || !loc) return;
  try {
    const d = await api.dataAt(bid, loc.addr);
    setState({ dialog: { kind: 'array', addr: d.start, type: d.type, current: d.def && d.def.type !== 'string' ? d.def.count : Math.max(1, d.maxCount), max: d.maxCount } });
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

/** IDA's P. OpenDecomp's discovery takes no seed address, so there is no way to create a function. */
export function createFunction(): void {
  const addr = state.loc?.addr;
  if (!addr) return;
  toast(
    `Cannot create a function at ${addr}: OpenDecomp finds functions itself (functions_discover takes no start address) and has no way to add one`,
    'error',
  );
}

/** The enums M offers, loaded once per binary (declaring types reloads them). */
export async function loadEnumCatalog(): Promise<EnumDef[]> {
  if (state.enumCatalog) return state.enumCatalog;
  const bid = state.bid!;
  const { enums } = await api.enumCatalog(bid);
  if (state.bid === bid) setState({ enumCatalog: enums });
  return enums;
}

/**
 * M (IDA's symbolic constant): display the selected constant — a number token of the
 * pseudocode or an immediate of the disassembly, at the current instruction — as an enum.
 */
export function beginEnum(highlight: string | null): void {
  const addr = state.loc?.addr;
  const key = highlight;
  if (!addr || !key?.startsWith('n:')) return void toast('Select a constant first (click a number), then press M', 'error');
  const value = key.slice(2);
  // From the pseudocode, the statement's instructions are linked: prefer the one whose operand holds the value.
  const holder = state.listing.data?.instructions.find(
    (i) => state.linked.has(i.addr) && operandTokens(i.operands).some((t) => t.key === key),
  );
  const at = holder?.addr ?? addr;
  void loadEnumCatalog().then(() => setState({ dialog: { kind: 'enum', key: `${at}|${value}`, value } }));
}

async function applyEnumDisplay(key: string, id: string | null): Promise<void> {
  const { enums } = await api.setEnumDisplay(state.bid!, key, id);
  setState({ enumDisplays: enums });
}

/** Shows the constant `key` as enum `id` (null: as a number again); undoable. */
export const setEnumDisplay = tracked(async (key: string, id: string | null): Promise<void> => {
  const bid = state.bid;
  if (!bid) return;
  const previous = state.enumDisplays[key] ?? null;
  if (previous === id) return;
  try {
    await applyEnumDisplay(key, id);
    record(bid, {
      label: `enum display of ${key.split('|')[1] ? `0x${key.split('|')[1]}` : key}`,
      undo: () => applyEnumDisplay(key, previous),
      redo: () => applyEnumDisplay(key, id),
    });
  } catch (e) {
    toast(errorText(e), 'error');
  }
});

export function beginComment(): void {
  const addr = state.loc?.addr;
  if (!addr) return;
  setState({ dialog: { kind: 'comment', addr, current: state.comments[addr] ?? '' } });
}

// ------------------------------------------------- types and signatures

/** After an annotation batch: new revision, so every view (and every caller) re-decompiles. */
/**
 * Applies signature libraries to the open binary: the functions they recognize are named
 * (OpenDecomp `library_match` annotations, with the library's declarations). One undo step.
 */
export const applySignatures = tracked(async (ids: string[], label: string): Promise<SignatureApplication | null> => {
  const bid = state.bid;
  if (!bid) return null;
  try {
    const result = await api.applySignatures(bid, ids);
    const annotationIds = result.edits.map((e) => (e as { id: string }).id);
    await refreshAfterAnnotation();
    if (annotationIds.length)
      record(bid, {
        label: `signatures ${label}`,
        undo: async () => {
          await api.removeSignatureMatches(bid, annotationIds);
          await refreshAfterAnnotation();
        },
        redo: async () => {
          await api.restoreSignatureMatches(bid, result.edits);
          await refreshAfterAnnotation();
        },
      });
    const named = Object.values(result.matched).reduce((a, b) => a + b, 0);
    toast(`${label}: ${named} function${named === 1 ? '' : 's'} named${result.ambiguous.length ? `, ${result.ambiguous.length} ambiguous left unnamed` : ''}`);
    return result;
  } catch (e) {
    if (state.bid === bid) toast(`Signatures: ${errorText(e)}`, 'error');
    return null;
  }
});

async function refreshAfterAnnotation(): Promise<void> {
  await loadFunctions();
  setState({ types: idle() });
  await reloadCurrent();
}

async function applyDeclare(source: string): Promise<Record<string, string>> {
  const { annotations } = await api.declareTypes(state.bid!, source);
  setState({ enumCatalog: null });
  await refreshAfterAnnotation();
  return annotations;
}

async function applyRemoveTypes(annotationIds: string[]): Promise<void> {
  await api.removeLibraryTypes(state.bid!, annotationIds);
  await refreshAfterAnnotation();
}

/** The type library as it is now (the Types view usually has it loaded already). */
async function currentLibrary(): Promise<LibraryType[]> {
  const t = state.types;
  return t.status === 'ready' && t.data ? t.data.library : (await api.types(state.bid!)).library;
}

/**
 * Declares C types and returns the undo entry: it puts back the previous declaration of
 * each redeclared name and removes the new names (their pointer helper types stay, as when
 * a declaration is deleted).
 */
async function declareStep(source: string): Promise<UndoEntry & { declared: string[] }> {
  const before = new Map((await currentLibrary()).flatMap((t) => (t.name ? [[t.name, t.declaration] as const] : [])));
  let annotations = await applyDeclare(source);
  const declared = Object.keys(annotations);
  return {
    declared,
    label: `declaration of ${declared.join(', ') || 'types'}`,
    undo: async () => {
      const added = declared.filter((n) => !before.has(n)).map((n) => annotations[n]!);
      const previous = declared.flatMap((n) => (before.has(n) ? [before.get(n)!] : []));
      if (added.length) await applyRemoveTypes(added);
      if (previous.length) await applyDeclare(previous.join('\n'));
    },
    redo: async () => {
      annotations = await applyDeclare(source);
    },
  };
}

/** Declares C types in the image's type library. Resolves to the error text, or null on success. */
export const declareTypes = tracked(async (source: string): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  try {
    const { declared, ...entry } = await declareStep(source);
    toast(declared.length ? `Declared ${declared.join(', ')}` : 'Types declared');
    record(bid, entry);
    return null;
  } catch (e) {
    return errorText(e);
  }
});

export const removeLibraryType = tracked(async (t: LibraryType): Promise<void> => {
  const bid = state.bid;
  if (!bid) return;
  const name = t.name ?? t.typeId;
  let id = t.annotationId;
  try {
    await applyRemoveTypes([id]);
    toast(`Removed ${name} from the type library`);
    // Undo declares it again: the same name keeps its type ID, so signatures using it bind again.
    record(bid, {
      label: `deletion of ${name}`,
      undo: async () => {
        const annotations = await applyDeclare(t.declaration);
        id = (t.name && annotations[t.name]) || id;
      },
      redo: () => applyRemoveTypes([id]),
    });
  } catch (e) {
    toast(errorText(e), 'error');
  }
});

/**
 * Y: the type dialog of the parameter, local or global selected in the pseudocode, else the
 * signature dialog of the selected call target or the current function.
 */
export async function beginSignature(): Promise<void> {
  const { selection, byId, loc, bid } = state;
  if (selection?.kind === 'variable') {
    const what = `${selection.parameter ? 'parameter' : 'local'} ${selection.name}`;
    setState({ dialog: { kind: 'retype', target: { fnId: selection.fnId, valueId: selection.id }, what, current: selection.type ?? '' } });
    return;
  }
  if (selection?.kind === 'addr' && selection.global) {
    const g = selection.global;
    setState({ dialog: { kind: 'retype', target: { addr: selection.addr }, what: `global ${g.name || selection.addr}`, current: g.type } });
    return;
  }
  const fn = (selection?.kind === 'function' ? byId.get(selection.fnId) : undefined) ?? (loc?.fnId ? byId.get(loc.fnId) : undefined);
  if (!bid || !fn) return;
  try {
    const { text, declared } = await api.prototype(bid, fn.id);
    setState({ dialog: { kind: 'signature', fnId: fn.id, name: fn.name, current: text, declared } });
  } catch (e) {
    toast(errorText(e), 'error');
  }
}

/** Applies a C prototype to a function (empty removes it). Resolves to the error text, or null. */
export const setSignature = tracked(async (fnId: string, text: string): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  try {
    const name = state.byId.get(fnId)?.name ?? fnId;
    const before = await snapshot(fnId);
    const { confirmed } = await api.setSignature(bid, fnId, text);
    await refreshAfterAnnotation();
    const after = await snapshot(fnId);
    if (JSON.stringify(before) !== JSON.stringify(after))
      record(bid, { label: `signature of ${name}`, undo: () => restore(fnId, before), redo: () => restore(fnId, after) });
    if (!text.trim()) toast('Signature removed');
    else if (confirmed) toast('Signature applied');
    else
      toast(
        'Signature stored, but OpenDecomp did not confirm it for this function, so its pseudocode keeps the inferred interface',
        'error',
      );
    return null;
  } catch (e) {
    return errorText(e);
  }
});

/** Types this tab gave variables and globals, for undo (as `knownNames`). */
const knownTypes = new Map<string, string>();

const typeKey = (bid: string, t: TypeTarget) => `${bid}|${'addr' in t ? `va:${t.addr}` : `value:${t.valueId}`}`;

/** Applies a type; resolves to the type the variable's pseudocode now shows (null for a global or when unknown). */
async function applyType(target: TypeTarget, text: string): Promise<string | null> {
  const bid = state.bid!;
  let shown: string | null = null;
  if ('addr' in target) await api.setGlobalType(bid, target.addr, text);
  else shown = (await api.setVariableType(bid, target.fnId, target.valueId, text, state.options)).shown;
  knownTypes.set(typeKey(bid, target), text.trim());
  await refreshAfterAnnotation();
  return shown;
}

/**
 * Whether the pseudocode honours a requested variable type: its declaration changed, and
 * names every named type of the request (a contradicted type falls back to an integer).
 */
function honoured(requested: string, before: string | null, shown: string | null): boolean {
  if (shown === null || !requested.trim()) return true;
  const named = [...requested.matchAll(/\b(?:struct|union|enum)\s+([A-Za-z_]\w*)/g)].map((m) => m[1]!);
  return (shown !== before || requested.replace(/\s+/g, '') === (before ?? '').replace(/\s+/g, '')) && named.every((n) => new RegExp(`\\b${n}\\b`).test(shown));
}

const notHonoured = (what: string, shown: string) =>
  `Type stored, but OpenDecomp did not apply it here (its analysis contradicts it, or type recovery is partial, as on ELF images): the pseudocode declares ${what} as ${shown}. Reset in Y removes it`;

/** The undo entry of a type change; the previous type is the one this tab set, else none (the inferred type). */
function typeStep(bid: string, target: TypeTarget, text: string, label: string): UndoEntry {
  const previous = knownTypes.get(typeKey(bid, target)) ?? '';
  return {
    label,
    undo: async () => void (await applyType(target, previous)),
    redo: async () => void (await applyType(target, text)),
  };
}

/**
 * Sets the C type of a parameter, local or global (Y); empty removes it, so OpenDecomp's
 * inferred type is back. Resolves to the error text, or null.
 */
export const setType = tracked(async (target: TypeTarget, text: string, what: string, before: string | null = null): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  try {
    const entry = typeStep(bid, target, text, `type of ${what}`);
    const shown = await applyType(target, text);
    record(bid, entry);
    if (!honoured(text, before, shown)) toast(notHonoured(what, shown!), 'error');
    else toast(text.trim() ? `${what} is now ${text.trim()}` : `Type of ${what} reset`);
    return null;
  } catch (e) {
    return errorText(e);
  }
});

/** S: create a structure from the selected pointer variable. */
export function beginCreateStruct(): void {
  const { selection } = state;
  if (selection?.kind !== 'variable') {
    toast('Select a pointer parameter or local in the pseudocode first (S creates a structure from it)', 'error');
    return;
  }
  setState({ dialog: { kind: 'createStruct', fnId: selection.fnId, valueId: selection.id, variable: selection.name, type: selection.type ?? '' } });
}

/**
 * Declares structure `name` with the members OpenDecomp recovered behind a pointer variable
 * (Binary Ninja's "Create structure"), then retypes the variable as `struct name *`. One
 * undo step reverts both. Resolves to the error text, or null.
 */
export const createStructFromVariable = tracked(async (fnId: string, valueId: string, variable: string, name: string): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  try {
    const { declaration } = await api.structFromVariable(bid, fnId, variable, name.trim(), state.options);
    const declare = await declareStep(declaration);
    const target = { fnId, valueId };
    const retype = typeStep(bid, target, `struct ${name.trim()} *`, '');
    let shown: string | null;
    try {
      shown = await applyType(target, `struct ${name.trim()} *`);
    } catch (e) {
      await declare.undo();
      throw e;
    }
    record(bid, {
      label: `structure ${name.trim()} from ${variable}`,
      undo: async () => {
        await retype.undo();
        await declare.undo();
      },
      redo: async () => {
        await declare.redo();
        await retype.redo();
      },
    });
    if (!honoured(`struct ${name.trim()} *`, null, shown)) toast(`Declared struct ${name.trim()}. ${notHonoured(variable, shown!)}`, 'error');
    else toast(`Declared struct ${name.trim()}; ${variable} is now struct ${name.trim()} *`);
    return null;
  } catch (e) {
    return errorText(e);
  }
});

async function applyRenameVariable(fnId: string, valueId: string, name: string): Promise<void> {
  await api.renameVariable(state.bid!, fnId, valueId, name, state.options);
  knownNames.set(`${state.bid}|value:${valueId}`, name.trim());
  await refreshAfterAnnotation();
}

/**
 * Renames a parameter or local (empty restores the generated name). `current` is the name
 * the pseudocode shows: undo gives it back (as a name annotation when it was generated).
 */
export const renameVariable = tracked(async (fnId: string, valueId: string, name: string, current: string): Promise<string | null> => {
  const bid = state.bid;
  if (!bid) return 'No binary open';
  try {
    const previous = knownNames.get(`${bid}|value:${valueId}`) ?? current;
    await applyRenameVariable(fnId, valueId, name);
    if (previous !== name.trim())
      record(bid, {
        label: `rename of ${current}`,
        undo: () => applyRenameVariable(fnId, valueId, previous),
        redo: () => applyRenameVariable(fnId, valueId, name),
      });
    toast(name.trim() ? `Renamed to ${name.trim()}` : 'Name reset');
    return null;
  } catch (e) {
    toast(errorText(e), 'error');
    return errorText(e);
  }
});
