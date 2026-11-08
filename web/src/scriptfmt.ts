// Pure helpers of the script console (web/src/scripting.ts): address arguments, the
// pretty-printing of results, script line numbers of errors, the script history.

/** `0x401000` from `0x401000`, `401000h`, 4198400 or 4198400n; null for anything else. */
export function toAddr(x: unknown): string | null {
  if (typeof x === 'bigint') return x >= 0n ? `0x${x.toString(16)}` : null;
  if (typeof x === 'number') return Number.isSafeInteger(x) && x >= 0 ? `0x${x.toString(16)}` : null;
  if (typeof x !== 'string') return null;
  const t = x.trim().toLowerCase();
  if (/^0x[0-9a-f]{1,16}$/.test(t)) return `0x${BigInt(t).toString(16)}`;
  if (/^[0-9a-f]{1,16}h$/.test(t)) return `0x${BigInt(`0x${t.slice(0, -1)}`).toString(16)}`;
  return null;
}

/** A non-negative integer argument (a length, a count): numbers, bigints and numeric strings. */
export function toCount(x: unknown, what: string): number {
  const n = typeof x === 'bigint' ? Number(x) : typeof x === 'string' && x.trim() ? Number(toAddr(x) ?? x) : x;
  if (typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0) throw new TypeError(`${what} must be a non-negative integer, got ${describe(x)}`);
  return n;
}

/** How an argument reads in an error message. */
export function describe(x: unknown): string {
  if (typeof x === 'string') return JSON.stringify(x.length > 60 ? `${x.slice(0, 60)}…` : x);
  if (typeof x === 'bigint') return `${x}n`;
  if (x === null || typeof x !== 'object') return String(x);
  return Array.isArray(x) ? `an array` : `an object`;
}

export interface FormatOptions {
  /** Array (and Map / Set) elements shown before "… N more". */
  maxItems?: number;
  /** Nested strings longer than this are cut. */
  maxString?: number;
  /** Nesting shown before `[…]`. */
  maxDepth?: number;
  /** A nested value fitting in this many characters stays on one line. */
  width?: number;
}

const DEFAULTS: Required<FormatOptions> = { maxItems: 100, maxString: 300, maxDepth: 6, width: 100 };

/**
 * A readable rendering of a script value: strings as they are at the top level (quoted
 * inside objects), objects and arrays indented unless they fit on one line, long lists
 * cut with a count, byte arrays as hex.
 */
export function formatValue(value: unknown, options: FormatOptions = {}): string {
  const o = { ...DEFAULTS, ...options };
  if (typeof value === 'string') return value;
  return render(value, o, 0, new Set());
}

function quote(s: string, max: number): string {
  return JSON.stringify(s.length > max ? `${s.slice(0, max)}…` : s) + (s.length > max ? ` (${s.length} chars)` : '');
}

const KEY = /^[A-Za-z_$][\w$]*$/;

function render(v: unknown, o: Required<FormatOptions>, depth: number, seen: Set<object>): string {
  if (v === null) return 'null';
  switch (typeof v) {
    case 'undefined':
      return 'undefined';
    case 'string':
      return quote(v, o.maxString);
    case 'bigint':
      return `${v}n`;
    case 'number':
    case 'boolean':
      return String(v);
    case 'symbol':
      return v.toString();
    case 'function':
      return `[function ${v.name || 'anonymous'}]`;
  }
  const obj = v as object;
  if (obj instanceof Error) return `${obj.name}: ${obj.message}`;
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof Uint8Array) return hexBytes(obj, o.maxItems * 4);
  if (seen.has(obj)) return '[circular]';
  if (depth >= o.maxDepth) return Array.isArray(obj) ? '[…]' : '{…}';
  seen.add(obj);
  try {
    let items: string[];
    let open: string;
    let close: string;
    let total: number;
    if (Array.isArray(obj) || obj instanceof Set) {
      const all = Array.isArray(obj) ? obj : [...obj];
      total = all.length;
      items = all.slice(0, o.maxItems).map((x) => render(x, o, depth + 1, seen));
      [open, close] = obj instanceof Set ? [`Set(${total}) {`, '}'] : ['[', ']'];
    } else if (obj instanceof Map) {
      const all = [...obj];
      total = all.length;
      items = all.slice(0, o.maxItems).map(([k, x]) => `${render(k, o, depth + 1, seen)} => ${render(x, o, depth + 1, seen)}`);
      [open, close] = [`Map(${total}) {`, '}'];
    } else {
      const entries = Object.entries(obj);
      total = entries.length;
      items = entries.slice(0, o.maxItems).map(([k, x]) => `${KEY.test(k) ? k : JSON.stringify(k)}: ${render(x, o, depth + 1, seen)}`);
      [open, close] = ['{', '}'];
    }
    if (total > items.length) items.push(`… ${total - items.length} more (${total} ${Array.isArray(obj) ? 'items' : 'entries'})`);
    if (items.length === 0) return `${open}${close}`;
    const flat = `${open}${open === '{' ? ' ' : ''}${items.join(', ')}${close === '}' && open === '{' ? ' ' : ''}${close}`;
    if (flat.length <= o.width && !flat.includes('\n')) return flat;
    const pad = '  ';
    return `${open}\n${items.map((x) => pad + x.replace(/\n/g, `\n${pad}`)).join(',\n')}\n${close}`;
  } finally {
    seen.delete(obj);
  }
}

/** `Uint8Array(6) 48 8b 05 10 00 00`; past `max` bytes, cut with a count. */
export function hexBytes(b: Uint8Array, max = 400): string {
  const shown = Array.from(b.subarray(0, max), (x) => x.toString(16).padStart(2, '0')).join(' ');
  return `Uint8Array(${b.length})${b.length ? ` ${shown}` : ''}${b.length > max ? ` … ${b.length - max} more` : ''}`;
}

/** The text a `print(a, b)` line shows: its arguments formatted, separated by spaces. */
export function formatPrint(args: unknown[]): string {
  return args.map((a) => formatValue(a)).join(' ');
}

/**
 * The line of the user's script a stack trace points at: the first frame in the script's
 * `//# sourceURL` source, minus `offset` (the lines the function wrapper adds). Null when
 * no frame is in the script (an error raised by the API itself).
 */
export function stackLine(stack: string | undefined, source: string, offset: number): number | null {
  if (!stack) return null;
  const at = stack.indexOf(`${source}:`);
  if (at < 0) return null;
  const m = /^:(\d+):\d+/.exec(stack.slice(at + source.length));
  if (!m) return null;
  const line = Number(m[1]) - offset;
  return line >= 1 ? line : null;
}

/**
 * The line a syntax error is on (engines report none for `new Function`): the shortest
 * prefix of the script's lines that fails to compile with the same message as the whole.
 * `compile` throws on a syntax error. Null when no prefix reproduces it. A script that
 * leaves a bracket, block or template open is cut short: its last line (every prefix
 * would fail the same way).
 */
export function syntaxErrorLine(code: string, message: string, compile: (code: string) => void): number | null {
  const lines = code.trimEnd().split('\n');
  if (unclosed(code)) return lines.length;
  for (let n = 1; n <= lines.length; n++) {
    try {
      compile(lines.slice(0, n).join('\n'));
    } catch (e) {
      if (e instanceof SyntaxError && e.message === message) return n;
    }
  }
  return null;
}

/** More `{ ( [` than closers, or an odd number of backticks, outside strings and comments (roughly). */
function unclosed(code: string): boolean {
  const bare = code.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/g, '');
  if ((bare.match(/`/g)?.length ?? 0) % 2) return true;
  let depth = 0;
  for (const ch of bare.replace(/`(?:\\.|[^`\\])*`/g, '')) depth += '{(['.includes(ch) ? 1 : '})]'.includes(ch) ? -1 : 0;
  return depth > 0;
}

/**
 * A script that is one expression is shown with its value, as a console does: `return (…)`.
 * A trailing semicolon is dropped. Null when it is not a single expression (`compile` throws).
 */
export function asExpression(code: string, compile: (code: string) => void): string | null {
  const body = code.replace(/;\s*$/, '');
  if (!body.trim()) return null;
  const wrapped = `return (\n${body}\n);`;
  try {
    compile(wrapped);
    return wrapped;
  } catch {
    return null;
  }
}

/** The history after running `script`: newest last, an earlier copy of it removed, at most `max`. */
export function pushHistory(history: readonly string[], script: string, max = 50): string[] {
  const s = script.trimEnd();
  if (!s.trim()) return [...history];
  return [...history.filter((h) => h !== s), s].slice(-max);
}
