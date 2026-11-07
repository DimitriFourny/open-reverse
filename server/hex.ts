// Address helpers. OpenDecomp exchanges addresses as unsigned hex strings; the
// UI uses one canonical spelling ("0x" + lowercase, no leading zeros) so they
// can be used as map keys.

export function canon(hex: string | bigint): string {
  const value = typeof hex === 'bigint' ? hex : BigInt(hex);
  return `0x${value.toString(16)}`;
}

export function parseAddress(text: string): bigint | null {
  const t = text.trim().toLowerCase();
  if (/^0x[0-9a-f]{1,16}$/.test(t)) return BigInt(t);
  if (/^[0-9a-f]{1,16}h$/.test(t)) return BigInt(`0x${t.slice(0, -1)}`);
  if (/^[0-9a-f]{1,16}$/.test(t)) return BigInt(`0x${t}`);
  return null;
}

export function add(hex: string, delta: number | bigint): string {
  return canon(BigInt(hex) + BigInt(delta));
}

/** Hex constants in disassembler operand text: `0x401870`, `#0x10`, or MASM `0000000000401870h`. */
export function operandConstants(operands: string): { text: string; value: bigint; inMemory: boolean }[] {
  const out: { text: string; value: bigint; inMemory: boolean }[] = [];
  for (const m of operands.matchAll(/(?<![\w])(0x[0-9a-f]+|[0-9a-f]+h)(?![\w])/gi)) {
    const text = m[1]!;
    const value = text.toLowerCase().startsWith('0x')
      ? BigInt(text)
      : BigInt(`0x${text.slice(0, -1)}`);
    const before = operands.slice(0, m.index);
    const inMemory = before.lastIndexOf('[') > before.lastIndexOf(']');
    out.push({ text, value, inMemory });
  }
  return out;
}
