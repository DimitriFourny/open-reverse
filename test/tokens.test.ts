// Token keys for click-to-highlight in the code views (run: npm test).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { numberKey, operandTokens, pseudoKey, wordKey } from '../web/src/views/tokens.ts';

describe('token keys', () => {
  test('x86-64 register aliases share a key', () => {
    for (const r of ['rax', 'eax', 'ax', 'al', 'ah']) assert.equal(wordKey(r), 'r:ax');
    for (const r of ['r8', 'r8d', 'r8w', 'r8b']) assert.equal(wordKey(r), 'r:r8');
    for (const r of ['rsi', 'esi', 'si', 'sil']) assert.equal(wordKey(r), 'r:si');
    assert.equal(wordKey('xmm3'), wordKey('ymm3'));
    assert.notEqual(wordKey('rax'), wordKey('rbx'));
  });

  test('ARM64 register aliases share a key', () => {
    assert.equal(wordKey('x0'), wordKey('w0'));
    assert.equal(wordKey('x29'), wordKey('fp'));
    assert.equal(wordKey('x30'), wordKey('lr'));
    assert.equal(wordKey('sp'), wordKey('wsp'));
    for (const r of ['q1', 'd1', 's1', 'h1', 'b1']) assert.equal(wordKey(r), wordKey('v1'));
  });

  test('numbers match across notations', () => {
    assert.equal(numberKey('0x10'), 'n:10');
    assert.equal(numberKey('16'), 'n:10');
    assert.equal(numberKey('10h'), 'n:10');
    assert.equal(numberKey('#0x10'), 'n:10');
    assert.equal(numberKey('16u'), 'n:10');
    assert.equal(pseudoKey('num', '0x10'), 'n:10');
  });

  test('operand tokens keep the text and skip syntax words', () => {
    const toks = operandTokens('qword ptr [rsp+50h],xmm0');
    assert.equal(toks.map((t) => t.text).join(''), 'qword ptr [rsp+50h],xmm0');
    assert.deepEqual(
      toks.filter((t) => t.key).map((t) => t.key),
      ['r:sp', 'n:50', 'r:v0'],
    );
    const arm = operandTokens('q0, [x29, #-0x20]!');
    assert.equal(arm.map((t) => t.text).join(''), 'q0, [x29, #-0x20]!');
    assert.deepEqual(
      arm.filter((t) => t.key).map((t) => t.key),
      ['r:v0', 'r:x29', 'n:20'],
    );
  });
});
