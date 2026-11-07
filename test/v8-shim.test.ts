// Tests for the browser replacement of node:v8 serialize/deserialize (run: npm test).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import * as v8 from 'node:v8';
import shim, { deserialize, serialize } from '../web/src/engine/shims/v8.ts';

const roundTrip = <T>(value: T): T => deserialize(serialize(value)) as T;
const v8RoundTrip = <T>(value: T): T => v8.deserialize(v8.serialize(value)) as T;

/** Deterministic PRNG so failures reproduce. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A graph shaped like analysis results: records with bigint addresses, string fields,
 * nested arrays, Maps keyed by bigint, shared and cyclic references. */
function randomGraph(seed: number, nodes: number): unknown {
  const r = rng(seed);
  const pool: object[] = [];
  const kinds = ['load', 'store', 'call', 'branch', 'phi', 'const', 'add', 'sub', 'mul', 'cmp'];
  const leaf = (): unknown => {
    const p = r();
    if (p < 0.2) return BigInt(Math.floor(r() * 2 ** 48)) * (r() < 0.1 ? -1n : 1n);
    if (p < 0.4) return Math.floor(r() * 10000) - 100;
    if (p < 0.5) return r() * 1e6;
    if (p < 0.7) return kinds[Math.floor(r() * kinds.length)]! + (r() < 0.5 ? '' : `_${Math.floor(r() * 500)}`);
    if (p < 0.75) return r() < 0.5 ? undefined : null;
    if (p < 0.8) return r() < 0.5;
    if (p < 0.85 && pool.length) return pool[Math.floor(r() * pool.length)];
    return 'ünïcødé ' + 'x'.repeat(Math.floor(r() * 40)) + ' 💾';
  };
  const records: unknown[] = [];
  const byAddress = new Map<bigint, unknown>();
  for (let i = 0; i < nodes; i++) {
    const rec: Record<string, unknown> = {
      id: i,
      kind: kinds[i % kinds.length],
      address: 0x400000n + BigInt(i * 4),
      operands: Array.from({ length: Math.floor(r() * 5) }, leaf),
      attrs: { width: 64, signed: r() < 0.5, note: leaf() },
      tags: new Set([kinds[i % 3], kinds[i % 7]]),
    };
    if (r() < 0.3 && records.length) rec.parent = records[Math.floor(r() * records.length)];
    records.push(rec);
    pool.push(rec);
    byAddress.set(rec.address as bigint, rec);
  }
  const root: Record<string, unknown> = { version: 3, records, byAddress };
  root.self = root;
  return root;
}

/** Structural equality that also requires the same sharing: walks both graphs in parallel and
 * insists every object of `a` maps to exactly one object of `b` and back. Linear time, unlike
 * deepStrictEqual on large graphs with shared references. */
function assertIsomorphic(a: unknown, b: unknown): void {
  const forward = new Map<object, object>();
  const backward = new Map<object, object>();
  const stack: [unknown, unknown, string][] = [[a, b, '$']];
  while (stack.length) {
    const [x, y, path] = stack.pop()!;
    if (x === null || typeof x !== 'object') {
      assert.ok(Object.is(x, y), `${path}: ${String(x)} !== ${String(y)}`);
      continue;
    }
    assert.ok(y !== null && typeof y === 'object', `${path}: expected object`);
    const seen = forward.get(x);
    if (seen !== undefined || backward.has(y)) {
      assert.equal(seen, y, `${path}: sharing differs`);
      assert.equal(backward.get(y), x, `${path}: sharing differs`);
      continue;
    }
    forward.set(x, y);
    backward.set(y, x);
    assert.equal(Object.getPrototypeOf(y), Object.getPrototypeOf(x) ?? Object.prototype, `${path}: prototype`);
    if (x instanceof Map) {
      const xs = [...x];
      const ys = [...(y as Map<unknown, unknown>)];
      assert.equal(ys.length, xs.length, `${path}: size`);
      xs.forEach(([k, v], i) => stack.push([v, ys[i]![1], `${path}.get(${String(k)})`], [k, ys[i]![0], `${path}.key${i}`]));
    } else if (x instanceof Set) {
      const xs = [...x];
      const ys = [...(y as Set<unknown>)];
      assert.equal(ys.length, xs.length, `${path}: size`);
      xs.forEach((v, i) => stack.push([v, ys[i], `${path}.item${i}`]));
    } else {
      if (Array.isArray(x)) assert.equal((y as unknown[]).length, x.length, `${path}: length`);
      const xk = Object.keys(x);
      assert.deepEqual(Object.keys(y), xk, `${path}: keys`);
      for (const k of xk) stack.push([(x as Record<string, unknown>)[k], (y as Record<string, unknown>)[k], `${path}.${k}`]);
    }
  }
}

describe('v8 shim', () => {
  test('default export', () => {
    assert.equal(shim.serialize, serialize);
    assert.equal(shim.deserialize, deserialize);
    assert.ok(serialize(1) instanceof Uint8Array);
  });

  test('primitives', () => {
    const values: unknown[] = [
      undefined, null, true, false, 0, 1, -1, 63, 64, -64, -65, 2 ** 31 - 1, -(2 ** 31), 2 ** 31, -(2 ** 31) - 1,
      2 ** 53, -(2 ** 53), 1.5, -1e-300, Number.MAX_VALUE, Number.MIN_VALUE, NaN, Infinity, -Infinity,
      '', 'a', 'hello world', 'x'.repeat(100), 'x'.repeat(100000), 'é', 'ü'.repeat(70), '日本語', '💾', '\u0000',
      'abc\ud800', '\udc00x', '\ud83d', 'a'.repeat(50) + '\ud800' + 'b'.repeat(50),
      0n, 1n, -1n, 0xffffffffn, 0x100000000n, 0xffffffffffffffffn, 0x10000000000000000n,
      -0x8000000000000000n, -0x8000000000000001n, 2n ** 1000n + 12345n, -(3n ** 500n),
    ];
    for (const v of values) assert.ok(Object.is(roundTrip(v), v), `round trip of ${String(v)}`);
    assert.ok(Object.is(roundTrip(-0), -0));
    assert.ok(Object.is(roundTrip([-0])[0], -0));
  });

  test('strings in the intern table keep their identity of content', () => {
    const strs = ['é', 'abc\ud800', 'a', 'é', 'abc\ud800', 'x'.repeat(64), 'x'.repeat(64), 'x'.repeat(65), 'x'.repeat(65)];
    assert.deepEqual(roundTrip(strs), strs);
    const obj = { a: 'a', b: { a: 'b', b: 'a' } };
    assert.deepEqual(roundTrip(obj), obj);
  });

  test('objects keep keys, order and undefined fields', () => {
    const obj: Record<string, unknown> = { z: 1, a: undefined, 10: 'ten', 2: 'two', m: null, '': 'empty' };
    const back = roundTrip(obj);
    assert.deepEqual(back, obj);
    assert.ok('a' in back);
    assert.deepEqual(Object.keys(back), Object.keys(obj));
    assert.deepEqual(roundTrip({}), {});
    const proto = JSON.parse('{"__proto__": {"x": 1}, "y": 2}') as Record<string, unknown>;
    const protoBack = roundTrip(proto);
    assert.equal(Object.getPrototypeOf(protoBack), Object.prototype);
    assert.ok(Object.hasOwn(protoBack, '__proto__'));
    assert.deepEqual(protoBack, proto);
    const nullProto = Object.assign(Object.create(null) as object, { a: 1 });
    assert.deepEqual(roundTrip(nullProto), { a: 1 });
  });

  test('arrays keep length and holes', () => {
    assert.deepEqual(roundTrip([]), []);
    assert.deepEqual(roundTrip([1, 'a', undefined, null]), [1, 'a', undefined, null]);
    // eslint-disable-next-line no-sparse-arrays
    const holey = [1, , 3, , undefined];
    const back = roundTrip(holey);
    assert.equal(back.length, 5);
    assert.ok(!(1 in back) && !(3 in back) && 4 in back);
    assert.deepEqual(back, holey);
    const sized = new Array(10);
    assert.deepEqual(roundTrip(sized), sized);
  });

  test('Map and Set keep insertion order and key types', () => {
    const key = { k: 1 };
    const map = new Map<unknown, unknown>([
      ['b', 1], [1, 'one'], [1n, 'big'], [key, [key]], [NaN, 'nan'], [undefined, null], ['a', new Map([[2, 3]])],
    ]);
    const back = roundTrip(map);
    assert.deepEqual(back, map);
    assert.deepEqual([...back.keys()].map((k) => typeof k), [...map.keys()].map((k) => typeof k));
    const objKey = [...back.keys()][3] as object;
    assert.equal((back.get(objKey) as unknown[])[0], objKey);
    const set = new Set<unknown>(['z', 3, 'a', 1n, null, { x: 1 }, [1]]);
    assert.deepEqual(roundTrip(set), set);
    assert.deepEqual([...roundTrip(set)], [...set]);
  });

  test('shared substructure and cycles', () => {
    const shared = { s: 1 };
    const value = { a: shared, b: shared, list: [shared, shared] };
    const back = roundTrip(value);
    assert.equal(back.a, back.b);
    assert.equal(back.list[0], back.a);
    assert.equal(back.list[1], back.a);
    const cyclic: Record<string, unknown> = { name: 'root' };
    cyclic.self = cyclic;
    cyclic.child = { parent: cyclic, arr: [cyclic] };
    const cb = roundTrip(cyclic);
    assert.equal(cb.self, cb);
    assert.equal((cb.child as { parent: unknown }).parent, cb);
    assert.equal((cb.child as { arr: unknown[] }).arr[0], cb);
    const arr: unknown[] = [];
    arr.push(arr, new Set([arr]));
    const ab = roundTrip(arr);
    assert.equal(ab[0], ab);
    assert.ok((ab[1] as Set<unknown>).has(ab));
    const m = new Map<unknown, unknown>();
    m.set(m, m);
    const mb = roundTrip(m);
    assert.equal(mb.get(mb), mb);
  });

  test('decoded containers are fresh and mutable', () => {
    const frozen = Object.freeze({ a: Object.freeze([1, 2]) });
    const back = roundTrip(frozen) as { a: number[]; b?: number };
    assert.ok(!Object.isFrozen(back) && !Object.isFrozen(back.a));
    back.b = 1;
    back.a.push(3);
    assert.deepEqual(back, { a: [1, 2, 3], b: 1 });
  });

  test('Date, ArrayBuffer, typed arrays and DataView', () => {
    const date = new Date(1700000000123);
    assert.deepEqual(roundTrip(date), date);
    assert.ok(Number.isNaN(roundTrip(new Date(NaN)).getTime()));
    const big = new Uint8Array(1000).map((_, i) => i * 7);
    const values = [
      new Uint8Array([1, 2, 255]), new Int8Array([-1, 5]), new Uint8ClampedArray([0, 255]), new Uint16Array([65535]),
      new Int16Array([-2]), new Uint32Array([2 ** 32 - 1]), new Int32Array([-5]), new Float32Array([1.5, NaN]),
      new Float64Array([-0, Infinity]), new BigInt64Array([-1n]), new BigUint64Array([2n ** 64n - 1n]),
      new Uint16Array(big.buffer, 2, 10), big.buffer, new DataView(big.buffer, 3, 5), new Uint8Array(0),
    ];
    for (const v of values) assert.deepEqual(roundTrip(v), v);
    const ta = new Uint8Array([9]);
    const b = roundTrip({ x: ta, y: ta });
    assert.equal(b.x, b.y);
    assert.deepEqual(roundTrip(Buffer.from('hi')), new Uint8Array([104, 105]));
  });

  test('unsupported values throw TypeError', () => {
    assert.throws(() => serialize(() => 1), TypeError);
    assert.throws(() => serialize({ f() {} }), TypeError);
    assert.throws(() => serialize(Symbol('s')), TypeError);
    assert.throws(() => serialize([Symbol.iterator]), TypeError);
    class Thing {
      x = 1;
    }
    assert.throws(() => serialize(new Thing()), TypeError);
    assert.throws(() => serialize(/re/), TypeError);
  });

  test('corrupt input throws', () => {
    assert.throws(() => deserialize(new Uint8Array([1, 2, 3])), TypeError);
    const bytes = serialize({ a: [1, 2, 3], b: 'hello' });
    assert.throws(() => deserialize(bytes.subarray(0, bytes.length - 2)));
    assert.throws(() => deserialize(new Uint8Array([...bytes, 0])), TypeError);
  });

  test('returns a Buffer under Node and accepts a plain Uint8Array view', () => {
    const bytes = serialize({ a: 1 });
    assert.ok(Buffer.isBuffer(bytes));
    const padded = new Uint8Array(bytes.length + 8);
    padded.set(bytes, 5);
    assert.deepEqual(deserialize(padded.subarray(5, 5 + bytes.length)), { a: 1 });
  });

  test('deep nesting', () => {
    for (const depth of [5000, 100000]) {
      let arr: unknown[] = [];
      const rootArr = arr;
      let obj: Record<string, unknown> = {};
      const rootObj = obj;
      let map = new Map<string, unknown>();
      const rootMap = map;
      for (let i = 0; i < depth; i++) {
        const nextArr: unknown[] = [];
        arr.push(i, nextArr);
        arr = nextArr;
        const nextObj = {};
        obj.n = nextObj;
        obj = nextObj;
        const nextMap = new Map<string, unknown>();
        map.set('m', nextMap);
        map = nextMap;
      }
      let a = roundTrip(rootArr);
      let o = roundTrip(rootObj);
      let m = roundTrip(rootMap);
      for (let i = 0; i < depth; i++) {
        assert.equal(a[0], i);
        a = a[1] as unknown[];
        o = o.n as Record<string, unknown>;
        m = m.get('m') as Map<string, unknown>;
      }
      assert.deepEqual(a, []);
      assert.deepEqual(o, {});
      assert.equal(m.size, 0);
    }
  });

  test('2 MB random graph round trips', () => {
    const graph = randomGraph(1, 30000);
    const bytes = serialize(graph);
    assert.ok(bytes.length > 2_000_000, `encoded ${bytes.length} bytes`);
    const back = deserialize(bytes) as Record<string, unknown>;
    assertIsomorphic(graph, back);
    assert.equal(back.self, back);
    const records = back.records as Record<string, unknown>[];
    const byAddress = back.byAddress as Map<bigint, unknown>;
    for (const rec of records) assert.equal(byAddress.get(rec.address as bigint), rec);
    // Bytes are deterministic for equal graphs.
    assert.deepEqual(serialize(back), bytes);
  });

  test('matches node:v8 round trip semantics', () => {
    const shared = { s: [1, 2] };
    const cyclic: Record<string, unknown> = { shared, again: shared };
    cyclic.me = cyclic;
    // eslint-disable-next-line no-sparse-arrays
    const holey = [1, , undefined, -0];
    const values: unknown[] = [
      { a: undefined, b: -0, c: NaN, d: [Infinity, -Infinity], 3: 'x', 1: 'y', e: 'lone \ud800 surrogate' },
      new Map<unknown, unknown>([[1n, { k: -(2n ** 100n) }], ['s', new Set([1, '1', 1n])], [{ o: 1 }, null]]),
      cyclic,
      holey,
      { date: new Date(0), bytes: new Uint8Array([1, 2, 3]), f64: new Float64Array([0.1, -0]) },
      randomGraph(7, 300),
      Object.assign(Object.create(null) as object, { n: 1, nested: { m: new Map() } }),
      ['ü', '日本', '💾', 'x'.repeat(200), ''],
    ];
    for (const value of values) {
      const ours = roundTrip(value);
      const theirs = v8RoundTrip(value);
      assert.deepEqual(ours, theirs);
    }
    // Sharing structure of a larger graph matches too.
    const graph = randomGraph(3, 3000);
    assertIsomorphic(roundTrip(graph), v8RoundTrip(graph));
    const ours = roundTrip(cyclic);
    const theirs = v8RoundTrip(cyclic);
    assert.equal(ours.me === ours, theirs.me === theirs);
    assert.equal(ours.shared === ours.again, theirs.shared === theirs.again);
    assert.equal(1 in roundTrip(holey), 1 in v8RoundTrip(holey));
  });
});
