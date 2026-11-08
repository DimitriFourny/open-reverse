// Unit tests for opening a file from a URL: URL checks, file names, archive detection by content.

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { encodeProjectArchive } from '../web/src/engine/archive.ts';
import { zipEncode } from '../web/src/engine/zip.ts';
import { isProjectArchiveBytes, parseRemoteUrl, remoteFileName } from '../web/src/remote.ts';

describe('open from URL', () => {
  test('only http(s) URLs are accepted', () => {
    assert.equal(parseRemoteUrl(' https://example.com/a.bin ')?.href, 'https://example.com/a.bin');
    assert.ok(parseRemoteUrl('http://localhost:8080/x'));
    for (const bad of ['javascript:alert(1)', 'file:///etc/passwd', 'data:,x', '/relative', 'example.com/a', ''])
      assert.equal(parseRemoteUrl(bad), null, bad);
  });

  test('file name: Content-Disposition first, else the last path segment', () => {
    const url = new URL('https://example.com/dl/my%20tool.orproj.zip?x=1');
    assert.equal(remoteFileName(url, null), 'my tool.orproj.zip');
    assert.equal(remoteFileName(url, 'attachment; filename="ls"'), 'ls');
    assert.equal(remoteFileName(url, "attachment; filename*=UTF-8''r%C3%A9sum%C3%A9.bin; filename=x"), 'résumé.bin');
    assert.equal(remoteFileName(url, 'attachment; filename="../../etc/passwd"'), '.._.._etc_passwd');
    assert.equal(remoteFileName(new URL('https://example.com/'), null), 'example.com');
    assert.equal(remoteFileName(new URL('https://example.com/%E0%A4%A'), null), '%E0%A4%A');
  });

  test('a project archive is recognised by content, whatever its name', async () => {
    const binary = new Uint8Array(100).fill(7);
    const sha256 = createHash('sha256').update(binary).digest('hex');
    const archive = await encodeProjectArchive({
      record: { id: sha256.slice(0, 16), name: 'demo', sha256, size: binary.length, addedAt: '2026-01-01T00:00:00.000Z' },
      binary,
      comments: {},
      project: new Map(),
    });
    assert.equal(isProjectArchiveBytes(archive), true);
    // Another ZIP, a binary, garbage and nothing at all are not.
    assert.equal(isProjectArchiveBytes(await zipEncode([{ path: 'readme.txt', data: new Uint8Array(3) }])), false);
    assert.equal(isProjectArchiveBytes(readFileSync('vendor/open-decomp/fixtures/bin/elf-x86_64-symbols')), false);
    assert.equal(isProjectArchiveBytes(new Uint8Array([0x50, 0x4b, 3, 4, ...new Uint8Array(40)])), false);
    assert.equal(isProjectArchiveBytes(new Uint8Array()), false);
  });
});
