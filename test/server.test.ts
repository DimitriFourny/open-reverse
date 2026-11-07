// End-to-end API tests over OpenDecomp's fixture binaries (run: npm test).

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../server/app.ts';
import { canon, operandConstants, parseAddress } from '../server/hex.ts';
import { Workspace } from '../server/workspace.ts';

const FIXTURES = join(import.meta.dirname, '..', 'vendor', 'open-decomp', 'fixtures', 'bin');

describe('hex helpers', () => {
  test('canonical addresses', () => {
    assert.equal(canon('0x0000401A90'), '0x401a90');
    assert.equal(parseAddress('401A90h'), 0x401a90n);
    assert.equal(parseAddress('0x10'), 0x10n);
    assert.equal(parseAddress('main'), null);
  });
  test('operand constants', () => {
    assert.deepEqual(
      operandConstants('xmm0,[4007C0h]').map((c) => [c.text, c.value, c.inMemory]),
      [['4007C0h', 0x4007c0n, true]],
    );
    assert.deepEqual(
      operandConstants('short 000000000000F070h').map((c) => [c.value, c.inMemory]),
      [[0xf070n, false]],
    );
    assert.deepEqual(operandConstants('x0, #0x10').map((c) => c.value), [0x10n]);
    assert.deepEqual(operandConstants('rax,rbx'), []);
  });
});

describe('API', () => {
  let root: string;
  let app: FastifyInstance;
  const ids: Record<string, string> = {};
  const get = async (url: string) => {
    const res = await app.inject({ method: 'GET', url });
    assert.equal(res.statusCode, 200, `${url}: ${res.body}`);
    return res.json();
  };

  before(async () => {
    root = await mkdtemp(join(tmpdir(), 'open-reverse-test-'));
    const workspace = new Workspace(root);
    await workspace.init();
    app = await buildApp({ workspace });
    for (const name of ['elf-x86_64-symbols', 'macho-arm64-symbols', 'pe-x86_64-symbols.exe']) {
      const res = await app.inject({
        method: 'POST',
        url: `/api/binaries?name=${name}`,
        headers: { 'content-type': 'application/octet-stream' },
        payload: await readFile(join(FIXTURES, name)),
      });
      assert.equal(res.statusCode, 200, res.body);
      ids[name] = res.json().id;
    }
  });

  after(async () => {
    await app.close();
    await rm(root, { recursive: true, force: true });
  });

  test('upload is content-addressed', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/binaries?name=again',
      headers: { 'content-type': 'application/octet-stream' },
      payload: await readFile(join(FIXTURES, 'elf-x86_64-symbols')),
    });
    assert.equal(res.json().id, ids['elf-x86_64-symbols']);
    assert.equal((await get('/api/binaries')).binaries.length, 3);
  });

  test('ELF: functions, listing, decompile, xrefs, rename, comment', async () => {
    const b = `/api/b/${ids['elf-x86_64-symbols']}`;
    const info = await get(`${b}/info`);
    assert.equal(info.image.target.format, 'elf');
    const { functions } = await get(`${b}/functions`);
    const check = functions.find((f: { name: string }) => f.name === 'fixture_check');
    const maximum = functions.find((f: { name: string }) => f.name === 'fixture_maximum');
    assert.ok(check && maximum);

    const listing = await get(`${b}/functions/${check.id}/listing`);
    assert.equal(listing.instructions[0].addr, check.entry);
    assert.match(listing.instructions[0].bytes, /^[0-9a-f]+$/);
    assert.ok(listing.blocks.length > 1);
    const call = listing.instructions.find((i: { refs: { label: string }[] }) => i.refs.some((r) => r.label === 'fixture_maximum'));
    assert.ok(call, 'calls resolve to function names');
    const branch = listing.instructions.find((i: { refs: { kind: string }[] }) => i.refs.some((r) => r.kind === 'code'));
    assert.ok(branch, 'branch targets are code refs');

    const d = await get(`${b}/functions/${maximum.id}/decompile`);
    assert.match(d.text, /fixture_maximum\(/);
    assert.ok(d.mappings.length > 0);
    const addrs = new Set(d.mappings.flatMap((m: { addrs: string[] }) => m.addrs));
    assert.ok(addrs.has(maximum.entry), 'mappings resolve to instruction addresses');

    const { xrefs } = await get(`${b}/xrefs?id=${maximum.id}`);
    assert.ok(xrefs.some((x: { fromFunction: { name: string } | null }) => x.fromFunction?.name === 'fixture_check'));

    const renamed = await app.inject({ method: 'POST', url: `${b}/rename`, payload: { id: maximum.id, name: 'my_max' } });
    assert.equal(renamed.statusCode, 200, renamed.body);
    const after = await get(`${b}/functions`);
    assert.equal(after.functions.find((f: { id: string }) => f.id === maximum.id).name, 'my_max');
    const caller = await get(`${b}/functions/${check.id}/decompile`);
    assert.match(caller.text, /my_max\(/, 'callers print the new name');
    const reset = await app.inject({ method: 'POST', url: `${b}/rename`, payload: { id: maximum.id, name: '' } });
    assert.equal(reset.statusCode, 200, reset.body);
    assert.equal((await get(`${b}/functions`)).functions.find((f: { id: string }) => f.id === maximum.id).name, 'fixture_maximum');

    const bad = await app.inject({ method: 'POST', url: `${b}/rename`, payload: { id: maximum.id, name: 'not valid!' } });
    assert.equal(bad.statusCode, 400);

    const c = await app.inject({ method: 'POST', url: `${b}/comment`, payload: { addr: check.entry, text: 'hello' } });
    assert.deepEqual(c.json().comments, { [check.entry]: 'hello' });

    const mem = await get(`${b}/memory?addr=${check.entry}&length=16`);
    assert.equal(mem.segments[0].hex.length, 32);
    assert.ok((await get(`${b}/sections`)).sections.some((s: { name: string }) => s.name === '.text'));
    assert.ok((await get(`${b}/strings`)).strings.length > 0);
  });

  test('Mach-O arm64 and PE x86-64 open and decompile', async () => {
    for (const name of ['macho-arm64-symbols', 'pe-x86_64-symbols.exe']) {
      const b = `/api/b/${ids[name]}`;
      const { functions } = await get(`${b}/functions`);
      assert.ok(functions.length > 0, name);
      const fn = functions.find((f: { size: number; importStub: boolean }) => f.size > 8 && !f.importStub) ?? functions[0];
      const listing = await get(`${b}/functions/${fn.id}/listing`);
      assert.ok(listing.instructions.length > 0, name);
      const d = await get(`${b}/functions/${fn.id}/decompile`);
      assert.ok(d.text.length > 0, name);
    }
  });

  test('errors are JSON', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/b/0000000000000000/info' });
    assert.equal(res.statusCode, 404);
    assert.match(res.json().error, /Unknown binary/);
    const addr = await app.inject({ method: 'GET', url: `/api/b/${ids['elf-x86_64-symbols']}/memory?addr=zzz` });
    assert.equal(addr.statusCode, 400);
  });
});
