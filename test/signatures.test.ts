// Tests for library signatures in the browser (run: bun run test): the signature source of a
// linked function (masks from its instructions, call constraints), suggestions from strings,
// and a round trip through OpenDecomp's generator and matcher (from the built submodule).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildSignatureLibrary, matchSignatures } from '../vendor/open-decomp/dist/src/metadata/library-signatures/index.js';
import { linkedSource, suggestLibraries, type LinkedInstruction } from '../web/src/engine/sigsource.ts';

const insn = (addr: number, size: number, mnemonic: string, operands: string, flow: string, targets: number[] = [], refs: number[] = []): LinkedInstruction => ({
  addr: BigInt(addr),
  size,
  mnemonic,
  operands,
  flow: { kind: flow, targets: targets.map((t) => `0x${t.toString(16)}`) },
  refs: refs.map((r) => `0x${r.toString(16)}`),
});

// helper at 0x1000:  endbr64; push rbx; mov rbx,rdi; lea rdi,[rip+0x2ff1]; call 0x1100; mov rdi,rbx;
//                    test eax,eax; jne 0x1020; pop rbx; jmp 0x1200; ret
const BYTES = Uint8Array.from([
  0xf3, 0x0f, 0x1e, 0xfa, 0x53, 0x48, 0x89, 0xfb, 0x48, 0x8d, 0x3d, 0xf1, 0x2f, 0x00, 0x00, 0xe8,
  0xec, 0x00, 0x00, 0x00, 0x48, 0x89, 0xdf, 0x85, 0xc0, 0x75, 0x00, 0x5b, 0xe9, 0xdf, 0x01, 0x00, 0x00, 0xc3,
]);
const INSNS = [
  insn(0x1000, 4, 'endbr64', '', 'next'),
  insn(0x1004, 1, 'push', 'rbx', 'next'),
  insn(0x1005, 3, 'mov', 'rbx,rdi', 'next'),
  insn(0x1008, 7, 'lea', 'rdi,[rip+2FF1h]', 'next', [], [0x4000]),
  insn(0x100f, 5, 'call', 'sub_1100', 'call', [0x1100]),
  insn(0x1014, 3, 'mov', 'rdi,rbx', 'next'),
  insn(0x1017, 2, 'test', 'eax,eax', 'next'),
  insn(0x1019, 2, 'jne', 'loc_101b', 'branch', [0x101b], [0x101b]),
  insn(0x101b, 1, 'pop', 'rbx', 'next'),
  insn(0x101c, 5, 'jmp', 'sub_1200', 'jump', [0x1200]),
  insn(0x1021, 1, 'ret', '', 'return'),
];
const names: Record<string, string> = { '0x1100': 'strlen', '0x1200': 'free' };
const nameAt = (a: bigint) => names[`0x${a.toString(16)}`] ?? null;

describe('linkedSource', () => {
  const source = linkedSource({ names: ['helper'], entry: 0x1000n, bytes: BYTES, instructions: INSNS }, 'x86_64', nameAt);
  const maskedAt = (from: number, to: number) => [...source.masked.subarray(from, to)];

  test('masks the displacement of calls and jumps out of the function, and names their callees', () => {
    assert.deepEqual(maskedAt(0x0f, 0x14), [0, 1, 1, 1, 1]);
    assert.deepEqual(maskedAt(0x1c, 0x21), [0, 1, 1, 1, 1]);
    assert.deepEqual(source.calls, [
      [0x10, 'strlen'],
      [0x1d, 'free'],
    ]);
  });
  test('masks an instruction that refers to an address whole, and keeps local branches', () => {
    assert.deepEqual(maskedAt(0x08, 0x0f), [1, 1, 1, 1, 1, 1, 1]);
    assert.deepEqual(maskedAt(0x19, 0x1b), [0, 0]);
    assert.deepEqual(maskedAt(0x00, 0x08), [0, 0, 0, 0, 0, 0, 0, 0]);
  });
  test('ARM64: a BL out of the function is masked and named, ADRP masked', () => {
    const arm = linkedSource(
      {
        names: ['f'],
        entry: 0x2000n,
        bytes: new Uint8Array(12),
        instructions: [
          { addr: 0x2000n, size: 4, mnemonic: 'adrp', operands: 'x0, 0x5000', flow: { kind: 'next', targets: [] }, refs: ['0x5000'] },
          { addr: 0x2004n, size: 4, mnemonic: 'bl', operands: '0x1100', flow: { kind: 'call', targets: ['0x1100'] }, refs: [] },
          { addr: 0x2008n, size: 4, mnemonic: 'ret', operands: '', flow: { kind: 'return', targets: [] }, refs: [] },
        ],
      },
      'arm64',
      nameAt,
    );
    assert.deepEqual([...arm.masked], [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]);
    assert.deepEqual(arm.calls, [[4, 'strlen']]);
  });
  test("round trip: a library made from one build names the function in another build's layout", () => {
    const { library } = buildSignatureLibrary([source], { id: 'kit', title: 'kit', architecture: 'x86_64', contracts: null, source: 'test' });
    // The same code linked elsewhere: other displacements (lea, call, jmp), same instructions.
    const moved = BYTES.slice();
    moved.set([0x11, 0x22, 0x00, 0x00], 0x0b);
    moved.set([0xec - 0x10, 0x00, 0x00, 0x00], 0x10); // strlen 0x10 bytes closer
    moved.set([0xdf - 0x10, 0x01, 0x00, 0x00], 0x1d);
    const image = new Map<bigint, Uint8Array>([
      [0x1000n, moved],
      [0x10f0n, Uint8Array.of(0xc3)],
      [0x11f0n, Uint8Array.of(0xc3)],
    ]);
    const report = matchSignatures([library], {
      architecture: 'x86_64',
      format: 'elf',
      read: (address: bigint, length: number) => image.get(address)?.subarray(0, length) ?? new Uint8Array(0),
      functions: [
        { id: 'f', entry: 0x1000n, name: null },
        { id: 's', entry: 0x10f0n, name: 'strlen' },
        { id: 'g', entry: 0x11f0n, name: 'free' },
      ],
    });
    assert.deepEqual(report.matches.map((m: { name: string; confirmed_calls: number }) => [m.name, m.confirmed_calls]), [['helper', 2]]);
    // A callee known by another name rules the alternative out.
    const contradicted = matchSignatures([library], {
      architecture: 'x86_64',
      format: 'elf',
      read: (address: bigint, length: number) => image.get(address)?.subarray(0, length) ?? new Uint8Array(0),
      functions: [
        { id: 'f', entry: 0x1000n, name: null },
        { id: 's', entry: 0x10f0n, name: 'memcpy' },
      ],
    });
    assert.equal(contradicted.matches.length, 0);
  });
});

describe('suggestLibraries', () => {
  const libraries = [
    { id: 'zlib', architecture: 'x86_64' as const, markers: ['^ ?(deflate|inflate) 1\\.3\\.1 Copyright'] },
    { id: 'openssl', architecture: 'x86_64' as const, markers: ['^OpenSSL 3\\.5'] },
    { id: 'arm', architecture: 'arm64' as const, markers: ['.'] },
  ];
  test('a marker string suggests its library, for the binary architecture only', () => {
    const found = suggestLibraries(libraries, ['usage: %s', ' inflate 1.3.1 Copyright 1995-2024 Mark Adler '], 'x86_64');
    assert.deepEqual([...found.keys()], ['zlib']);
    assert.match(found.get('zlib')!, /^ inflate 1\.3\.1/);
  });
});
