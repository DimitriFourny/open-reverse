// C function prototypes ("int parse(struct Node *n, char *s)") compiled into an
// OpenDecomp `signature` annotation value, and C type names ("struct Node *") into the
// type a variable or global is bound to.
//
// OpenDecomp has no prototype parser: its C declaration parser
// (src/metadata/c-declarations, the one behind `types_declare`) parses
// struct/union/enum/typedef declarations and skips function declarations. A
// parameter list has the syntax of structure members, so the prototype is parsed
// as a synthetic structure whose members are the return type (as a pointer, so
// `void` and by-value structures are fine) and the parameters, and the member
// types become the signature's types.
//
// Named types (struct/union/enum tags, typedef names) are not redeclared: they
// refer to the image's type library (`types_declare`), by their deterministic
// library type IDs. Every other type the prototype needs (builtins, pointers to
// them, arrays) is declared next to the signature, as `type` annotations on the
// function itself, with content-derived IDs.
//
// Pure module: the parser and the identity functions are injected, so it can be
// unit-tested under Node.

/** The parts of OpenDecomp's parser result used here (see c-declarations/types.ts). */
export type ParsedDefinition =
  | { readonly kind: 'void' }
  | { readonly kind: 'unknown'; readonly size: bigint | null }
  | { readonly kind: 'integer'; readonly bits: number; readonly signed: boolean }
  | { readonly kind: 'float'; readonly bits: 16 | 32 | 64 | 80 | 128 }
  | { readonly kind: 'pointer'; readonly to: string; readonly bits: 64 }
  | { readonly kind: 'array'; readonly element: string; readonly count: bigint | null }
  | { readonly kind: 'vector'; readonly element: string; readonly lanes: number }
  | {
      readonly kind: 'structure';
      readonly size: bigint | null;
      readonly alignment: number | null;
      readonly fields: readonly { readonly id: string; readonly name: string; readonly offset: bigint; readonly type_id: string }[];
    };

export interface ParseResult {
  readonly types: readonly { readonly key: string; readonly name: string | null; readonly definition: ParsedDefinition }[];
  readonly named: ReadonlyMap<string, string>;
  readonly diagnostics: readonly { readonly message: string; readonly line: number; readonly column: number }[];
}

export type Parser = (source: string) => ParseResult;

/** A type definition whose references are OpenDecomp type IDs (internal bigint form). */
export type TypeDefinition =
  | Exclude<ParsedDefinition, { kind: 'pointer' | 'array' | 'vector' | 'structure' }>
  | { readonly kind: 'pointer'; readonly to: string; readonly bits: 64 }
  | { readonly kind: 'array'; readonly element: string; readonly count: bigint | null }
  | { readonly kind: 'vector'; readonly element: string; readonly lanes: number };

export interface TypeIds {
  /** The library type ID of a named type (tag or typedef name). */
  named(name: string): string;
  /** The library pointer type to a named type (`types_declare` declares one per name). */
  pointerTo(name: string): string;
  /** A content-derived ID for an anonymous type declared next to the signature. */
  local(definition: TypeDefinition): string;
}

export interface CompiledPrototype {
  /** The function name written in the prototype. */
  name: string;
  returnType: string;
  parameters: { name: string | null; type: string }[];
  variadic: boolean;
  /** Anonymous types to declare next to the signature, by ID. */
  declarations: Map<string, TypeDefinition>;
  /** Named types the prototype refers to (they must be in the type library). */
  namedTypes: string[];
}

export class PrototypeError extends Error {}

const TYPE_WORDS = new Set(
  'void char short int long float double signed unsigned const volatile restrict _Bool bool struct union enum _Complex'.split(' '),
);
const PREFIX = '__or_';

/** Comments, storage-class words and a trailing `{` or `;` removed; whitespace collapsed. */
function clean(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[{;]\s*$/, '')
    .replace(/^(?:(?:extern|static|inline|__attribute__\s*\(\([^)]*\)\))\s+)+/, '')
    .trim();
}

/** Splits `text` on commas outside parentheses and brackets. */
function splitTopLevel(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === ',' && depth === 0) {
      out.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(text.slice(start).trim());
  return out;
}

function identifiers(text: string): { text: string; start: number }[] {
  const out: { text: string; start: number }[] = [];
  const re = /[A-Za-z_][A-Za-z0-9_]*/g;
  for (let m = re.exec(text); m; m = re.exec(text)) out.push({ text: m[0], start: m.index });
  return out;
}

/**
 * One parameter as a structure member declaration, and the name the user gave it
 * (null when unnamed: the member then gets a generated name).
 */
function parameterMember(text: string, index: number): { member: string; name: string | null } {
  const generated = `${PREFIX}p${index}`;
  // A function pointer: `void (*cb)(int)` or unnamed `void (*)(int)`.
  const fp = /\(\s*\*\s*([A-Za-z_][A-Za-z0-9_]*)?\s*\)\s*\(/.exec(text);
  if (fp) {
    if (fp[1]) return { member: text, name: fp[1] };
    return { member: text.replace(/\(\s*\*\s*\)/, `(*${generated})`), name: null };
  }
  // An array parameter decays to a pointer: `char s[16]` is `char *s`.
  let decl = text;
  const array = /^(.*?)([A-Za-z_][A-Za-z0-9_]*)?\s*\[[^\]]*\]\s*$/.exec(text);
  if (array) decl = `${array[1]!.trim()} *${array[2] ?? ''}`.trim();
  const ids = identifiers(decl);
  const last = ids.at(-1);
  const before = ids.at(-2);
  const named =
    !!last &&
    decl.slice(last.start + last.text.length).trim() === '' &&
    !TYPE_WORDS.has(last.text) &&
    // `struct Node` names a type, not a parameter.
    !(before && (before.text === 'struct' || before.text === 'union' || before.text === 'enum') && ids.length === 2) &&
    // A lone identifier (`size_t`) is a type; anything before it makes it the name.
    decl.slice(0, last.start).trim() !== '';
  if (named) return { member: decl, name: last.text };
  return { member: `${decl} ${generated}`, name: null };
}

/** Splits a prototype into its function name, return type text and parameter declarations. */
export function splitPrototype(text: string): { name: string; returns: string; parameters: string[]; variadic: boolean } {
  const s = clean(text);
  if (!s) throw new PrototypeError('Empty prototype');
  if (!s.endsWith(')')) throw new PrototypeError('Expected a prototype such as `int parse(struct Node *n, char *s)`');
  let depth = 0;
  let open = -1;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ')') depth++;
    else if (s[i] === '(' && --depth === 0) {
      open = i;
      break;
    }
  }
  if (open < 0) throw new PrototypeError('Unbalanced parentheses');
  const head = s.slice(0, open).trim();
  const nameMatch = /([A-Za-z_][A-Za-z0-9_]*)\s*$/.exec(head);
  if (!nameMatch || TYPE_WORDS.has(nameMatch[1]!)) throw new PrototypeError('The prototype has no function name');
  const returns = head.slice(0, nameMatch.index).trim();
  if (!returns) throw new PrototypeError('The prototype has no return type (write `void` for none)');
  if (returns.includes('(')) throw new PrototypeError('Functions returning function pointers are not supported; return `void *`');
  const inner = s.slice(open + 1, -1).trim();
  let parameters = inner === '' || inner === 'void' ? [] : splitTopLevel(inner);
  let variadic = false;
  if (parameters.at(-1) === '...') {
    variadic = true;
    parameters = parameters.slice(0, -1);
  }
  if (parameters.some((p) => p === '' || p === '...')) throw new PrototypeError('Malformed parameter list');
  return { name: nameMatch[1]!, returns, parameters, variadic };
}


/**
 * Parses structure member declarations (`members`, without the braces) and resolves
 * their types to OpenDecomp type IDs. `typeText` is the C text whose struct/union/enum
 * tags and typedef names refer to the type library.
 */
function compileMembers(members: string, typeText: string, parse: Parser, ids: TypeIds) {
  // Named types are references to the type library: give each a complete stub so
  // the parser accepts them by value or by pointer; only their names are used.
  const stubs = new Map<string, string>();
  for (const m of typeText.matchAll(/\b(struct|union|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/g)) {
    const [, tag, name] = m;
    stubs.set(`${tag} ${name}`, tag === 'enum' ? `enum ${name} { ${PREFIX}e_${name} };` : `${tag} ${name} { unsigned char ${PREFIX}stub; };`);
  }
  let parsed: ParseResult | null = null;
  for (let attempt = 0; attempt < 64; attempt++) {
    const source = `${[...stubs.values()].join('\n')}\nstruct ${PREFIX}sig { ${members} };`;
    parsed = parse(source);
    const unknown = parsed.diagnostics
      .map((d) => /^unknown type name '([A-Za-z_][A-Za-z0-9_]*)'/.exec(d.message)?.[1])
      .filter((n): n is string => !!n && !stubs.has(`typedef ${n}`));
    if (unknown.length === 0) break;
    // A typedef name: refer to the library type of that name.
    // (`typedef struct Node Node` when the text also names the tag.)
    for (const n of unknown) {
      const tag = ['struct', 'union', 'enum'].find((t) => stubs.has(`${t} ${n}`));
      stubs.set(`typedef ${n}`, tag ? `typedef ${tag} ${n} ${n};` : `typedef unsigned char ${n};`);
    }
  }
  if (!parsed) throw new PrototypeError('Could not parse the type');
  if (parsed.diagnostics.length) {
    const messages = [...new Set(parsed.diagnostics.map((d) => d.message.replaceAll(PREFIX, '')))];
    throw new PrototypeError(messages.join('\n'));
  }

  const byKey = new Map(parsed.types.map((t) => [t.key, t]));
  const sig = parsed.types.find((t) => t.name === `${PREFIX}sig`);
  if (!sig || sig.definition.kind !== 'structure') throw new PrototypeError('Could not parse the type');

  const declarations = new Map<string, TypeDefinition>();
  const namedTypes = new Set<string>();
  const local = (definition: TypeDefinition): string => {
    const id = ids.local(definition);
    declarations.set(id, definition);
    return id;
  };
  const resolve = (key: string, depth = 0): string => {
    if (depth > 64) throw new PrototypeError('Type nesting is too deep');
    const t = byKey.get(key);
    if (!t) throw new PrototypeError(`Unresolved type ${key}`);
    if (t.name !== null) {
      if (t.name.startsWith(PREFIX)) throw new PrototypeError('Unsupported type');
      namedTypes.add(t.name);
      return ids.named(t.name);
    }
    const d = t.definition;
    switch (d.kind) {
      case 'pointer': {
        const to = byKey.get(d.to);
        if (to?.name != null && !to.name.startsWith(PREFIX)) {
          namedTypes.add(to.name);
          return ids.pointerTo(to.name);
        }
        return local({ kind: 'pointer', to: resolve(d.to, depth + 1), bits: 64 });
      }
      case 'array':
        return local({ kind: 'array', element: resolve(d.element, depth + 1), count: d.count });
      case 'vector':
        return local({ kind: 'vector', element: resolve(d.element, depth + 1), lanes: d.lanes });
      case 'structure':
        throw new PrototypeError('Anonymous structures and unions are not supported here: declare them by name in the Types view');
      default:
        return local(d);
    }
  };
  return { fields: sig.definition.fields, byKey, resolve, local, declarations, namedTypes };
}

/** Compiles a C prototype for the given parser and type identities. */
export function compilePrototype(text: string, parse: Parser, ids: TypeIds): CompiledPrototype {
  const proto = splitPrototype(text);
  const members = proto.parameters.map((p, i) => parameterMember(p, i));
  const names = members.map((m) => m.name).filter((n): n is string => n !== null);
  const dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup) throw new PrototypeError(`Parameter '${dup}' is declared twice`);
  if (names.some((n) => n.startsWith(PREFIX))) throw new PrototypeError(`Names starting with ${PREFIX} are reserved`);
  const body = [`${proto.returns} *${PREFIX}ret;`, ...members.map((m) => `${m.member};`)].join(' ');
  const { fields, byKey, resolve, local, declarations, namedTypes } = compileMembers(
    body,
    `${proto.returns} ${proto.parameters.join(' ')}`,
    parse,
    ids,
  );
  if (fields.length !== members.length + 1) throw new PrototypeError('Could not parse the parameter list');
  const ret = byKey.get(fields[0]!.type_id);
  if (!ret || ret.definition.kind !== 'pointer') throw new PrototypeError('Could not parse the return type');
  const returnType = resolve(ret.definition.to);
  const parameters = members.map((m, i) => {
    const field = fields[i + 1]!;
    const t = byKey.get(field.type_id);
    // An array parameter written through a typedef still decays to a pointer.
    const type =
      t && t.name === null && t.definition.kind === 'array'
        ? local({ kind: 'pointer', to: resolve(t.definition.element), bits: 64 })
        : resolve(field.type_id);
    if (byKey.get(field.type_id)?.definition.kind === 'void') throw new PrototypeError('A parameter cannot have type void');
    return { name: m.name, type };
  });
  return { name: proto.name, returnType, parameters, variadic: proto.variadic, declarations, namedTypes: [...namedTypes] };
}

export interface CompiledType {
  /** The type ID to bind a variable or global to. */
  type: string;
  /** Anonymous types it needs, by ID. */
  declarations: Map<string, TypeDefinition>;
  /** Named types it refers to (they must be in the type library). */
  namedTypes: string[];
}

/**
 * Compiles a C type name (`struct Node *`, `char *`, `uint32_t[8]`, `void (*)(int)`) for a
 * variable or a global. Unlike a parameter, an array keeps its array type.
 */
export function compileType(text: string, parse: Parser, ids: TypeIds): CompiledType {
  const t = clean(text);
  if (!t) throw new PrototypeError('Empty type');
  const name = `${PREFIX}v`;
  let member: string;
  if (t.includes('(')) {
    // A function pointer: the name goes in its `(*)`.
    if (!/\(\s*\*\s*\)/.test(t)) throw new PrototypeError('Expected a type such as `struct Node *`, `char *` or `uint32_t[8]`');
    member = t.replace(/\(\s*\*\s*\)/, `(*${name})`);
  } else {
    const array = /^(.*?)\s*((?:\[[^\]]*\]\s*)+)$/.exec(t);
    member = array ? `${array[1]} ${name}${array[2]!.replace(/\s+/g, '')}` : `${t} ${name}`;
  }
  let compiled;
  try {
    compiled = compileMembers(`${member};`, t, parse, ids);
  } catch (error) {
    if (error instanceof PrototypeError) throw new PrototypeError(error.message.replaceAll("member 'v'", 'the variable'));
    throw error;
  }
  const { fields, byKey, resolve, declarations, namedTypes } = compiled;
  if (fields.length !== 1) throw new PrototypeError('Expected one type, without a variable name');
  if (byKey.get(fields[0]!.type_id)?.definition.kind === 'void') throw new PrototypeError('A variable cannot have type void');
  return { type: resolve(fields[0]!.type_id), declarations, namedTypes: [...namedTypes] };
}
