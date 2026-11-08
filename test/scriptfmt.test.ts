// The script console's pure helpers (web/src/scriptfmt.ts): address arguments, result
// formatting, error line numbers, history (run: npm test).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { asExpression, formatPrint, formatValue, hexBytes, pushHistory, stackLine, syntaxErrorLine, toAddr, toCount } from '../web/src/scriptfmt.ts';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => () => Promise<unknown>;
const compile = (body: string) => void new AsyncFunction('or', 'print', body);

describe('toAddr', () => {
  test('hex strings, numbers and bigints become canonical hex', () => {
    assert.equal(toAddr('0x0000401A90'), '0x401a90');
    assert.equal(toAddr(' 401a90h '), '0x401a90');
    assert.equal(toAddr(4198400), '0x401000');
    assert.equal(toAddr(0x100003f00n), '0x100003f00');
    assert.equal(toAddr(0), '0x0');
  });
  test('names and invalid values are no address', () => {
    for (const x of ['main', 'add', '401000', '', '0x', -1, 1.5, Number.MAX_SAFE_INTEGER + 2, -1n, null, undefined, {}]) assert.equal(toAddr(x), null, String(x));
  });
});

describe('toCount', () => {
  test('accepts integers in any spelling', () => {
    assert.equal(toCount(16, 'length'), 16);
    assert.equal(toCount(16n, 'length'), 16);
    assert.equal(toCount('0x10', 'length'), 16);
    assert.equal(toCount('16', 'length'), 16);
  });
  test('rejects the rest with the argument in the message', () => {
    assert.throws(() => toCount(-1, 'length'), /length must be a non-negative integer, got -1/);
    assert.throws(() => toCount('ten', 'count'), /count .* got "ten"/);
    assert.throws(() => toCount(undefined, 'length'), /got undefined/);
  });
});

describe('formatValue', () => {
  test('top-level strings are raw, nested ones quoted', () => {
    assert.equal(formatValue('int main() {}'), 'int main() {}');
    assert.equal(formatValue(['a', 'b"c']), '["a", "b\\"c"]');
  });
  test('short objects stay on one line, long ones indent', () => {
    assert.equal(formatValue({ name: 'main', entry: '0x401000', size: 42 }), '{ name: "main", entry: "0x401000", size: 42 }');
    const long = formatValue({ name: 'a_rather_long_function_name_here', entry: '0x401000', size: 4200, mangled: '_ZN4geom4areaEii', renamed: false });
    assert.equal(long.split('\n')[0], '{');
    assert.match(long, /^ {2}mangled: "_ZN4geom4areaEii",$/m);
  });
  test('arrays of objects: one element per line', () => {
    const fns = Array.from({ length: 5 }, (_, i) => ({ name: `function_number_${i}`, entry: `0x40${i}000`, size: i }));
    const lines = formatValue(fns).split('\n');
    assert.equal(lines.length, 7);
    assert.equal(lines[1], '  { name: "function_number_0", entry: "0x400000", size: 0 },');
  });
  test('long lists are cut with a count', () => {
    const text = formatValue(Array.from({ length: 250 }, (_, i) => i), { maxItems: 3 });
    assert.equal(text, '[0, 1, 2, … 247 more (250 items)]');
    assert.match(formatValue(Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`k${i}`, i])), { maxItems: 2 }), /… 3 more \(5 entries\)/);
  });
  test('scalars, special objects, cycles and depth', () => {
    assert.equal(formatValue(undefined), 'undefined');
    assert.equal(formatValue(12n), '12n');
    assert.equal(formatValue(new Error('boom')), 'Error: boom');
    assert.equal(formatValue(function f() {}), '[function f]');
    assert.equal(formatValue(new Map([['a', 1]])), 'Map(1) {"a" => 1}');
    assert.equal(formatValue(new Set([1, 2])), 'Set(2) {1, 2}');
    const cyc: Record<string, unknown> = { a: 1 };
    cyc.self = cyc;
    assert.equal(formatValue(cyc), '{ a: 1, self: [circular] }');
    assert.equal(formatValue({ a: { b: { c: 1 } } }, { maxDepth: 2 }), '{ a: { b: {…} } }');
    // The same object twice is no cycle.
    const o = { x: 1 };
    assert.equal(formatValue([o, o]), '[{ x: 1 }, { x: 1 }]');
    assert.equal(formatValue({ 'not-a-key': 1 }), '{ "not-a-key": 1 }');
  });
  test('long nested strings are cut with their length', () => {
    assert.equal(formatValue(['abcdef'], { maxString: 3 }), '["abc…" (6 chars)]');
  });
  test('byte arrays as hex', () => {
    assert.equal(formatValue(Uint8Array.of(0x48, 0x8b, 5)), 'Uint8Array(3) 48 8b 05');
    assert.equal(hexBytes(Uint8Array.of(1, 2, 3), 2), 'Uint8Array(3) 01 02 … 1 more');
    assert.equal(hexBytes(new Uint8Array(0)), 'Uint8Array(0)');
  });
  test('print joins its formatted arguments', () => {
    assert.equal(formatPrint(['0x401000', 42, { a: 1 }]), '0x401000 42 { a: 1 }');
  });
});

describe('script line numbers', () => {
  test('stackLine finds the first frame in the script, minus the wrapper lines', () => {
    const stack = 'TypeError: x is not a function\n    at eval (openreverse-script-3:5:9)\n    at run (scripting.ts:10:2)';
    assert.equal(stackLine(stack, 'openreverse-script-3', 2), 3);
    assert.equal(stackLine(stack, 'openreverse-script-4', 2), null);
    assert.equal(stackLine(undefined, 'openreverse-script-3', 2), null);
    assert.equal(stackLine(stack, 'openreverse-script-3', 9), null);
  });
  test('stackLine on a real engine stack', () => {
    try {
      new Function('a', 'const x = 1;\nnull.f();\n//# sourceURL=openreverse-test')(1);
    } catch (e) {
      const probe = (() => {
        try {
          new Function('a', 'throw new Error()\n//# sourceURL=openreverse-probe')(1);
        } catch (p) {
          return stackLine((p as Error).stack, 'openreverse-probe', 0)! - 1;
        }
        return 0;
      })();
      assert.equal(stackLine((e as Error).stack, 'openreverse-test', probe), 2);
    }
  });
  test('syntaxErrorLine: the first prefix failing with the same message', () => {
    const code = 'const a = 1;\nprint(a)\nconst b = = 2;\nprint(b)';
    let message = '';
    try {
      compile(code);
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(syntaxErrorLine(code, message, compile), 3);
    // An unclosed block fails only as a whole: the last line.
    const open = 'for (const f of x) {\n  print(f)\n';
    try {
      compile(open);
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(syntaxErrorLine(open, message, compile), 2);
    const template = 'print(`a\n${1}\n';
    try {
      compile(template);
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(syntaxErrorLine(template, message, compile), 2);
    // A stray closer is found where it is.
    const stray = 'const a = [1, 2];\nprint(a))\nprint(3)';
    try {
      compile(stray);
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(syntaxErrorLine(stray, message, compile), 2);
    assert.equal(syntaxErrorLine('ok()', 'nope', compile), null);
  });
});

describe('asExpression', () => {
  test('one expression is returned, with or without a semicolon', () => {
    assert.equal(asExpression('await or.functions()', compile), 'return (\nawait or.functions()\n);');
    assert.equal(asExpression('1 + 2;  ', compile), 'return (\n1 + 2\n);');
    assert.equal(asExpression('x.filter(f => f.name.includes(";")) // trailing comment', compile), 'return (\nx.filter(f => f.name.includes(";")) // trailing comment\n);');
  });
  test('statements are not', () => {
    for (const code of ['const a = 1', 'print(1)\nprint(2)', 'a; b', 'for (;;) {}', 'return 3', '   ']) assert.equal(asExpression(code, compile), null, code);
  });
});

describe('pushHistory', () => {
  test('newest last, no duplicates, capped', () => {
    assert.deepEqual(pushHistory(['a', 'b'], 'a\n'), ['b', 'a']);
    assert.deepEqual(pushHistory(['a'], '   '), ['a']);
    assert.deepEqual(pushHistory(['a', 'b', 'c'], 'd', 3), ['b', 'c', 'd']);
  });
});
