// Tests for structure layouts and declarations rebuilt from recovered structures (run: npm test).
// Uses OpenDecomp's own C declaration parser from the built submodule.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { parseCDeclarations } from '../vendor/open-decomp/dist/src/metadata/c-declarations/index.js';
import { declaredMembers, normalizeType, recoveredDeclaration, splitMember, structLayout, structSource } from '../web/src/engine/structs.ts';

const parse = (source: string) => parseCDeclarations(source, { abi: 'darwin-arm64' });

describe('structLayout', () => {
  test('offsets, sizes and alignment from the parser', () => {
    const l = structLayout('struct S { uint8_t a; uint32_t b; char *c; uint16_t d[3]; };', 'S', parse);
    assert.ok(!('errors' in l));
    assert.deepEqual(l.fields, [
      { name: 'a', offset: 0, size: 1 },
      { name: 'b', offset: 4, size: 4 },
      { name: 'c', offset: 8, size: 8 },
      { name: 'd', offset: 16, size: 6 },
    ]);
    assert.equal(l.size, 24);
    assert.equal(l.alignment, 8);
    assert.equal(l.union, false);
  });
  test('packed and unions', () => {
    const p = structLayout('struct P { uint8_t a; uint32_t b; } __attribute__((packed));', 'P', parse);
    assert.ok(!('errors' in p));
    assert.equal(p.fields[1]!.offset, 1);
    const u = structLayout('union U { uint8_t a; uint64_t b; };', 'U', parse);
    assert.ok(!('errors' in u) && u.union && u.size === 8);
  });
  test('errors', () => {
    const e = structLayout('struct S { nope a; };', 'S', parse);
    assert.ok('errors' in e && e.errors.length > 0);
    assert.ok('errors' in structLayout('struct S { int a; };', 'T', parse));
  });
});

describe('members', () => {
  test('splitMember and normalizeType', () => {
    assert.deepEqual(splitMember('struct Node *next'), { type: 'struct Node *', name: 'next', dims: '' });
    assert.deepEqual(splitMember('uint8_t pad_0x4 [ 4 ]'), { type: 'uint8_t', name: 'pad_0x4', dims: '[4]' });
    assert.deepEqual(splitMember('struct_47fdf8* address'), { type: 'struct_47fdf8 *', name: 'address', dims: '' });
    assert.equal(splitMember('x'), null);
    assert.equal(normalizeType('char * *'), 'char **');
    assert.equal(normalizeType('const  char*'), 'const char *');
  });
  test('declaredMembers reads a declaration in pseudocode, overlays by their first member', () => {
    const text = 'typedef struct struct_ab struct_ab;\nstruct struct_ab { uint32_t field_0xc; union { uint64_t field_0x10; double field_0x10_f; }; };\n';
    assert.deepEqual(declaredMembers(text, 'struct_ab'), {
      union: false,
      members: [
        { type: 'uint32_t', name: 'field_0xc', dims: '' },
        { type: 'uint64_t', name: 'field_0x10', dims: '' },
      ],
    });
    assert.equal(declaredMembers(text, 'struct_cd'), null);
  });
  test('structSource round-trips through declaredMembers', () => {
    const members = [
      { type: 'char *', name: 'name', dims: '' },
      { type: 'uint8_t', name: 'tag', dims: '[4]' },
    ];
    const src = structSource('R', members);
    assert.equal(src, 'struct R {\n  char *name;\n  uint8_t tag[4];\n};');
    assert.deepEqual(declaredMembers(src, 'R')?.members, members);
  });
});

describe('recoveredDeclaration', () => {
  test('members keep the offsets their names state, gaps become padding', () => {
    const src = recoveredDeclaration({ members: [{ type: 'uint8_t', name: 'field_0x1d', dims: '' }] }, 'Msg', parse);
    assert.equal(src, 'struct Msg {\n  uint8_t pad_0x0[29];\n  uint8_t field_0x1d;\n};');
    const l = structLayout(src, 'Msg', parse);
    assert.ok(!('errors' in l) && l.fields[1]!.offset === 0x1d);
  });
  test('several members out of order, pointers to other recovered structures', () => {
    const src = recoveredDeclaration(
      {
        members: [
          { type: 'uint64_t', name: 'field_0x10', dims: '' },
          { type: 'struct_ab *', name: 'field_0x0', dims: '' },
          { type: 'uint32_t', name: 'field_0xc', dims: '' },
        ],
      },
      'S',
      parse,
    );
    const l = structLayout(src, 'S', parse);
    assert.ok(!('errors' in l));
    assert.deepEqual(
      l.fields.filter((f) => !f.name.startsWith('pad_')).map((f) => [f.name, f.offset]),
      [
        ['field_0x0', 0],
        ['field_0xc', 12],
        ['field_0x10', 16],
      ],
    );
    assert.match(src, /void \*field_0x0;/);
  });
  test('a misaligned member makes the structure packed', () => {
    const src = recoveredDeclaration({ members: [{ type: 'uint32_t', name: 'field_0x3', dims: '' }] }, 'U', parse);
    assert.match(src, /packed/);
    const l = structLayout(src, 'U', parse);
    assert.ok(!('errors' in l) && l.fields[1]!.offset === 3);
  });
});
