// How many decompile workers the machine can afford, and what the engine holds in memory.
//
// Every request-worker helper keeps its own copy of the project database plus the
// decompiler's heaps (a large binary's project is hundreds of MB, a renderer peaks at
// several GB), so the automatic count is bounded by memory as well as by cores.

/**
 * The automatic worker count: one less than the cores (2 to 4), capped by memory.
 * `memoryGiB` is `navigator.deviceMemory` (Chrome rounds it to a power of two and caps it
 * at 8, so 8 means "8 GB or more"): under 8 GB → 1 (decompiles in the engine thread only),
 * 8 GB or more → 2, unknown (Firefox, Safari) → 2.
 */
export function autoThreads(cores: number, memoryGiB: number | null): number {
  const byCores = Math.max(2, Math.min(4, cores - 1));
  const byMemory = memoryGiB === null ? 2 : memoryGiB < 8 ? 1 : 2;
  return Math.min(byCores, byMemory);
}

/** `navigator.deviceMemory` in GiB, where the browser reports it. */
export function deviceMemory(): number | null {
  const n = typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof n === 'number' && n > 0 ? n : null;
}

/** Bytes the engine worker holds, by what holds them. */
export interface EngineMemory {
  /** The SQLite WASM heap (open project databases, caches); it never shrinks. */
  sqlite: number;
  /** Files held in memory by the virtual filesystem (binaries, artifacts), open databases excluded. */
  files: number;
  /** The worker's JavaScript heap, where the browser reports it (Chrome's `performance.memory`). */
  js: number | null;
}

export function jsHeapUsed(): number | null {
  const m = typeof performance === 'undefined' ? undefined : (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
  return m && m.usedJSHeapSize > 0 ? m.usedJSHeapSize : null;
}
