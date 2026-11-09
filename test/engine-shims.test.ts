// Unit tests for the browser engine's Node shims (VFS, node:fs, node:sqlite,
// node:crypto, child_process). In Node the VFS runs without IndexedDB.

import assert from 'node:assert/strict';
import { createHash as nodeHash } from 'node:crypto';
import { before, describe, test } from 'node:test';
import { createHash, hash } from '../web/src/engine/shims/crypto.ts';
import * as fs from '../web/src/engine/shims/fs.ts';
import { DatabaseSync, initSqlite } from '../web/src/engine/shims/sqlite.ts';
import { zstdCompressSync, zstdDecompressSync } from '../web/src/engine/shims/zlib.ts';
import { vfs } from '../web/src/engine/vfs.ts';

describe('vfs + node:fs shim', () => {
  test('files, directories, stats', () => {
    fs.mkdirSync('/t/a/b', { recursive: true });
    fs.writeFileSync('/t/a/b/x.txt', 'hello');
    assert.equal(fs.readFileSync('/t/a/b/x.txt', 'utf8'), 'hello');
    assert.ok(fs.existsSync('/t/a'));
    assert.ok(fs.statSync('/t/a').isDirectory());
    assert.equal(fs.statSync('/t/a/b/x.txt').size, 5);
    assert.equal(typeof fs.statSync('/t/a/b/x.txt', { bigint: true }).size, 'bigint');
    assert.deepEqual(fs.readdirSync('/t/a/b'), ['x.txt']);
    assert.equal(fs.realpathSync('/t/a/../a/b'), '/t/a/b');
    assert.throws(() => fs.readFileSync('/t/missing'), { code: 'ENOENT' });
    assert.throws(() => fs.mkdirSync('/t/a'), { code: 'EEXIST' });
  });

  test('descriptors: exclusive create, positional write/read, fsync, rename', () => {
    const fd = fs.openSync('/t/tmp', fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
    assert.throws(() => fs.openSync('/t/tmp', 'wx'), { code: 'EEXIST' });
    const data = new Uint8Array(10000).map((_, i) => i & 255);
    let written = 0;
    while (written < data.length) written += fs.writeSync(fd, data, written, Math.min(3000, data.length - written));
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fs.renameSync('/t/tmp', '/t/final');
    assert.ok(!fs.existsSync('/t/tmp'));
    const r = fs.openSync('/t/final', fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    assert.equal(fs.fstatSync(r).size, 10000);
    const buf = new Uint8Array(100);
    assert.equal(fs.readSync(r, buf, 0, 100, 5000), 100);
    assert.equal(buf[0], 5000 & 255);
    fs.closeSync(r);
  });

  test('promises API reads in chunks', async () => {
    const h = await fs.promises.open('/t/final', fs.constants.O_RDONLY);
    const b = new Uint8Array(4096);
    let total = 0;
    for (;;) {
      const { bytesRead } = await h.read(b, 0, b.length, total);
      if (bytesRead === 0) break;
      total += bytesRead;
    }
    await h.close();
    assert.equal(total, 10000);
  });

  test('cp, rm -r', () => {
    fs.cpSync('/t/a', '/t/c', { recursive: true });
    assert.equal(fs.readFileSync('/t/c/b/x.txt', 'utf8'), 'hello');
    fs.rmSync('/t/c', { recursive: true, force: true });
    assert.ok(!fs.existsSync('/t/c/b/x.txt'));
    fs.rmSync('/t/nope', { force: true });
  });
});

describe('node:sqlite shim', () => {
  before(async () => {
    await initSqlite();
  });

  test('statements, blobs, transactions, persistence through the VFS', () => {
    fs.mkdirSync('/db', { recursive: true });
    const db = new DatabaseSync('/db/p.sqlite', { timeout: 1000 });
    db.exec('PRAGMA locking_mode=EXCLUSIVE; PRAGMA foreign_keys=ON; BEGIN EXCLUSIVE; COMMIT; PRAGMA journal_mode=WAL;');
    db.exec('CREATE TABLE r(id TEXT PRIMARY KEY, n INTEGER NOT NULL, payload BLOB) STRICT');
    assert.ok(fs.existsSync('/db/p.sqlite'), 'opening creates the file');
    const ins = db.prepare('INSERT INTO r VALUES (?,?,?)');
    db.exec('BEGIN');
    assert.equal(db.isTransaction, true);
    for (let i = 0; i < 100; i++) ins.run(`k${i}`, i, new Uint8Array([i, i + 1]));
    db.exec('COMMIT');
    assert.equal(db.isTransaction, false);
    const row = db.prepare('SELECT * FROM r WHERE id=?').get('k7')!;
    assert.equal(row.n, 7);
    assert.deepEqual([...(row.payload as Uint8Array)], [7, 8]);
    assert.equal(db.prepare('SELECT * FROM r WHERE id=?').get('none'), undefined);
    assert.equal([...db.prepare('SELECT id FROM r WHERE n>=? ORDER BY n').iterate(95)].length, 5);
    assert.equal(db.prepare('SELECT count(*) AS c FROM r').get()!.c, 100);
    assert.equal(db.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get()!.busy, 0);
    // A second connection shares the same database.
    const probe = new DatabaseSync('/db/p.sqlite', { readOnly: true });
    assert.equal(probe.prepare('SELECT count(*) AS c FROM r').get()!.c, 100);
    probe.close();
    db.close();
    // Closed: the bytes are in the VFS file; reopening restores them.
    assert.ok(fs.statSync('/db/p.sqlite').size > 0);
    const again = new DatabaseSync(new URL('file:///db/p.sqlite'));
    assert.equal(again.prepare('SELECT n FROM r WHERE id=?').get('k99')!.n, 99);
    // A live database's bytes can be copied (snapshot) without closing it.
    again.prepare('INSERT INTO r VALUES (?,?,NULL)').run('late', 1);
    fs.cpSync('/db/p.sqlite', '/db/copy.sqlite');
    const copy = new DatabaseSync('/db/copy.sqlite');
    assert.equal(copy.prepare('SELECT count(*) AS c FROM r').get()!.c, 101);
    copy.close();
    again.close();
    // An open database is held once (in SQLite); closing it unchanged gives its bytes back.
    const unchanged = new DatabaseSync('/db/copy.sqlite');
    assert.equal(vfs.get('/db/copy.sqlite')!.data.length, 0, 'the VFS node drops its copy while live');
    assert.ok(fs.statSync('/db/copy.sqlite').size > 0, 'a live file reports the database size');
    unchanged.close();
    assert.ok(vfs.get('/db/copy.sqlite')!.data.length > 0);
    const reread = new DatabaseSync('/db/copy.sqlite', { readOnly: true });
    assert.equal(reread.prepare('SELECT count(*) AS c FROM r').get()!.c, 101);
    reread.close();
  });

  test('values bind and read back as node:sqlite gives them', () => {
    const db = new DatabaseSync(':memory:');
    db.exec('CREATE TABLE v(t TEXT, i INTEGER, f REAL, b BLOB)');
    const ins = db.prepare('INSERT INTO v VALUES (?,?,?,?)');
    ins.run('é€😀 text', 2 ** 40, 1.5, new Uint8Array([1, 2, 3]));
    ins.run('', -(2n ** 62n), 2, new Uint8Array(0));
    ins.run(null, -7, null, null);
    db.prepare('INSERT INTO v VALUES (:t, @i, $f, :b)').run({ t: 'named', '@i': 2 ** 31, $f: 0.25, b: null });
    const rows = db.prepare('SELECT * FROM v').all();
    assert.deepEqual(rows[0], { t: 'é€😀 text', i: 2 ** 40, f: 1.5, b: new Uint8Array([1, 2, 3]) });
    assert.deepEqual(rows[1], { t: '', i: -(2n ** 62n), f: 2, b: new Uint8Array(0) });
    assert.deepEqual(rows[2], { t: null, i: -7, f: null, b: null });
    assert.deepEqual(rows[3], { t: 'named', i: 2 ** 31, f: 0.25, b: null });
    const big = db.prepare('SELECT i, f FROM v WHERE t=?');
    big.setReadBigInts(true);
    assert.deepEqual(big.get('named'), { i: 2n ** 31n, f: 0.25 });
    assert.throws(() => db.prepare('SELECT ?').get(2n ** 64n), /too big/);
    assert.throws(() => db.prepare('SELECT :a').get({ b: 1 }), /parameter name/);
    db.close();
  });

  test('rename and unlink of a live database', () => {
    const db = new DatabaseSync('/db/a.sqlite');
    db.exec('CREATE TABLE t(x)');
    db.prepare('INSERT INTO t VALUES (?)').run(42);
    fs.renameSync('/db/a.sqlite', '/db/b.sqlite');
    db.close();
    const b = new DatabaseSync('/db/b.sqlite');
    assert.equal(b.prepare('SELECT x FROM t').get()!.x, 42);
    b.close();
    assert.ok(vfs.live.size === 0, 'no live handles remain');
  });
});

describe('crypto + zlib shims', () => {
  test('sha256 matches node:crypto', () => {
    for (const input of ['', 'abc', 'x'.repeat(100000)]) {
      assert.equal(createHash('sha256').update(input).digest('hex'), nodeHash('sha256').update(input).digest('hex'));
      assert.equal(hash('sha256', input), nodeHash('sha256').update(input).digest('hex'));
    }
    const h = createHash('sha256').update('a');
    const copy = h.copy().update('b');
    assert.equal(copy.digest('hex'), nodeHash('sha256').update('ab').digest('hex'));
    assert.equal(h.digest('hex'), nodeHash('sha256').update('a').digest('hex'));
    // Every padding case (lengths around the 55/56/64-byte block boundaries), UTF-8 text,
    // byte input in uneven pieces, and the other output encodings.
    for (let n = 0; n < 200; n++) {
      const text = 'é€x'.repeat(n).slice(0, n);
      assert.equal(hash('sha256', text), nodeHash('sha256').update(text).digest('hex'), `length ${n}`);
    }
    const bytes = Uint8Array.from({ length: 70_000 }, (_, i) => (i * 7919) & 255);
    const pieces = createHash('sha256');
    for (let at = 0, step = 1; at < bytes.length; at += step, step = (step * 3 + 1) % 997) pieces.update(bytes.subarray(at, at + step));
    assert.equal(pieces.digest('hex'), nodeHash('sha256').update(bytes).digest('hex'));
    assert.equal(createHash('sha256').update('abc').digest('base64'), nodeHash('sha256').update('abc').digest('base64'));
    assert.deepEqual([...(createHash('sha256').update('616263', 'hex').digest() as Uint8Array)], [...nodeHash('sha256').update('abc').digest()]);
  });
  test('zstd shim round-trips and rejects foreign payloads', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    assert.deepEqual([...zstdDecompressSync(zstdCompressSync(data))], [...data]);
    assert.throws(() => zstdDecompressSync(new Uint8Array([0x28, 0xb5, 0x2f, 0xfd])));
  });
});
