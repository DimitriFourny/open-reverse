// State of the binary-wide search (Alt+B bytes, Alt+T text, Alt+I immediate). The
// search runs in the engine worker; hits stream in while it runs and stay until the
// next search, also when the panel is closed and reopened.

import { useSyncExternalStore } from 'react';
import { api, type SearchHit, type SearchQuery, type TaskProgress } from './api.ts';
import { getState } from './store.ts';

export type SearchMode = SearchQuery['mode'];

export interface SearchState {
  open: boolean;
  /** Bumped to focus the input (the panel was asked for again). */
  focus: number;
  mode: SearchMode;
  /** What is typed, per mode. */
  text: Record<SearchMode, string>;
  caseSensitive: boolean;
  ascii: boolean;
  utf16: boolean;
  /** The binary the results belong to. */
  bid: string | null;
  status: 'idle' | 'running' | 'done' | 'error' | 'cancelled';
  /** The query the results answer. */
  ran: SearchQuery | null;
  hits: SearchHit[];
  progress: TaskProgress | null;
  truncated: boolean;
  elapsedMs: number | null;
  error: string | null;
}

let state: SearchState = {
  open: false,
  focus: 0,
  mode: 'bytes',
  text: { bytes: '', text: '', immediate: '' },
  caseSensitive: false,
  ascii: true,
  utf16: true,
  bid: null,
  status: 'idle',
  ran: null,
  hits: [],
  progress: null,
  truncated: false,
  elapsedMs: null,
  error: null,
};

const listeners = new Set<() => void>();

export function getSearch(): SearchState {
  return state;
}

export function setSearch(patch: Partial<SearchState>): void {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function useSearch<T>(selector: (s: SearchState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selector(state),
  );
}

let running: AbortController | null = null;

/** Results of another binary are dropped. */
function forCurrentBinary(): void {
  const bid = getState().bid;
  if (state.bid !== bid) {
    running?.abort();
    running = null;
    setSearch({ bid, status: 'idle', ran: null, hits: [], progress: null, truncated: false, elapsedMs: null, error: null });
  }
}

/** Show the panel in a mode (the previous results stay until a new search). */
export function openSearch(mode?: SearchMode): void {
  forCurrentBinary();
  setSearch({ open: true, focus: state.focus + 1, ...(mode ? { mode } : {}) });
}

export function closeSearch(): void {
  setSearch({ open: false });
}

export function cancelSearch(): void {
  running?.abort();
}

export async function startSearch(): Promise<void> {
  forCurrentBinary();
  const bid = state.bid;
  if (!bid) return;
  const query: SearchQuery = {
    mode: state.mode,
    text: state.text[state.mode],
    ...(state.mode === 'text' ? { caseSensitive: state.caseSensitive, ascii: state.ascii, utf16: state.utf16 } : {}),
  };
  running?.abort();
  const abort = new AbortController();
  running = abort;
  setSearch({ status: 'running', ran: query, hits: [], progress: null, truncated: false, elapsedMs: null, error: null });
  const current = () => running === abort && state.bid === bid;
  try {
    const result = await api.search(
      bid,
      query,
      (progress) => {
        if (!current()) return;
        const items = (progress.items ?? []) as SearchHit[];
        setSearch({ progress, ...(items.length ? { hits: [...state.hits, ...items] } : {}) });
      },
      abort.signal,
    );
    if (current()) setSearch({ status: 'done', hits: result.hits, truncated: result.truncated, elapsedMs: result.elapsedMs, progress: null });
  } catch (e) {
    if (!current()) return;
    if (abort.signal.aborted) setSearch({ status: 'cancelled', progress: null });
    else setSearch({ status: 'error', error: e instanceof Error ? e.message : String(e), progress: null });
  } finally {
    if (running === abort) running = null;
  }
}
