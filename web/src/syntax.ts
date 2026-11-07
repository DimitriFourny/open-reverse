// Minimal tokenizer for the C-like and Python-like pseudocode dialects.
// Tokens carry their absolute UTF-16 offset in the text so they line up with
// OpenDecomp's emission mappings (span_unit = utf16).

export type TokenKind = 'kw' | 'type' | 'num' | 'str' | 'comment' | 'ident' | 'call' | 'punct' | 'space' | 'pp';

export interface Token {
  kind: TokenKind;
  text: string;
  start: number;
}

const C_KEYWORDS = new Set(
  'if else while for do return break continue switch case default goto sizeof struct union enum typedef static inline extern const volatile true false NULL _Alignas __builtin_unreachable'.split(' '),
);
const PY_KEYWORDS = new Set(
  'if elif else while for in return break continue def pass and or not is None True False lambda with as match case'.split(' '),
);
const TYPE_RE = /^(void|bool|char|short|int|long|float|double|signed|unsigned|u?int(8|16|32|64|128)_t|size_t|uintptr_t|intptr_t|aligned16_uint128_t|struct_[0-9a-f]+|__uint128_t|__int128_t|pointer|u?int\d+|float\d+)$/;

export function tokenize(text: string, language: string): Token[] {
  const python = language.startsWith('python');
  const kws = python ? PY_KEYWORDS : C_KEYWORDS;
  const out: Token[] = [];
  let i = 0;
  const n = text.length;
  const push = (kind: TokenKind, end: number) => {
    out.push({ kind, text: text.slice(i, end), start: i });
    i = end;
  };
  while (i < n) {
    const c = text[i]!;
    const rest = text.slice(i, i + 2);
    if (c === '\n' || c === ' ' || c === '\t') {
      let j = i + 1;
      while (j < n && (text[j] === ' ' || text[j] === '\t')) j++;
      push('space', c === '\n' ? i + 1 : j);
    } else if (!python && rest === '/*') {
      const j = text.indexOf('*/', i + 2);
      push('comment', j < 0 ? n : j + 2);
    } else if ((!python && rest === '//') || (python && c === '#')) {
      const j = text.indexOf('\n', i);
      push('comment', j < 0 ? n : j);
    } else if (!python && c === '#' && (i === 0 || text[i - 1] === '\n')) {
      const j = text.indexOf('\n', i);
      push('pp', j < 0 ? n : j);
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1;
      push('str', Math.min(n, j + 1));
    } else if (/[0-9]/.test(c)) {
      const m = /^(0x[0-9a-fA-F]+|\d+(\.\d+)?([eE][+-]?\d+)?)[uUlLfF]*/.exec(text.slice(i, i + 40));
      push('num', i + (m ? m[0].length : 1));
    } else if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_$]/.test(text[j]!)) j++;
      const word = text.slice(i, j);
      let k = j;
      while (k < n && text[k] === ' ') k++;
      const kind: TokenKind = kws.has(word) ? 'kw' : TYPE_RE.test(word) ? 'type' : text[k] === '(' ? 'call' : 'ident';
      push(kind, j);
    } else {
      push('punct', i + 1);
    }
  }
  return out;
}

/** Split tokens into lines (newline tokens end a line and are dropped). */
export function splitLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    if (t.text === '\n') lines.push([]);
    else lines.at(-1)!.push(t);
  }
  return lines;
}
