// End-to-end test of the static build in a real browser (Chromium via Playwright).
//
//   npm run build && npm run preview -- --port 5199 &
//   npm run test:e2e            # needs `npm i -D playwright && npx playwright install chromium`
//
// Env: OPEN_REVERSE_URL (default http://localhost:5199/), STRIPPED_BINARY (default /bin/ls, skipped if absent),
// PLAYWRIGHT_PATH (a playwright package directory, when it is not installed here), E2E_TMP (scratch directory).
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeProjectArchive } from '../../web/src/engine/archive.ts';
import { zipDecode } from '../../web/src/engine/zip.ts';

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
const URL_ = process.env.OPEN_REVERSE_URL ?? 'http://localhost:5199/';
const STRIPPED = process.env.STRIPPED_BINARY ?? '/bin/ls';
let failures = 0;
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
  let page = await ctx.newPage();
  const errors = [];
  const watch = (p) => {
    p.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
    p.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  };
  watch(page);
  const step = async (name, fn) => {
    const t = Date.now();
    try {
      await fn();
      console.log(`ok   ${name} (${Date.now() - t} ms)`);
    } catch (e) {
      failures++;
      console.log(`FAIL ${name}: ${e.message.split('\n')[0]}`);
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
    await page.locator('.pane-pseudo .tok.t-var', { hasText: 'arg0' }).first().click();
    await page.keyboard.press('n');
    await page.fill('.modal-input', 'lhs');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("my_max(int32_t lhs")', { timeout: 120000 });
    await page.waitForSelector('.pline:has-text("return lhs >")');
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
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').nth(3).click();
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
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').nth(4).click();
    const at = await page.locator('.row.cursor .addr').first().textContent();
    await page.keyboard.press('Alt+m');
    await page.fill('.modal-input', 'check loop');
    await page.keyboard.press('Enter');
    await toast('Bookmarked');
    await page.locator('.row.insn').nth(8).click();
    await page.keyboard.press('Alt+m');
    await page.keyboard.press('Enter');
    await page.locator('.side-item', { hasText: 'fixture_arithmetic' }).click();
    await page.waitForSelector('.side-item.active:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.keyboard.press('Control+m');
    await page.waitForSelector('.bookmark-item:has-text("check loop")');
    if ((await page.locator('.bookmark-item').count()) !== 2) throw new Error('expected 2 bookmarks');
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
    await page.keyboard.press('u');
    await waitCursor(/0x200 dup\(\?\)/, 'U');
    // N on data renames the global; X lists its references.
    await page.keyboard.press('n');
    await page.waitForSelector('.modal-title:has-text("Rename global at 0x100008008")');
    await page.fill('.modal-input', 'zero_buffer');
    await page.keyboard.press('Enter');
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
    await page.locator('.row.insn').first().click();
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
  if (existsSync(STRIPPED)) await step(`stripped ${STRIPPED} with background discovery`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', STRIPPED);
    await page.waitForSelector('.row.insn', { timeout: 180000 });
    await page.waitForFunction(() => /^(\d+) functions/.test(document.querySelector('.side-count')?.textContent ?? '') && Number(document.querySelector('.side-count').textContent.split(' ')[0].replace(/,/g, '')) > 400, null, { timeout: 300000 });
    console.log('     ', await page.locator('.side-count').textContent());
    await page.waitForSelector('.pline', { timeout: 180000 });
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
  await step('reopen ELF from the recent list', async () => {
    await page.locator('.brand').click();
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
    const watcher = page.waitForSelector('.task-panel:has-text("Decompiling")', { timeout: 120000 }).then(() => (sawProgress = true));
    const { name, bytes } = await download(page, () => exportItem('export-pseudo'));
    await watcher.catch(() => undefined);
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

  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(failures || errors.length ? 1 : 0);
}
