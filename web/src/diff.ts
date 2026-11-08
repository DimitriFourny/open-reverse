// State of the binary diff view: the open binary (A) against another stored binary (B).
// The diff runs in the engine worker as a background task; its result stays until the
// next diff or until another binary is opened.

import { useSyncExternalStore } from 'react';
import { api, type AlignedRow, type DiffFunction, type DiffResult, type Line, type TaskProgress } from './api.ts';
import { getState } from './store.ts';

export type DiffCategory = 'identical' | 'changed' | 'onlyA' | 'onlyB';

/** One row of the diff table: a matched pair, or a function only one side has. */
export interface DiffTableRow {
  key: string;
  category: DiffCategory;
  a: DiffFunction | null;
  b: DiffFunction | null;
  similarity: number | null;
  reason: string;
}

export interface DiffState {
  /** The view is shown (instead of the code panes). */
  open: boolean;
  /** The open binary the result belongs to, and the other one. */
  bid: string | null;
  other: string | null;
  status: 'idle' | 'running' | 'done' | 'error' | 'cancelled';
  progress: TaskProgress | null;
  result: DiffResult | null;
  rows: DiffTableRow[];
  error: string | null;
  selected: string | null;
  /** The selected pair side by side. */
  pair: { key: string; a: Line[]; b: Line[]; rows: AlignedRow[] } | { key: string; error: string } | null;
}

let state: DiffState = { open: false, bid: null, other: null, status: 'idle', progress: null, result: null, rows: [], error: null, selected: null, pair: null };

const listeners = new Set<() => void>();

export function getDiff(): DiffState {
  return state;
}

function set(patch: Partial<DiffState>): void {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function useDiff<T>(selector: (s: DiffState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
  );
}

/** The table rows of a result: matched pairs (identical or changed), then each side's unmatched functions. */
export function tableRows(r: DiffResult): DiffTableRow[] {
  return [
    ...r.matches.map((m) => ({
      key: `${m.a.id}|${m.b.id}`,
      category: (m.identical ? 'identical' : 'changed') as DiffCategory,
      a: m.a,
      b: m.b,
      similarity: m.similarity,
      reason: m.reason,
    })),
    ...r.unmatchedA.map((f) => ({ key: `${f.id}|`, category: 'onlyA' as const, a: f, b: null, similarity: null, reason: '' })),
    ...r.unmatchedB.map((f) => ({ key: `|${f.id}`, category: 'onlyB' as const, a: null, b: f, similarity: null, reason: '' })),
  ];
}

let running: AbortController | null = null;

/** Show the view (the result of the open binary, if any). */
export function showDiff(open = true): void {
  if (open && state.bid !== getState().bid) return;
  set({ open });
}

export function cancelDiff(): void {
  running?.abort();
}

/** Diff the open binary with another stored binary. */
export async function startDiff(other: string): Promise<void> {
  const bid = getState().bid;
  if (!bid) return;
  running?.abort();
  const abort = new AbortController();
  running = abort;
  set({ open: true, bid, other, status: 'running', progress: null, result: null, rows: [], error: null, selected: null, pair: null });
  const current = () => running === abort && getState().bid === bid;
  try {
    const result = await api.diff(bid, other, (progress) => current() && set({ progress }), abort.signal);
    if (!current()) return;
    const rows = tableRows(result);
    set({ status: 'done', result, rows, progress: null });
    // Start on the least similar changed function: what a patch diff is about.
    const first = rows.filter((r) => r.category === 'changed').sort((x, y) => x.similarity! - y.similarity!)[0];
    if (first) void selectDiffRow(first.key);
  } catch (e) {
    if (!current()) return;
    if (abort.signal.aborted) set({ status: 'cancelled', progress: null });
    else set({ status: 'error', error: e instanceof Error ? e.message : String(e), progress: null });
  } finally {
    if (running === abort) running = null;
  }
}

/** Select a row and fetch its two functions side by side. */
export async function selectDiffRow(key: string): Promise<void> {
  const row = state.rows.find((r) => r.key === key);
  if (!row || !state.bid || !state.other) return;
  set({ selected: key });
  if (state.pair?.key === key) return;
  try {
    const pair = await api.diffFunction(state.bid, row.a?.id ?? null, state.other, row.b?.id ?? null);
    if (state.selected === key) set({ pair: { key, ...pair } });
  } catch (e) {
    if (state.selected === key) set({ pair: { key, error: e instanceof Error ? e.message : String(e) } });
  }
}

/** Another binary was opened (or the open one closed): the result no longer applies. */
export function resetDiff(): void {
  running?.abort();
  running = null;
  set({ open: false, bid: null, other: null, status: 'idle', progress: null, result: null, rows: [], error: null, selected: null, pair: null });
}
