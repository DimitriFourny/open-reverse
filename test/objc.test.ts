import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { Instruction } from '../web/src/engine/linear.ts';
import { autoThreads } from '../web/src/engine/memory.ts';
import { objcComment, objcItems, objcLabel, objcMessage, objcRelabels, writtenRegs, type ObjCAt } from '../web/src/engine/objc.ts';

// Records as OpenDecomp's recoverRuntimeMetadata returns them for
// test/metadata/fixtures/objc-foundation-classic (addresses from that image).
const record = (kind: string, name: string, at: bigint, owner: string | null = null) => ({ kind, name, address: { value: at }, owner });
const items = objcItems([
  record('objc_selector', 'counterWithLabel:', 0x100008138n),
  record('objc_selector', 'addValue:times:', 0x100008148n),
  record('objc_class_reference', 'ODCounter', 0x100008180n),
  record('objc_superclass_reference', 'NSObject', 0x1000081a0n, 'ODCounter'),
  record('objc_superclass_reference', 'ODCounter', 0x100008188n),
  record('objc_string', 'hello, fixture', 0x100004000n),
  record('objc_class', 'ODCounter', 0x100008198n),
  record('objc_selector_stub', 'increment', 0x100000d40n),
  record('objc_method', 'increment', 0x100000d98n, 'ODCounter'),
]);

describe('objc items', () => {
  test('kinds by address; a superclass field and method records are left out', () => {
    assert.deepEqual(items.get('0x100008138'), { kind: 'selref', name: 'counterWithLabel:' });
    assert.equal(items.get('0x100008188')?.kind, 'superref');
    assert.equal(items.has('0x1000081a0'), false);
    assert.equal(items.has('0x100000d98'), false);
  });
  test('labels and comments', () => {
    assert.equal(objcLabel(items.get('0x100008148')!), 'selRef_addValue_times_');
    assert.equal(objcLabel(items.get('0x100008180')!), 'classRef_ODCounter');
    assert.equal(objcLabel(items.get('0x100004000')!), 'cfstr_hello_fixture');
    assert.equal(objcLabel({ kind: 'cfstring', name: '%@=%ld' }), 'cfstr_ld');
    assert.equal(objcLabel({ kind: 'cfstring', name: '%@ %@' }), 'cfstr');
    assert.equal(objcLabel(items.get('0x100008198')!), '_OBJC_CLASS_$_ODCounter');
    assert.equal(objcRelabels(items.get('0x100008198')!, 'ODCounter.ODCounter'), true);
    assert.equal(objcRelabels(items.get('0x100008198')!, '_OBJC_CLASS_$_ODCounter'), false);
    assert.equal(objcRelabels(items.get('0x100008138')!, 'counterWithLabel:'), true);
    assert.equal(objcComment(items.get('0x100008148')!), '@selector(addValue:times:)');
    assert.equal(objcComment(items.get('0x100004000')!), '@"hello, fixture"');
    assert.equal(objcComment(items.get('0x100008180')!), 'class ODCounter');
  });
});

test('registers an ARM64 instruction writes', () => {
  assert.deepEqual(writtenRegs('ldr', 'x1, [x8, #0x138]'), ['x1']);
  assert.deepEqual(writtenRegs('movz', 'w2, #0x3'), ['x2']);
  assert.deepEqual(writtenRegs('ldp', 'x29, x30, [sp, #16]'), ['x29', 'x30']);
  assert.deepEqual(writtenRegs('stp', 'x21, x0, [sp]'), []);
  assert.deepEqual(writtenRegs('str', 'x0, [x8]'), []);
  assert.deepEqual(writtenRegs('cmp', 'x0, #0x1'), []);
  assert.deepEqual(writtenRegs('add', 'sp, sp, #0x40'), []);
  assert.deepEqual(writtenRegs('ldr', 'q0, [x1]'), []);
});

describe('objc_msgSend messages', () => {
  // _ODMakeSummary of objc-foundation-classic, as the listing presents it.
  let at = 0x100000bc4;
  const i = (mnemonic: string, operands: string, extra: Partial<Instruction> = {}): Instruction => ({
    addr: `0x${(at += 4).toString(16)}`,
    size: 4,
    bytes: '',
    mnemonic,
    operands,
    valid: true,
    flow: { kind: 'fallthrough', targets: [], conditional: false },
    refs: [],
    resolved: [],
    ...extra,
  });
  const load = (operands: string, to: string) => i('ldr', operands, { resolved: [{ addr: to, kind: 'data', label: '', access: 'read' }] });
  const call = (to: string) => i('bl', to, { flow: { kind: 'call', targets: [to], conditional: false } });
  const MSGSEND = '0x100000d0c';
  const insns = [
    i('mov', 'x2, x0'),
    load('x0, [x8, #0x180]', '0x100008180'),
    load('x1, [x8, #0x138]', '0x100008138'),
    call(MSGSEND), // [ODCounter counterWithLabel:]
    i('mov', 'x19, x0'),
    load('x1, [x8, #0x148]', '0x100008148'),
    i('mov', 'x0, x19'),
    call(MSGSEND), // [id addValue:times:]
    call('0x100000d40'), // selector stub: [id increment]
    load('x20, [x8, #0x180]', '0x100008180'),
    call('0x100000d40'), // [id increment]
    i('mov', 'x0, x20'),
    call('0x100000d40'), // x20 is callee-saved: [ODCounter increment]
    load('x0, [x8, #0x180]', '0x100008180'),
    call('0x100000d40'), // [ODCounter increment]
    call('0x100000d40'), // x0 is the previous call's result: [id increment]
    i('movz', 'w1, #0x0'),
    call(MSGSEND), // x1 is not a selector reference
  ];
  const itemOf = (insn: Instruction): ObjCAt | null => {
    const r = insn.resolved.find((x) => items.has(x.addr));
    return r ? { addr: r.addr, ...items.get(r.addr)! } : null;
  };
  const message = (k: number, targets = new Set<string>(), method = false) =>
    objcMessage(insns, k, (a) => (a === MSGSEND ? '_objc_msgSend' : null), (a) => items.get(a) ?? null, itemOf, targets, method);

  test('selector from x1, receiver class from a class reference in x0', () => {
    assert.deepEqual(message(3), { text: '[ODCounter counterWithLabel:]', addr: '0x100008138' });
  });
  test('a receiver moved from another register is followed; a call result is unknown', () => {
    assert.deepEqual(message(7), { text: '[id addValue:times:]', addr: '0x100008148' });
  });
  test('a selector stub names its selector', () => {
    assert.deepEqual(message(8), { text: '[id increment]', addr: '0x100000d40' });
  });
  test("a method's x0 on entry is self", () => {
    const entry = [i('mov', 'x19, x0'), call('0x100000d40'), i('mov', 'x0, x19'), call('0x100000d40')];
    const send = (k: number, method: boolean) => objcMessage(entry, k, () => null, (a) => items.get(a) ?? null, itemOf, new Set(), method)?.text;
    assert.equal(send(1, true), '[self increment]');
    assert.equal(send(3, true), '[self increment]');
    assert.equal(send(1, false), '[id increment]');
  });
  test('callee-saved registers survive calls, x0 does not', () => {
    assert.deepEqual(message(12), { text: '[ODCounter increment]', addr: '0x100000d40' });
    assert.deepEqual(message(14), { text: '[ODCounter increment]', addr: '0x100000d40' });
    assert.deepEqual(message(15), { text: '[id increment]', addr: '0x100000d40' });
  });
  test('no message without a selector reference, nor across a branch target', () => {
    assert.equal(message(17), null);
    assert.equal(message(0), null);
    // The selector load is the branch target itself; the receiver load before it is not known.
    assert.deepEqual(message(3, new Set([insns[2]!.addr])), { text: '[id counterWithLabel:]', addr: '0x100008138' });
  });
});

test('automatic worker count: cores, then memory', () => {
  assert.equal(autoThreads(16, null), 2);
  assert.equal(autoThreads(16, 8), 2);
  assert.equal(autoThreads(16, 4), 1);
  assert.equal(autoThreads(2, 8), 2);
  assert.equal(autoThreads(4, 0.5), 1);
});
