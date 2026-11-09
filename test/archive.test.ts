// Unit tests for the ZIP container and the OpenReverse project archive
// (encode, decode, validation of hostile input).

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import {
  ARCHIVE_MANIFEST,
  ArchiveError,
  decodeProjectArchive,
  encodeProjectArchive,
  safeRelativePath,
  type ProjectArchive,
} from '../web/src/engine/archive.ts';
import { crc32, zipDecode, zipEncode, ZipError } from '../web/src/engine/zip.ts';

const enc = new TextEncoder();

function sample(): ProjectArchive {
  const binary = new Uint8Array(5000).map((_, i) => (i * 7) & 255);
  const sha256 = createHash('sha256').update(binary).digest('hex');
  const sqlite = new Uint8Array(4096);
  sqlite.set(enc.encode('SQLite format 3\0'));
  return {
    record: { id: sha256.slice(0, 16), name: 'demo.bin', sha256, size: binary.length, addedAt: '2026-01-02T03:04:05.000Z' },
    binary,
    comments: { '0x401000': 'entry point' },
    data: { defs: {}, names: {} },
    project: new Map([
      [`${sha256}.default/project.sqlite`, sqlite],
      [`${sha256}.default/images/${sha256}`, binary],
      [`${sha256}.default/artifacts/abc`, enc.encode('{"x":1}'.repeat(100))],
    ]),
  };
}

/** Rewrites one entry of an archive with new contents/name (re-encoding the zip). */
async function mutate(bytes: Uint8Array, fn: (entries: { path: string; data: Uint8Array }[]) => void): Promise<Uint8Array> {
  const entries = await zipDecode(bytes);
  fn(entries);
  return zipEncode(entries);
}

describe('zip', () => {
  test('crc32 matches the reference value', () => {
    assert.equal(crc32(enc.encode('123456789')), 0xcbf43926);
  });

  test('round trip, stored and deflated entries', async () => {
    const entries = [
      { path: 'a.txt', data: enc.encode('hello') },
      { path: 'dir/b.bin', data: new Uint8Array(100_000).fill(7) },
      { path: 'dir/ünïcode.c', data: crypto.getRandomValues(new Uint8Array(1000)) },
      { path: 'empty', data: new Uint8Array(0) },
    ];
    const zip = await zipEncode(entries);
    assert.ok(zip.length < 20_000, 'repetitive data is deflated');
    const back = await zipDecode(zip);
    assert.deepEqual(
      back.map((e) => e.path),
      entries.map((e) => e.path),
    );
    for (let i = 0; i < entries.length; i++) assert.deepEqual(back[i]!.data, entries[i]!.data);
  });

  test('readable by the system unzip', async (t) => {
    let has = true;
    try {
      execFileSync('unzip', ['-v'], { stdio: 'ignore' });
    } catch {
      has = false;
    }
    if (!has) return t.skip('unzip not installed');
    const dir = mkdtempSync(join(tmpdir(), 'or-zip-'));
    try {
      const big = new Uint8Array(50_000).map((_, i) => i % 13);
      writeFileSync(join(dir, 'x.zip'), await zipEncode([{ path: 'd/big', data: big }, { path: 'd/s.txt', data: enc.encode('hi') }]));
      execFileSync('unzip', ['-q', join(dir, 'x.zip'), '-d', join(dir, 'out')]);
      assert.deepEqual(new Uint8Array(readFileSync(join(dir, 'out/d/big'))), big);
      assert.equal(readFileSync(join(dir, 'out/d/s.txt'), 'utf8'), 'hi');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('rejects garbage, CRC damage and zip bombs', async () => {
    await assert.rejects(zipDecode(enc.encode('not a zip at all, definitely not')), ZipError);
    const zip = await zipEncode([{ path: 'a', data: new Uint8Array(1000).fill(1) }], { compress: false });
    const damaged = zip.slice();
    damaged[30 + 1 + 10] ^= 0xff; // a data byte of the stored entry
    await assert.rejects(zipDecode(damaged), /CRC mismatch/);
    // An entry that inflates beyond its declared size.
    const bomb = await zipEncode([{ path: 'b', data: new Uint8Array(1_000_000) }]);
    const view = new DataView(bomb.buffer);
    const eocd = bomb.length - 22;
    const cd = view.getUint32(eocd + 16, true);
    view.setUint32(cd + 24, 10, true); // declared uncompressed size
    await assert.rejects(zipDecode(bomb), /inflates beyond/);
    // Limits.
    await assert.rejects(zipDecode(zip, { maxEntries: 10, maxEntryBytes: 10, maxTotalBytes: 1e9 }), /too large/);
    await assert.rejects(zipDecode(zip, { maxEntries: 0, maxEntryBytes: 1e9, maxTotalBytes: 1e9 }), /Too many entries/);
  });
});

describe('project archive', () => {
  test('safeRelativePath', () => {
    assert.equal(safeRelativePath('a/b/c.sqlite'), 'a/b/c.sqlite');
    for (const bad of ['', '/etc/passwd', 'a/../b', '..', './a', 'a//b', 'a/', 'a\\b', 'C:x', 'a\0b', 'a/\nb'])
      assert.equal(safeRelativePath(bad), null, JSON.stringify(bad));
  });

  test('round trip', async () => {
    const a = sample();
    const bytes = await encodeProjectArchive(a);
    const b = await decodeProjectArchive(bytes);
    assert.deepEqual(b.record, a.record);
    assert.deepEqual(b.binary, a.binary);
    assert.deepEqual(b.comments, a.comments);
    assert.deepEqual([...b.project.keys()].sort(), [...a.project.keys()].sort());
    for (const [k, v] of a.project) assert.deepEqual(b.project.get(k), v);
    const names = (await zipDecode(bytes)).map((e) => e.path);
    assert.equal(names[0], ARCHIVE_MANIFEST);
    assert.ok(names.includes('binary/demo.bin'));
    assert.ok(names.every((n) => n === ARCHIVE_MANIFEST || n === 'comments.json' || n.startsWith('binary/') || n.startsWith('project/')));
  });

  test('data definitions: version 2 with data.json, version 1 without', async () => {
    const plain = await encodeProjectArchive(sample());
    const manifestOf = async (bytes: Uint8Array) =>
      JSON.parse(new TextDecoder().decode((await zipDecode(bytes)).find((e) => e.path === ARCHIVE_MANIFEST)!.data));
    assert.equal((await manifestOf(plain)).version, 1);
    assert.deepEqual((await decodeProjectArchive(plain)).data, { defs: {}, names: {} });
    const data = { defs: { '0x402000': { type: 'u32' as const, count: 4, od: true }, '0x402010': { type: 'string' as const, count: 6 } }, names: { '0x402000': 'table' } };
    const v2 = await encodeProjectArchive({ ...sample(), data });
    assert.equal((await manifestOf(v2)).version, 2);
    assert.ok((await zipDecode(v2)).some((e) => e.path === 'data.json'));
    assert.deepEqual((await decodeProjectArchive(v2)).data, data);
    // data.json is a version 2 entry, and is validated.
    const asV1 = await mutate(v2, (es) => {
      const e = es.find((x) => x.path === ARCHIVE_MANIFEST)!;
      e.data = enc.encode(JSON.stringify({ ...JSON.parse(new TextDecoder().decode(e.data)), version: 1 }));
    });
    await assert.rejects(decodeProjectArchive(asV1), /Unexpected entry/);
    for (const bad of ['{"defs":{"main":{"type":"u8","count":1}}}', '{"defs":{"0x1":{"type":"u128","count":1}}}', '{"defs":{"0x1":{"type":"u8","count":0}}}', '{"names":{"0x1":"a b"}}', '[]'])
      await assert.rejects(decodeProjectArchive(await mutate(v2, (es) => (es.find((e) => e.path === 'data.json')!.data = enc.encode(bad)))), ArchiveError, bad);
  });

  test('enum displays and declared enumerators travel in data.json', async () => {
    const data = {
      defs: {},
      names: {},
      enums: { '0x401005|241': 'lib:open_flags', '0x401010|2': 'user:Color' },
      enumTypes: { Color: [{ name: 'RED', value: '1' }, { name: 'NONE', value: '-1' }] },
    };
    const bytes = await encodeProjectArchive({ ...sample(), data });
    assert.deepEqual((await decodeProjectArchive(bytes)).data, data);
    for (const bad of ['{"enums":{"0x1":"lib:x"}}', '{"enums":{"0x1|2":"x"}}', '{"enumTypes":{"A":[{"name":"a b","value":"1"}]}}', '{"enumTypes":{"A":[{"name":"a","value":"0x1"}]}}'])
      await assert.rejects(decodeProjectArchive(await mutate(bytes, (es) => (es.find((e) => e.path === 'data.json')!.data = enc.encode(bad)))), ArchiveError, bad);
  });

  test('bookmarks: version 2 with bookmarks.json, version 1 without', async () => {
    const version = async (bytes: Uint8Array) =>
      JSON.parse(new TextDecoder().decode((await zipDecode(bytes)).find((e) => e.path === ARCHIVE_MANIFEST)!.data)).version;
    const plain = await encodeProjectArchive(sample());
    assert.equal(await version(plain), 1);
    assert.ok(!(await zipDecode(plain)).some((e) => e.path === 'bookmarks.json'));
    assert.deepEqual((await decodeProjectArchive(plain)).bookmarks, {});
    const marked = await encodeProjectArchive({ ...sample(), bookmarks: { '0x401000': 'start here', '0x401010': '' } });
    assert.equal(await version(marked), 2);
    assert.deepEqual((await decodeProjectArchive(marked)).bookmarks, { '0x401000': 'start here', '0x401010': '' });
    await assert.rejects(
      decodeProjectArchive(await mutate(marked, (es) => (es.find((e) => e.path === 'bookmarks.json')!.data = enc.encode('{"0x1":5}')))),
      /Invalid bookmark at 0x1/,
    );
    await assert.rejects(
      decodeProjectArchive(await mutate(marked, (es) => (es.find((e) => e.path === 'bookmarks.json')!.data = enc.encode('[]')))),
      /bookmarks.json must be an object/,
    );
  });

  test('version 2 with bookmarks and data definitions together; bookmarks.json is a version 2 entry', async () => {
    const data = { defs: { '0x402000': { type: 'ptr' as const, count: 1 } }, names: {} };
    const bytes = await encodeProjectArchive({ ...sample(), bookmarks: { '0x401000': 'entry' }, data });
    const entries = await zipDecode(bytes);
    assert.equal(JSON.parse(new TextDecoder().decode(entries.find((e) => e.path === ARCHIVE_MANIFEST)!.data)).version, 2);
    assert.ok(entries.some((e) => e.path === 'bookmarks.json') && entries.some((e) => e.path === 'data.json'));
    const back = await decodeProjectArchive(bytes);
    assert.deepEqual(back.bookmarks, { '0x401000': 'entry' });
    assert.deepEqual(back.data, data);
    const asV1 = await mutate(bytes, (es) => {
      es.splice(es.findIndex((e) => e.path === 'data.json'), 1);
      const e = es.find((x) => x.path === ARCHIVE_MANIFEST)!;
      e.data = enc.encode(JSON.stringify({ ...JSON.parse(new TextDecoder().decode(e.data)), version: 1 }));
    });
    await assert.rejects(decodeProjectArchive(asV1), /Unexpected entry in archive: "bookmarks.json"/);
  });

  test('refuses to encode unsafe project paths', async () => {
    const a = sample();
    a.project.set('../escape', new Uint8Array(1));
    await assert.rejects(encodeProjectArchive(a), ArchiveError);
  });

  test('rejects path traversal and unknown entries', async () => {
    const good = await encodeProjectArchive(sample());
    for (const path of ['project/../meta/x.json', 'project//abs', 'project/a/../../x', '/etc/passwd', 'binary/other', 'evil.txt', 'project/a\\..\\b'])
      await assert.rejects(
        decodeProjectArchive(await mutate(good, (es) => es.push({ path, data: new Uint8Array(1) }))),
        ArchiveError,
        path,
      );
  });

  test('rejects a tampered binary, record or format', async () => {
    const good = await encodeProjectArchive(sample());
    await assert.rejects(
      decodeProjectArchive(await mutate(good, (es) => (es.find((e) => e.path === 'binary/demo.bin')!.data[0] ^= 1))),
      /sha256/,
    );
    const editManifest = (edit: (m: Record<string, any>) => void) =>
      mutate(good, (es) => {
        const e = es.find((x) => x.path === ARCHIVE_MANIFEST)!;
        const m = JSON.parse(new TextDecoder().decode(e.data));
        edit(m);
        e.data = enc.encode(JSON.stringify(m));
      });
    await assert.rejects(decodeProjectArchive(await editManifest((m) => (m.version = 4))), /format version 4/);
    await assert.rejects(decodeProjectArchive(await editManifest((m) => (m.format = 'other'))), /unknown format/);
    await assert.rejects(decodeProjectArchive(await editManifest((m) => (m.record.id = '0000000000000000'))), /id does not match/);
    await assert.rejects(decodeProjectArchive(await editManifest((m) => (m.record.name = '../x'))), /Invalid binary name/);
    await assert.rejects(decodeProjectArchive(await mutate(good, (es) => es.splice(es.findIndex((e) => e.path === ARCHIVE_MANIFEST), 1))), /no open-reverse.json/);
    await assert.rejects(
      decodeProjectArchive(await mutate(good, (es) => (es.find((e) => e.path === 'comments.json')!.data = enc.encode('{"main":"x"}')))),
      /Invalid comment address/,
    );
    await assert.rejects(decodeProjectArchive(enc.encode('PK not really')), ArchiveError);
  });

  test('rejects a project.sqlite that is not SQLite, and file/dir conflicts', async () => {
    const a = sample();
    const key = [...a.project.keys()].find((k) => k.endsWith('project.sqlite'))!;
    a.project.set(key, enc.encode('#!/bin/sh\necho pwned\n'));
    await assert.rejects(decodeProjectArchive(await encodeProjectArchive(a)), /not a SQLite database/);
    const b = sample();
    b.project.set('x', new Uint8Array(1));
    b.project.set('x/y', new Uint8Array(1));
    await assert.rejects(decodeProjectArchive(await encodeProjectArchive(b)), /Conflicting paths/);
  });

  test('size limit on the archive itself', async () => {
    const bytes = await encodeProjectArchive(sample());
    await assert.rejects(
      decodeProjectArchive(bytes, { maxArchiveBytes: 100, maxEntries: 1e6, maxEntryBytes: 1e9, maxTotalBytes: 1e9 }),
      /too large/,
    );
  });

  test('debug file: version 3 with debug/<name>, verified against its record', async () => {
    const a = sample();
    const debug = new Uint8Array(3000).map((_, i) => (i * 13) & 255);
    const sha256 = createHash('sha256').update(debug).digest('hex');
    a.record = { ...a.record, debug: { name: 'demo.debug', sha256, size: debug.length, kind: 'elf', addedAt: '2026-01-02T03:04:05.000Z' } };
    a.debug = debug;
    const bytes = await encodeProjectArchive(a);
    const manifest = JSON.parse(new TextDecoder().decode((await zipDecode(bytes)).find((e) => e.path === ARCHIVE_MANIFEST)!.data));
    assert.equal(manifest.version, 3);
    const back = await decodeProjectArchive(bytes);
    assert.deepEqual(back.record.debug, a.record.debug);
    assert.deepEqual(back.debug, debug);
    // A PE's PDB travels the same way.
    const pdb = { ...a, record: { ...a.record, debug: { ...a.record.debug!, name: 'demo.pdb', kind: 'pdb' as const } } };
    const pdbBack = await decodeProjectArchive(await encodeProjectArchive(pdb));
    assert.deepEqual(pdbBack.record.debug, pdb.record.debug);
    assert.deepEqual(pdbBack.debug, debug);
    // Without a debug file nothing changes: version 1 or 2 as before, no debug entry.
    const plain = await encodeProjectArchive(sample());
    assert.ok(!(await zipDecode(plain)).some((e) => e.path.startsWith('debug/')));
    assert.equal((await decodeProjectArchive(plain)).debug, undefined);
    // Damage, a missing entry, an older version or a record without bytes are refused.
    await assert.rejects(
      decodeProjectArchive(await mutate(bytes, (es) => (es.find((e) => e.path === 'debug/demo.debug')!.data = new Uint8Array(3000)))),
      /debug file does not match/,
    );
    await assert.rejects(decodeProjectArchive(await mutate(bytes, (es) => es.splice(es.findIndex((e) => e.path === 'debug/demo.debug'), 1))), /no debug file/);
    await assert.rejects(
      decodeProjectArchive(
        await mutate(bytes, (es) => {
          const m = es.find((e) => e.path === ARCHIVE_MANIFEST)!;
          m.data = enc.encode(JSON.stringify({ ...manifest, version: 2 }));
        }),
      ),
      /needs archive version 3/,
    );
    await assert.rejects(
      decodeProjectArchive(
        await mutate(bytes, (es) => {
          const m = es.find((e) => e.path === ARCHIVE_MANIFEST)!;
          m.data = enc.encode(JSON.stringify({ ...manifest, record: { ...manifest.record, debug: { ...manifest.record.debug, name: '../x' } } }));
        }),
      ),
      /Invalid debug file record/,
    );
    await assert.rejects(encodeProjectArchive({ ...a, debug: undefined } as ProjectArchive), /needs its bytes/);
  });
});
