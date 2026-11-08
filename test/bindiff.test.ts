// Binary diffing: signatures, matching rounds and line alignment (web/src/engine/bindiff.ts).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  alignLines,
  diffRows,
  functionSignature,
  generatedName,
  hashText,
  maskOperands,
  matchFunctions,
  similarity,
  type FunctionSig,
  type Line,
  type SigInput,
} from '../web/src/engine/bindiff.ts';

type Insn = SigInput['instructions'][number];

/** An instruction from "mnemonic operands"; `call`/`jmp` to a hex address get it as their flow target. */
function insn(text: string, addr: number): Insn {
  const [mnemonic, ...rest] = text.split(' ');
  const operands = rest.join(' ');
  const target = /^0x[0-9a-f]+$/.test(operands) ? [operands] : [];
  const kind = mnemonic === 'call' ? 'call' : mnemonic!.startsWith('j') ? 'branch' : mnemonic === 'ret' ? 'return' : 'fallthrough';
  const str = /"(.*)"/.exec(operands);
  return {
    addr: `0x${addr.toString(16)}`,
    mnemonic: mnemonic!,
    operands,
    flow: { kind, targets: target },
    refs: str ? [{ kind: 'string', label: str[1]! }] : [],
    resolved: [],
  };
}

interface Spec {
  name: string;
  entry: number;
  code: string[];
  /** Blocks as lists of successor block indices. */
  cfg?: number[][];
}

/** Signatures of a whole "binary": calls name each other by entry address. */
function binary(specs: Spec[]): FunctionSig[] {
  const byEntry = new Map(specs.map((s) => [`0x${s.entry.toString(16)}`, { entry: `0x${s.entry.toString(16)}`, name: s.name, importStub: false }]));
  byEntry.set('0x9000', { entry: '0x9000', name: 'puts', importStub: true });
  return specs.map((s) => {
    const cfg = s.cfg ?? [[]];
    const input: SigInput = {
      function: { id: `id-${s.name}-${s.entry}`, entry: `0x${s.entry.toString(16)}`, name: s.name, size: s.code.length * 4 },
      instructions: s.code.map((c, i) => insn(c, s.entry + i * 4)),
      blocks: cfg.map((succ, i) => ({ id: `b${i}`, edges: succ.map((t) => ({ to: `b${t}` })) })),
    };
    return functionSignature(input, (e) => byEntry.get(e));
  });
}

const CHECKSUM = (k: string) => ['mov eax, 0x7', 'movzx edx, byte ptr [rdi]', `imul eax, eax, ${k}`, 'add eax, edx', 'inc rdi', 'jne 0x1010', 'ret'];
const PARSE = ['push rbx', 'call 0x9000', 'mov ebx, eax', 'test eax, eax', 'js 0x1120', 'mov eax, ebx', 'pop rbx', 'ret'];
const PARSE2 = ['push rbx', 'call 0x9000', 'mov ebx, eax', 'test eax, eax', 'js 0x1120', 'cmp eax, 0x9', 'jg 0x1130', 'mov eax, ebx', 'pop rbx', 'ret'];
const ADD = ['lea eax, [rdi+rdi*2]', 'add eax, esi', 'ret'];
const WORDS = ['xor eax, eax', 'xor ecx, ecx', 'movzx edx, byte ptr [rdi]', 'cmp dl, 0x20', 'je 0x1200', 'cmp dl, 0x9', 'je 0x1200', 'test ecx, ecx', 'jne 0x1210', 'inc eax', 'mov ecx, 0x1', 'inc rdi', 'jmp 0x1204', 'ret'];
const VALIDATE = ['push rbx', 'call 0x9000', 'cmp rax, 0x20', 'ja 0x1400', 'lea rdi, "invalid name"', 'call 0x9000', 'xor eax, eax', 'pop rbx', 'ret'];

const v1 = (names: (n: string) => string, at = 0) =>
  binary([
    { name: names('checksum'), entry: 0x1000 + at, code: CHECKSUM('0x1f'), cfg: [[1], [1, 2], []] },
    { name: names('parse_level'), entry: 0x1100 + at, code: PARSE, cfg: [[1, 2], [], []] },
    { name: names('helper_add'), entry: 0x1180 + at, code: ADD },
    { name: names('count_words'), entry: 0x1200 + at, code: WORDS, cfg: [[1], [2, 3], [1], []] },
    { name: names('main'), entry: 0x1300 + at, code: ['push rbx', `call 0x${(0x1000 + at).toString(16)}`, `call 0x${(0x1100 + at).toString(16)}`, `call 0x${(0x1180 + at).toString(16)}`, `call 0x${(0x1200 + at).toString(16)}`, 'pop rbx', 'ret'] },
  ]);
const v2 = (names: (n: string) => string, at = 0) =>
  binary([
    { name: names('checksum'), entry: 0x1000 + at, code: CHECKSUM('0x21'), cfg: [[1], [1, 2], []] },
    { name: names('parse_level'), entry: 0x1100 + at, code: PARSE2, cfg: [[1, 2], [3, 4], [], [], []] },
    { name: names('add_values'), entry: 0x1180 + at, code: ADD },
    { name: names('count_words'), entry: 0x1200 + at, code: WORDS, cfg: [[1], [2, 3], [1], []] },
    { name: names('validate_name'), entry: 0x1280 + at, code: VALIDATE, cfg: [[1, 2], [], []] },
    {
      name: names('main'),
      entry: 0x1300 + at,
      code: ['push rbx', `call 0x${(0x1280 + at).toString(16)}`, 'test eax, eax', `call 0x${(0x1000 + at).toString(16)}`, `call 0x${(0x1100 + at).toString(16)}`, `call 0x${(0x1180 + at).toString(16)}`, `call 0x${(0x1200 + at).toString(16)}`, 'pop rbx', 'ret'],
    },
  ]);

/** A generated (stripped) name for a function. */
const stripped = (n: string) => `sub_${[...n].map((c) => c.charCodeAt(0).toString(16)).join('').slice(0, 8)}`;

describe('signatures', () => {
  test('hash and masking', () => {
    assert.equal(hashText('push;ret'), hashText('push;ret'));
    assert.notEqual(hashText('push;ret'), hashText('ret;push'));
    assert.match(hashText(''), /^[0-9a-f]{16}$/);
    assert.equal(maskOperands('qword ptr [rip+0x2e5a]'), 'qword ptr [rip+@]');
    assert.equal(maskOperands('eax, eax, 0x1f'), 'eax, eax, 0x1f');
    assert.equal(maskOperands('0x100003f40'), '@');
    // iced's MASM syntax: hex with an h suffix.
    assert.equal(maskOperands('rdi,[2004h]'), 'rdi,[@]');
    assert.equal(maskOperands('short 000000000000121Bh'), 'short @');
    assert.equal(maskOperands('edx,0Ah'), 'edx,0Ah');
    assert.ok(generatedName('sub_1a2b'));
    assert.ok(!generatedName('subtract'));
  });

  test('features of a function', () => {
    const [, parse, , words, main] = v1((n) => n);
    assert.equal(parse!.insns, 8);
    assert.equal(parse!.calls, 1);
    assert.deepEqual(parse!.calleeNames, ['puts']);
    assert.deepEqual(parse!.callees, []); // an import stub is not a function of the image
    assert.equal(parse!.blocks, 3);
    assert.equal(parse!.edges, 2);
    assert.equal(words!.mnemonics.cmp, 2);
    assert.deepEqual(main!.callees, ['0x1000', '0x1100', '0x1180', '0x1200']);
    assert.deepEqual(main!.calleeNames, ['checksum', 'count_words', 'helper_add', 'parse_level']);
    const [validate] = binary([{ name: 'v', entry: 0x10, code: VALIDATE }]);
    assert.deepEqual(validate!.strings, ['invalid name']);
  });

  test('a changed constant keeps the mnemonic hash, not the exact one', () => {
    const [a] = v1((n) => n);
    const [b] = v2((n) => n);
    assert.equal(a!.mnemonicHash, b!.mnemonicHash);
    assert.equal(a!.cfgHash, b!.cfgHash);
    assert.notEqual(a!.exactHash, b!.exactHash);
    assert.ok(similarity(a!, b!) > 0.8 && similarity(a!, b!) < 1);
  });

  test('moved code with other addresses is identical', () => {
    const [a] = v1((n) => n);
    const [b] = v1((n) => n, 0x40);
    assert.equal(a!.exactHash, b!.exactHash);
    assert.equal(similarity(a!, b!), 1);
  });
});

describe('matching', () => {
  test('two versions with symbols: changed, renamed, added', () => {
    const A = v1((n) => n);
    const B = v2((n) => n);
    const r = diffRows(A, B, matchFunctions(A, B));
    const row = (name: string) => r.matches.find((m) => m.a.name === name);
    assert.equal(row('checksum')?.reason, 'name');
    assert.equal(row('checksum')?.identical, false);
    assert.equal(row('count_words')?.identical, true);
    assert.equal(row('count_words')?.similarity, 1);
    assert.equal(row('parse_level')?.identical, false);
    assert.equal(row('main')?.identical, false);
    // The renamed static function: no name match, identical code.
    assert.equal(row('helper_add')?.b.name, 'add_values');
    assert.equal(row('helper_add')?.reason, 'identical code');
    assert.equal(row('helper_add')?.identical, true);
    assert.deepEqual(r.unmatchedA, []);
    assert.deepEqual(r.unmatchedB.map((f) => f.name), ['validate_name']);
  });

  test('stripped versions: matched by code, CFG and the call graph', () => {
    const A = v1(stripped);
    const B = v2(stripped, 0x80);
    assert.ok([...A, ...B].every((f) => !f.named));
    const r = matchFunctions(A, B);
    const pairs = new Map(r.matches.map((m) => [A[m.a]!.entry, B[m.b]!.entry]));
    // Every v1 function finds its v2 counterpart (v2's are 0x80 further).
    for (const f of A) assert.equal(pairs.get(f.entry), `0x${(BigInt(f.entry) + 0x80n).toString(16)}`, f.entry);
    assert.deepEqual(r.unmatchedB.map((i) => B[i]!.entry), ['0x1300']);
    const reasons = new Set(r.matches.map((m) => m.reason));
    assert.ok(reasons.has('identical code'));
  });

  test('call-graph propagation tells apart look-alike callees', () => {
    // Two look-alike leaf functions in each binary (same code: not unique), called from distinct parents.
    const leaf = (k: string) => ['mov eax, edi', `add eax, ${k}`, 'ret'];
    const mk = (base: number, k1: string, k2: string) =>
      binary([
        { name: 'sub_a', entry: base, code: ['push rbx', 'lea rdi, "first"', `call 0x${(base + 0x100).toString(16)}`, 'pop rbx', 'ret'] },
        { name: 'sub_b', entry: base + 0x40, code: ['push rbx', 'lea rdi, "second"', `call 0x${(base + 0x140).toString(16)}`, 'pop rbx', 'ret'] },
        { name: 'sub_c', entry: base + 0x100, code: leaf(k1) },
        { name: 'sub_d', entry: base + 0x140, code: leaf(k2) },
      ]);
    // v1: both leaves add 1 (identical, so no unique hash); v2: each changed differently.
    const A = mk(0x1000, '0x1', '0x1');
    const B = mk(0x5000, '0x2', '0x3');
    const r = matchFunctions(A, B);
    const pairs = new Map(r.matches.map((m) => [A[m.a]!.entry, [B[m.b]!.entry, m.reason]]));
    assert.deepEqual(pairs.get('0x1000'), ['0x5000', 'identical code']);
    assert.deepEqual(pairs.get('0x1100'), ['0x5100', 'call graph']);
    assert.deepEqual(pairs.get('0x1140'), ['0x5140', 'call graph']);
  });

  test('unrelated functions stay unmatched', () => {
    const A = binary([{ name: 'sub_1', entry: 0x10, code: WORDS, cfg: [[1], [2, 3], [1], []] }]);
    const B = binary([{ name: 'sub_2', entry: 0x10, code: ['push rbp', 'call 0x9000', 'lea rdi, "x"', 'call 0x9000', 'leave', 'ret'] }]);
    const r = matchFunctions(A, B);
    assert.equal(r.matches.length, 0);
    assert.deepEqual(r.unmatchedA, [0]);
    assert.deepEqual(r.unmatchedB, [0]);
  });

  test('a duplicated name is not a name match', () => {
    const A = binary([
      { name: 'dup', entry: 0x10, code: ADD },
      { name: 'dup', entry: 0x20, code: WORDS },
    ]);
    const B = binary([{ name: 'dup', entry: 0x10, code: WORDS }]);
    const r = matchFunctions(A, B);
    assert.equal(r.matches.length, 1);
    assert.equal(r.matches[0]!.a, 1);
    assert.equal(r.matches[0]!.reason, 'identical code');
  });
});

describe('line alignment', () => {
  const lines = (code: string[], base = 0x1000): Line[] => code.map((c, i) => {
    const [m, ...rest] = c.split(' ');
    return [`0x${(base + i * 4).toString(16)}`, m!, rest.join(' ')];
  });

  test('a constant change is one changed row', () => {
    const rows = alignLines(lines(CHECKSUM('0x1f')), lines(CHECKSUM('0x21'), 0x2000));
    assert.equal(rows.length, 7);
    assert.deepEqual(rows.map((r) => r.kind), ['same', 'same', 'changed', 'same', 'same', 'same', 'same']);
  });

  test('inserted lines show on one side', () => {
    const rows = alignLines(lines(PARSE), lines(PARSE2));
    assert.deepEqual(
      rows.map((r) => r.kind),
      ['same', 'same', 'same', 'same', 'same', 'added', 'added', 'same', 'same', 'same'],
    );
    assert.deepEqual(rows[5], { a: null, b: 5, kind: 'added' });
  });

  test('replaced lines pair up, the surplus is removed', () => {
    const rows = alignLines(lines(['push rbx', 'mov eax, 0x1', 'xor ecx, ecx', 'ret']), lines(['push rbx', 'lea eax, [rdi]', 'ret']));
    assert.deepEqual(rows.map((r) => [r.a, r.b, r.kind]), [
      [0, 0, 'same'],
      [1, 1, 'changed'],
      [2, null, 'removed'],
      [3, 2, 'same'],
    ]);
  });

  test('one side empty', () => {
    assert.deepEqual(alignLines([], lines(ADD)).map((r) => r.kind), ['added', 'added', 'added']);
    assert.deepEqual(alignLines(lines(ADD), []).map((r) => r.kind), ['removed', 'removed', 'removed']);
  });
});
