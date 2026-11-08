// Shared rendering of one instruction's operands and auto-comments.

import type { Instruction, Listing, OperandRef, ResolvedTarget } from '../api.ts';
import { getState, navigate, setCursor, useStore } from '../store.ts';
import { numberKey, operandTokens } from './tokens.ts';

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

/** Plain operand text split into highlightable tokens (spans with data-k). */
function plainTokens(text: string, parts: React.ReactNode[], key: { n: number }): void {
  for (const t of operandTokens(text)) {
    if (t.key)
      parts.push(
        <span key={key.n++} data-k={t.key}>
          {t.text}
        </span>,
      );
    else parts.push(t.text);
  }
}

/** Highlight key of a resolved reference, as it is displayed. */
export function refKey(r: ResolvedRef): string {
  if (r.local) return `i:${labelFor(r.addr)}`;
  if (r.kind === 'function') return `i:${r.label}`;
  return numberKey(r.text) ?? `n:${BigInt(r.addr).toString(16)}`;
}

export function Operands({ insn, local }: { insn: Instruction; local: Set<string> }) {
  const selection = useStore((s) => s.selection);
  const refs = resolveRefs(insn, local);
  const parts: React.ReactNode[] = [];
  let rest = insn.operands;
  const key = { n: 0 };
  for (const r of refs) {
    const at = rest.indexOf(r.text);
    if (at < 0) continue;
    if (at > 0) plainTokens(rest.slice(0, at), parts, key);
    const shown = r.local ? labelFor(r.addr) : r.kind === 'function' ? r.label : r.text;
    const selected = selection?.kind === 'addr' && selection.addr === r.addr;
    parts.push(
      <span
        key={key.n++}
        data-k={refKey(r)}
        className={`ref ref-${r.local ? 'code' : r.kind}${selected ? ' selected' : ''}`}
        title={`${r.addr}${r.label ? ` ${r.label}` : ''} — double-click or Enter to follow`}
        onClick={(e) => {
          e.stopPropagation();
          setCursor(insn.addr, { kind: 'addr', addr: r.addr });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          void navigate(r.addr);
        }}
      >
        {shown}
      </span>,
    );
    rest = rest.slice(at + r.text.length);
  }
  if (rest) plainTokens(rest, parts, key);
  return <span className="op">{parts}</span>;
}

export function Mnemonic({ insn }: { insn: Instruction }) {
  return (
    <span className={mnemonicClass(insn)} data-k={`m:${insn.mnemonic}`}>
      {insn.mnemonic}
    </span>
  );
}

/**
 * Enter: follow the reference under the cursor. The selected operand if it
 * belongs to this instruction, else the call/branch target, else the first
 * referenced address.
 */
export function followFrom(insn: Instruction | undefined, local: Set<string>): void {
  const { selection, byId } = getState();
  if (selection?.kind === 'function') {
    const f = byId.get(selection.fnId);
    if (f) void navigate(f.entry, { fnId: f.id });
    return;
  }
  if (!insn) return;
  const refs = resolveRefs(insn, local);
  const sel = selection?.kind === 'addr' ? refs.find((r) => r.addr === selection.addr) : undefined;
  if (sel) return void navigate(sel.addr);
  const selResolved = selection?.kind === 'addr' ? commentTargets(insn).find((t) => t.addr === selection.addr) : undefined;
  if (selResolved) return void navigate(selResolved.addr);
  const target = insn.flow.kind !== 'fallthrough' ? insn.flow.targets[0] : undefined;
  if (target) return void navigate(target);
  const r = refs[0];
  if (r) return void navigate(r.addr);
  const t = commentTargets(insn).find((x) => x.addr);
  if (t) void navigate(t.addr);
}

/** Operand text as displayed (labels substituted), for layout. */
export function displayOperands(insn: Instruction, local: Set<string>): string {
  let text = insn.operands;
  for (const r of resolveRefs(insn, local)) text = text.replace(r.text, r.local ? labelFor(r.addr) : r.kind === 'function' ? r.label : r.text);
  return text;
}

const quote = (text: string) => JSON.stringify(text.length > 80 ? `${text.slice(0, 80)}…` : text);

/** How a resolved target reads in a comment: a string's text, else a name, else its address. */
function targetText(t: ResolvedTarget): string {
  if (t.kind === 'string') return quote(t.label);
  return t.label || t.addr;
}

/** Targets the comment of `insn` names: an operand string, then what OpenDecomp resolved. */
function commentTargets(insn: Instruction): ResolvedTarget[] {
  const s = insn.refs.find((r) => r.kind === 'string');
  const out: ResolvedTarget[] = s ? [{ addr: s.addr, kind: 'string', label: s.label, access: 'address' }] : [];
  for (const t of insn.resolved ?? []) if (!out.some((o) => o.addr === t.addr && o.label === t.label)) out.push(t);
  return out;
}

/** The auto-comment of an instruction as plain text (search, layout). */
export function autoComment(insn: Instruction): string | null {
  const targets = commentTargets(insn);
  return targets.length ? targets.map(targetText).join(', ') : null;
}

/** The auto-comment, each target clickable: click selects it (X, Enter), double-click follows it. */
export function AutoComment({ insn }: { insn: Instruction }) {
  const selection = useStore((s) => s.selection);
  const targets = commentTargets(insn);
  return (
    <>
      {targets.map((t, i) => {
        const text = targetText(t);
        if (!t.addr) return <span key={i}>{i > 0 ? ', ' : ''}{text}</span>;
        const selected = selection?.kind === 'addr' && selection.addr === t.addr;
        return (
          <span key={i}>
            {i > 0 ? ', ' : ''}
            <span
              className={`ref ref-${t.kind === 'import' ? 'function' : t.kind}${selected ? ' selected' : ''}`}
              data-k={t.kind === 'string' ? undefined : `n:${BigInt(t.addr).toString(16)}`}
              title={`${t.addr}${t.label ? ` ${t.label}` : ''} (${t.access}) — X: xrefs · double-click or Enter: follow`}
              onClick={(e) => {
                e.stopPropagation();
                setCursor(insn.addr, { kind: 'addr', addr: t.addr });
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                void navigate(t.addr);
              }}
            >
              {text}
            </span>
          </span>
        );
      })}
    </>
  );
}


export function mnemonicClass(insn: Instruction): string {
  const k = insn.flow.kind;
  if (k === 'call') return 'mn mn-call';
  if (k === 'return') return 'mn mn-ret';
  if (k === 'branch' || k === 'jump' || k === 'indirect' || k === 'tail_call') return 'mn mn-jmp';
  if (!insn.valid) return 'mn mn-bad';
  return 'mn';
}
