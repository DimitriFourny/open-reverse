// Token keys for click-to-highlight. A key names what a token *is*, so that
// every spelling of the same thing shares it: register aliases (rax/eax/ax/al,
// x0/w0, v0/q0/d0/s0), numbers written in hex or decimal, and identifiers.
//   r:<family>   register        n:<hex>   number
//   i:<name>     identifier      m:<mn>    mnemonic

const REGS = new Map<string, string>();
{
  // x86-64
  for (const l of ['a', 'b', 'c', 'd']) for (const r of [`r${l}x`, `e${l}x`, `${l}x`, `${l}l`, `${l}h`]) REGS.set(r, `${l}x`);
  for (const b of ['si', 'di', 'bp', 'sp']) for (const r of [`r${b}`, `e${b}`, b, `${b}l`]) REGS.set(r, b);
  for (let n = 8; n < 16; n++) for (const s of ['', 'd', 'w', 'b', 'l']) REGS.set(`r${n}${s}`, `r${n}`);
  for (const r of ['rip', 'eip', 'ip']) REGS.set(r, 'ip');
  for (let n = 0; n < 32; n++) for (const p of ['xmm', 'ymm', 'zmm']) REGS.set(`${p}${n}`, `v${n}`);
  // ARM64
  for (let n = 0; n <= 30; n++) for (const p of ['x', 'w']) REGS.set(`${p}${n}`, `x${n}`);
  for (let n = 0; n < 32; n++) for (const p of ['v', 'q', 'd', 's', 'h', 'b']) REGS.set(`${p}${n}`, `v${n}`);
  REGS.set('fp', 'x29');
  REGS.set('lr', 'x30');
  REGS.set('wsp', 'sp');
  REGS.set('xzr', 'zr');
  REGS.set('wzr', 'zr');
}

/** Operand words that are syntax, not things worth highlighting. */
const NOISE = new Set(['byte', 'word', 'dword', 'qword', 'tbyte', 'fword', 'oword', 'xmmword', 'ymmword', 'zmmword', 'ptr', 'short', 'near', 'far']);

export function numberKey(text: string): string | null {
  const t = text.replace(/^#/, '').toLowerCase();
  const m = /^(?:(0x[0-9a-f]+|\d+)(u|l|ul|ull|ll|lu|llu)?|([0-9][0-9a-f]*)h)$/.exec(t);
  if (!m) return null;
  try {
    return `n:${BigInt(m[1] ?? `0x${m[3]}`).toString(16)}`;
  } catch {
    return null;
  }
}

export function wordKey(word: string): string | null {
  const w = word.toLowerCase();
  const reg = REGS.get(w);
  if (reg) return `r:${reg}`;
  if (NOISE.has(w)) return null;
  return `i:${word}`;
}

export interface OpToken {
  text: string;
  key: string | null;
}

const OP_RE = /#?(?:0x[0-9a-fA-F]+|[0-9][0-9a-fA-F]*h|\d+)\b|[A-Za-z_.$@?][\w.$@?]*|[^A-Za-z_.$@?#0-9]+|./g;

/** Split operand text into highlightable tokens and plain punctuation. */
export function operandTokens(text: string): OpToken[] {
  const out: OpToken[] = [];
  for (const m of text.matchAll(OP_RE)) {
    const t = m[0];
    const c = t[0]!;
    const key = c === '#' || (c >= '0' && c <= '9') ? numberKey(t) : /[A-Za-z_.$@?]/.test(c) ? wordKey(t) : null;
    const last = out.at(-1);
    if (!key && last && !last.key) last.text += t;
    else out.push({ text: t, key });
  }
  return out;
}

/** Key for a pseudocode token (identifiers, calls, types, numbers). */
export function pseudoKey(kind: string, text: string): string | null {
  if (kind === 'num') return numberKey(text);
  if (kind === 'ident' || kind === 'call' || kind === 'type') return wordKey(text);
  return null;
}
