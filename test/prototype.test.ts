// Tests for the C prototype compiler behind the signature editor (run: npm test).
// Uses OpenDecomp's own C declaration parser from the built submodule.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { parseCDeclarations } from '../vendor/open-decomp/dist/src/metadata/c-declarations/index.js';
import { compilePrototype, PrototypeError, splitPrototype, type TypeDefinition } from '../web/src/engine/prototype.ts';

const parse = (source: string) => parseCDeclarations(source, { abi: 'sysv-amd64' });
const ids = {
  named: (name: string) => `named:${name}`,
  pointerTo: (name: string) => `ptr:${name}`,
  local: (d: TypeDefinition) => `local:${JSON.stringify(d, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))}`,
};
const compile = (text: string) => compilePrototype(text, parse, ids);

describe('splitPrototype', () => {
  test('name, return type, parameters', () => {
    assert.deepEqual(splitPrototype('int parse(struct Node *n, char *s)'), {
      name: 'parse',
      returns: 'int',
      parameters: ['struct Node *n', 'char *s'],
      variadic: false,
    });
  });
  test('decompiler declaration line, comments, void, variadic', () => {
    assert.deepEqual(splitPrototype('/* x */ uint32_t* f(void) {\n'), { name: 'f', returns: 'uint32_t*', parameters: [], variadic: false });
    assert.deepEqual(splitPrototype('extern int printf(const char *fmt, ...);'), {
      name: 'printf',
      returns: 'int',
      parameters: ['const char *fmt'],
      variadic: true,
    });
  });
  test('rejects non-prototypes', () => {
    assert.throws(() => splitPrototype('int x'), PrototypeError);
    assert.throws(() => splitPrototype('f(int a)'), PrototypeError);
    assert.throws(() => splitPrototype(''), PrototypeError);
  });
});

describe('compilePrototype', () => {
  test('builtins are declared locally, named types refer to the library', () => {
    const c = compile('int parse(struct Node *n, char *s, Node by_value, size_t len)');
    assert.equal(c.name, 'parse');
    assert.equal(c.returnType, ids.local({ kind: 'integer', bits: 32, signed: true }));
    assert.deepEqual(
      c.parameters.map((p) => [p.name, p.type]),
      [
        ['n', 'ptr:Node'],
        ['s', ids.local({ kind: 'pointer', to: ids.local({ kind: 'integer', bits: 8, signed: true }), bits: 64 })],
        ['by_value', 'named:Node'],
        ['len', ids.local({ kind: 'integer', bits: 64, signed: false })],
      ],
    );
    assert.deepEqual(c.namedTypes.sort(), ['Node']);
    assert.equal(c.declarations.size, 4);
  });
  test('void return, unnamed parameters, arrays and function pointers', () => {
    const c = compile('void f(int, unsigned char buf[16], void (*cb)(int), uint32_t)');
    assert.equal(c.returnType, ids.local({ kind: 'void' }));
    assert.deepEqual(
      c.parameters.map((p) => p.name),
      [null, 'buf', 'cb', null],
    );
    assert.equal(c.parameters[1]!.type, ids.local({ kind: 'pointer', to: ids.local({ kind: 'integer', bits: 8, signed: false }), bits: 64 }));
  });
  test('typedef names and pointer returns', () => {
    const c = compile('total_t *sum(const total_t *values, enum Color c)');
    assert.equal(c.returnType, 'ptr:total_t');
    assert.deepEqual(c.parameters.map((p) => p.type), ['ptr:total_t', 'named:Color']);
  });
  test('errors', () => {
    assert.throws(() => compile('int f(int a, int a)'), /declared twice/);
    assert.throws(() => compile('int f(struct { int x; } *p)'), PrototypeError);
    assert.throws(() => compile('int f(int a b c)'), PrototypeError);
  });
});
