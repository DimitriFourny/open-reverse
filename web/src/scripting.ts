// The script console (Shift+F2): runs the JavaScript a user types, in this page, with an
// `or` object wrapping the same engine calls (api.ts) and store edits the UI makes, so a
// rename from a script refreshes every view and Ctrl+Z undoes it like a manual one.
// Nothing but the user's own typed script is evaluated; scripts are kept in localStorage.

import { useSyncExternalStore } from 'react';
import { api, type FunctionSummary, type Instruction, type SearchQuery, type SymbolItem } from './api.ts';
import { asExpression, describe, formatPrint, formatValue, pushHistory, stackLine, syntaxErrorLine, toAddr, toCount } from './scriptfmt.ts';
import {
  defineData as storeDefineData,
  getState,
  loadCalls,
  navigate,
  redo as storeRedo,
  rename as storeRename,
  renameVariable as storeRenameVariable,
  setBookmark,
  setComment,
  setType as storeSetType,
  undo as storeUndo,
} from './store.ts';

// ------------------------------------------------------------------ console state

export interface OutputLine {
  kind: 'input' | 'print' | 'result' | 'error' | 'info';
  text: string;
}

export interface ConsoleState {
  open: boolean;
  /** Bumped to focus the editor (the console was asked for again). */
  focus: number;
  code: string;
  output: OutputLine[];
  running: boolean;
  history: string[];
}

const HISTORY_KEY = 'open-reverse.script-history';
const DRAFT_KEY = 'open-reverse.script-draft';
/** Output lines kept; older ones are dropped. */
const MAX_OUTPUT = 2000;

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A convenience only.
  }
}

let state: ConsoleState = {
  open: false,
  focus: 0,
  code: load(DRAFT_KEY, ''),
  output: [{ kind: 'info', text: 'Type JavaScript and press Ctrl+Enter. `or` is the API (help() lists it); top-level await works.' }],
  running: false,
  history: load<string[]>(HISTORY_KEY, []),
};
const listeners = new Set<() => void>();

export function getConsole(): ConsoleState {
  return state;
}

function setConsole(patch: Partial<ConsoleState>): void {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function useConsole<T>(selector: (s: ConsoleState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
  );
}

export function toggleConsole(): void {
  setConsole(state.open ? { open: false } : { open: true, focus: state.focus + 1 });
}

export function closeConsole(): void {
  setConsole({ open: false });
}

export function setCode(code: string): void {
  setConsole({ code });
  save(DRAFT_KEY, code);
}

/** The Help button: the API reference, without running a script. */
export function showHelp(): void {
  emit({ kind: 'info', text: HELP });
}

export function clearOutput(): void {
  setConsole({ output: [] });
}

/** Output written while a script runs is flushed once per frame, so many prints stay cheap. */
let pendingOutput: OutputLine[] = [];
let flushScheduled = false;

function emit(line: OutputLine): void {
  pendingOutput.push(line);
  if (flushScheduled) return;
  flushScheduled = true;
  setTimeout(flushOutput, 16);
}

function flushOutput(): void {
  flushScheduled = false;
  if (!pendingOutput.length) return;
  let output = [...state.output, ...pendingOutput];
  pendingOutput = [];
  if (output.length > MAX_OUTPUT) output = [{ kind: 'info', text: `… older output dropped` }, ...output.slice(-MAX_OUTPUT)];
  setConsole({ output });
}

// ------------------------------------------------------------------ running

export class ScriptStopped extends Error {
  constructor() {
    super('Script stopped');
    this.name = 'ScriptStopped';
  }
}

interface Run {
  stopped: boolean;
  abort: AbortController;
  /** When the script last let the event loop run. */
  yielded: number;
}

let current: Run | null = null;
let runs = 0;

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => (...a: unknown[]) => Promise<unknown>;
const PARAMS = ['or', 'print', 'help'];
const compile = (body: string) => void new AsyncFunction(...PARAMS, body);

/** Lines the engine's function wrapper puts before the body (measured once: engines differ). */
let wrapperLines: number | null = null;
function wrapperOffset(): number {
  if (wrapperLines === null) {
    try {
      new Function(...PARAMS, 'throw new Error()\n//# sourceURL=openreverse-probe')();
    } catch (e) {
      const line = stackLine((e as Error).stack, 'openreverse-probe', 0);
      wrapperLines = line === null ? 0 : line - 1;
    }
  }
  return wrapperLines ?? 0;
}

/** Stop button / Esc: every further API call (and print) of the running script throws. */
export function stopScript(): void {
  if (!current) return;
  current.stopped = true;
  current.abort.abort();
}

/** Runs the editor's script (Ctrl+Enter). */
export async function runScript(code = state.code): Promise<void> {
  if (state.running || !code.trim()) return;
  const history = pushHistory(state.history, code);
  save(HISTORY_KEY, history);
  setConsole({ running: true, history });
  const run: Run = { stopped: false, abort: new AbortController(), yielded: performance.now() };
  current = run;
  const source = `openreverse-script-${++runs}`;
  emit({ kind: 'input', text: code.trimEnd() });
  const started = performance.now();
  const expression = asExpression(code, compile);
  // `return (` takes a line of its own before the script.
  const offset = wrapperOffset() + (expression ? 1 : 0);
  try {
    let fn: (...a: unknown[]) => Promise<unknown>;
    try {
      fn = new AsyncFunction(...PARAMS, `${expression ?? code}\n//# sourceURL=${source}`);
    } catch (e) {
      const line = e instanceof SyntaxError ? syntaxErrorLine(code, e.message, compile) : null;
      throw Object.assign(e as Error, { scriptLine: line });
    }
    const print = (...args: unknown[]) => {
      if (run.stopped) throw new ScriptStopped();
      emit({ kind: 'print', text: formatPrint(args) });
    };
    const value = await fn(makeApi(run, print), print, () => print(HELP));
    if (run.stopped) throw new ScriptStopped();
    if (value !== undefined) emit({ kind: 'result', text: formatValue(value) });
    emit({ kind: 'info', text: `done in ${fmtMs(performance.now() - started)}` });
  } catch (e) {
    emit({ kind: 'error', text: errorMessage(e, source, offset) });
  } finally {
    current = null;
    flushOutput();
    setConsole({ running: false });
  }
}

const fmtMs = (ms: number) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);

function errorMessage(e: unknown, source: string, offset: number): string {
  if (e instanceof ScriptStopped || (e instanceof DOMException && e.name === 'AbortError')) return 'Script stopped';
  if (!(e instanceof Error)) return `Uncaught ${formatValue(e)}`;
  const line = (e as Error & { scriptLine?: number | null }).scriptLine ?? stackLine(e.stack, source, offset);
  return `${e.name}: ${e.message}${line !== null && line !== undefined ? ` (line ${line})` : ''}`;
}

// ------------------------------------------------------------------ the API

type Target = string | number | bigint | { id?: string; entry?: string; addr?: string | null };

/** A function as scripts see it (a copy: scripts cannot change the store's objects). */
export interface ScriptFunction {
  name: string;
  entry: string;
  size: number;
  /** The name before a rename / the linkage name when mangled. */
  originalName: string | null;
  mangled: string | null;
  renamed: boolean;
  importStub: boolean;
}

const fnView = (f: FunctionSummary): ScriptFunction => ({
  name: f.name,
  entry: f.entry,
  size: f.size,
  originalName: f.originalName,
  mangled: f.mangled,
  renamed: f.renamed,
  importStub: f.importStub,
});

/** Symbols per binary, for names that are no function (the API looks names up in them). */
const symbolCache = new Map<string, Promise<SymbolItem[]>>();
function symbolsOf(bid: string): Promise<SymbolItem[]> {
  let p = symbolCache.get(bid);
  if (!p) {
    p = api.symbols(bid).then((r) => r.symbols);
    symbolCache.set(bid, p);
    p.catch(() => symbolCache.delete(bid));
  }
  return p;
}

function bid(): string {
  const b = getState().bid;
  if (!b) throw new Error('No binary open');
  return b;
}

interface Resolved {
  fn: FunctionSummary | null;
  addr: string | null;
  /** An OpenDecomp entity of an object from the API (a symbol, a string) that is no function. */
  entity?: string;
}

/** What a target names: a function (by name, entry, id or summary object), an address, or an API object. */
async function resolve(t: Target): Promise<Resolved> {
  const s = getState();
  if (t && typeof t === 'object') {
    const f = (t.id && s.byId.get(t.id)) || (t.entry && s.byEntry.get(toAddr(t.entry) ?? ''));
    if (f) return { fn: f, addr: f.entry };
    const a = toAddr(t.entry ?? t.addr);
    if (a || t.id) return { fn: a ? (s.byEntry.get(a) ?? null) : null, addr: a, ...(t.id ? { entity: t.id } : {}) };
    throw new TypeError(`Not an address, name or function: ${describe(t)}`);
  }
  const a = toAddr(t);
  if (a) return { fn: s.byEntry.get(a) ?? null, addr: a };
  if (typeof t !== 'string' || !t.trim()) throw new TypeError(`Not an address or name: ${describe(t)}`);
  const name = t.trim();
  const f = s.byName.get(name) ?? s.functions.find((x) => x.mangled === name);
  if (f) return { fn: f, addr: f.entry };
  const sym = (await symbolsOf(bid())).find((x) => x.addr && (x.name === name || x.mangled === name || x.name === `_${name}`));
  if (sym?.addr) return { fn: s.byEntry.get(toAddr(sym.addr)!) ?? null, addr: toAddr(sym.addr) };
  throw new Error(`No function or symbol named ${JSON.stringify(name)}`);
}

async function addrOf(t: Target): Promise<string> {
  const r = await resolve(t);
  if (!r.addr) throw new Error(`${describe(t)} has no address`);
  return r.addr;
}

/** The function a target names or an address lies in. */
async function functionOf(t: Target): Promise<FunctionSummary> {
  const r = await resolve(t);
  if (r.fn) return r.fn;
  const found = r.addr ? (await api.functionAt(bid(), r.addr)).function : null;
  const f = found && getState().byId.get(found.id);
  if (!f) throw new Error(`No function at ${r.addr ?? describe(t)}`);
  return f;
}

const xrefTarget = (r: Resolved) => (r.fn ? { id: r.fn.id } : r.entity ? { id: r.entity } : { addr: r.addr! });

const failIf = (err: string | null) => {
  if (err) throw new Error(err);
};

/**
 * The `or` object of one run. Every method is async and checks the run was not stopped,
 * before the call and when its result arrives.
 */
function makeApi(run: Run, print: (...a: unknown[]) => void) {
  const live = <A extends unknown[], R>(f: (...a: A) => Promise<R> | R) =>
    async (...a: A): Promise<R> => {
      // A call answered from the page's state resolves as a microtask: a loop of them would
      // never let the page paint or see the Stop button. Yield to the event loop now and then.
      if (performance.now() - run.yielded > 30) {
        await new Promise((r) => setTimeout(r, 0));
        run.yielded = performance.now();
      }
      if (run.stopped) throw new ScriptStopped();
      const r = await f(...a);
      if (run.stopped) throw new ScriptStopped();
      return r;
    };
  const search = (mode: SearchQuery['mode']) =>
    live(async (text: string | number | bigint, opts: Omit<SearchQuery, 'mode' | 'text'> = {}) => {
      const q = typeof text === 'string' ? text : `0x${BigInt(text).toString(16)}`;
      return (await api.search(bid(), { ...opts, mode, text: q }, undefined, run.abort.signal)).hits;
    });
  const variable = async (fn: Target, name: string) => {
    const f = await functionOf(fn);
    const d = await api.decompile(bid(), f.id, getState().options, run.abort.signal);
    const v = d.variables.find((x) => x.name === name);
    if (!v) throw new Error(`${f.name} has no parameter or local named ${JSON.stringify(name)} (it has ${d.variables.map((x) => x.name).join(', ') || 'none'})`);
    return { f, v };
  };
  return {
    // ------------------------------------------------------------ read
    /** The binary open: name, format, architecture, entry points. */
    info: live(() => {
      const i = getState().info;
      if (!i) throw new Error('No binary open');
      const t = i.image.target;
      return { name: i.record.name, sha256: i.record.sha256, size: i.record.size, format: t.format, architecture: t.architecture, imageBase: i.image.image_base, entryPoints: i.image.entry_points.map((e) => toAddr(e.value)) };
    }),
    functions: live(() => getState().functions.map(fnView)),
    func: live(async (t: Target) => {
      try {
        return fnView(await functionOf(t));
      } catch (e) {
        if (e instanceof TypeError) throw e;
        return null;
      }
    }),
    strings: live(async () => (await api.strings(bid())).strings),
    symbols: live(async () => (await api.symbols(bid())).symbols),
    sections: live(async () => (await api.sections(bid())).sections),
    comments: live(() => ({ ...getState().comments })),
    bookmarks: live(() => ({ ...getState().bookmarks })),
    xrefsTo: live(async (t: Target) => (await api.xrefs(bid(), xrefTarget(await resolve(t)), 'incoming')).xrefs),
    xrefsFrom: live(async (t: Target) => (await api.xrefs(bid(), xrefTarget(await resolve(t)), 'outgoing')).xrefs),
    callers: live(async (t: Target) => (await loadCalls((await functionOf(t)).id)).callers),
    callees: live(async (t: Target) => (await loadCalls((await functionOf(t)).id)).callees),
    disasm: live(async (t: Target): Promise<Instruction[]> => (await api.listing(bid(), (await functionOf(t)).id)).instructions),
    decompile: live(async (t: Target) => (await api.decompile(bid(), (await functionOf(t)).id, getState().options, run.abort.signal)).text),
    /** Parameters and locals of a function's pseudocode: name, C type, parameter or not. */
    variables: live(async (t: Target) =>
      (await api.decompile(bid(), (await functionOf(t)).id, getState().options, run.abort.signal)).variables.map((v) => ({ name: v.name, type: v.type, parameter: v.parameter })),
    ),
    read: live(async (t: Target, length: number | bigint) => {
      const start = BigInt(await addrOf(t));
      const len = toCount(length, 'length');
      const out = new Uint8Array(len);
      let done = 0;
      while (done < len) {
        if (run.stopped) throw new ScriptStopped();
        const chunk = await api.memory(bid(), `0x${(start + BigInt(done)).toString(16)}`, Math.min(65536, len - done));
        let got = 0;
        for (const seg of chunk.segments) {
          if (!seg.hex || BigInt(seg.start) !== start + BigInt(done + got)) break;
          for (let i = 0; i < seg.hex.length; i += 2) out[done + got++] = parseInt(seg.hex.slice(i, i + 2), 16);
        }
        if (got === 0) {
          if (done === 0) throw new Error(`0x${start.toString(16)} is not mapped`);
          return out.slice(0, done);
        }
        done += got;
      }
      return out;
    }),
    search: { bytes: search('bytes'), text: search('text'), immediate: search('immediate') },
    here: live(() => getState().loc?.addr ?? null),
    /** The current function (where the cursor is), or null. */
    hereFunction: live(() => {
      const s = getState();
      const f = s.loc?.fnId ? s.byId.get(s.loc.fnId) : undefined;
      return f ? fnView(f) : null;
    }),
    selection: live(() => {
      const sel = getState().selection;
      if (!sel) return null;
      if (sel.kind === 'function') {
        const f = getState().byId.get(sel.fnId);
        return f ? { kind: 'function', ...fnView(f) } : null;
      }
      if (sel.kind === 'variable') return { kind: 'variable', name: sel.name, type: sel.type, parameter: sel.parameter, function: getState().byId.get(sel.fnId)?.name ?? null };
      return { kind: 'addr', addr: sel.addr, name: sel.global?.name ?? sel.name ?? null };
    }),

    // ------------------------------------------------------------ write (undoable)
    rename: live(async (t: Target, name: string) => {
      const r = await resolve(t);
      failIf(await storeRename(xrefTarget(r), String(name)));
    }),
    renameVar: live(async (fn: Target, from: string, to: string) => {
      const { f, v } = await variable(fn, from);
      failIf(await storeRenameVariable(f.id, v.id, String(to), v.name));
    }),
    comment: live(async (t: Target, text: string) => failIf(await setComment(await addrOf(t), String(text ?? '')))),
    bookmark: live(async (t: Target, text: string | null = '') => failIf(await setBookmark(await addrOf(t), text === null ? null : String(text)))),
    /** The C type of a global (address or name), or of a variable: setType({ fn, var }, 'char *'). '' resets. */
    setType: live(async (t: Target | { fn: Target; var: string }, type: string) => {
      if (t && typeof t === 'object' && 'var' in t) {
        const { f, v } = await variable(t.fn, t.var);
        return failIf(await storeSetType({ fnId: f.id, valueId: v.id }, String(type), v.name, v.type));
      }
      const addr = await addrOf(t);
      failIf(await storeSetType({ addr }, String(type), `global at ${addr}`));
    }),
    /** D A O * U: kind 'byte'…'qword' (D cycles from undefined), 'string', 'ptr', 'array' (with count), 'undefine'. */
    defineData: live(async (t: Target, kind: 'cycle' | 'string' | 'ptr' | 'array' | 'undefine', count?: number) => {
      if (!['cycle', 'string', 'ptr', 'array', 'undefine'].includes(kind)) throw new TypeError(`kind must be 'cycle', 'string', 'ptr', 'array' or 'undefine', got ${describe(kind)}`);
      const r = await storeDefineData(kind, count === undefined ? undefined : toCount(count, 'count'), await addrOf(t));
      if (typeof r === 'string') throw new Error(r);
      return r;
    }),
    undo: live(() => storeUndo()),
    redo: live(() => storeRedo()),

    // ------------------------------------------------------------ UI
    goto: live(async (t: Target) => {
      const r = await resolve(t);
      await navigate(r.addr!, r.fn ? { fnId: r.fn.id } : {});
    }),
    print,
    help: () => print(HELP),
  };
}

export const HELP = `OpenReverse script API — every call is async: use await. Addresses are hex strings ('0x401000'); numbers, bigints and names ('main', '_fprintf') are accepted wherever a target is.

read
  or.info()                    binary name, format, architecture, entry points
  or.functions()               [{ name, entry, size, originalName, mangled, renamed, importStub }]
  or.func(target)              one function (by name, entry or an address inside it), or null
  or.strings() / or.symbols() / or.sections()
  or.xrefsTo(target)           references to a function, string or address: [{ from, fromFunction, kind, ... }]
  or.xrefsFrom(target)         references a function or instruction makes
  or.callers(fn) / or.callees(fn)   [{ name, entry, sites }]
  or.disasm(fn)                [{ addr, mnemonic, operands, bytes, flow, refs, resolved }]
  or.decompile(fn)             pseudocode text (the dialect and options of the toolbar)
  or.variables(fn)             parameters and locals of the pseudocode
  or.read(addr, length)        Uint8Array (shorter when the range leaves mapped memory)
  or.search.bytes('48 8b ?? 05') / or.search.text('usage', { caseSensitive }) / or.search.immediate(0x862)
  or.comments() / or.bookmarks()   { addr: text }
  or.here()                    the cursor address; or.hereFunction(), or.selection()
write (each is one undo step, like the same edit by hand: Ctrl+Z or await or.undo())
  or.rename(target, name)      a function or global; '' resets
  or.renameVar(fn, var, name)  a parameter or local
  or.comment(addr, text)       '' removes
  or.bookmark(addr, text)      null removes
  or.setType(addr, 'char *')   a global's C type; or.setType({ fn, var: 'arg0' }, 'int') a variable's; '' resets
  or.defineData(addr, kind, count?)   'cycle' (D), 'string' (A), 'ptr' (O), 'array' (*), 'undefine' (U)
  or.undo() / or.redo()
UI
  or.goto(target)              navigate there
  print(...values)             write to this console (objects are pretty-printed); help() shows this

A script that is one expression shows its value; otherwise \`return\` one. Stop (or Esc) makes the next API call throw. Scripts run in the page: a long loop of plain JavaScript without await blocks the UI.`;

export const EXAMPLES: { title: string; code: string }[] = [
  {
    title: 'Largest functions',
    code: `const fns = await or.functions();
fns.sort((a, b) => b.size - a.size);
for (const f of fns.slice(0, 10)) print(f.entry, f.size, f.name);`,
  },
  {
    title: 'Strings and how often they are referenced',
    code: `const out = [];
for (const s of (await or.strings()).slice(0, 50)) {
  const n = (await or.xrefsTo(s.addr)).length;
  if (n) out.push({ addr: s.addr, refs: n, text: s.text.slice(0, 60) });
}
return out.sort((a, b) => b.refs - a.refs);`,
  },
  {
    title: 'String arguments of every call to a function',
    code: `// Every call to fprintf and the string loaded before it (the listing's resolved comment).
// Scans the disassembly: OpenDecomp's index has no incoming xrefs of an import stub.
const target = await or.func('fprintf');
for (const f of await or.functions()) {
  if (f.importStub) continue;
  const insns = await or.disasm(f);
  insns.forEach((n, i) => {
    if (n.flow.kind !== 'call' || !n.refs.some((r) => r.addr === target.entry)) return;
    const str = insns.slice(Math.max(0, i - 8), i).reverse()
      .flatMap((p) => [...(p.resolved ?? []), ...p.refs]).find((r) => r.kind === 'string');
    print(n.addr, f.name, str ? JSON.stringify(str.label) : '(no string)');
  });
}`,
  },
  {
    title: 'Comment every call to a function',
    code: `const target = await or.func('malloc');
let n = 0;
for (const f of await or.functions()) {
  if (f.importStub) continue;
  for (const i of await or.disasm(f))
    if (i.flow.kind === 'call' && i.refs.some((r) => r.addr === target.entry)) await or.comment(i.addr, 'calls ' + target.name), n++;
}
return n + ' comments (Ctrl+Z undoes them one by one)';`,
  },
  {
    title: 'Functions that call an import',
    code: `const name = 'malloc';
const out = [];
for (const f of await or.functions())
  if (!f.importStub && (await or.callees(f)).some((c) => c.name.replace(/^_+/, '') === name)) out.push(f.name);
return out;`,
  },
  {
    title: 'Hex dump at the cursor',
    code: `const at = await or.here();
const bytes = await or.read(at, 64);
for (let i = 0; i < bytes.length; i += 16)
  print((BigInt(at) + BigInt(i)).toString(16).padStart(8, '0'),
        Array.from(bytes.subarray(i, i + 16), (b) => b.toString(16).padStart(2, '0')).join(' '));`,
  },
];
