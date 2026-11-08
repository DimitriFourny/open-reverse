// Structure layouts and declarations: the offsets OpenDecomp's C declaration parser
// assigns (the layout rules `types_declare` stores), and a declaration rebuilt from a
// structure the decompiler recovered for one function (`struct struct_<hex>`).
//
// Pure module: the parser is injected, so it can be unit-tested under Node.

import type { ParsedDefinition, Parser } from './prototype.ts';

export interface FieldLayout {
  name: string;
  offset: number;
  /** Bytes; null when the type has no known size. */
  size: number | null;
}

export interface StructLayout {
  /** True when every member starts at offset 0 (OpenDecomp renders it as a union). */
  union: boolean;
  size: number | null;
  alignment: number | null;
  fields: FieldLayout[];
}

/** Size in bytes of a parsed type (by parser key), as the parser laid it out. */
function sizeOf(defs: Map<string, ParsedDefinition>, key: string, depth = 0): number | null {
  const d = defs.get(key);
  if (!d || depth > 64) return null;
  switch (d.kind) {
    case 'integer':
      return Math.ceil(d.bits / 8);
    case 'float':
      return d.bits === 80 ? 16 : d.bits / 8;
    case 'pointer':
      return 8;
    case 'array': {
      const e = sizeOf(defs, d.element, depth + 1);
      return e === null || d.count === null ? null : e * Number(d.count);
    }
    case 'vector': {
      const e = sizeOf(defs, d.element, depth + 1);
      return e === null ? null : e * d.lanes;
    }
    case 'structure':
      return d.size === null ? null : Number(d.size);
    case 'unknown':
      return d.size === null ? null : Number(d.size);
    default:
      return null;
  }
}

/** The layout of structure or union `name` declared in `source`, or the parser's error messages. */
export function structLayout(source: string, name: string, parse: Parser): StructLayout | { errors: string[] } {
  const parsed = parse(source);
  if (parsed.diagnostics.length) return { errors: parsed.diagnostics.map((d) => `${d.line}:${d.column}: ${d.message}`) };
  const defs = new Map(parsed.types.map((t) => [t.key, t.definition]));
  const key = parsed.named.get(name);
  const d = key === undefined ? undefined : defs.get(key);
  if (!d || d.kind !== 'structure') return { errors: [`No structure or union named ${name}`] };
  return {
    union: d.fields.length > 1 && d.fields.every((f) => f.offset === 0n),
    size: d.size === null ? null : Number(d.size),
    alignment: d.alignment,
    fields: d.fields.map((f) => ({ name: f.name, offset: Number(f.offset), size: sizeOf(defs, f.type_id) })),
  };
}

/** One member of a structure: its C type (`uint32_t`, `struct Node *`), name and array suffix (`[4]`). */
export interface Member {
  type: string;
  name: string;
  dims: string;
}

/** Splits a member declaration (`struct Node *next`, `uint8_t pad[4]`) into type, name and array suffix. */
export function splitMember(text: string): Member | null {
  const m = /^(.*?[\s*])\s*([A-Za-z_][A-Za-z0-9_]*)\s*((?:\[[^\]]*\]\s*)*)$/.exec(text.trim());
  if (!m || !m[1]!.trim()) return null;
  return { type: normalizeType(m[1]!), name: m[2]!, dims: m[3]!.replace(/\s+/g, '') };
}

/** `struct_47fdf8*` -> `struct_47fdf8 *`, `char * *` -> `char **`. */
export function normalizeType(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*\*\s*/g, ' *')
    .replace(/\* \*/g, '**')
    .replace(/\* \*/g, '**')
    .trim();
}

/** Splits a structure body on `;` outside braces. */
function splitBody(body: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === ';' && depth === 0) {
      out.push(body.slice(start, i).trim());
      start = i + 1;
    }
  }
  if (body.slice(start).trim()) out.push(body.slice(start).trim());
  return out.filter(Boolean);
}

/** Members of `struct <tag>` or `union <tag>` as a C declaration in `text`, or null when it declares no body. */
export function declaredMembers(text: string, tag: string): { union: boolean; members: Member[] } | null {
  const re = new RegExp(`\\b(struct|union)\\s+${tag}\\s*\\{((?:[^{}]|\\{[^{}]*\\})*)\\}`);
  const m = re.exec(text);
  if (!m) return null;
  const members: Member[] = [];
  for (const part of splitBody(m[2]!)) {
    // An overlay of one offset (`union { uint64_t field_0x10; double field_0x10_f; }`): its first member.
    const inner = /^union\s*\{([^{}]*)\}$/.exec(part);
    const member = splitMember(inner ? (splitBody(inner[1]!)[0] ?? '') : part);
    if (!member) return null;
    members.push(member);
  }
  return { union: m[1] === 'union', members };
}

/** C text of a structure or union declaration. */
export function structSource(name: string, members: Member[], opts: { union?: boolean; packed?: boolean } = {}): string {
  const body = members.map((m) => `  ${m.type}${m.type.endsWith('*') ? '' : ' '}${m.name}${m.dims};`).join('\n');
  return `${opts.union ? 'union' : 'struct'} ${name} {\n${body}\n}${opts.packed ? ' __attribute__((packed))' : ''};`;
}

/** The offset a recovered member's name states (`field_0x1d`, `field_0x10_f`), else null. */
function statedOffset(name: string): number | null {
  const m = /^field_0x([0-9a-f]+)(?:_f)?$/.exec(name);
  return m ? parseInt(m[1]!, 16) : null;
}

/**
 * A declaration of structure `name` with the members of a structure recovered for one
 * function: members keep their offsets (their names state them) and the gaps between them
 * become `uint8_t pad_0x<offset>[n]` members, laid out by the parser (`parse`); a member
 * the layout cannot place at its offset makes the structure packed. Pointers to other
 * recovered structures become `void *` (they are not in the type library).
 */
export function recoveredDeclaration(recovered: { members: Member[] }, name: string, parse: Parser): string {
  const members = recovered.members
    .filter((m) => !/^pad_/.test(m.name))
    .map((m) => ({ ...m, type: m.type.replace(/\bstruct_[0-9a-f]+ \*/g, 'void *') }));
  if (members.some((m) => /\bstruct_[0-9a-f]+\b/.test(m.type))) throw new Error('The structure holds another recovered structure by value: declare that one first');
  const offsets = members.map((m) => statedOffset(m.name));
  // Members that do not state their offsets (Objective-C ivars) keep their written order and natural layout.
  if (offsets.some((o) => o === null)) return structSource(name, members);
  const order = members.map((m, i) => ({ m, offset: offsets[i]! })).sort((a, b) => a.offset - b.offset);
  // Each member's size, laid out by the parser.
  const sizes = structLayout(structSource(name, order.map((x) => x.m), { packed: true }), name, parse);
  if ('errors' in sizes) throw new Error(sizes.errors.join('\n'));
  const out: Member[] = [];
  let end = 0;
  order.forEach(({ m, offset }, i) => {
    if (offset < end) return; // overlaps the previous member: keep the first
    if (offset > end) out.push({ type: 'uint8_t', name: `pad_0x${end.toString(16)}`, dims: `[${offset - end}]` });
    out.push(m);
    end = offset + (sizes.fields[i]!.size ?? 1);
  });
  const plain = structSource(name, out);
  const check = structLayout(plain, name, parse);
  const placed = (l: StructLayout) =>
    l.fields.every((f) => (f.name.startsWith('pad_') ? true : f.offset === statedOffset(f.name)));
  if (!('errors' in check) && placed(check)) return plain;
  return structSource(name, out, { packed: true });
}
