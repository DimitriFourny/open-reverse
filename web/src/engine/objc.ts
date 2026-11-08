// Objective-C names for the listing, from OpenDecomp's static runtime metadata
// (recoverRuntimeMetadata: selector and class references, `__objc_stubs`, `__cfstring`
// objects, classes and metaclasses), and the message an `objc_msgSend` call sends.
//
// Pure module: unit-tested under Node.

import type { Instruction } from './linear.ts';

export type ObjCKind = 'selref' | 'classref' | 'superref' | 'stub' | 'cfstring' | 'class' | 'metaclass';

/** An Objective-C runtime object at an address: what it is and the name it carries. */
export interface ObjCItem {
  kind: ObjCKind;
  /** The selector, class name or string contents. */
  name: string;
}

/** An item and where it is: what an instruction's resolved reference names. */
export type ObjCAt = ObjCItem & { addr: string };

/** The fields of OpenDecomp's RuntimeRecord this module reads. */
export interface RuntimeRecordLike {
  kind: string;
  name: string;
  address: { value: bigint };
  owner: string | null;
}

/** Objective-C items by VA (canonical hex). A superclass reference with an owner is a class's
 * superclass field, not an `__objc_superrefs` slot, and is left out. */
export function objcItems(records: readonly RuntimeRecordLike[]): Map<string, ObjCItem> {
  const kinds: Record<string, ObjCKind> = {
    objc_selector: 'selref',
    objc_class_reference: 'classref',
    objc_selector_stub: 'stub',
    objc_string: 'cfstring',
    objc_class: 'class',
    objc_metaclass: 'metaclass',
  };
  const out = new Map<string, ObjCItem>();
  for (const r of records) {
    const kind = r.kind === 'objc_superclass_reference' ? (r.owner === null ? 'superref' : null) : kinds[r.kind];
    const at = `0x${r.address.value.toString(16)}`;
    if (kind && !out.has(at)) out.set(at, { kind, name: r.name });
  }
  return out;
}

/** An identifier made of a name: IDA's `selRef_addValue_times_`, `cfstr_hello_fixture`. */
function ident(text: string, max = 48): string {
  return text.replace(/[^A-Za-z0-9_$]+/g, '_').slice(0, max);
}

/** A string's words as an identifier: `hello, fixture` → `hello_fixture`, `%@=%ld` → `ld`. */
function words(text: string): string {
  return ident(text).replace(/^_+|_+$/g, '');
}

/**
 * Whether the item's own label replaces the listing's name for its address. OpenDecomp names
 * selector and class references, CFStrings and classes after their record (`init`,
 * `ODCounter`, `ODCounter.ODCounter`); a linker symbol (`_OBJC_CLASS_$_ODCounter`) stays.
 */
export function objcRelabels(item: ObjCItem, name: string | undefined): boolean {
  const isClass = item.kind === 'class' || item.kind === 'metaclass';
  return name === undefined || !(isClass && name.startsWith('_OBJC_'));
}

/** The label of an item in the listing's data sections (IDA's names). */
export function objcLabel(item: ObjCItem): string {
  switch (item.kind) {
    case 'selref':
      return `selRef_${ident(item.name, 200)}`;
    case 'classref':
      return `classRef_${item.name}`;
    case 'superref':
      return `superRef_${item.name}`;
    case 'stub':
      return `objc_msgSend$${item.name}`;
    case 'cfstring':
      return words(item.name) ? `cfstr_${words(item.name)}` : 'cfstr';
    case 'class':
      return `_OBJC_CLASS_$_${item.name}`;
    case 'metaclass':
      return `_OBJC_METACLASS_$_${item.name}`;
  }
}

/** How a reference to an item reads in an instruction's comment. */
export function objcComment(item: ObjCItem): string {
  switch (item.kind) {
    case 'selref':
    case 'stub':
      return `@selector(${item.name})`;
    case 'classref':
    case 'superref':
    case 'class':
      return `class ${item.name}`;
    case 'metaclass':
      return `metaclass ${item.name}`;
    case 'cfstring':
      return `@${JSON.stringify(item.name.length > 80 ? `${item.name.slice(0, 80)}…` : item.name)}`;
  }
}

/** `x0`..`x30` for an ARM64 general register (`w5` is `x5`), else null. */
function xreg(text: string): string | null {
  const m = /^[xw](\d+)$/.exec(text.trim());
  return m && Number(m[1]) <= 30 ? `x${m[1]}` : null;
}

/** Mnemonics whose first operand is not written: stores, compares, branches, hints. */
const NO_DEST = /^(st|cmp|cmn|tst|b$|b\.|bl|br|blr|cb|tb|ret|nop|prfm|hint|dmb|dsb|isb|brk|svc|pac|aut|bti|ccmp|ccmn)/;

/** The ARM64 general registers an instruction writes (as `xN`), by its presentation. */
export function writtenRegs(mnemonic: string, operands: string): string[] {
  const m = mnemonic.toLowerCase();
  if (NO_DEST.test(m)) return [];
  const ops = operands.split(',');
  const first = ops[0] ? xreg(ops[0]) : null;
  if (!first) return [];
  const second = m === 'ldp' || m === 'ldpsw' || m === 'ldnp' || m === 'ldaxp' || m === 'ldxp' ? (ops[1] ? xreg(ops[1]) : null) : null;
  return second ? [first, second] : [first];
}

const BOUNDARY = new Set(['call', 'return', 'branch', 'jump', 'indirect', 'tail_call']);

/**
 * The Objective-C item the value of `reg` before `insns[i]` was loaded from, following
 * register moves back, within the run of straight-line code before `i` (no branch or branch
 * target in between, nor a call unless `reg` is callee-saved); `entry` when it still holds
 * the value it had on entry to the function (`insns` starts at the entry). `itemOf` names
 * an instruction's resolved data reference.
 */
function traceReg(
  insns: readonly Instruction[],
  i: number,
  reg: string,
  targets: ReadonlySet<string>,
  itemOf: (insn: Instruction) => ObjCAt | null,
): ObjCAt | 'entry' | null {
  for (let j = i - 1; j >= 0 && i - j <= 64; j--) {
    const insn = insns[j]!;
    // A call keeps the callee-saved x19-x28 (AAPCS64); its result and scratch registers are unknown.
    if (insn.flow.kind === 'call' ? Number(reg.slice(1)) < 19 : BOUNDARY.has(insn.flow.kind)) return null;
    if (writtenRegs(insn.mnemonic, insn.operands).includes(reg)) {
      const item = itemOf(insn);
      if (item) return item;
      const ops = insn.operands.split(',');
      const from = insn.mnemonic.toLowerCase() === 'mov' && ops.length === 2 ? xreg(ops[1]!) : null;
      if (!from) return null;
      reg = from;
    }
    // Code before a branch target also runs on other paths.
    if (targets.has(insn.addr)) return null;
  }
  return i < 64 ? 'entry' : null;
}

/** objc_msgSend and friends, as the call's target names them (`_objc_msgSend`, `objc_msgSendSuper2`). */
const SEND = /^_*objc_msgSend(Super2?)?$/;

/**
 * The message `insns[i]` sends, as `[ODCounter counterWithLabel:]` (`[id increment]` when the
 * receiver's class is not a class reference, `[self label]` for a method's own receiver when
 * `method`, `[super init]` for a super send), or null. A call to `objc_msgSend` takes its
 * selector from the selector reference loaded into x1; a call to an `__objc_stubs` entry
 * carries its selector. `calleeName` names a call target; `itemAt` is the
 * Objective-C item at an address; `itemOf` the one an instruction's resolved reference names.
 */
export function objcMessage(
  insns: readonly Instruction[],
  i: number,
  calleeName: (addr: string) => string | null,
  itemAt: (addr: string) => ObjCItem | null,
  itemOf: (insn: Instruction) => ObjCAt | null,
  targets: ReadonlySet<string>,
  method: boolean,
): { text: string; addr: string } | null {
  const call = insns[i];
  if (!call || (call.flow.kind !== 'call' && call.flow.kind !== 'tail_call')) return null;
  const target = call.flow.targets[0];
  if (!target) return null;
  const stub = itemAt(target);
  let sel: ObjCAt | null = stub?.kind === 'stub' ? { ...stub, addr: target } : null;
  const send = sel ? null : SEND.exec(calleeName(target) ?? '');
  if (!sel && !send) return null;
  if (!sel) {
    const loaded = traceReg(insns, i, 'x1', targets, itemOf);
    sel = loaded === 'entry' ? null : loaded;
  }
  if (sel?.kind !== 'selref' && sel?.kind !== 'stub') return null;
  if (send?.[1]) return { text: `[super ${sel.name}]`, addr: sel.addr };
  const receiver = traceReg(insns, i, 'x0', targets, itemOf);
  const known = receiver !== 'entry' && (receiver?.kind === 'classref' || receiver?.kind === 'class');
  const cls = known ? (receiver as ObjCAt).name : receiver === 'entry' && method ? 'self' : 'id';
  return { text: `[${cls} ${sel.name}]`, addr: sel.addr };
}
