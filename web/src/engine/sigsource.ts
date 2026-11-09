// Pure parts of library signatures in the browser (no OpenDecomp runtime import, so Node's
// unit tests load them): the signature source of a linked function, and suggestions.

import type { SignatureArchitecture, SignatureSource } from '../../../vendor/open-decomp/dist/src/metadata/library-signatures/index.js';

/** What suggestions need of a library (see SignatureInfo in signatures.ts). */
interface Suggestible {
  id: string;
  architecture: SignatureArchitecture;
  markers?: string[];
}

/** One instruction of a linked function, as the listing gives it. */
export interface LinkedInstruction {
  addr: bigint;
  size: number;
  mnemonic: string;
  operands: string;
  flow: { kind: string; targets: string[] };
  /** Addresses the instruction refers to (operands, resolved ADRP pairs, RIP-relative loads). */
  refs: string[];
}

/**
 * The signature source of a function of a linked image with symbols. A linked image has no
 * relocations left, so the instructions say which bytes depend on the layout: a call or jump
 * out of the function (its displacement; a direct call to a named function becomes a call
 * constraint), and any instruction that refers to an address (RIP-relative operands, absolute
 * addresses, ARM64 ADRP/ADR and their page offsets) is masked whole. Branches inside the
 * function keep their bytes.
 */
export function linkedSource(
  fn: { names: string[]; entry: bigint; bytes: Uint8Array; instructions: LinkedInstruction[] },
  architecture: SignatureArchitecture,
  nameAt: (addr: bigint) => string | null,
): SignatureSource {
  const { bytes, entry } = fn;
  const end = entry + BigInt(bytes.length);
  const masked = new Uint8Array(bytes.length);
  const calls: [number, string][] = [];
  const inside = (a: bigint) => a >= entry && a < end;
  for (const insn of fn.instructions) {
    const off = Number(insn.addr - entry);
    if (off < 0 || off + insn.size > bytes.length) continue;
    const targets = insn.flow.targets.map((t) => BigInt(t));
    const outside = targets.filter((t) => !inside(t));
    const branch = insn.flow.kind === 'call' || insn.flow.kind === 'jump' || insn.flow.kind === 'branch';
    if (branch && outside.length) {
      if (architecture === 'arm64') {
        masked.fill(1, off, off + 4);
        const name = nameAt(outside[0]!);
        if (name && /^bl?$/.test(insn.mnemonic)) calls.push([off, name]);
      } else {
        // x86-64 rel32 forms: [prefix] E8/E9 rel32, 0F 8x rel32; rel8: EB/7x.
        let op = off;
        while (op < off + insn.size - 1 && (bytes[op] === 0xf2 || bytes[op] === 0x3e || bytes[op] === 0x2e)) op++;
        const b = bytes[op]!;
        const field = b === 0xe8 || b === 0xe9 ? op + 1 : b === 0x0f && (bytes[op + 1]! & 0xf0) === 0x80 ? op + 2 : -1;
        if (field >= 0 && field + 4 === off + insn.size) {
          masked.fill(1, field, field + 4);
          const name = nameAt(outside[0]!);
          if (name) calls.push([field, name]);
        } else masked.fill(1, off, off + insn.size);
      }
      continue;
    }
    const refersOutside = insn.refs.some((r) => !branch || !inside(BigInt(r)));
    if (refersOutside || /\brip\b/.test(insn.operands) || /^adrp?$/.test(insn.mnemonic)) masked.fill(1, off, off + insn.size);
  }
  return { names: fn.names.map((name) => ({ name, binding: 'global' })), bytes, masked, calls, ifunc: false };
}

/** Bundled libraries whose markers a binary's strings contain, with the string that matched. */
export function suggestLibraries(libraries: Suggestible[], strings: Iterable<string>, architecture: string): Map<string, string> {
  const out = new Map<string, string>();
  const tests = libraries.flatMap((library) =>
    library.architecture === architecture ? (library.markers ?? []).map((marker) => ({ id: library.id, re: new RegExp(marker) })) : [],
  );
  if (!tests.length) return out;
  for (const text of strings) {
    for (const test of tests) if (!out.has(test.id) && test.re.test(text)) out.set(test.id, text.length > 60 ? `${text.slice(0, 57)}...` : text);
    if (out.size === new Set(tests.map((t) => t.id)).size) break;
  }
  return out;
}
