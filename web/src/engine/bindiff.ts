// Binary diffing in the style of BinDiff and Diaphora: a compact signature per function
// (built from its listing), the matching of two binaries' functions in rounds, the most
// confident first, and the alignment of two functions' disassembly lines. Pure: see
// test/bindiff.test.ts.

/** Bump when the signature layout changes: older cached tables are recomputed. */
export const DIFFSIG_VERSION = 1;

/** One disassembly line: address, mnemonic, operands. */
export type Line = [addr: string, mnemonic: string, operands: string];

/** What the matcher compares of a function. */
export interface FunctionFeatures {
  id: string;
  entry: string;
  name: string;
  /** The name comes from a symbol or a rename (not a generated `sub_…`): it can match by name. */
  named: boolean;
  size: number;
  insns: number;
  blocks: number;
  /** Edges between the function's own blocks. */
  edges: number;
  /** Call sites. */
  calls: number;
  /** Strings it references (sorted, unique). */
  strings: string[];
  /** Names of the named functions and imports it calls (sorted, unique). */
  calleeNames: string[];
  /** Entries of the functions of the same image it calls or tail-calls (sorted, unique). */
  callees: string[];
  /** Hash of the mnemonic sequence (operands stripped). */
  mnemonicHash: string;
  /** Hash of mnemonics and operands with addresses masked: equal hashes are identical code. */
  exactHash: string;
  /** Hash of the blocks' sorted (in, out) degree multiset. */
  cfgHash: string;
  /** How often each mnemonic occurs. */
  mnemonics: Record<string, number>;
}

export interface FunctionSig extends FunctionFeatures {
  lines: Line[];
}

/** The parts of a listing a signature is built from (see session.ts). */
export interface SigInput {
  function: { id: string; entry: string; name: string; size: number };
  instructions: {
    addr: string;
    mnemonic: string;
    operands: string;
    flow: { kind: string; targets: string[] };
    refs: { kind: string; label: string }[];
    resolved: { kind: string; label: string; access: string }[];
  }[];
  blocks: { id: string; edges: { to: string | null }[] }[];
}

/** A callee by entry address: a function of the image (or an import stub), if any. */
export type CalleeLookup = (entry: string) => { entry: string; name: string; importStub: boolean } | undefined;

const GENERATED = /^(sub|fcn|func|FUN|nullsub|j_sub|unknown)_[0-9a-fA-F]+$/;

/** True for a name a tool made up from the address. */
export function generatedName(name: string): boolean {
  return GENERATED.test(name);
}

/** A 64-bit hash of a string (two FNV-1a lanes), as 16 hex digits. */
export function hashText(text: string): string {
  // Two 32-bit FNV-1a lanes (the second also mixes in the position).
  let lo = 0x811c9dc5;
  let hi = 0x050c5d1f;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    lo = Math.imul(lo ^ c, 0x01000193) >>> 0;
    hi = Math.imul(hi ^ (c + i), 0x01000193) >>> 0;
  }
  return hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0');
}

/** Operands with addresses (hex numbers of 4+ digits, `0x1234` or MASM `1234h`) masked, small constants kept. */
export function maskOperands(operands: string): string {
  return operands.replace(/0x[0-9a-fA-F]{4,}|\b[0-9][0-9a-fA-F]{3,}h\b/g, '@');
}

/** The masked form of a line: what "the same instruction" means across two builds. */
export function lineKey(line: Line): string {
  return `${line[1]} ${maskOperands(line[2])}`;
}

/** A function's signature from its listing. */
export function functionSignature(input: SigInput, callee: CalleeLookup): FunctionSig {
  const fn = input.function;
  const lines: Line[] = input.instructions.map((i) => [i.addr, i.mnemonic, i.operands]);
  const mnemonics: Record<string, number> = {};
  for (const l of lines) mnemonics[l[1]] = (mnemonics[l[1]] ?? 0) + 1;
  const strings = new Set<string>();
  const calleeNames = new Set<string>();
  const callees = new Set<string>();
  let calls = 0;
  for (const i of input.instructions) {
    for (const r of i.refs) if (r.kind === 'string') strings.add(r.label);
    const isCall = i.flow.kind === 'call';
    if (isCall) calls++;
    let named = false;
    // A call, or a jump to another function's entry (a tail call).
    for (const t of i.flow.targets) {
      const f = callee(t);
      if (!f || f.entry === fn.entry) continue;
      if (!f.importStub) callees.add(f.entry);
      if (!generatedName(f.name)) calleeNames.add(f.name);
      named = true;
    }
    for (const r of i.resolved) {
      if (r.kind === 'string') strings.add(r.label);
      else if (!named && isCall && (r.kind === 'import' || r.kind === 'function') && r.label && !generatedName(r.label)) calleeNames.add(r.label);
    }
  }
  const degree = new Map<string, [number, number]>(input.blocks.map((b) => [b.id, [0, 0]]));
  let edges = 0;
  for (const b of input.blocks)
    for (const e of b.edges) {
      if (!e.to || !degree.has(e.to)) continue;
      edges++;
      degree.get(b.id)![1]++;
      degree.get(e.to)![0]++;
    }
  const shape = [...degree.values()].map(([i, o]) => `${i}:${o}`).sort().join(',');
  return {
    id: fn.id,
    entry: fn.entry,
    name: fn.name,
    named: !generatedName(fn.name),
    size: fn.size,
    insns: lines.length,
    blocks: input.blocks.length,
    edges,
    calls,
    strings: [...strings].sort(),
    calleeNames: [...calleeNames].sort(),
    callees: [...callees].sort(),
    mnemonicHash: hashText(lines.map((l) => l[1]).join(';')),
    exactHash: hashText(lines.map(lineKey).join(';')),
    cfgHash: hashText(shape),
    mnemonics,
    lines,
  };
}

// ------------------------------------------------------------------ similarity

const ratio = (x: number, y: number) => (x === y ? 1 : Math.min(x, y) / Math.max(x, y));

function jaccard(x: string[], y: string[]): number {
  const ys = new Set(y);
  let both = 0;
  for (const s of x) if (ys.has(s)) both++;
  const union = x.length + y.length - both;
  return union === 0 ? 1 : both / union;
}

/** Weighted Jaccard of two mnemonic histograms. */
function histogram(x: Record<string, number>, y: Record<string, number>): number {
  let min = 0;
  let max = 0;
  for (const k in x) {
    const a = x[k]!;
    const b = y[k] ?? 0;
    min += Math.min(a, b);
    max += Math.max(a, b);
  }
  for (const k in y) if (!(k in x)) max += y[k]!;
  return max === 0 ? 1 : min / max;
}

/**
 * How alike two functions are, 0..1: 1 only for identical code, else a weighted mix of the
 * mnemonic histogram, the shape counts, the CFG shape, and the strings and named callees
 * (each of the last two only when either function has some).
 */
export function similarity(x: FunctionFeatures, y: FunctionFeatures): number {
  if (x.exactHash === y.exactHash) return 1;
  const parts: [number, number][] = [
    [0.35, histogram(x.mnemonics, y.mnemonics)],
    [0.25, (ratio(x.insns, y.insns) + ratio(x.blocks, y.blocks) + ratio(x.edges, y.edges) + ratio(x.calls, y.calls)) / 4],
    [0.1, x.cfgHash === y.cfgHash ? 1 : 0],
  ];
  if (x.strings.length || y.strings.length) parts.push([0.15, jaccard(x.strings, y.strings)]);
  if (x.calleeNames.length || y.calleeNames.length) parts.push([0.15, jaccard(x.calleeNames, y.calleeNames)]);
  if (x.named && y.named) parts.push([0.1, x.name === y.name ? 1 : 0]);
  const weight = parts.reduce((n, [w]) => n + w, 0);
  const score = parts.reduce((n, [w, v]) => n + w * v, 0) / weight;
  return Math.min(0.99, Math.round(score * 1000) / 1000);
}

// ------------------------------------------------------------------ matching

export type MatchReason = 'name' | 'identical code' | 'mnemonics + CFG' | 'strings' | 'call graph' | 'similarity';

export interface Match {
  /** Indices into the two function lists. */
  a: number;
  b: number;
  similarity: number;
  reason: MatchReason;
  /** Same code (addresses aside). */
  identical: boolean;
}

export interface MatchResult {
  matches: Match[];
  unmatchedA: number[];
  unmatchedB: number[];
}

export interface MatchOptions {
  /** Least similarity of a match by call-graph neighbourhood. */
  propagate?: number;
  /** Least similarity of a match by similarity alone (the last round). */
  threshold?: number;
}

/**
 * Pair the functions of A with those of B, in rounds: the same (non-generated) name;
 * identical code; the same mnemonic sequence and CFG shape; the same set of referenced
 * strings (each only when the key is unique on both sides); then the callees and callers of
 * matched pairs; finally the most similar remaining pairs above a threshold.
 */
export function matchFunctions(A: FunctionFeatures[], B: FunctionFeatures[], opts: MatchOptions = {}): MatchResult {
  const propagate = opts.propagate ?? 0.5;
  const threshold = opts.threshold ?? 0.6;
  const toB = new Int32Array(A.length).fill(-1);
  const toA = new Int32Array(B.length).fill(-1);
  const matches: Match[] = [];
  const pair = (a: number, b: number, reason: MatchReason) => {
    toB[a] = b;
    toA[b] = a;
    const s = similarity(A[a]!, B[b]!);
    matches.push({ a, b, similarity: s, reason, identical: s === 1 });
  };

  const unique = (reason: MatchReason, key: (f: FunctionFeatures) => string | null) => {
    const index = (fs: FunctionFeatures[], taken: Int32Array) => {
      const m = new Map<string, number>();
      fs.forEach((f, i) => {
        if (taken[i] !== -1) return;
        const k = key(f);
        if (k !== null) m.set(k, m.has(k) ? -1 : i);
      });
      return m;
    };
    const ka = index(A, toB);
    const kb = index(B, toA);
    for (const [k, a] of ka) {
      const b = kb.get(k);
      if (a >= 0 && b !== undefined && b >= 0) pair(a, b, reason);
    }
  };
  unique('name', (f) => (f.named ? f.name : null));
  unique('identical code', (f) => (f.insns ? f.exactHash : null));
  unique('mnemonics + CFG', (f) => (f.insns > 2 ? `${f.mnemonicHash}/${f.cfgHash}` : null));
  unique('strings', (f) => (f.strings.length ? f.strings.join('\u0000') : null));

  // Call-graph propagation: neighbours of matched pairs, until nothing new matches.
  const byEntry = (fs: FunctionFeatures[]) => new Map(fs.map((f, i) => [f.entry, i]));
  const ea = byEntry(A);
  const eb = byEntry(B);
  const calleesOf = (fs: FunctionFeatures[], e: Map<string, number>) => fs.map((f) => f.callees.map((c) => e.get(c)).filter((i): i is number => i !== undefined));
  const callersOf = (callees: number[][]) => {
    const out: number[][] = callees.map(() => []);
    callees.forEach((cs, i) => cs.forEach((c) => out[c]!.push(i)));
    return out;
  };
  const calleesA = calleesOf(A, ea);
  const calleesB = calleesOf(B, eb);
  const callersA = callersOf(calleesA);
  const callersB = callersOf(calleesB);
  const best = (as: number[], bs: number[], min: number, reason: MatchReason) => {
    const cand: [number, number, number][] = [];
    for (const a of as) if (toB[a] === -1) for (const b of bs) if (toA[b] === -1) {
      const s = similarity(A[a]!, B[b]!);
      if (s >= min) cand.push([s, a, b]);
    }
    cand.sort((x, y) => y[0] - x[0] || x[1] - y[1] || x[2] - y[2]);
    let n = 0;
    for (const [, a, b] of cand)
      if (toB[a] === -1 && toA[b] === -1) {
        pair(a, b, reason);
        n++;
      }
    return n;
  };
  for (let round = 0; round < 50; round++) {
    let added = 0;
    for (const m of [...matches]) {
      added += best(calleesA[m.a]!, calleesB[m.b]!, propagate, 'call graph');
      added += best(callersA[m.a]!, callersB[m.b]!, propagate, 'call graph');
    }
    if (!added) break;
  }

  // The rest: the most similar pairs, comparing only functions of comparable length.
  const restB = B.map((_, i) => i).filter((i) => toA[i] === -1).sort((x, y) => B[x]!.insns - B[y]!.insns);
  const cand: [number, number, number][] = [];
  for (let a = 0; a < A.length; a++) {
    if (toB[a] !== -1) continue;
    const n = A[a]!.insns;
    let lo = 0;
    let hi = restB.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (B[restB[mid]!]!.insns * 2 < n) lo = mid + 1;
      else hi = mid;
    }
    for (let k = lo; k < restB.length && k < lo + 2000; k++) {
      const b = restB[k]!;
      if (B[b]!.insns > n * 2 + 2) break;
      const s = similarity(A[a]!, B[b]!);
      if (s >= threshold) cand.push([s, a, b]);
    }
  }
  cand.sort((x, y) => y[0] - x[0] || x[1] - y[1] || x[2] - y[2]);
  for (const [, a, b] of cand) if (toB[a] === -1 && toA[b] === -1) pair(a, b, 'similarity');

  return {
    matches,
    unmatchedA: A.map((_, i) => i).filter((i) => toB[i] === -1),
    unmatchedB: B.map((_, i) => i).filter((i) => toA[i] === -1),
  };
}

// ------------------------------------------------------------------ line alignment

export interface AlignedRow {
  /** Indices into the two line lists (null: no counterpart). */
  a: number | null;
  b: number | null;
  /** same: equal masked lines; changed: a different line in its place; removed / added: only on one side. */
  kind: 'same' | 'changed' | 'removed' | 'added';
}

/** Largest table the exact alignment fills; longer functions are aligned by position past their common ends. */
const MAX_CELLS = 4_000_000;

/**
 * Side-by-side rows of two functions: a longest common subsequence of their mnemonics
 * anchors the rows; lines between anchors are paired in order (changed) and the surplus
 * shows on one side only. A line equal to its counterpart (addresses masked) is `same`.
 */
export function alignLines(a: Line[], b: Line[]): AlignedRow[] {
  const ma = a.map((l) => l[1]);
  const mb = b.map((l) => l[1]);
  let pre = 0;
  while (pre < ma.length && pre < mb.length && ma[pre] === mb[pre]) pre++;
  let suf = 0;
  while (suf < ma.length - pre && suf < mb.length - pre && ma[ma.length - 1 - suf] === mb[mb.length - 1 - suf]) suf++;
  const n = ma.length - pre - suf;
  const m = mb.length - pre - suf;
  // Anchors: index pairs of equal mnemonics, in order.
  const anchors: [number, number][] = [];
  for (let i = 0; i < pre; i++) anchors.push([i, i]);
  if (n > 0 && m > 0 && (n + 1) * (m + 1) <= MAX_CELLS) {
    const w = m + 1;
    const t = new Uint32Array((n + 1) * w);
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        t[i * w + j] = ma[pre + i] === mb[pre + j] ? t[(i + 1) * w + j + 1]! + 1 : Math.max(t[(i + 1) * w + j]!, t[i * w + j + 1]!);
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (ma[pre + i] === mb[pre + j]) anchors.push([pre + i++, pre + j++]);
      else if (t[(i + 1) * w + j]! >= t[i * w + j + 1]!) i++;
      else j++;
    }
  }
  for (let k = 0; k < suf; k++) anchors.push([ma.length - suf + k, mb.length - suf + k]);

  const rows: AlignedRow[] = [];
  const gap = (i0: number, i1: number, j0: number, j1: number) => {
    const both = Math.min(i1 - i0, j1 - j0);
    for (let k = 0; k < both; k++) rows.push({ a: i0 + k, b: j0 + k, kind: 'changed' });
    for (let k = i0 + both; k < i1; k++) rows.push({ a: k, b: null, kind: 'removed' });
    for (let k = j0 + both; k < j1; k++) rows.push({ a: null, b: k, kind: 'added' });
  };
  let i = 0;
  let j = 0;
  for (const [x, y] of anchors) {
    gap(i, x, j, y);
    rows.push({ a: x, b: y, kind: lineKey(a[x]!) === lineKey(b[y]!) ? 'same' : 'changed' });
    i = x + 1;
    j = y + 1;
  }
  gap(i, a.length, j, b.length);
  return rows;
}

// ------------------------------------------------------------------ results

/** A function as the diff view lists it. */
export interface DiffFunction {
  id: string;
  entry: string;
  name: string;
  size: number;
  insns: number;
  blocks: number;
}

export interface DiffRow {
  a: DiffFunction;
  b: DiffFunction;
  similarity: number;
  reason: MatchReason;
  identical: boolean;
}

export interface DiffSide {
  bid: string;
  name: string;
  functions: number;
  /** The signatures came from the cache (no function was disassembled). */
  cached: boolean;
  ms: number;
}

export interface DiffResult {
  a: DiffSide;
  b: DiffSide;
  matches: DiffRow[];
  unmatchedA: DiffFunction[];
  unmatchedB: DiffFunction[];
  matchMs: number;
}

export function diffFunction(f: FunctionFeatures): DiffFunction {
  return { id: f.id, entry: f.entry, name: f.name, size: f.size, insns: f.insns, blocks: f.blocks };
}

/** The matcher's result as rows of functions. */
export function diffRows(A: FunctionFeatures[], B: FunctionFeatures[], r: MatchResult): Pick<DiffResult, 'matches' | 'unmatchedA' | 'unmatchedB'> {
  return {
    matches: r.matches.map((m) => ({ a: diffFunction(A[m.a]!), b: diffFunction(B[m.b]!), similarity: m.similarity, reason: m.reason, identical: m.identical })),
    unmatchedA: r.unmatchedA.map((i) => diffFunction(A[i]!)),
    unmatchedB: r.unmatchedB.map((i) => diffFunction(B[i]!)),
  };
}
