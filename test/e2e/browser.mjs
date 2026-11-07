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
