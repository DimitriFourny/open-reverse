// End-to-end test of the static build in a real browser (Chromium via Playwright).
//
//   npm run build && npm run preview -- --port 5199 &
//   npm run test:e2e            # needs `npm i -D playwright && npx playwright install chromium`
//
// Env: OPEN_REVERSE_URL (default http://localhost:5199/), STRIPPED_BINARY (default /bin/ls, skipped if absent),
// SSHPASS_BINARY (an arm64 Mach-O sshpass with an `args` global, default /tmp/sshpass, skipped if absent),
// PLAYWRIGHT_PATH (a playwright package directory, when it is not installed here), E2E_TMP (scratch directory),
// E2E_LOG (a file to write a timestamped trace to: console messages, workers, toasts, task panel, failures in full).
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeProjectArchive } from '../../web/src/engine/archive.ts';
import { zipDecode, zipEncode } from '../../web/src/engine/zip.ts';

let chromium;
try {
  ({ chromium } = process.env.PLAYWRIGHT_PATH ? createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH) : await import('playwright'));
} catch {
  console.error('playwright is not installed: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const TMP = process.env.E2E_TMP ?? join(tmpdir(), `open-reverse-e2e-${process.pid}`);
mkdirSync(TMP, { recursive: true });
const FIX = fileURLToPath(new URL('../../vendor/open-decomp/fixtures/bin/', import.meta.url));
// OpenDecomp's ELF debug-info fixtures (shapes.c: stripped image + objcopy --only-keep-debug file).
const ELFDBG = fileURLToPath(new URL('../../vendor/open-decomp/test/metadata/debug/fixtures/elf/', import.meta.url));
// OpenDecomp's Objective-C test inputs (test/metadata/fixtures/objc-foundation.m, built with objc_msgSend + __objc_selrefs).
const OBJC = fileURLToPath(new URL('../../vendor/open-decomp/test/metadata/fixtures/objc-foundation-classic', import.meta.url));
const URL_ = process.env.OPEN_REVERSE_URL ?? 'http://localhost:5199/';
const STRIPPED = process.env.STRIPPED_BINARY ?? '/bin/ls';
const SSHPASS = process.env.SSHPASS_BINARY ?? '/tmp/sshpass';
let failures = 0;
// A promise a step left behind must fail the run, not crash it before the other steps.
process.on('unhandledRejection', (e) => {
  failures++;
  console.log(`FAIL unhandled rejection: ${String(e?.message ?? e).split('\n')[0]}`);
});
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
  // With E2E_LOG, the page reports toasts and task-panel changes to the trace.
  if (process.env.E2E_LOG)
    await ctx.addInitScript(() => {
      let panel = null;
      new MutationObserver(() => {
        for (const t of document.querySelectorAll('.toast:not([data-traced])')) {
          t.setAttribute('data-traced', '');
          console.debug(`[e2e] toast: ${t.textContent}`);
        }
        const now = document.querySelector('.task-panel .task-phase')?.textContent ?? null;
        if (now !== panel) console.debug(`[e2e] task panel: ${(panel = now)}`);
      }).observe(document, { subtree: true, childList: true, characterData: true });
    });
  let page = await ctx.newPage();
  const errors = [];
  const t0 = Date.now();
  const trace = (text) => process.env.E2E_LOG && appendFileSync(process.env.E2E_LOG, `[${((Date.now() - t0) / 1000).toFixed(1)}] ${text}\n`);
  /** Live Web Workers per page: the engine, plus each open binary's request-worker helpers. */
  const workers = new Map();
  const watch = (p) => {
    p.on('pageerror', (e) => (errors.push(`pageerror: ${e}`), trace(`pageerror: ${e}`)));
    p.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 300));
      trace(`console.${m.type()}: ${m.text().slice(0, 600)}`);
    });
    p.on('crash', () => (errors.push('page crashed'), trace('PAGE CRASHED')));
    workers.set(p, 0);
    p.on('worker', (w) => {
      workers.set(p, workers.get(p) + 1);
      trace(`worker started ${w.url()}`);
      w.on('close', () => (workers.set(p, workers.get(p) - 1), trace(`worker closed ${w.url()}`)));
    });
    p.on('download', (d) => trace(`download ${d.suggestedFilename()}`));
  };
  watch(page);
  const step = async (name, fn) => {
    const t = Date.now();
    trace(`step ${name}`);
    try {
      await fn();
      console.log(`ok   ${name} (${Date.now() - t} ms)`);
    } catch (e) {
      failures++;
      // Playwright's call log says what an action waited for (the element, its state).
      const [first, ...log] = e.message.split('\n');
      const waited = log.filter((l) => /^\s+- /.test(l)).slice(-3).map((l) => l.trim().slice(2));
      console.log(`FAIL ${name}: ${first}${waited.length ? ` [${waited.join('; ')}]` : ''}`);
      trace(`FAIL ${name}: ${e.message}`);
    }
  };

  await page.goto(URL_);
  await step('upload ELF + decompile', async () => {
    await page.setInputFiles('input[type=file]', FIX + 'elf-x86_64-symbols');
    await page.locator('.side-item', { hasText: 'fixture_maximum' }).click();
    await page.waitForSelector('.pline:has-text("fixture_maximum")', { timeout: 120000 });
  });
  await step('rename via N', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'my_max');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.active:has-text("my_max")', { timeout: 60000 });
  });
  await step('caller shows new name', async () => {
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
    await page.waitForSelector('.pline:has-text("my_max(")', { timeout: 120000 });
  });
  await step('rename a parameter from the pseudocode via N', async () => {
    await page.locator('.side-item', { hasText: 'my_max' }).click();
    // The fixture's DWARF names the parameters (`a`, `b`); a rename still wins.
    await page.locator('.pane-pseudo .tok.t-var').filter({ hasText: /^a$/ }).first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'lhs');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("my_max(int32_t lhs")', { timeout: 120000 });
    await page.waitForSelector('.pline:has-text("lhs > b")');
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
  });
  await step('comment', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press(';');
    await page.fill('.modal-input', 'persisted comment');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.user-comment:has-text("persisted comment")');
  });
  await step('reload keeps project, rename and comment', async () => {
    await page.waitForTimeout(4000); // debounced IndexedDB flush
    await page.close();
    page = await ctx.newPage();
    watch(page);
    await page.goto(URL_);
    await page.locator('.recent-item', { hasText: 'elf-x86_64-symbols' }).click();
    await page.waitForSelector('.side-item:has-text("my_max")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
    await page.waitForSelector('.user-comment:has-text("persisted comment")', { timeout: 60000 });
    await page.waitForSelector('.pline:has-text("my_max(")', { timeout: 120000 });
  });
  // Code-view UX (fixture_check: 66 blocks, many branches).
  const cursorAddr = () => page.locator('.row.cursor .addr, .gline.cursor .addr').first().textContent();
  await step('linear: branch arrows', async () => {
    await page.waitForSelector('.arrow-gutter .larrow');
    const n = await page.locator('.larrow').count();
    if (n < 3) throw new Error(`only ${n} arrows`);
  });
  await step('linear: keyboard navigation', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    const start = await cursorAddr();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowDown');
    const third = await page.locator('.row.insn.cur-fn .addr').nth(3).textContent();
    if ((await cursorAddr()) !== third) throw new Error(`Down x3 landed on ${await cursorAddr()}, want ${third}`);
    await page.keyboard.press('End');
    await page.waitForSelector('.row.cursor .mn-ret');
    await page.keyboard.press('PageUp');
    await page.keyboard.press('Home');
    if ((await cursorAddr()) !== start) throw new Error('Home did not return to the entry');
  });
  await step('token highlight with register aliases', async () => {
    await page.locator('.row.insn.cur-fn [data-k="r:ax"]').first().click();
    const seen = await page.$$eval('.code-scroll [data-k="r:ax"]', (els) => ({
      lit: els.every((e) => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'),
      texts: [...new Set(els.map((e) => e.textContent))],
    }));
    if (!seen.lit || seen.texts.length < 2) throw new Error(`highlight ${JSON.stringify(seen)}`);
    await page.locator('.row.insn.cur-fn .addr').first().click();
    if (await page.locator('style', { hasText: 'data-k' }).count()) throw new Error('click on a line did not clear the highlight');
  });
  await step('Enter follows a call, Esc returns', async () => {
    await page.locator('.row.insn.cur-fn', { has: page.locator('.mn-call') }).first().click();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.active:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.keyboard.press('Escape');
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
  });
  await step('find in disassembly and pseudocode', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Control+f');
    await page.keyboard.type('cmp');
    await page.waitForFunction(() => /^\d+\/\d+$/.test(document.querySelector('.pane-main .find-count')?.textContent ?? ''));
    await page.keyboard.press('Enter');
    await page.waitForSelector('.row.cursor .mn:text-is("cmp")');
    await page.keyboard.press('Escape');
    await page.waitForSelector('.find-bar', { state: 'detached' });
    await page.locator('.pline').nth(5).click();
    await page.keyboard.press('Control+f');
    await page.keyboard.type('return');
    await page.waitForFunction(() => /^\d+\/\d+$/.test(document.querySelector('.pane-pseudo .find-count')?.textContent ?? ''));
    await page.keyboard.press('Escape');
  });
  await step('graph: minimap, edge highlight, keys', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Space');
    await page.waitForSelector('.minimap');
    const before = await cursorAddr();
    for (let i = 0; i < 25; i++) await page.keyboard.press('ArrowDown');
    if ((await cursorAddr()) === before) throw new Error('Down did not move in the graph');
    await page.waitForSelector('.edge.hot', { state: 'attached' });
    const mm = await page.locator('.minimap').boundingBox();
    const t0 = await page.locator('.graph-canvas').getAttribute('style');
    await page.mouse.click(mm.x + mm.width / 2, mm.y + mm.height - 3);
    if ((await page.locator('.graph-canvas').getAttribute('style')) === t0) throw new Error('minimap click did not pan');
    await page.keyboard.press('Space');
    await page.waitForSelector('.row.insn');
  });
  await step('graph + hex + xrefs', async () => {
    await page.keyboard.press('Space');
    await page.waitForSelector('.gnode');
    // X on a line acts on what it references: a call line gives the callee's xrefs...
    await page.locator('.gline.insn:has(.mn-call)').first().dispatchEvent('click');
    await page.keyboard.press('x');
    await page.waitForSelector('.xref-table tbody tr');
    const callee = await page.locator('.gline.insn.cursor .ref').first().innerText();
    if (!(await page.locator('.xrefs-panel, .panel-head, body').first().innerText()).includes(`Xrefs to ${callee}`))
      throw new Error(`X on a call line did not show xrefs to ${callee}`);
    // ...and the function's entry line gives the function's callers.
    await page.locator('.gline.insn').first().dispatchEvent('click');
    await page.keyboard.press('x');
    await page.waitForSelector('.xref-table tbody tr');
    await page.keyboard.press('h');
    await page.waitForSelector('.hb:not(:empty)');
    await page.keyboard.press('h');
  });
  const toast = (text) => page.waitForSelector(`.toast:has-text(${JSON.stringify(text)})`, { timeout: 120000 });
  await step('undo / redo a rename and a comment (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y)', async () => {
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'checker');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.active:has-text("checker")', { timeout: 60000 });
    await page.keyboard.press('Control+z');
    await toast('Undid rename of fixture_check');
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
    await page.keyboard.press('Control+Shift+z');
    await page.waitForSelector('.side-item.active:has-text("checker")', { timeout: 60000 });
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
    await page.locator('.row.insn.cur-fn').nth(3).click();
    await page.keyboard.press(';');
    await page.fill('.modal-input', 'short-lived');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.user-comment:has-text("short-lived")');
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.user-comment:has-text("short-lived")', { state: 'detached' });
    await page.keyboard.press('Control+y');
    await page.waitForSelector('.user-comment:has-text("short-lived")');
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.user-comment:has-text("short-lived")', { state: 'detached' });
    await page.waitForSelector('.user-comment:has-text("persisted comment")');
  });
  await step('xrefs from (Shift+X) and the To / From toggle', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Shift+X');
    await page.waitForSelector('.panel-head:has-text("Xrefs from fixture_check")');
    await page.waitForSelector('.xref-table tbody tr:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.locator('.xref-dir button', { hasText: 'To' }).click();
    await page.waitForSelector('.panel-head:has-text("Xrefs to fixture_check")');
    await page.locator('.xref-dir button', { hasText: 'From' }).click();
    await page.locator('.xref-table tbody tr', { hasText: 'fixture_arithmetic' }).first().click();
    await page.waitForSelector('.side-item.active:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.keyboard.press('Escape'); // closes the panel
    await page.keyboard.press('Escape'); // back
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
  });
  await step('call tree: callers and callees, lazy expansion, click to navigate', async () => {
    await page.locator('.tabs button', { hasText: 'Calls' }).click();
    await page.waitForSelector('.call-root:has-text("fixture_check")');
    const callee = page.locator('.call-node', { hasText: 'my_max' }).first();
    await callee.waitFor({ timeout: 60000 });
    await page.waitForSelector('.call-node:has-text("fixture_entry")'); // a caller
    await page.locator('.call-node', { hasText: 'fixture_entry' }).first().locator('.call-twisty').click();
    await page.waitForFunction(() => ![...document.querySelectorAll('.call-note')].some((n) => n.textContent.includes('Loading')), null, { timeout: 60000 });
    await callee.click();
    await page.waitForSelector('.call-root:has-text("my_max")', { timeout: 60000 });
    await page.waitForSelector('.call-node:has-text("fixture_check")'); // its caller
    await page.keyboard.press('Escape');
    await page.locator('.tabs button', { hasText: 'Functions' }).click();
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
  });
  await step('bookmarks: Alt+M marks, Ctrl+M lists, jumps and removes', async () => {
    await page.locator('.row.insn.cur-fn').nth(4).click();
    const at = await page.locator('.row.cursor .addr').first().textContent();
    await page.keyboard.press('Alt+m');
    await page.fill('.modal-input', 'check loop');
    await page.keyboard.press('Enter');
    await toast('Bookmarked');
    await page.locator('.row.insn.cur-fn').nth(8).click();
    await page.keyboard.press('Alt+m');
    await page.keyboard.press('Enter');
    await page.locator('.side-item', { hasText: 'fixture_arithmetic' }).click();
    await page.waitForSelector('.side-item.active:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.keyboard.press('Control+m');
    await page.waitForSelector('.bookmark-item:has-text("check loop")');
    // The second bookmark may still be on its way when the list opens.
    await page
      .waitForFunction(() => document.querySelectorAll('.bookmark-item').length === 2, null, { timeout: 30000 })
      .catch(() => {
        throw new Error('expected 2 bookmarks');
      });
    await page.locator('.bookmark-item').nth(1).locator('.close').click();
    await page.waitForFunction(() => document.querySelectorAll('.bookmark-item').length === 1);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
    if ((await page.locator('.row.cursor .addr').first().textContent()) !== at) throw new Error('did not jump to the bookmark');
  });
  for (const f of ['macho-arm64-symbols', 'pe-x86_64-symbols.exe']) {
    await step(`open ${f}`, async () => {
      await page.locator('.brand').click();
      await page.setInputFiles('input[type=file]', FIX + f);
      await page.waitForSelector('.row.insn', { timeout: 120000 });
      await page.waitForSelector('.pline', { timeout: 120000 });
    });
  }
  /** Runs a script in the open console and returns its output lines (`print: …`, `result: …`, `error: …`). */
  const runScript = async (code) => {
    const before = await page.locator('.script-output .out-input').count();
    await page.fill('.script-editor', code);
    await page.locator('.script-editor').press('Control+Enter');
    await page.waitForFunction((n) => document.querySelectorAll('.script-output .out-input').length > n && !document.querySelector('.script-output .busy'), before, { timeout: 120000 });
    // The output of this run: everything after its echoed input.
    return page.$$eval('.script-output pre', (els) => {
      const i = els.findLastIndex((e) => e.classList.contains('out-input'));
      return els.slice(i + 1).map((e) => `${e.className.replace('out-', '')}: ${e.textContent}`);
    });
  };
  /** X, the Calls tab and the script API all list the calls to an import stub (OpenDecomp names the import, not the stub, as their target). */
  const stubCallers = async (stub, caller, sites) => {
    await page.locator('.side-item', { hasText: stub }).first().click();
    await page.waitForSelector(`.side-item.active:has-text("${stub}")`, { timeout: 60000 });
    await page.locator('.row.insn.cur-fn .addr').first().click(); // not an operand: X names the function
    await page.keyboard.press('x');
    await page.waitForSelector(`.panel-head:has-text("Xrefs to ${stub}")`);
    await page.waitForSelector(`.xref-table tbody tr:has-text("${caller}")`, { timeout: 60000 });
    const rows = await page.locator('.xref-table tbody tr').count();
    if (rows !== sites) throw new Error(`X: ${rows} xrefs, expected ${sites}`);
    await page.keyboard.press('Escape');
    await page.locator('.tabs button', { hasText: 'Calls' }).click();
    await page.waitForSelector(`.call-root:has-text("${stub}")`);
    const node = page.locator('.call-node', { hasText: caller }).first();
    await node.waitFor({ timeout: 60000 });
    if (sites > 1 && !(await node.textContent()).includes(`×${sites}`)) throw new Error(`Callers: ${await node.textContent()}`);
    await page.locator('.tabs button', { hasText: 'Functions' }).click();
    await page.locator('.statusbar').click();
    await page.keyboard.press('Shift+F2');
    await page.waitForSelector('.script-editor:focus');
    const out = await runScript(`return [(await or.xrefsTo('${stub}')).length, (await or.callers('${stub}')).map((c) => c.name + ' ' + c.sites)]`);
    if (out[0] !== `result: [${sites}, ["${caller} ${sites}"]]`) throw new Error(`script: ${out}`);
    await page.locator('.script-console .close').click();
    await page.waitForSelector('.script-console', { state: 'detached' });
  };
  await step('xrefs to an import stub: X, Callers and or.xrefsTo (_puts)', async () => {
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'macho-arm64-symbols' }).click();
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await stubCallers('_puts', '_main', 1);
  });
  await step('whole-image listing: sections, strings, GOT, data keys, rename and xrefs on data', async () => {
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'macho-arm64-symbols' }).click();
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    const cursorText = () => page.locator('.pane-main .row.cursor').first().innerText();
    const waitCursor = (re, what) =>
      page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.pane-main .row.cursor')?.textContent ?? ''), re.source, { timeout: 60000 }).catch(async () => {
        throw new Error(`${what}: cursor line is ${JSON.stringify(await cursorText().catch(() => null))}`);
      });
    const goTo = async (target) => {
      await page.keyboard.press('g');
      await page.fill('.modal-input', target);
      await page.waitForTimeout(200);
      await page.keyboard.press('Enter');
    };
    // A string, a GOT slot (named by its import) and a section header.
    await goTo('_fixture_message');
    await waitCursor(/db"open-decomp trusted fixture v1", 0/, 'string');
    await page.waitForSelector('.label-data:text-is("_fixture_message:")');
    await goTo('0x100004000');
    await waitCursor(/dq_puts.*import/, 'GOT slot');
    await page.waitForSelector('.row-section:has-text("section __got")');
    // Data keys on a zero-fill global: D (byte, then word), * (array), U.
    await goTo('_fixture_zero_fill');
    await waitCursor(/0x200 dup\(\?\)/, 'zero fill');
    await page.keyboard.press('d');
    await waitCursor(/db0x0$/, 'D');
    await page.keyboard.press('d');
    await waitCursor(/dw0x0$/, 'D twice');
    await page.keyboard.press('*');
    await page.waitForSelector('.modal-title:has-text("Array of u16")');
    await page.fill('.modal-input', '4');
    await page.keyboard.press('Enter');
    await waitCursor(/dw0x0, 0x0, 0x0, 0x0 ; u16\[4\]/, 'array');
    // Y on a data line: the global's C type, as for a global of the pseudocode.
    await page.keyboard.press('y');
    await page.waitForSelector('.modal-title:has-text("Type of global _fixture_zero_fill")');
    if ((await page.inputValue('.modal-input')) !== 'uint16_t[4]') throw new Error(`Y shows ${await page.inputValue('.modal-input')}`);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.modal', { state: 'detached' });
    await page.keyboard.press('u');
    await waitCursor(/0x200 dup\(\?\)/, 'U');
    // Undo / redo put back the definition (listing and OpenDecomp type).
    await page.keyboard.press('Control+z');
    await waitCursor(/dw0x0, 0x0, 0x0, 0x0 ; u16\[4\]/, 'undo of U');
    await page.keyboard.press('Control+z');
    await waitCursor(/dw0x0$/, 'undo of *');
    await page.keyboard.press('Control+Shift+z');
    await waitCursor(/u16\[4\]/, 'redo of *');
    await page.keyboard.press('Control+Shift+z');
    await waitCursor(/0x200 dup\(\?\)/, 'redo of U');
    // N on data renames the global; X lists its references; undo restores the label.
    await page.keyboard.press('n');
    await page.waitForSelector('.modal-title:has-text("Rename global _fixture_zero_fill at 0x100008008")');
    await page.fill('.modal-input', 'zero_buffer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.label-data:text-is("zero_buffer:")', { timeout: 60000 });
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.label-data:text-is("_fixture_zero_fill:")', { timeout: 60000 });
    await page.keyboard.press('Control+Shift+z');
    await page.waitForSelector('.label-data:text-is("zero_buffer:")', { timeout: 60000 });
    await goTo('_fixture_message');
    await waitCursor(/fixture v1/, 'back to the string');
    await page.keyboard.press('x');
    await page.waitForSelector('.xref-table tbody tr:has-text("_fixture_string")');
    await page.keyboard.press('Escape');
    // Code is not data, and OpenDecomp cannot create functions.
    await page.locator('.side-item', { hasText: '_fixture_string' }).click();
    await waitCursor(/adrp/, 'function entry');
    await page.keyboard.press('d');
    await page.waitForSelector('.toast:has-text("OpenDecomp has no way to undefine code")');
    await page.keyboard.press('p');
    await page.waitForSelector('.toast:has-text("Cannot create a function")');
  });
  await step('types: declare, inline errors, signature (Y) with a library type, callers, local rename', async () => {
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'macho-arm64-symbols' }).click();
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await page.locator('.seg button', { hasText: 'Types' }).click();
    await page.fill('.types-input', 'struct Bad { int x }');
    await page.keyboard.press('Control+Enter');
    await page.waitForSelector('.types-errors:has-text("line 1")', { timeout: 120000 });
    await page.fill('.types-input', 'typedef unsigned int count_t;');
    await page.keyboard.press('Control+Enter');
    await page.waitForSelector('.lib-type:has-text("count_t")', { timeout: 120000 });
    await page.locator('.seg button', { hasText: 'Linear' }).click();
    await page.locator('.side-item', { hasText: '_fixture_arithmetic' }).click();
    await page.waitForSelector('.pline:has-text("fixture_arithmetic(")', { timeout: 120000 });
    await page.keyboard.press('y');
    await page.fill('.modal-input', 'int arith(struct Missing *m)');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.form-error:has-text("Missing")', { timeout: 60000 });
    await page.fill('.modal-input', 'count_t arith(int x, int y)');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("count_t arith(int32_t x, int32_t y)")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: '_fixture_direct' }).click();
    await page.waitForSelector('.pline:has-text("extern uint32_t arith(int32_t, int32_t);")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: '_fixture_loop' }).click();
    await page.locator('.pane-pseudo .tok.t-var', { hasText: 'accumulator' }).first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'total');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("return total;")', { timeout: 120000 });
  });
  await step('undo a local rename, a signature and a type redeclaration', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.pline:has-text("return accumulator;")', { timeout: 120000 });
    await page.keyboard.press('Control+z');
    await toast('Undid signature of _fixture_arithmetic');
    await page.waitForSelector('.side-item:has-text("_fixture_arithmetic")', { timeout: 120000 });
    await page.keyboard.press('Control+y');
    await page.waitForSelector('.side-item:has-text("arith")', { timeout: 120000 });
    await page.keyboard.press('Control+y');
    await page.waitForSelector('.pline:has-text("return total;")', { timeout: 120000 });
    await page.locator('.seg button', { hasText: 'Types' }).click();
    await page.waitForSelector('.lib-type:has-text("typedef uint32_t count_t")', { timeout: 120000 });
    await page.fill('.types-input', 'typedef int count_t;');
    await page.keyboard.press('Control+Enter');
    await page.waitForSelector('.lib-type:has-text("typedef int32_t count_t")', { timeout: 120000 });
    await page.locator('.types-section').first().click(); // out of the editor, whose Ctrl+Z is the text's own
    await page.keyboard.press('Control+z');
    await toast('Undid declaration of count_t');
    await page.waitForSelector('.lib-type:has-text("typedef uint32_t count_t")', { timeout: 120000 });
    await page.locator('.seg button', { hasText: 'Linear' }).click();
  });
  await step('retype a parameter from the pseudocode (Y on a variable), undo', async () => {
    await page.locator('.side-item', { hasText: '_fixture_memory' }).click();
    await page.waitForSelector('.pline:has-text("fixture_memory(uint64_t* address")', { timeout: 120000 });
    await page.locator('.pane-pseudo .tok.t-var', { hasText: 'address' }).first().click();
    await page.keyboard.press('y');
    if ((await page.inputValue('.modal-input')) !== 'uint64_t *') throw new Error('Y did not open the variable type');
    await page.fill('.modal-input', 'uint16_t *');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("fixture_memory(uint16_t* address")', { timeout: 120000 });
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.pline:has-text("fixture_memory(uint64_t* address")', { timeout: 120000 });
  });
  await step('structure editor: parser offsets, declare, retype a parameter as a pointer to it', async () => {
    await page.locator('.seg button', { hasText: 'Types' }).click();
    await page.locator('button', { hasText: 'New structure' }).click();
    await page.fill('.struct-name', 'Acc');
    const cell = (row, col) => page.locator('.struct-table tbody tr').nth(row).locator('input').nth(col);
    await cell(0, 0).fill('uint64_t');
    await cell(0, 1).fill('total');
    await page.locator('button', { hasText: 'Add field' }).click();
    await cell(1, 0).fill('uint8_t');
    await cell(1, 1).fill('flag');
    await page.locator('button', { hasText: 'Add field' }).click();
    await cell(2, 0).fill('char *');
    await cell(2, 1).fill('label');
    const offsetOf = (row, want) =>
      page.waitForFunction(([r, w]) => document.querySelectorAll('.struct-table tbody tr')[r]?.querySelector('td')?.textContent === w, [row, want], { timeout: 60000 });
    await offsetOf(2, '0x10');
    await page.waitForSelector('.struct-size:has-text("size 0x18")');
    await page.locator('.struct-editor button.primary').click();
    await page.waitForSelector('.lib-type:has-text("struct Acc")', { timeout: 120000 });
    await page.locator('.lib-type', { hasText: 'struct Acc' }).hover();
    await page.locator('.lib-type', { hasText: 'struct Acc' }).locator('button', { hasText: 'fields' }).click();
    if ((await page.locator('.struct-table tbody tr').count()) !== 3) throw new Error('fields did not load the declaration');
    await page.locator('.struct-table tbody tr').nth(1).locator('button[title="Insert a field above"]').click();
    await offsetOf(2, '0xc');
    await page.locator('.struct-editor button', { hasText: 'Cancel' }).click();
    await page.locator('.seg button', { hasText: 'Linear' }).click();
    await page.waitForSelector('.pline:has-text("fixture_memory(")', { timeout: 120000 });
    await page.locator('.pane-pseudo .tok.t-var', { hasText: 'address' }).first().click();
    await page.keyboard.press('y');
    await page.fill('.modal-input', 'struct Acc *');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("address->total")', { timeout: 120000 });
  });
  await step('create a structure from a pointer local (S), one undo step', async () => {
    await page.locator('.side-item', { hasText: '_fixture_check' }).click();
    await page.locator('.pane-pseudo .pline:has-text("struct_47fdf8* address;") .tok.t-var').first().click({ timeout: 120000 });
    await page.keyboard.press('s');
    await page.fill('.modal-input', 'Msg');
    await page.keyboard.press('Enter');
    // fixture_string()'s char * result: OpenDecomp declares the structure but keeps its own type for the local.
    await toast('Declared struct Msg');
    await page.locator('.seg button', { hasText: 'Types' }).click();
    await page.waitForSelector('.lib-type:has-text("pad_0x0[29]")', { timeout: 120000 });
    await page.locator('.types-section').first().click();
    await page.keyboard.press('Control+z');
    await toast('Undid structure Msg from address');
    await page.waitForSelector('.lib-type:has-text("struct Acc")', { timeout: 120000 });
    if (await page.locator('.lib-type:has-text("struct Msg")').count()) throw new Error('Msg is still declared');
    await page.locator('.seg button', { hasText: 'Linear' }).click();
  });
  // ------------------------------------------- search, navigation band, demangling
  /** Runs a search from the keyboard (Alt+B / T / I) and waits for its summary. */
  const search = async (key, text) => {
    await page.keyboard.press(key);
    await page.fill('.search-input', text);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => /\d\.\d\d s$/.test(document.querySelector('.search-summary')?.textContent ?? ''), null, { timeout: 300000 });
    return page.locator('.search-table tbody tr').evaluateAll((rs) => rs.map((r) => r.textContent));
  };
  await step('search bytes, text and immediates; results survive closing the panel', async () => {
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'elf-x86_64-symbols' }).click();
    await page.locator('.side-item', { hasText: 'fixture_check' }).click({ timeout: 120000 });
    await page.locator('.row.insn.cur-fn').first().click();
    const text = await search('Alt+t', 'LD-LINUX');
    if (!text.some((r) => r.includes('ld-linux-x86-64.so.2'))) throw new Error(`text: ${text}`);
    // Every hit is an instruction with a 0 among its operands, located in its function.
    const imm = await search('Alt+i', '0');
    const cells = await page.locator('.search-table tbody tr td:last-child').allTextContents();
    if (!imm.length || !cells.every((c) => /(?<![\w])(0|0h|0x0|#0)(?![\w])/.test(c))) throw new Error(`immediate: ${cells.slice(0, 3)}`);
    const pat = await search('Alt+b', 'C3');
    if (!pat.length || !pat.every((r) => r.includes('c3'))) throw new Error(`bytes: ${pat.slice(0, 3)}`);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.search-panel', { state: 'detached' });
    await page.locator('button', { hasText: 'Search…' }).click();
    if ((await page.locator('.search-table tbody tr').count()) !== pat.length) throw new Error('results lost on reopen');
    // Wait for the hit's own address: the status bar already shows the previous cursor, and a
    // navigation landing after this step ends would move the cursor under the next one.
    const hit = BigInt(`0x${await page.locator('.search-table tbody tr td.addr').first().textContent()}`);
    await page.locator('.search-table tbody tr').first().click();
    await page.waitForFunction((a) => { const t = document.querySelector('.statusbar span')?.textContent ?? ''; return /^0x[0-9a-f]+$/.test(t) && BigInt(t) === BigInt(a); }, `0x${hit.toString(16)}`);
    await page.keyboard.press('Escape');
  });
  await step('navigation band: hover names the place, click goes there', async () => {
    const box = await page.locator('.navstrip-canvas').boundingBox();
    if (!box || box.height > 16) throw new Error(`band box ${JSON.stringify(box)}`);
    // The left end is the first mapped section; go to a quarter of the band.
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
    const tip = await page.locator('.navstrip-tip').textContent();
    if (!/^0x[0-9a-f]+ · \S+/.test(tip)) throw new Error(`tip ${tip}`);
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
    await page.waitForFunction((t) => t.startsWith(document.querySelector('.statusbar span')?.textContent + ' '), tip, { timeout: 30000 }).catch(() => undefined);
    if (!tip.startsWith((await page.locator('.statusbar span').first().textContent()) + ' ')) throw new Error(`went to ${await page.locator('.statusbar span').first().textContent()}, tip ${tip}`);
    await page.locator('.nav-toggle').click();
    await page.waitForSelector('.navstrip', { state: 'detached' });
    await page.locator('.nav-toggle').click();
    await page.waitForSelector('.navstrip-canvas');
    await page.keyboard.press('Escape'); // back
  });
  await step('script console: list functions, rename (Ctrl+Z undoes it), xrefs to a string, errors, stop, history', async () => {
    const run = runScript;
    await page.locator('.statusbar').click();
    await page.keyboard.press('Shift+F2');
    await page.waitForSelector('.script-editor:focus');
    let out = await run(`const fns = await or.functions();
print(fns.length, 'functions');
await or.rename('fixture_divide', 'script_divide');
return (await or.functions()).filter((f) => f.name.startsWith('script_')).map((f) => f.entry)`);
    if (!out.some((l) => /^print: \d+ functions$/.test(l)) || !out.includes('result: ["0x401900"]')) throw new Error(`rename: ${out}`);
    await page.waitForSelector('.side-item:has-text("script_divide")');
    // The rename is an undo step like a manual one.
    await page.locator('.statusbar').click();
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.side-item:has-text("fixture_divide")', { timeout: 60000 });
    if (await page.locator('.side-item:has-text("script_divide")').count()) throw new Error('undo kept the scripted name');
    out = await run(`const s = (await or.strings()).find((s) => s.text.includes('trusted fixture'));
return (await or.xrefsTo(s.addr)).length`);
    if (out[0] !== 'result: 1') throw new Error(`xrefs to a string: ${out}`);
    out = await run('const a = 1;\nnull.f();');
    if (!/^error: TypeError: .* \(line 2\)$/.test(out[0])) throw new Error(`runtime error: ${out}`);
    out = await run('print(1)\nconst = 2;');
    if (!/^error: SyntaxError: .* \(line 2\)$/.test(out[0])) throw new Error(`syntax error: ${out}`);
    // Stop: the next API call of a running script throws.
    await page.fill('.script-editor', 'let n = 0;\nwhile (true) { await or.here(); if (++n % 500 === 0) print(n); }');
    await page.locator('.script-editor').press('Control+Enter');
    await page.waitForSelector('.script-output .out-print:has-text("500")');
    await page.locator('.script-console button', { hasText: 'Stop' }).click();
    await page.waitForSelector('.script-output .out-error:has-text("Script stopped")');
    // ↑ in an empty editor recalls the last script.
    await page.fill('.script-editor', '');
    await page.locator('.script-editor').press('ArrowUp');
    if (!(await page.inputValue('.script-editor')).startsWith('let n = 0;')) throw new Error('history');
    await page.locator('.script-console .close').click();
    await page.waitForSelector('.script-console', { state: 'detached' });
  });
  const CXX = fileURLToPath(new URL('../fixtures/cxx-symbols', import.meta.url));
  await step('C++ names: demangled everywhere, mangled in tooltips, go to by either', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', CXX);
    const item = page.locator('.side-item', { hasText: 'geom::area(int, int)' });
    await item.waitFor({ timeout: 120000 });
    if (!(await item.getAttribute('title')).includes('mangled: _ZN4geom4areaEii')) throw new Error('no mangled name in the tooltip');
    if ((await item.getAttribute('class')).includes('renamed')) throw new Error('a demangled name shows as renamed');
    await page.locator('.side-item', { hasText: /^main/ }).click();
    const call = page.locator('.pane-pseudo .tok.t-fn', { hasText: 'geom__area_int__int_' }).first();
    await call.waitFor({ timeout: 180000 });
    if (!(await call.getAttribute('title')).startsWith('geom::area(int, int) @')) throw new Error(await call.getAttribute('title'));
    await page.waitForSelector('.row.insn .ref-function:has-text("geom::area(int, int)")');
    await page.keyboard.press('g');
    await page.fill('.modal-input', '_ZN4geom4areaEii');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.statusbar')?.textContent?.includes('geom::area(int, int)'));
    const hits = await search('Alt+i', '0x862');
    if (hits.length !== 1 || !hits[0].includes('helper(std::') || !hits[0].includes('862h')) throw new Error(`immediate: ${hits}`);
    await page.keyboard.press('Escape');
    // Renaming starts from the mangled name, and the new name wins.
    await page.locator('.side-item', { hasText: 'geom::area(int, int)' }).click();
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('n');
    if ((await page.inputValue('.modal-input')) !== '_ZN4geom4areaEii') throw new Error(`rename starts from ${await page.inputValue('.modal-input')}`);
    await page.fill('.modal-input', 'area');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.renamed:has-text("area")', { timeout: 60000 });
  });
  await step('binary diff: v1 against v2 from the home screen, changed / renamed / added functions, side by side, go to', async () => {
    const DIFF = fileURLToPath(new URL('../fixtures/diff/', import.meta.url));
    for (const v of ['diffme-v1', 'diffme-v2']) {
      await page.locator('.brand').click();
      await page.setInputFiles('input[type=file]', DIFF + v);
      await page.waitForSelector('.row.insn', { timeout: 120000 });
    }
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'diffme-v1' }).locator('.act-diff').click();
    await page.locator('.diff-pick', { hasText: 'diffme-v2' }).click();
    await page.waitForSelector('.diff-counts', { timeout: 180000 });
    const counts = await page.locator('.diff-counts').innerText();
    if (!/0 only in A/.test(counts) || !/1 only in B/.test(counts) || !/\b3 changed/.test(counts)) throw new Error(`counts: ${counts}`);
    const rows = await page.locator('.diff-body .diff-row').evaluateAll((els) => els.map((e) => [...e.children].map((c) => c.textContent.trim())));
    const row = (a) => rows.find((r) => r[0].startsWith(`${a} `));
    for (const f of ['checksum', 'parse_level', 'main']) if (!(row(f)?.[2] < '1.00')) throw new Error(`${f} not changed: ${row(f)}`);
    if (row('count_words')?.[2] !== '1.00') throw new Error(`count_words: ${row('count_words')}`);
    // The renamed static function matches by its code.
    if (!row('helper_add')?.[1].startsWith('add_values') || row('helper_add')[3] !== 'identical code') throw new Error(`helper_add: ${row('helper_add')}`);
    if (!rows.some((r) => r[0] === '—' && r[1].startsWith('validate_name'))) throw new Error('validate_name is not only in B');
    // parse_level side by side: v2's new branch shows as added lines.
    await page.locator('.diff-body .diff-row', { hasText: 'parse_level' }).click();
    await page.waitForSelector('.diff-line.k-added');
    if (!(await page.locator('.diff-line.k-added', { hasText: 'cmp' }).count())) throw new Error('no added cmp line');
    await page.locator('.diff-pair-head .link', { hasText: 'go to' }).click();
    await page.waitForSelector('.diff-view', { state: 'detached' });
    await page.waitForFunction(() => document.querySelector('.statusbar')?.textContent?.includes('parse_level'));
    // The top bar's Diff shows it again; Esc leaves it.
    await page.locator('.diff-button').click();
    await page.waitForSelector('.diff-view');
    await page.keyboard.press('Escape');
    await page.waitForSelector('.diff-view', { state: 'detached' });
  });
  if (existsSync(SSHPASS)) await step(`${SSHPASS}: xrefs to the _fprintf stub, search the fprintf call sequence, "Conflicting", immediate 0x862`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', SSHPASS);
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await stubCallers('_fprintf', '_parse_options', 5);
    // ldr x0,[x8]; adrp x1,…; add x1,x1,#0x862; bl _fprintf
    const seq = await search('Alt+b', '00 01 40 F9 01 00 00 B0 21 88 21 91 ?? ?? ?? 94');
    if (seq.length !== 4 || !seq.every((r) => r.includes('_parse_options+0x'))) throw new Error(`bytes: ${seq}`);
    const text = await search('Alt+t', 'Conflicting');
    if (!text.length || !text.every((r) => /conflicting/i.test(r))) throw new Error(`text: ${text}`);
    const imm = await search('Alt+i', '0x862');
    if (imm.filter((r) => r.includes('#0x862')).length < 4) throw new Error(`immediate: ${imm}`);
    console.log(`      ${seq.length} sequences, ${text.length} strings, ${imm.length} instructions`);
    await page.keyboard.press('Escape');
  });
  if (existsSync(SSHPASS)) await step(`${SSHPASS}: rename and retype a global, create a structure from a pointer`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', SSHPASS);
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await page.locator('.side-item', { hasText: '_write_pass' }).first().click();
    await page.waitForSelector('.pline:has-text("extern uint32_t args;")', { timeout: 180000 });
    await page.locator('.pane-pseudo .tok.t-global', { hasText: 'args' }).first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'g_args');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("extern uint32_t g_args;")', { timeout: 180000 });
    await page.locator('.seg button', { hasText: 'Types' }).click();
    await page.fill('.types-input', 'struct Args { uint32_t pwtype; uint32_t pad; char *pwsrc; };');
    await page.keyboard.press('Control+Enter');
    await page.waitForSelector('.lib-type:has-text("struct Args")', { timeout: 180000 });
    await page.locator('.seg button', { hasText: 'Linear' }).click();
    await page.locator('.pane-pseudo .tok.t-global', { hasText: 'g_args' }).first().click({ timeout: 180000 });
    await page.keyboard.press('y');
    await page.fill('.modal-input', 'struct Args');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("g_args.pwtype")', { timeout: 180000 });
    await page.locator('.side-item', { hasText: '_handleoutput' }).first().click();
    await page.locator('.pane-pseudo .pline:has-text("struct_533f5f* address;") .tok.t-var').first().click({ timeout: 180000 });
    await page.keyboard.press('s');
    await page.fill('.modal-input', 'State');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("struct State* address")', { timeout: 180000 });
    await page.waitForSelector('.pline:has-text("address->field_0xc")');
  });
  if (existsSync(STRIPPED)) await step(`stripped ${STRIPPED} with background discovery`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', STRIPPED);
    await page.waitForSelector('.row.insn', { timeout: 180000 });
    await page.waitForFunction(() => /^(\d+) functions/.test(document.querySelector('.side-count')?.textContent ?? '') && Number(document.querySelector('.side-count').textContent.split(' ')[0].replace(/,/g, '')) > 400, null, { timeout: 300000 });
    console.log('     ', await page.locator('.side-count').textContent());
    await page.waitForSelector('.pline', { timeout: 180000 });
  });
  if (existsSync(STRIPPED)) await step('find past the loaded slice of the listing (Ctrl+F, Enter reads on)', async () => {
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Control+f');
    // A string of .rodata, far below the code around the cursor.
    await page.keyboard.type('for more information');
    await page.waitForSelector('.pane-main .find-count:text-is("Enter: search on")');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => /for more information/.test(document.querySelector('.pane-main .row.cursor')?.textContent ?? ''), null, { timeout: 120000 });
    await page.waitForFunction(() => /^\d+\/\d+\+$/.test(document.querySelector('.pane-main .find-count')?.textContent ?? ''));
    await page.keyboard.press('Escape');
    await page.waitForSelector('.find-bar', { state: 'detached' });
  });

  // ------------------------------------------------ data in / out, storage
  const download = async (p, click, timeout = 300000) => {
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout }), click()]);
    const path = join(TMP, dl.suggestedFilename());
    await dl.saveAs(path);
    return { name: dl.suggestedFilename(), bytes: new Uint8Array(readFileSync(path)), path };
  };
  const exportItem = async (cls) => {
    await page.locator('.export-menu').click();
    await page.locator(`.menu-item.${cls}`).click();
  };
  let archivePath = null;
  // ------------------------------------------------ ARM64 Mach-O
  const goTo = async (target) => {
    await page.keyboard.press('g');
    await page.fill('.modal-input', target);
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
  };
  const waitCursor = (re, what) =>
    page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.pane-main .row.cursor')?.textContent ?? ''), re.source, { timeout: 60000 }).catch(async () => {
      throw new Error(`${what}: cursor line is ${JSON.stringify(await page.locator('.pane-main .row.cursor').first().innerText().catch(() => null))}`);
    });
  await step('ARM64 Mach-O: ADRP+ADD auto-comment, X on it, graph, rename + undo', async () => {
    await page.locator('.brand').click();
    await page.locator('.recent-item', { hasText: 'macho-arm64-symbols' }).click();
    await page.locator('.side-item', { hasText: '_fixture_string' }).click();
    await page.waitForSelector('.pline:has-text("fixture_string(")', { timeout: 120000 });
    // The ADD of an ADRP pair: OpenDecomp resolves the page + offset to the string.
    const add = page.locator('.row.insn.cur-fn', { has: page.locator('.mn:text-is("add")') }).filter({ has: page.locator('.comment .ref-string') }).first();
    if (!(await add.locator('.comment').innerText()).includes('open-decomp trusted fixture v1')) throw new Error('no resolved string on the ADRP+ADD row');
    await add.locator('.addr').click();
    await page.keyboard.press('x');
    await page.waitForSelector('.xref-table tbody tr:has-text("_fixture_string")');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Space');
    await page.waitForSelector('.gline.insn:has-text("open-decomp trusted fixture v1")');
    await page.keyboard.press('Space');
    await page.locator('.row.insn.cur-fn .addr').first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'message_text');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("message_text(")', { timeout: 120000 });
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.side-item.active:has-text("_fixture_string")', { timeout: 60000 });
    await page.waitForSelector('.pline:has-text("fixture_string(")', { timeout: 120000 });
  });
  await step('ARM64 Mach-O: export all pseudocode', async () => {
    const { name, bytes } = await download(page, () => exportItem('export-pseudo'));
    const paths = (await zipDecode(bytes)).map((e) => e.path);
    if (!paths.some((p) => /\/functions\/_?fixture_string@0x[0-9a-f]+\.c$/.test(p))) throw new Error(`no fixture_string.c in ${paths.slice(0, 8).join(', ')}`);
    console.log(`      ${name}: ${paths.filter((p) => p.includes('/functions/')).length} function files`);
  });
  await step('ARM64 Mach-O stripped: discovery, graph, pseudocode, data definition + undo', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', FIX + 'macho-arm64-stripped');
    await page.locator('.side-item', { hasText: 'sub_100000594' }).click({ timeout: 120000 });
    await page.waitForSelector('.pline:has-text("accumulator")', { timeout: 120000 });
    await page.keyboard.press('Space');
    await page.waitForFunction(() => document.querySelectorAll('.gnode').length >= 3, null, { timeout: 60000 });
    await page.keyboard.press('Space');
    await goTo('0x100008008');
    await waitCursor(/dup\(\?\)/, 'zero fill');
    await page.keyboard.press('d');
    await waitCursor(/db0x0$/, 'D');
    await page.keyboard.press('Control+z');
    await waitCursor(/dup\(\?\)/, 'undo of D');
  });
  await step('Objective-C: method names, messages at objc_msgSend, selector / class / CFString labels', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', OBJC);
    await page.waitForSelector('.side-item:has-text("+[ODCounter counterWithLabel:]")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: '_ODMakeSummary' }).click();
    await page.waitForSelector('.pline:has-text("[ODCounter counterWithLabel:")', { timeout: 120000 });
    await page.waitForSelector('.row.insn.cur-fn:has(.mn-call) .comment:has-text("[ODCounter counterWithLabel:]")');
    await page.waitForSelector('.row.insn.cur-fn .comment:has-text("@selector(addValue:times:)")');
    await page.waitForSelector('.row.insn.cur-fn .comment:has-text("class ODCounter")');
    await page.locator('.side-item', { hasText: '-[ODCounter summary]' }).click();
    await page.waitForSelector('.row.insn.cur-fn .comment:has-text("[NSString stringWithFormat:]")', { timeout: 60000 });
    await page.waitForSelector(`.row.insn.cur-fn .comment:has-text('@"%@=%ld"')`);
    await goTo('0x100008148');
    await page.waitForSelector('.label-data:text-is("selRef_addValue_times_:")', { timeout: 60000 });
    await page.waitForSelector('.label-data:text-is("classRef_ODCounter:")');
    await goTo('0x100004080');
    await waitCursor(/dq_OBJC_CLASS_\$_ODCounter/, 'class list');
    await page.waitForSelector('.label-data:text-is("cfstr_hello_fixture:")');
  });
  await step('performance: automatic workers by memory, engine memory shown', async () => {
    await page.waitForSelector('.status-memory:has-text("engine")');
    await page.locator('.brand').click();
    // The effective count arrives from the engine after the panel shows.
    await page.waitForFunction(() => /\(\d\)/.test(document.querySelector('.storage-panel select option')?.textContent ?? ''), null, { timeout: 30000 }).catch(() => undefined);
    const auto = await page.locator('.storage-panel select option').first().innerText();
    // One less than the cores (2 to 4), but 1 under 8 GB and at most 2 otherwise.
    const [cores, memory] = await page.evaluate(() => [navigator.hardwareConcurrency || 2, navigator.deviceMemory ?? null]);
    const want = Math.min(Math.max(2, Math.min(4, cores - 1)), memory !== null && memory < 8 ? 1 : 2);
    if (auto !== `Automatic (${want})`) throw new Error(`${auto} with ${cores} cores and deviceMemory ${memory}`);
    await page.waitForSelector('.engine-memory:has-text("SQLite")');
  });

  await step('reopen ELF from the recent list', async () => {
    await page.locator('.brand').click();
    // Leaving a binary closes its engine session: only the engine worker is left.
    for (let i = 0; workers.get(page) > 1; i++) {
      if (i > 100) throw new Error(`${workers.get(page)} workers still running at home`);
      await page.waitForTimeout(100);
    }
    await page.locator('.recent-item', { hasText: 'elf-x86_64-symbols' }).click();
    await page.waitForSelector('.side-item:has-text("my_max")', { timeout: 120000 });
  });
  await step('export pseudocode can be cancelled', async () => {
    await exportItem('export-pseudo');
    await page.waitForSelector('.task-panel');
    await page.locator('.task-cancel').click();
    await page.waitForSelector('.task-panel', { state: 'detached', timeout: 120000 });
    await page.waitForSelector('.toast:has-text("cancelled")', { timeout: 5000 });
  });
  await step('export all pseudocode (zip with one .c per function + types.h)', async () => {
    let sawProgress = false;
    // Settles on its own (never rejects), so a slow export cannot leave an unhandled rejection behind.
    const watcher = page.waitForSelector('.task-panel:has-text("Decompiling")', { timeout: 120000 }).then(
      () => (sawProgress = true),
      () => undefined,
    );
    const t0 = Date.now();
    const { name, bytes } = await download(page, () => exportItem('export-pseudo')).catch(async (e) => {
      const panel = await page.locator('.task-panel').innerText().catch(() => 'no task panel');
      throw new Error(`${e.message.split('\n')[0]} after ${Date.now() - t0} ms; task panel: ${JSON.stringify(panel)}`);
    });
    await watcher;
    if (!sawProgress) throw new Error('no per-function progress shown');
    const entries = await zipDecode(bytes);
    const paths = entries.map((e) => e.path);
    const root = name.replace(/\.zip$/, '');
    for (const f of ['types.h', 'index.tsv', 'README.txt']) if (!paths.includes(`${root}/${f}`)) throw new Error(`missing ${f} in ${name}`);
    const mine = entries.find((e) => /\/functions\/my_max@0x[0-9a-f]+\.c$/.test(e.path));
    if (!mine) throw new Error(`no functions/my_max@….c in ${paths.slice(0, 8).join(', ')}`);
    const caller = entries.find((e) => /\/functions\/fixture_check@/.test(e.path));
    if (!caller || !new TextDecoder().decode(caller.data).includes('my_max(')) throw new Error('fixture_check.c does not call my_max');
    console.log(`      ${name}: ${paths.filter((p) => p.includes('/functions/')).length} function files`);
  });
  await step('export project archive of the open binary', async () => {
    const { name, bytes, path } = await download(page, () => exportItem('export-archive'));
    if (name !== 'elf-x86_64-symbols.orproj.zip') throw new Error(`unexpected name ${name}`);
    const archive = await decodeProjectArchive(bytes);
    if (archive.comments[Object.keys(archive.comments)[0]] !== 'persisted comment') throw new Error('comment missing from archive');
    if (!Object.values(archive.bookmarks).includes('check loop')) throw new Error('bookmark missing from archive');
    if (![...archive.project.keys()].some((k) => k.endsWith('/project.sqlite'))) throw new Error('project.sqlite missing');
    if (Buffer.compare(Buffer.from(archive.binary), readFileSync(FIX + 'elf-x86_64-symbols')) !== 0) throw new Error('binary differs');
    console.log(`      ${name}: ${(bytes.length / 1024).toFixed(0)} KiB, ${archive.project.size} project files`);
    archivePath = path;
  });
  await step('home: storage usage, download binary, import conflict, delete', async () => {
    await page.locator('.brand').click();
    const item = page.locator('.recent-item', { hasText: 'elf-x86_64-symbols' });
    await item.locator('.usage:has-text("stored")').waitFor({ timeout: 30000 });
    await page.waitForSelector('.storage-panel:has-text("Projects:")');
    const bin = await download(page, () => item.locator('.act-download').click(), 30000);
    if (bin.name !== 'elf-x86_64-symbols' || Buffer.compare(Buffer.from(bin.bytes), readFileSync(FIX + 'elf-x86_64-symbols')) !== 0) throw new Error('downloaded binary differs');
    // Importing an archive of a binary that exists asks; dismissing keeps it.
    let asked = '';
    page.once('dialog', (d) => ((asked = d.message()), d.dismiss()));
    await page.setInputFiles('.import-input', archivePath);
    await page.waitForSelector('.toast:has-text("Import cancelled")', { timeout: 60000 });
    if (!asked.includes('already in your workspace')) throw new Error(`unexpected dialog: ${asked}`);
    page.once('dialog', (d) => d.accept());
    await item.locator('.close').click();
    await item.waitFor({ state: 'detached', timeout: 30000 });
  });
  await step('import archive in a fresh browser: rename, comment and cached decompile survive', async () => {
    await page.close();
    const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 950 } });
    page = await ctx2.newPage();
    watch(page);
    await page.goto(URL_);
    await page.setInputFiles('.import-input', archivePath);
    await page.waitForSelector('.side-item:has-text("my_max")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
    await page.waitForSelector('.user-comment:has-text("persisted comment")', { timeout: 60000 });
    await page.waitForSelector('.pline:has-text("my_max(")', { timeout: 120000 });
    await page.waitForSelector('.pane-head:has-text("cached")', { timeout: 10000 });
    await page.keyboard.press('Control+m');
    await page.waitForSelector('.bookmark-item:has-text("check loop")');
    await page.keyboard.press('Escape');
  });
  await step('reset project keeps binary and comments, drops renames', async () => {
    await page.locator('.brand').click();
    const item = page.locator('.recent-item', { hasText: 'elf-x86_64-symbols' });
    page.once('dialog', (d) => d.accept());
    await item.locator('.act-reset').click();
    await page.waitForSelector('.toast:has-text("Reset")', { timeout: 30000 });
    await item.click();
    await page.waitForSelector('.side-item:has-text("fixture_maximum")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: 'fixture_check' }).click();
    await page.waitForSelector('.user-comment:has-text("persisted comment")', { timeout: 60000 });
  });

  await step('open from a URL: ?open= asks first, CORS refusal, a binary and an archive told apart by content', async () => {
    // Another origin: /cors/ allows the app's origin, /nocors/ does not.
    const files = { 'macho-arm64-stripped': readFileSync(FIX + 'macho-arm64-stripped'), 'project.bin': readFileSync(archivePath) };
    let requests = 0;
    const server = createServer((req, res) => {
      requests++;
      const m = /^\/(cors|nocors)\/([^/?]+)$/.exec(req.url ?? '');
      const body = m && files[m[2]];
      if (m?.[1] === 'cors') res.setHeader('Access-Control-Allow-Origin', '*');
      if (!body) return res.writeHead(404).end();
      res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': body.length }).end(body);
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const seen = errors.length;
    try {
      // A link names a file: nothing is fetched before the user says so, and the parameter leaves the page URL.
      await page.goto(`${URL_}?open=${encodeURIComponent(`${base}/cors/macho-arm64-stripped`)}`);
      await page.waitForSelector(`.open-url-confirm .open-url-target:has-text("${base}/cors/macho-arm64-stripped")`);
      if (page.url().includes('open=')) throw new Error(`parameter kept: ${page.url()}`);
      await page.locator('.open-url-confirm button', { hasText: 'Cancel' }).click();
      await page.waitForSelector('.open-url-confirm', { state: 'detached' });
      if (requests !== 0) throw new Error(`${requests} requests before confirming`);
      await page.goto(`${URL_}?open=${encodeURIComponent(`${base}/cors/macho-arm64-stripped`)}`);
      await page.locator('.open-url-confirm button', { hasText: 'Download and open' }).click();
      await page.waitForSelector('.topbar:has-text("macho-arm64-stripped")', { timeout: 120000 });
      await page.waitForSelector('.row.insn', { timeout: 120000 });
      // The server does not allow other sites: a clear error, nothing opened.
      await page.locator('.brand').click();
      await page.fill('.open-url-input', `${base}/nocors/macho-arm64-stripped`);
      await page.locator('.open-url-go').click();
      await toast('does not allow downloads from other sites');
      await page.fill('.open-url-input', `${base}/cors/missing`);
      await page.locator('.open-url-go').click();
      await toast('HTTP 404');
      // An archive whatever its name: imported (its binary is in the workspace: replace it), renames come back.
      page.once('dialog', (d) => d.accept());
      await page.fill('.open-url-input', `${base}/cors/project.bin`);
      await page.locator('.open-url-go').click();
      await page.waitForSelector('.side-item:has-text("my_max")', { timeout: 120000 });
    } finally {
      server.close();
      // Chromium logs the refused and the missing download as console errors: expected here.
      const expected = /CORS policy|Failed to load resource|ERR_FAILED/;
      for (let i = errors.length - 1; i >= seen; i--) if (expected.test(errors[i])) errors.splice(i, 1);
    }
  });

  await step('debug file: a stripped ELF dropped with its debug file gets names, prototypes, structures, locals; a wrong one is refused', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', [ELFDBG + 'shapes-stripped', ELFDBG + 'shapes.debug']);
    await page.waitForSelector('.debug-badge.loaded:has-text("debug file")', { timeout: 120000 });
    await page.locator('.side-item', { hasText: 'registry_add' }).click();
    await page.waitForSelector('.pline:has-text("void registry_add(registry_t* reg, shape* s)")', { timeout: 120000 });
    await page.waitForSelector('.pline:has-text("reg->count = 1 + reg->count;")');
    await page.locator('.side-item', { hasText: 'registry_visit' }).click();
    await page.waitForSelector('.pline:has-text("uint32_t visited;")', { timeout: 120000 });
    await page.locator('.debug-badge').click();
    await page.waitForSelector('.debug-status:has-text("matched by build ID")');
    await page.setInputFiles('[data-testid=debug-file-input]', ELFDBG + 'shapes-nobuildid.debug');
    await page.waitForSelector('.toast-error:has-text("is not the debug file of shapes-stripped")', { timeout: 120000 });
    await page.waitForSelector('.debug-badge.loaded', { timeout: 120000 });
  });
  await step('debug file: a stripped Mach-O gets its zipped .dSYM from the dialog; the archive keeps it; remove', async () => {
    const dsymDir = 'macho-arm64-symbols.dSYM/Contents/Resources/DWARF/macho-arm64-symbols';
    const dwarf = readFileSync(FIX + dsymDir);
    const zipPath = join(TMP, 'macho-arm64-symbols.dSYM.zip');
    writeFileSync(zipPath, await zipEncode([{ path: dsymDir, data: dwarf }]));
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', FIX + 'macho-arm64-stripped');
    await page.waitForSelector('.debug-badge:has-text("+ debug")', { timeout: 120000 });
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await page.locator('.debug-badge').click();
    await page.waitForSelector('.debug-dialog');
    await page.setInputFiles('[data-testid=debug-file-input]', zipPath);
    await page.waitForSelector('.debug-badge.loaded:has-text("dSYM")', { timeout: 120000 }).catch(async (e) => {
      throw new Error(`${e.message.split('\n')[0]}; toast: ${await page.locator('.toast').textContent().catch(() => 'none')}`);
    });
    await page.locator('.side-item', { hasText: 'fixture_arithmetic' }).click();
    await page.waitForSelector('.pline:has-text("fixture_arithmetic(uint32_t a, uint32_t b)")', { timeout: 120000 });
    const { bytes } = await download(page, () => exportItem('export-archive'));
    const archive = await decodeProjectArchive(bytes);
    if (archive.record.debug?.kind !== 'dsym' || Buffer.compare(Buffer.from(archive.debug), dwarf) !== 0) throw new Error('debug file missing from the archive');
    await page.locator('.debug-badge').click();
    await page.locator('.debug-dialog button', { hasText: 'Remove debug file' }).click();
    await page.waitForSelector('.debug-badge:has-text("+ debug")', { timeout: 120000 });
  });

  // Library signatures (Shift+F5). zdemo-stripped: zlib linked statically into a stripped program
  // (test/fixtures/signatures/zdemo.c); libsigfix.a / sigfix-stripped: OpenDecomp's fixtures.
  const SIGS = fileURLToPath(new URL('../fixtures/signatures/', import.meta.url));
  const SIGFIX = fileURLToPath(new URL('../../vendor/open-decomp/test/metadata/fixtures/signatures/', import.meta.url));
  // Discovery starts once the first listing is shown (and waits a few seconds for the UI).
  const discovered = async () => {
    await page.waitForSelector('.busy:has-text("Discovering")', { timeout: 12000 }).catch(() => undefined);
    await page.waitForSelector('.busy:has-text("Discovering")', { state: 'detached', timeout: 300000 });
  };
  const signatures = async () => {
    await page.keyboard.press('Shift+F5');
    await page.waitForSelector('.signatures-dialog .sig-table input[type=checkbox]', { timeout: 60000 });
  };
  const applyOnly = async (row) => {
    for (const c of await page.locator('.sig-table input[type=checkbox]').all()) if (await c.isChecked()) await c.uncheck();
    await page.locator('.sig-table tr', { hasText: row }).locator('input[type=checkbox]').check();
    await page.locator('.signatures-dialog button.primary').click();
    await page.waitForSelector('[data-testid=sig-result]', { timeout: 180000 });
    return page.locator('[data-testid=sig-result]').innerText();
  };
  await step('library signatures: zlib suggested and applied to a stripped program (Shift+F5), callers named, cyan in the list, undo / redo', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', SIGS + 'zdemo-stripped');
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await discovered();
    await signatures();
    await page.waitForSelector('.sig-table tr:has-text("zlib 1.3.1") .sig-badge.suggested');
    const result = await applyOnly('zlib 1.3.1');
    if (!/Named \d+ from zlib-1\.3\.1-x86_64/.test(result)) throw new Error(`result: ${result}`);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.signatures-dialog', { state: 'detached' });
    await page.waitForSelector('.side-item.library:has-text("compress2")', { timeout: 60000 });
    const title = await page.locator('.side-item.library', { hasText: 'uncompress' }).first().getAttribute('title');
    if (!title.includes('library function (signatures zlib-1.3.1-x86_64)')) throw new Error(`title: ${title}`);
    // main (0x10c0) calls them by name now.
    await page.keyboard.press('g');
    await page.fill('.modal-input', '0x10c0');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("compress2(")', { timeout: 180000 });
    await page.waitForSelector('.pline:has-text("adler32(1, ")');
    await page.keyboard.press('Control+z');
    await page.waitForSelector('.side-item.library', { state: 'detached', timeout: 60000 });
    await page.waitForSelector('.pline:has-text("sub_2ae0(")', { timeout: 180000 });
    await page.keyboard.press('Control+Shift+z');
    await page.waitForSelector('.side-item.library:has-text("compress2")', { timeout: 60000 });
  });
  await step('signature kit: a library from a binary with symbols names its stripped build (ARM64 Mach-O); one from a dropped .a, with "one of" two left unnamed', async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', FIX + 'macho-arm64-symbols');
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await signatures();
    await page.fill('.sig-make .modal-input', 'fixture kit');
    await page.locator('.sig-make button', { hasText: "From this binary's symbols" }).click();
    await page.waitForSelector('.sig-table tr:has-text("fixture kit") .sig-badge:has-text("yours")', { timeout: 120000 });
    await page.keyboard.press('Escape');
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', FIX + 'macho-arm64-stripped');
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await discovered();
    await signatures();
    const kit = await applyOnly('fixture kit');
    if (!/Named 1[0-9] from user-fixture_kit/.test(kit)) throw new Error(`kit: ${kit}`);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.side-item.library:has-text("_fixture_arithmetic")', { timeout: 60000 });
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', SIGFIX + 'sigfix-stripped');
    await page.waitForSelector('.row.insn', { timeout: 120000 });
    await discovered();
    await signatures();
    await page.fill('.sig-make .modal-input', 'sigfix');
    await page.setInputFiles('[data-testid=sig-files]', SIGFIX + 'libsigfix.a');
    await page.waitForSelector('.sig-table tr:has-text("sigfix")', { timeout: 60000 });
    const fix = await applyOnly('sigfix');
    if (!/Named 4 from/.test(fix) || !/one of sig_mix, sig_mix_copy/.test(fix)) throw new Error(`sigfix: ${fix}`);
    // The user's library downloads, and goes.
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('.sig-table tr', { hasText: 'sigfix' }).locator('button[title^="Download"]').click()]);
    if (!JSON.parse(readFileSync(await dl.path(), 'utf8')).functions.length) throw new Error('empty download');
    await page.locator('.sig-table tr', { hasText: 'sigfix' }).locator('button[title^="Delete"]').click();
    await page.waitForSelector('.sig-table tr:has-text("sigfix")', { state: 'detached' });
    await page.keyboard.press('Escape');
    await page.waitForSelector('.side-item.library:has-text("sig_dup")', { timeout: 60000 });
  });

  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(failures || errors.length ? 1 : 0);
}
