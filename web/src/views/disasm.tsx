// Shared rendering of one instruction's operands and auto-comments.

import type { Instruction, Listing, OperandRef } from '../api.ts';
import { navigate, setCursor, useStore } from '../store.ts';

export interface ResolvedRef extends OperandRef {
  local: boolean;
}

/** Local code targets get loc_ labels; everything else keeps the server's classification. */
export function resolveRefs(insn: Instruction, local: Set<string>): ResolvedRef[] {
  return insn.refs.map((r) => ({ ...r, local: local.has(r.addr) && r.kind !== 'function' }));
}

export function labelFor(addr: string): string {
  return `loc_${addr.slice(2)}`;
}

/** Branch targets inside the function: they get a label line. */
export function branchTargets(listing: Listing): Set<string> {
  const out = new Set<string>();
  const local = new Set(listing.instructions.map((i) => i.addr));
  for (const i of listing.instructions) {
    if (i.flow.kind === 'fallthrough' || i.flow.kind === 'call') continue;
    for (const t of i.flow.targets) if (local.has(t)) out.add(t);
  }
  return out;
}

export function Operands({ insn, local }: { insn: Instruction; local: Set<string> }) {
  const selection = useStore((s) => s.selection);
  const refs = resolveRefs(insn, local);
  if (refs.length === 0) return <span className="op">{insn.operands}</span>;
  const parts: React.ReactNode[] = [];
  let rest = insn.operands;
  let key = 0;
  for (const r of refs) {
    const at = rest.indexOf(r.text);
    if (at < 0) continue;
    if (at > 0) parts.push(<span key={key++}>{rest.slice(0, at)}</span>);
    const shown = r.local ? labelFor(r.addr) : r.kind === 'function' ? r.label : r.text;
    const selected = selection?.kind === 'addr' && selection.addr === r.addr;
    parts.push(
      <span
        key={key++}
        className={`ref ref-${r.local ? 'code' : r.kind}${selected ? ' selected' : ''}`}
        title={`${r.addr}${r.label ? ` ${r.label}` : ''} — double-click to follow`}
        onClick={(e) => {
          e.stopPropagation();
          setCursor(insn.addr, { kind: 'addr', addr: r.addr });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          void navigate(r.addr, r.kind === 'data' && !r.local ? { view: 'hex' } : {});
        }}
      >
        {shown}
      </span>,
    );
    rest = rest.slice(at + r.text.length);
  }
  if (rest) parts.push(<span key={key++}>{rest}</span>);
  return <span className="op">{parts}</span>;
}

/** Operand text as displayed (labels substituted), for layout. */
export function displayOperands(insn: Instruction, local: Set<string>): string {
  let text = insn.operands;
  for (const r of resolveRefs(insn, local)) text = text.replace(r.text, r.local ? labelFor(r.addr) : r.kind === 'function' ? r.label : r.text);
  return text;
}

export function autoComment(insn: Instruction): string | null {
  const s = insn.refs.find((r) => r.kind === 'string');
  if (s) return JSON.stringify(s.label.length > 80 ? `${s.label.slice(0, 80)}…` : s.label);
  return null;
}

export function mnemonicClass(insn: Instruction): string {
  const k = insn.flow.kind;
  if (k === 'call') return 'mn mn-call';
  if (k === 'return') return 'mn mn-ret';
  if (k === 'branch' || k === 'jump' || k === 'indirect' || k === 'tail_call') return 'mn mn-jmp';
  if (!insn.valid) return 'mn mn-bad';
  return 'mn';
}
