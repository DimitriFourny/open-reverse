// Undo/redo history (web/src/undo.ts) and the bookmark list's function offsets (run: npm test).

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { UndoHistory, type UndoEntry } from '../web/src/undo.ts';
import { functionOffset } from '../web/src/util.ts';

/** An edit of a shared value, the way the store records one: previous and next value. */
function edit(state: { value: string }, label: string, previous: string, next: string, log: string[] = []): UndoEntry {
  state.value = next;
  return {
    label,
    undo: async () => {
      log.push(`undo ${label}`);
      state.value = previous;
    },
    redo: async () => {
      log.push(`redo ${label}`);
      state.value = next;
    },
  };
}

describe('undo history', () => {
  test('undo and redo walk the edits in order', async () => {
    const h = new UndoHistory();
    const s = { value: 'a' };
    h.record(edit(s, 'one', 'a', 'b'));
    h.record(edit(s, 'two', 'b', 'c'));
    assert.equal((await h.undo())?.label, 'two');
    assert.equal(s.value, 'b');
    assert.equal((await h.undo())?.label, 'one');
    assert.equal(s.value, 'a');
    assert.equal(await h.undo(), null);
    assert.equal((await h.redo())?.label, 'one');
    assert.equal((await h.redo())?.label, 'two');
    assert.equal(s.value, 'c');
    assert.equal(await h.redo(), null);
  });

  test('a new edit drops what could be redone', async () => {
    const h = new UndoHistory();
    const s = { value: 'a' };
    h.record(edit(s, 'one', 'a', 'b'));
    await h.undo();
    h.record(edit(s, 'other', 'a', 'z'));
    assert.equal(await h.redo(), null);
    assert.equal((await h.undo())?.label, 'other');
    assert.equal(s.value, 'a');
  });

  test('concurrent requests run one at a time, in order', async () => {
    const h = new UndoHistory();
    const s = { value: 'a' };
    const log: string[] = [];
    h.record(edit(s, 'one', 'a', 'b', log));
    h.record(edit(s, 'two', 'b', 'c', log));
    const results = await Promise.all([h.undo(), h.undo(), h.redo(), h.undo()]);
    assert.deepEqual(
      results.map((e) => e?.label),
      ['two', 'one', 'one', 'one'],
    );
    assert.deepEqual(log, ['undo two', 'undo one', 'redo one', 'undo one']);
    assert.equal(s.value, 'a');
  });

  test('a failed undo stays in the history', async () => {
    const h = new UndoHistory();
    let fail = true;
    h.record({
      label: 'flaky',
      undo: async () => {
        if (fail) throw new Error('engine busy');
      },
      redo: async () => undefined,
    });
    await assert.rejects(h.undo(), /engine busy/);
    assert.equal(await h.redo(), null);
    fail = false;
    assert.equal((await h.undo())?.label, 'flaky');
  });
});

describe('functionOffset', () => {
  const fns = [
    { name: 'a', entry: '0x1000', size: 0x10 },
    { name: 'b', entry: '0x1010', size: 0x20 },
    { name: 'c', entry: '0x2000', size: 4 },
  ];
  test('inside, at the entry and outside every function', () => {
    assert.equal(functionOffset(fns, '0x1000'), 'a');
    assert.equal(functionOffset(fns, '0x100f'), 'a+0xf');
    assert.equal(functionOffset(fns, '0x1024'), 'b+0x14');
    assert.equal(functionOffset(fns, '0x1030'), null);
    assert.equal(functionOffset(fns, '0x2003'), 'c+0x3');
    assert.equal(functionOffset(fns, '0xfff'), null);
    assert.equal(functionOffset([], '0x1000'), null);
  });
});
