// Enum displays (M): formatting a constant as members of a bundled or declared enum
// (web/src/engine/enums.ts), and archive validation of the stored displays.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { constantBits, formatEnum, hexValue, type EnumDef } from '../web/src/engine/enums.ts';

const openFlags: EnumDef = {
  id: 'lib:open_flags',
  name: 'open_flags',
  kind: 'flags',
  source: 'library',
  members: [
    { name: 'O_CREAT', value: '40' },
    { name: 'O_TRUNC', value: '200' },
    { name: 'O_CLOEXEC', value: '80000' },
  ],
  fields: [{ mask: '3', members: [{ name: 'O_RDONLY', value: '0' }, { name: 'O_WRONLY', value: '1' }, { name: 'O_RDWR', value: '2' }] }],
};
const stdHandle: EnumDef = {
  id: 'lib:std_handle',
  name: 'std_handle',
  kind: 'values',
  source: 'library',
  members: [{ name: 'STD_INPUT_HANDLE', value: 'fffffff6' }, { name: 'STD_OUTPUT_HANDLE', value: 'fffffff5' }],
};
const color: EnumDef = {
  id: 'user:Color',
  name: 'Color',
  kind: 'values',
  source: 'user',
  members: [
    { name: 'RED', value: '1' },
    { name: 'GREEN', value: '2' },
    { name: 'BLUE', value: '4' },
    { name: 'NONE', value: '-1' },
  ],
};

test('flag sets spell value fields and flags, with an uncovered remainder', () => {
  assert.equal(formatEnum(openFlags, 0x241n), 'O_WRONLY | O_CREAT | O_TRUNC');
  assert.equal(formatEnum(openFlags, 0n), 'O_RDONLY');
  assert.equal(formatEnum(openFlags, 0x80002n), 'O_RDWR | O_CLOEXEC');
  assert.equal(formatEnum(openFlags, 0x1041n), 'O_WRONLY | O_CREAT | 0x1000');
});

test('value sets need an exact member; declared enums may combine members', () => {
  assert.equal(formatEnum(stdHandle, 0xfffffff6n), 'STD_INPUT_HANDLE');
  assert.equal(formatEnum(stdHandle, 3n), null);
  assert.equal(formatEnum(color, 2n), 'GREEN');
  assert.equal(formatEnum(color, 5n), 'RED | BLUE');
  assert.equal(formatEnum(color, 8n), null, 'a declared enum keeps a value no member covers');
  assert.equal(formatEnum(color, 0xffffffffn), 'NONE', 'negative members compare at the constant width');
  assert.equal(formatEnum(color, 0xffffffffffffffffn), 'NONE');
});

test('widths and value text', () => {
  assert.equal(constantBits(0xffffffffn), 32);
  assert.equal(constantBits(0x100000000n), 64);
  assert.equal(hexValue(-10n), '-a');
  assert.equal(hexValue(0x40n), '40');
});

test('a zero field value alone does not spell other bits', () => {
  assert.equal(formatEnum(openFlags, 0x8n), null);
});
