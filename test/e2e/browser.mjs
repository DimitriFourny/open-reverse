// End-to-end test of the static build in a real browser (Chromium via Playwright).
//
//   npm run build && npm run preview -- --port 5199 &
//   npm run test:e2e            # needs `npm i -D playwright && npx playwright install chromium`
//
// Env: OPEN_REVERSE_URL (default http://localhost:5199/), STRIPPED_BINARY (default /bin/ls, skipped if absent),
// SSHPASS_BINARY (an arm64 Mach-O sshpass with an `args` global, default /tmp/sshpass, skipped if absent),
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
const SSHPASS = process.env.SSHPASS_BINARY ?? '/tmp/sshpass';
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
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').first().click();
    const start = await cursorAddr();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowDown');
    const third = await page.locator('.row.insn .addr').nth(3).textContent();
    if ((await cursorAddr()) !== third) throw new Error(`Down x3 landed on ${await cursorAddr()}, want ${third}`);
    await page.keyboard.press('End');
    await page.waitForSelector('.row.cursor .mn-ret');
    await page.keyboard.press('PageUp');
    await page.keyboard.press('Home');
    if ((await cursorAddr()) !== start) throw new Error('Home did not return to the entry');
  });
  await step('token highlight with register aliases', async () => {
    await page.locator('.row.insn [data-k="r:ax"]').first().click();
    const seen = await page.$$eval('.code-scroll [data-k="r:ax"]', (els) => ({
      lit: els.every((e) => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'),
      texts: [...new Set(els.map((e) => e.textContent))],
    }));
    if (!seen.lit || seen.texts.length < 2) throw new Error(`highlight ${JSON.stringify(seen)}`);
    await page.locator('.row.insn .addr').first().click();
    if (await page.locator('style', { hasText: 'data-k' }).count()) throw new Error('click on a line did not clear the highlight');
  });
  await step('Enter follows a call, Esc returns', async () => {
    await page.locator('.row.insn', { has: page.locator('.mn-call') }).first().click();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.active:has-text("fixture_arithmetic")', { timeout: 60000 });
    await page.keyboard.press('Escape');
    await page.waitForSelector('.side-item.active:has-text("fixture_check")', { timeout: 60000 });
  });
  await step('find in disassembly and pseudocode', async () => {
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').first().click();
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
  await step('retype a parameter from the pseudocode (Y on a variable), undo', async () => {
    await page.locator('.side-item', { hasText: '_fixture_memory' }).click();
    await page.waitForSelector('.pline:has-text("fixture_memory(uint64_t* address")', { timeout: 120000 });
    await page.locator('.pane-pseudo .tok.t-var', { hasText: 'address' }).first().click();
    await page.keyboard.press('y');
    if ((await page.inputValue('.modal-input')) !== 'uint64_t *') throw new Error('Y did not open the variable type');
    await page.fill('.modal-input', 'uint16_t *');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.pline:has-text("fixture_memory(uint16_t* address")', { timeout: 120000 });
    await page.locator('.row.insn').first().click();
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
    await page.locator('.row.insn').first().click();
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
    await page.locator('.search-table tbody tr').first().click();
    await page.waitForFunction(() => /^0x[0-9a-f]+$/.test(document.querySelector('.statusbar span')?.textContent ?? ''));
    await page.keyboard.press('Escape');
  });
  await step('navigation band: hover names the place, click goes there', async () => {
    const box = await page.locator('.navstrip-canvas').boundingBox();
    if (!box || box.height > 16) throw new Error(`band box ${JSON.stringify(box)}`);
    const before = await page.locator('.statusbar span').first().textContent();
    // The left end is the first mapped section; go to a quarter of the band.
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
    const tip = await page.locator('.navstrip-tip').textContent();
    if (!/^0x[0-9a-f]+ · \S+/.test(tip)) throw new Error(`tip ${tip}`);
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
    await page.waitForFunction((b) => document.querySelector('.statusbar span')?.textContent !== b, before, { timeout: 30000 });
    if (!tip.startsWith((await page.locator('.statusbar span').first().textContent()) + ' ')) throw new Error(`went to ${await page.locator('.statusbar span').first().textContent()}, tip ${tip}`);
    await page.locator('.nav-toggle').click();
    await page.waitForSelector('.navstrip', { state: 'detached' });
    await page.locator('.nav-toggle').click();
    await page.waitForSelector('.navstrip-canvas');
    await page.keyboard.press('Escape'); // back
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
    await page.locator('.row.insn').first().click();
    await page.keyboard.press('n');
    if ((await page.inputValue('.modal-input')) !== '_ZN4geom4areaEii') throw new Error(`rename starts from ${await page.inputValue('.modal-input')}`);
    await page.fill('.modal-input', 'area');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.side-item.renamed:has-text("area")', { timeout: 60000 });
  });
  if (existsSync(SSHPASS)) await step(`${SSHPASS}: search the fprintf call sequence, "Conflicting", immediate 0x862`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', SSHPASS);
    await page.waitForSelector('.row.insn', { timeout: 120000 });
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
