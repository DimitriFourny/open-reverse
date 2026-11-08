import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildLayout, LinearListing, quoteC, type FunctionListing, type Instruction, type LayoutItem, type LayoutSection, type LinearRow } from '../web/src/engine/linear.ts';

// A small image: .text [0x1000, 0x1040) with one 3-instruction function at 0x1010,
// .data [0x2000, 0x2100) (file bytes up to 0x20c0, then zero-fill).
const memory = new Uint8Array(0x3000);
memory.set([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0], 0x2000); // "Hello"
memory.set([0x78, 0x56, 0x34, 0x12], 0x2010); // u32 0x12345678
memory.set([0x10, 0x10, 0, 0, 0, 0, 0, 0], 0x2018); // pointer to the function
memory.fill(0xcc, 0x1000, 0x1010);
memory.fill(0x90, 0x1030, 0x1040);
memory.fill(0x41, 0x2050, 0x2060);

const insn = (addr: number, kind = 'fallthrough', targets: string[] = []): Instruction => ({
  addr: `0x${addr.toString(16)}`,
  size: 4,
  bytes: '',
  mnemonic: kind === 'return' ? 'ret' : kind === 'branch' ? 'jne' : 'nop',
  operands: '',
  valid: true,
  flow: { kind, targets, conditional: kind === 'branch' },
  refs: [],
  resolved: [],
});
const listing: FunctionListing = {
  function: { id: 'f1', name: 'main', entry: '0x1010', size: 12, renamed: false, originalName: 'main' },
  instructions: [insn(0x1010, 'branch', ['0x1018']), insn(0x1014, 'return'), insn(0x1018, 'return')],
  blocks: [{ start: '0x1010' }, { start: '0x1014' }, { start: '0x1018' }],
};

const sections: LayoutSection[] = [
  { name: '.data', start: 0x2000n, end: 0x2100n, fileEnd: 0x20c0n, perms: ['read', 'write'] },
  { name: '.text', start: 0x1000n, end: 0x1040n, fileEnd: 0x1040n, perms: ['read', 'execute'] },
];
const items: LayoutItem[] = [
  { kind: 'code', start: 0x1010n, end: 0x101cn, fnId: 'f1', entry: true },
  { kind: 'def', start: 0x2010n, end: 0x2014n, def: { type: 'u32', count: 1 } },
  { kind: 'pointer', start: 0x2018n, end: 0x2020n, target: 0x1010n, symbol: null },
  { kind: 'string', start: 0x2000n, end: 0x2006n, text: 'Hello', encoding: 'ascii', terminated: true },
  // Overlaps the string: dropped.
  { kind: 'string', start: 0x2004n, end: 0x2008n, text: 'o', encoding: 'ascii', terminated: true },
];
const layout = buildLayout(sections, items, new Map([['0x2050', 'table'], ['0x2080', 'counter']]));
const lin = new LinearListing(layout, {
  read: async (start, len) => memory.slice(Number(start), Number(start) + len),
  listing: async () => listing,
  listed: () => true,
  refAt: (a) => (a === 0x1010n ? { addr: '0x1010', kind: 'function', label: 'main' } : null),
});

const show = (r: LinearRow) =>
  r.kind === 'data' ? `${r.addr} ${r.directive} ${r.text}` : r.kind === 'insn' ? `${r.addr} ${r.insn.mnemonic}` : r.kind === 'blank' ? `${r.addr} blank` : `${r.addr} ${r.kind}:${'name' in r ? r.name : ''}`;

async function all(): Promise<LinearRow[]> {
  return (await lin.window(0n, 0, 4000)).rows;
}

describe('linear listing', () => {
  test('lays out sections in address order with functions, data items and undefined bytes', async () => {
    const text = (await all()).map(show);
    assert.deepEqual(text, [
      '0x1000 blank',
      '0x1000 section:.text',
      '0x1000 db cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc',
      '0x1010 blank',
      '0x1010 function:main',
      '0x1010 jne',
      '0x1014 blank',
      '0x1014 ret',
      '0x1018 blank',
      '0x1018 label:loc_1018',
      '0x1018 ret',
      '0x101c db 00 00 00 00',
      '0x1020 db 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
      '0x1030 db 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90',
      '0x2000 blank',
      '0x2000 section:.data',
      '0x2000 db "Hello", 0',
      '0x2006 db 00 00 00 00 00 00 00 00 00 00',
      '0x2010 dd 0x12345678',
      '0x2014 db 00 00 00 00',
      '0x2018 dq main',
      '0x2020 db 0x30 dup(0)',
      '0x2050 label:table',
      '0x2050 db 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41',
      '0x2060 db 0x20 dup(0)',
      '0x2080 label:counter',
      '0x2080 db 0x40 dup(0)',
      '0x20c0 db 0x40 dup(?)',
    ]);
  });

  test('windows built forward and backward from any address join the full listing', async () => {
    const full = (await all()).map(show);
    for (const addr of [0x1000n, 0x1012n, 0x1018n, 0x1025n, 0x2000n, 0x2003n, 0x2055n, 0x2090n, 0x20f0n]) {
      for (const n of [1, 3, 7]) {
        const w = await lin.window(addr, n, n);
        const text = w.rows.map(show);
        const at = full.indexOf(text[0]!);
        assert.ok(at >= 0, `window at ${addr.toString(16)} starts with a known row`);
        assert.deepEqual(text, full.slice(at, at + text.length), `window at 0x${addr.toString(16)} (${n}) is contiguous`);
        // Rows of one address stay together at both ends.
        const rows = await all();
        if (at > 0) assert.notEqual(rows[at - 1]!.addr, w.rows[0]!.addr);
        if (at + text.length < rows.length) assert.notEqual(rows[at + text.length]!.addr, w.rows.at(-1)!.addr);
      }
      // Extending a window by its own edges reproduces the neighbours.
      const w = await lin.window(addr, 2, 2);
      const before = await lin.window(BigInt(w.rows[0]!.addr), 3, 0);
      const after = await lin.window(BigInt(w.rows.at(-1)!.addr) + 1n, 0, 3);
      const joined = [...before.rows, ...w.rows, ...after.rows].map(show);
      const at = full.indexOf(joined[0]!);
      assert.deepEqual(joined, full.slice(at, at + joined.length));
    }
  });

  test('reports the ends of the image', async () => {
    assert.equal((await lin.window(0x1000n, 10, 1)).atStart, true);
    assert.equal((await lin.window(0x20c0n, 1, 10)).atEnd, true);
    assert.equal((await lin.window(0x1018n, 1, 1)).atEnd, false);
  });

  test('a quick window stops at a function whose listing is not at hand', async () => {
    const cold = new LinearListing(layout, {
      read: async (start, len) => memory.slice(Number(start), Number(start) + len),
      listing: async () => listing,
      listed: () => false,
      refAt: () => null,
    });
    // From the data: the window ends before the function, without claiming the end of the image.
    const w = await cold.window(0x1000n, 0, 100, true);
    assert.deepEqual(w.rows.map(show), ['0x1000 blank', '0x1000 section:.text', '0x1000 db cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc']);
    assert.equal(w.atEnd, false);
    // The unit holding the address is always built.
    assert.ok((await cold.window(0x1014n, 5, 5, true)).rows.some((r) => r.kind === 'insn'));
  });

  test('quotes C strings', () => {
    assert.equal(quoteC('a"b\\\n\x01'), '"a\\"b\\\\\\n\\x01"');
  });
});
