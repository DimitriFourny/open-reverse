// Binary search, operand value search and the navigation band's map (web/src/engine/search.ts),
// and the C spelling of demangled names (run: npm test).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  buildNavMap,
  findAll,
  MAX_HITS,
  NAV_KINDS,
  navAddress,
  navFraction,
  operandValues,
  parseBytePattern,
  parseImmediate,
  runSearch,
  sameValue,
  SearchError,
  textPattern,
  type SearchSource,
} from '../web/src/engine/search.ts';
import { noTask, type TaskProgress } from '../web/src/engine/tasks.ts';
import { cIdentifier } from '../web/src/util.ts';

const bytes = (...b: number[]) => Uint8Array.from(b);
const hits = (buf: Uint8Array, p: ReturnType<typeof parseBytePattern>) => {
  const out: number[] = [];
  findAll(buf, p, 0, buf.length, (i) => void out.push(i));
  return out;
};

describe('byte patterns', () => {
  test('spaced, contiguous and wildcard spellings', () => {
    for (const text of ['48 8B ?? 05', '488B??05', '48 8b ? 05', '0x48 0x8b ?? 0x05']) {
      const p = parseBytePattern(text);
      assert.deepEqual([...p.values], [0x48, 0x8b, 0, 0x05], text);
      assert.deepEqual(p.mask, [true, true, false, true], text);
    }
  });
  test('rejects what is not a pattern', () => {
    assert.throws(() => parseBytePattern('48 8'), SearchError);
    assert.throws(() => parseBytePattern('zz'), SearchError);
    assert.throws(() => parseBytePattern('?? ??'), SearchError);
    assert.throws(() => parseBytePattern(''), SearchError);
  });
  test('finds every match, wildcards included, also a pattern starting with a wildcard', () => {
    const buf = bytes(0x48, 0x8b, 0x11, 0x05, 0x48, 0x8b, 0x22, 0x05, 0x48, 0x8b, 0x33);
    assert.deepEqual(hits(buf, parseBytePattern('48 8B ?? 05')), [0, 4]);
    assert.deepEqual(hits(buf, parseBytePattern('?? 05')), [2, 6]);
    // A match may not run past the buffer.
    assert.deepEqual(hits(buf, parseBytePattern('48 8b 33 00')), []);
  });
  test('matches must start before `to`, may end after it', () => {
    const buf = bytes(1, 2, 3, 1, 2, 3);
    const out: number[] = [];
    findAll(buf, parseBytePattern('02 03'), 0, 2, (i) => void out.push(i));
    assert.deepEqual(out, [1]);
  });
});

describe('text patterns', () => {
  test('ASCII folds letters unless case-sensitive', () => {
    const buf = new TextEncoder().encode('xx Conflicting CONFLICTING conflicting');
    assert.deepEqual(hits(buf, textPattern('conflicting', 'ascii', false)), [3, 15, 27]);
    assert.deepEqual(hits(buf, textPattern('Conflicting', 'ascii', true)), [3]);
  });
  test('UTF-16LE', () => {
    const s = 'aéOk';
    const buf = new Uint8Array([0, 0, ...[...s].flatMap((c) => [c.charCodeAt(0) & 0xff, c.charCodeAt(0) >> 8])]);
    assert.deepEqual(hits(buf, textPattern('ok', 'utf16', false)), [6]);
    assert.deepEqual(hits(buf, textPattern('ok', 'utf16', true)), []);
    assert.deepEqual(hits(buf, textPattern('éO', 'utf16', true)), [4]);
  });
});

describe('immediate values', () => {
  test('parses hex and decimal', () => {
    assert.equal(parseImmediate('0x862'), 0x862n);
    assert.equal(parseImmediate('862h'), 0x862n);
    assert.equal(parseImmediate('2146'), 2146n);
    assert.equal(parseImmediate('-8'), -8n);
    assert.equal(parseImmediate('#0x10'), 16n);
    assert.throws(() => parseImmediate('rax'), SearchError);
  });
  test('reads operand constants of both syntaxes, not register numbers', () => {
    assert.deepEqual(operandValues('esi,862h'), [0x862n]);
    assert.deepEqual(operandValues('x0, x1, #0x862'), [0x862n]);
    assert.deepEqual(operandValues('dword ptr [rsp+70h],7'), [0x70n, 7n]);
    assert.deepEqual(operandValues('[rbp-8]'), [-8n]);
    assert.deepEqual(operandValues('x29, x30, [sp, #-0x10]!'), [-0x10n]);
    assert.deepEqual(operandValues('w8, #2146'), [2146n]);
    assert.deepEqual(operandValues('xmm0,xmm1'), []);
  });
  test('two\'s complement spellings are the same value', () => {
    assert.ok(sameValue(-1n, 0xffffffffn));
    assert.ok(sameValue(-1n, 0xffffffffffffffffn));
    assert.ok(sameValue(0x862n, 0x862n));
    assert.ok(!sameValue(0x10n, 0x100000010n));
    assert.ok(!sameValue(1n, 2n));
  });
});

/** An image with two sections and three functions, for runSearch. */
function source(): SearchSource {
  const text = new Uint8Array(0x30000).fill(0x90);
  text.set([0x48, 0x8b, 0x05, 0x05], 0x10);
  text.set([0x48, 0x8b, 0x07, 0x05], 0xfffe); // across a 64 KiB read
  const data = new TextEncoder().encode('\0Conflicting options\0conflicting\0');
  const mem = [
    { start: 0x1000n, bytes: text },
    { start: 0x80000n, bytes: data },
  ];
  return {
    regions: async () => [
      { name: '.text', start: 0x1000n, size: text.length, fileSize: text.length, exec: true },
      { name: '.data', start: 0x80000n, size: data.length, fileSize: data.length, exec: false },
      { name: '.bss', start: 0x90000n, size: 0x1000, fileSize: 0, exec: false },
    ],
    read: async (addr, length) => {
      const m = mem.find((x) => addr >= x.start && addr < x.start + BigInt(x.bytes.length))!;
      const off = Number(addr - m.start);
      return [{ start: addr, bytes: m.bytes.subarray(off, off + length) }];
    },
    functions: async () => [
      { id: 'f1', name: 'main', entry: '0x1000' },
      { id: 'f2', name: 'helper', entry: '0x2000' },
    ],
    instructions: async (id) =>
      id === 'f1'
        ? [
            { addr: '0x1000', mnemonic: 'mov', operands: 'esi,862h' },
            { addr: '0x1005', mnemonic: 'call', operands: '0000000000002000h' },
          ]
        : [{ addr: '0x2000', mnemonic: 'cmp', operands: 'w0, #0x862' }],
  };
}

describe('runSearch', () => {
  test('bytes, across read boundaries, with previews', async () => {
    const r = await runSearch(source(), { mode: 'bytes', text: '48 8B ?? 05' }, noTask());
    assert.deepEqual(r.hits.map((h) => h.addr), ['0x1010', '0x10ffe']);
    assert.equal(r.hits[0]!.preview.slice(0, 11), '48 8b 05 05');
    assert.equal(r.truncated, false);
  });
  test('text in both encodings, case-insensitive', async () => {
    const r = await runSearch(source(), { mode: 'text', text: 'conflicting' }, noTask());
    assert.deepEqual(r.hits.map((h) => [h.addr, h.kind, h.preview]), [
      ['0x80001', 'ascii', 'Conflicting options'],
      ['0x80015', 'ascii', 'conflicting'],
    ]);
  });
  test('immediate, every function, streamed as progress items', async () => {
    const reports: TaskProgress[] = [];
    const ctx = { signal: new AbortController().signal, progress: (p: TaskProgress) => void reports.push(p) };
    const r = await runSearch(source(), { mode: 'immediate', text: '0x862' }, ctx);
    assert.deepEqual(r.hits.map((h) => [h.addr, h.fn?.name, h.preview]), [
      ['0x1000', 'main', 'mov esi,862h'],
      ['0x2000', 'helper', 'cmp w0, #0x862'],
    ]);
    assert.equal(reports.flatMap((p) => p.items ?? []).length, 2);
    assert.equal(reports.at(-1)!.done, 2);
  });
  test('stops at the hit limit', async () => {
    const r = await runSearch(source(), { mode: 'bytes', text: '90' }, noTask());
    assert.equal(r.hits.length, MAX_HITS);
    assert.equal(r.truncated, true);
  });
  test('cancellation', async () => {
    const abort = new AbortController();
    abort.abort();
    await assert.rejects(runSearch(source(), { mode: 'immediate', text: '1' }, { signal: abort.signal, progress: () => undefined }));
  });
});

describe('navigation map', () => {
  const regions = [
    { name: '.text', start: 0x1000n, size: 0x1000, fileSize: 0x1000, exec: true },
    { name: '.data', start: 0x100000n, size: 0x1000, fileSize: 0x1000, exec: false },
  ];
  test('regions laid end to end; kinds by majority', () => {
    const map = buildNavMap(regions, [
      { start: 0x1000n, size: 0x800, kind: 'code' },
      { start: 0x100000n, size: 0x300, kind: 'string' },
    ], 8);
    assert.equal(map.total, 0x2000);
    assert.deepEqual(map.regions.map((r) => r.offset), [0, 0x1000]);
    const k = map.kinds.map((i) => NAV_KINDS[i]);
    assert.deepEqual(k, ['code', 'code', 'unexplored', 'unexplored', 'string', 'data', 'data', 'data']);
  });
  test('an item stays in the region it starts in', () => {
    // A function whose ranges sum past its section's end must not paint the next section.
    const map = buildNavMap(regions, [{ start: 0x1000n, size: 0x1800, kind: 'code' }], 8);
    assert.deepEqual(map.kinds.map((i) => NAV_KINDS[i]), ['code', 'code', 'code', 'code', 'data', 'data', 'data', 'data']);
  });
  test('addresses to and from strip positions', () => {
    const map = buildNavMap(regions, [], 8);
    assert.equal(navFraction(map, '0x1800'), 0.25);
    assert.equal(navFraction(map, '0x100000'), 0.5);
    assert.equal(navFraction(map, '0x5000'), null);
    assert.equal(navAddress(map, 0.75)!.addr, '0x100800');
    assert.equal(navAddress(map, 0)!.region.name, '.text');
    assert.equal(navAddress(map, 1)!.addr, '0x100fff');
  });
  test('overlapping regions are clipped', () => {
    const map = buildNavMap([...regions, { name: 'dup', start: 0x1800n, size: 0x1000, fileSize: 0, exec: true }], [], 8);
    assert.deepEqual(map.regions.map((r) => [r.name, r.start, r.size]), [
      ['.text', '0x1000', 0x1000],
      ['dup', '0x2000', 0x800],
      ['.data', '0x100000', 0x1000],
    ]);
  });
});

describe('demangled names in pseudocode', () => {
  test('the C identifier OpenDecomp prints for a demangled name', () => {
    assert.equal(cIdentifier('geom::area(int, int)'), 'geom__area_int__int_');
    assert.equal(cIdentifier('operator new(unsigned long)'), 'operator_new_unsigned_long_');
    assert.equal(cIdentifier('std::__throw_logic_error(char const*)'), 'std____throw_logic_error_char_const__');
    assert.equal(cIdentifier('main'), 'main');
    assert.equal(cIdentifier('x'.repeat(80)).length, 64);
  });
});
