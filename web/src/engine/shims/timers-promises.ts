export function setTimeout<T>(ms?: number, value?: T, options?: { signal?: AbortSignal }): Promise<T> {
  return new Promise((resolve, reject) => {
    const signal = options?.signal;
    if (signal?.aborted) return reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    const t = globalThis.setTimeout(() => resolve(value as T), ms ?? 0);
    signal?.addEventListener('abort', () => {
      globalThis.clearTimeout(t);
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}
export const setImmediate = <T>(value?: T) => setTimeout(0, value);
export default { setTimeout, setImmediate };
