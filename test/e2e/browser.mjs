// End-to-end test of the static build in a real browser (Chromium via Playwright).
//
//   npm run build && npm run preview -- --port 5199 &
//   npm run test:e2e            # needs `npm i -D playwright && npx playwright install chromium`
//
// Env: OPEN_REVERSE_URL (default http://localhost:5199/), STRIPPED_BINARY (default /bin/ls, skipped if absent).
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('playwright is not installed: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
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
    await page.keyboard.press('x');
    await page.waitForSelector('.xref-table tbody tr');
    await page.keyboard.press('h');
    await page.waitForSelector('.hb:not(:empty)');
    await page.keyboard.press('h');
  });
  for (const f of ['macho-arm64-symbols', 'pe-x86_64-symbols.exe']) {
    await step(`open ${f}`, async () => {
      await page.locator('.brand').click();
      await page.setInputFiles('input[type=file]', FIX + f);
      await page.waitForSelector('.row.insn', { timeout: 120000 });
      await page.waitForSelector('.pline', { timeout: 120000 });
    });
  }
  if (existsSync(STRIPPED)) await step(`stripped ${STRIPPED} with background discovery`, async () => {
    await page.locator('.brand').click();
    await page.setInputFiles('input[type=file]', STRIPPED);
    await page.waitForSelector('.row.insn', { timeout: 180000 });
    await page.waitForFunction(() => /^(\d+) functions/.test(document.querySelector('.side-count')?.textContent ?? '') && Number(document.querySelector('.side-count').textContent.split(' ')[0].replace(/,/g, '')) > 400, null, { timeout: 300000 });
    console.log('     ', await page.locator('.side-count').textContent());
    await page.waitForSelector('.pline', { timeout: 180000 });
  });
  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(failures || errors.length ? 1 : 0);
}
