// node:util subset.
function eq(a: unknown, b: unknown, seen: Map<object, object>): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  const x = a as object;
  const y = b as object;
  if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;
  if (seen.get(x) === y) return true;
  seen.set(x, y);
  if (ArrayBuffer.isView(x)) {
    const u = new Uint8Array((x as ArrayBufferView).buffer, (x as ArrayBufferView).byteOffset, (x as ArrayBufferView).byteLength);
    const v = new Uint8Array((y as ArrayBufferView).buffer, (y as ArrayBufferView).byteOffset, (y as ArrayBufferView).byteLength);
    return u.length === v.length && u.every((n, i) => n === v[i]);
  }
  if (x instanceof Date) return x.getTime() === (y as Date).getTime();
  if (x instanceof Map) {
    const m = y as Map<unknown, unknown>;
    if (x.size !== m.size) return false;
    for (const [k, v] of x) if (!m.has(k) || !eq(v, m.get(k), seen)) return false;
    return true;
  }
  if (x instanceof Set) {
    const s = y as Set<unknown>;
    if (x.size !== s.size) return false;
    for (const v of x) if (!s.has(v)) return false;
    return true;
  }
  const ka = Object.keys(x);
  const kb = Object.keys(y);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.prototype.hasOwnProperty.call(y, k) || !eq((x as Record<string, unknown>)[k], (y as Record<string, unknown>)[k], seen)) return false;
  return true;
}

export const isDeepStrictEqual = (a: unknown, b: unknown) => eq(a, b, new Map());
export const inspect = (v: unknown) => {
  try {
    return JSON.stringify(v, (_k, x) => (typeof x === 'bigint' ? `${x}n` : x));
  } catch {
    return String(v);
  }
};
export const TextDecoder = globalThis.TextDecoder;
export const TextEncoder = globalThis.TextEncoder;
export const types = { isUint8Array: (v: unknown) => v instanceof Uint8Array };
export function parseArgs(): never {
  throw new Error('parseArgs is not available in the browser');
}
export default { isDeepStrictEqual, inspect, TextDecoder, TextEncoder, types, parseArgs };
