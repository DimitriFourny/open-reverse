// Long-running engine calls (exports, imports) get a TaskContext as their last
// argument: a cancellation signal and a progress callback whose reports reach
// the caller as `progress` events of the RPC (see worker.ts and ../api.ts).

export interface TaskProgress {
  /** What is happening, e.g. 'snapshot', 'decompile', 'zip', 'write'. */
  phase: string;
  done: number;
  total: number | null;
  /** The item in progress (a function name, a file). */
  detail?: string;
  /** Results found since the previous report (a search streams its hits). */
  items?: unknown[];
}

export interface TaskContext {
  signal: AbortSignal;
  progress: (p: TaskProgress) => void;
}

/** Engine methods that receive a TaskContext as their last argument. */
export const TASK_METHODS = new Set(['exportArchive', 'importArchive', 'exportPseudocode', 'search', 'diff']);

/** A context for direct (non-RPC) calls and tests. */
export function noTask(): TaskContext {
  return { signal: new AbortController().signal, progress: () => undefined };
}
