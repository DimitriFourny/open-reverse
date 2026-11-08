export function canon(hex: string): string {
  const t = hex.trim().toLowerCase();
  const v = t.endsWith('h') && !t.startsWith('0x') ? BigInt(`0x${t.slice(0, -1)}`) : BigInt(t.startsWith('0x') ? t : `0x${t}`);
  return `0x${v.toString(16)}`;
}

/** Parse what a user types in "Go to": hex with or without 0x / h suffix. */
export function parseAddress(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (/^(0x)?[0-9a-f]{1,16}$/.test(t) || /^[0-9a-f]{1,16}h$/.test(t)) return canon(t);
  return null;
}

/** Fixed-width address column, e.g. 0000000000401a90 → 00401a90 for small images. */
export function padAddr(addr: string, width = 8): string {
  return addr.slice(2).padStart(width, '0');
}

export function addrWidth(addressBits: number | undefined, sample?: string): number {
  if (sample && sample.length - 2 > 8) return 16;
  return addressBits === 32 ? 8 : sample && sample.length - 2 <= 8 ? 8 : 12;
}

export function addHex(addr: string, delta: number): string {
  return `0x${(BigInt(addr) + BigInt(delta)).toString(16)}`;
}

export function fmtSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${(n / 1024 / 1024).toFixed(1)} MiB`;
}

export function cmpAddr(a: string, b: string): number {
  const x = BigInt(a);
  const y = BigInt(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

/**
 * How OpenDecomp's pseudocode spells a name as a C identifier (its source identifier
 * stem): every other character becomes `_`, at most 64 characters, `value_` before a
 * leading digit. `geom::area(int, int)` reads `geom__area_int__int_`.
 */
export function cIdentifier(name: string): string {
  const stem = name.replace(/[^A-Za-z0-9_]/g, '_').slice(0, 64);
  return /^[A-Za-z_]/.test(stem) ? stem : `value_${stem}`;
}

/** A tooltip line naming the mangled (linkage) name behind a demangled one. */
export function mangledNote(mangled: string | null | undefined): string {
  return mangled ? `\nmangled: ${mangled}` : '';
}

export function isEditableTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

/**
 * `name+0x10` for an address inside one of `sorted` (functions by entry), else null: the
 * last function starting at or before it, when the address is within its size.
 */
export function functionOffset(sorted: readonly { name: string; entry: string; size: number }[], addr: string): string | null {
  const a = BigInt(addr);
  let lo = 0;
  let hi = sorted.length - 1;
  let hit = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (BigInt(sorted[mid]!.entry) <= a) {
      hit = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  const f = sorted[hit];
  if (!f) return null;
  const off = a - BigInt(f.entry);
  if (off >= BigInt(Math.max(f.size, 1))) return null;
  return off === 0n ? f.name : `${f.name}+0x${off.toString(16)}`;
}
