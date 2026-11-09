// Enumerations a constant can be displayed as (IDA's M, Binary Ninja's "display as enum"):
// the bundled library constant sets of the binary's platform (values read from its real
// headers by OpenDecomp) and the enums the user declared in the type library. Pure: shared
// by the worker (catalog) and the views (formatting).

export interface EnumMember {
  name: string;
  /** Hexadecimal two's-complement text of the value (`-a` for -10), as the headers define it. */
  value: string;
}

export interface EnumDef {
  /** `lib:<set>` for a bundled set, `user:<name>` for a declared enum. */
  id: string;
  name: string;
  /** `values`: exactly one member; `flags`: an OR of members (bits no member covers stay a number). */
  kind: 'values' | 'flags';
  members: EnumMember[];
  /** Value fields inside a flag word (`O_RDONLY` under `O_ACCMODE`). */
  fields?: { mask: string; members: EnumMember[] }[];
  source: 'library' | 'user';
}

const parse = (text: string): bigint => (text.startsWith('-') ? -BigInt(`0x${text.slice(1)}`) : BigInt(`0x${text}`));
export const hexValue = (value: bigint): string => (value < 0n ? `-${(-value).toString(16)}` : value.toString(16));

const popcount = (value: bigint): number => {
  let n = 0;
  for (let rest = value; rest; rest &= rest - 1n) n++;
  return n;
};

/** Width a printed constant is compared at: 32 bits when it fits, else 64. */
export function constantBits(value: bigint): number {
  return value >= 0n && value < 1n << 32n ? 32 : 64;
}

/**
 * The symbolic text of `value` in `def`, or null when it has none: an equal member, else
 * (flags, or any user enum whose members cover every set bit) an OR of members, field
 * values first. A bundled flag set keeps uncovered bits as a hexadecimal remainder.
 */
export function formatEnum(def: EnumDef, value: bigint, bits = constantBits(value)): string | null {
  const mask = (1n << BigInt(bits)) - 1n;
  const word = value & mask;
  const of = (m: EnumMember) => parse(m.value) & mask;
  const exact = def.members.find((m) => of(m) === word);
  if (exact && (def.kind === 'values' || !def.fields?.length)) return exact.name;
  if (def.kind === 'values' && def.source === 'library') return null;
  const parts: string[] = [];
  let rest = word,
    named = false;
  for (const field of def.fields ?? []) {
    const fieldMask = parse(field.mask) & mask;
    const hit = field.members.find((m) => of(m) === (rest & fieldMask));
    if (!hit) continue;
    parts.push(hit.name);
    named ||= of(hit) !== 0n;
    rest &= ~fieldMask;
  }
  if (word === 0n) return parts[0] ?? def.members.find((m) => of(m) === 0n)?.name ?? null;
  const flags = def.members.filter((m) => of(m) !== 0n).sort((a, b) => popcount(of(b)) - popcount(of(a)));
  for (const m of flags) {
    const bitsOf = of(m);
    if ((rest & bitsOf) !== bitsOf) continue;
    parts.push(m.name);
    named = true;
    rest &= ~bitsOf;
  }
  // A zero field value alone (`O_RDONLY | 0x8`) does not spell a nonzero word.
  if (!parts.length || (!named && rest)) return null;
  if (rest) {
    if (def.source === 'user' && def.kind === 'values') return null;
    parts.push(`0x${rest.toString(16)}`);
  }
  return parts.join(' | ');
}
