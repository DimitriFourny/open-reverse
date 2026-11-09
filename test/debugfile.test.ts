// Recognising companion debug files (dSYM DWARF, zipped .dSYM, ELF debug files, PDB).

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { DebugFileError, extractDsym, looksLikeDebugFile, readDebugFile, sniffDebugFile } from '../web/src/engine/debugfile.ts';
import { zipEncode } from '../web/src/engine/zip.ts';

const OD = new URL('../vendor/open-decomp/', import.meta.url);
const file = (path: string) => new Uint8Array(readFileSync(new URL(path, OD)));
const dsym = file('fixtures/bin/macho-arm64-symbols.dSYM/Contents/Resources/DWARF/macho-arm64-symbols');
const machoBinary = file('fixtures/bin/macho-arm64-symbols');
const universal = file('fixtures/bin/macho-universal');
const elfDebug = file('test/metadata/debug/fixtures/elf/shapes.debug');
const elfStripped = file('test/metadata/debug/fixtures/elf/shapes-stripped');
const elfWithDwarf = file('test/metadata/debug/fixtures/elf/shapes-g');
const pe = file('fixtures/bin/pe-x86_64-symbols.exe');

describe('debug files', () => {
  test('recognised by content: dSYM DWARF, ELF debug file, PDB; binaries are not debug files', () => {
    assert.equal(sniffDebugFile(dsym), 'dsym');
    assert.equal(sniffDebugFile(elfDebug), 'elf');
    assert.equal(sniffDebugFile(new TextEncoder().encode('Microsoft C/C++ MSF 7.00\r\n\x1aDS\0\0\0rest')), 'pdb');
    for (const binary of [machoBinary, universal, elfStripped, elfWithDwarf, pe, new Uint8Array(0)]) assert.equal(sniffDebugFile(binary), null);
    assert.equal(looksLikeDebugFile('shapes.debug', elfDebug), true);
    assert.equal(looksLikeDebugFile('app', machoBinary), false);
    assert.equal(looksLikeDebugFile('libfoo.so.debug', new Uint8Array(10)), true);
  });

  test('a zipped .dSYM bundle yields its one DWARF file', async () => {
    const zip = await zipEncode([
      { path: 'app.dSYM/Contents/Info.plist', data: new TextEncoder().encode('<plist/>') },
      { path: 'app.dSYM/Contents/Resources/DWARF/app', data: dsym },
    ]);
    assert.equal(sniffDebugFile(zip), 'dsym-zip');
    const inner = await extractDsym(zip);
    assert.equal(inner.name, 'app');
    assert.deepEqual(inner.bytes, dsym);
    const read = await readDebugFile('app.dSYM.zip', zip);
    assert.equal(read.kind, 'dsym');
    assert.equal(read.name, 'app');
    const two = await zipEncode([
      { path: 'a.dSYM/Contents/Resources/DWARF/a', data: dsym },
      { path: 'b.dSYM/Contents/Resources/DWARF/b', data: dsym },
    ]);
    await assert.rejects(extractDsym(two), /2 DWARF files/);
  });

  test('anything else is refused with what to add instead', async () => {
    await assert.rejects(readDebugFile('app', machoBinary), (e) => e instanceof DebugFileError && /not a debug file/.test(e.message));
    await assert.rejects(readDebugFile('app.pdb', new TextEncoder().encode('Microsoft C/C++ MSF 7.00\r\n\x1aDS\0\0\0')), /PDB/);
    assert.equal((await readDebugFile('shapes.debug', elfDebug)).kind, 'elf');
  });
});
