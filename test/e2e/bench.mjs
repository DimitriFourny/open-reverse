// Performance benchmark of the built site in a real browser (Chromium via Playwright).
//
//   bun run build && bun run preview -- --port 5199 &
//   node test/e2e/bench.mjs [binary ...]      # default: /bin/ls and the fixtures' PE and Mach-O
//
// Each binary opens in a fresh browser profile (a cold import) and is timed through the UI:
//   open → list       the function list shows (import, first index)
//   open → disasm     the listing at the cursor shows
//   open → pseudo     the cursor's pseudocode shows
//   discovery         whole-image function discovery is done (stripped binaries)
//   settle            the first listing and xrefs after discovery (per-revision index builds)
//   fn disasm/graph/pseudo   go to a large function (90th percentile of the sizes): its listing, then
//                     its graph (Space), then its pseudocode
//   whole disasm      `or.search.immediate` of a value no instruction has: every function's
//                     disassembly (what immediate search and diff signatures pay), then again (cached)
//   diff sigs         the signature table a binary diff builds (every function's listing with its CFG)
//   scroll            the linear listing scrolled down by 10 extensions (4000 rows)
//   find              Ctrl+F in the linear listing of a word no line has: reads the rest of the image
//   memory            the engine worker's memory (status bar) and the browser's resident memory (all processes)
// Results print as a table and, with BENCH_JSON=<file>, as JSON.
//
// Env: OPEN_REVERSE_URL (default http://localhost:5199/), PLAYWRIGHT_PATH (a playwright package
// directory, when it is not installed here), BENCH_THREADS (decompile workers, default 1),
// BENCH_SKIP (comma-separated phases to skip, e.g. `diff,pseudo`), BENCH_TIMEOUT (ms per phase, default 600000).
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = process.env.PLAYWRIGHT_PATH ? createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH) : await import('playwright'));
} catch {
  console.error('playwright is not installed: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const FIX = fileURLToPath(new URL('../../vendor/open-decomp/fixtures/bin/', import.meta.url));
const URL_ = process.env.OPEN_REVERSE_URL ?? 'http://localhost:5199/';
const THREADS = process.env.BENCH_THREADS ?? '1';
const SKIP = new Set((process.env.BENCH_SKIP ?? '').split(',').filter(Boolean));
const TIMEOUT = Number(process.env.BENCH_TIMEOUT ?? 600000);
const targets = process.argv.length > 2 ? process.argv.slice(2) : ['/bin/ls', FIX + 'pe-x86_64-symbols.exe', FIX + 'macho-arm64-symbols'];

/** Resident memory of a process and all its descendants (Linux /proc), in bytes. */
function treeRss(pid) {
  let total = 0;
  const stack = [pid];
  while (stack.length) {
    const p = stack.pop();
    try {
      const m = /VmRSS:\s+(\d+) kB/.exec(readFileSync(`/proc/${p}/status`, 'utf8'));
      total += m ? Number(m[1]) * 1024 : 0;
      for (const t of readdirSync(`/proc/${p}/task`))
        for (const c of readFileSync(`/proc/${p}/task/${t}/children`, 'utf8').split(' ').filter(Boolean)) stack.push(Number(c));
    } catch {
      // The process exited meanwhile.
    }
  }
  return total;
}
const mb = (n) => `${Math.round(n / 1e6)} MB`;
const secs = (ms) => (ms === null ? '—' : ms < 10000 ? `${(ms / 1000).toFixed(2)} s` : `${(ms / 1000).toFixed(1)} s`);

async function bench(file) {
  const out = { binary: file, size: readFileSync(file).length };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
  await ctx.addInitScript((threads) => localStorage.setItem('open-reverse.threads', threads), THREADS);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  // The browser's processes are this process's descendants.
  const browserRss = () => treeRss(process.pid) - process.memoryUsage().rss;
  let peak = 0;
  const sampler = setInterval(() => (peak = Math.max(peak, browserRss())), 500);
  const timed = async (name, fn) => {
    if (SKIP.has(name.split(' ')[0])) return;
    const t = Date.now();
    try {
      const extra = await fn();
      out[name] = Date.now() - t;
      if (extra) Object.assign(out, extra);
    } catch (e) {
      out[name] = null;
      out[`${name} error`] = e.message.split('\n')[0];
    }
  };
  const runScript = async (code) => {
    if (!(await page.locator('.script-console').count())) {
      await page.keyboard.press('Shift+F2');
      await page.waitForSelector('.script-editor:focus');
    }
    const before = await page.locator('.script-output .out-input').count();
    await page.fill('.script-editor', code);
    await page.locator('.script-editor').press('Control+Enter');
    await page.waitForFunction((n) => document.querySelectorAll('.script-output .out-input').length > n && !document.querySelector('.script-output .busy'), before, { timeout: TIMEOUT });
    const lines = await page.$$eval('.script-output pre', (els) => els.slice(els.findLastIndex((e) => e.classList.contains('out-input')) + 1).map((e) => `${e.className.replace('out-', '')}: ${e.textContent}`));
    // The script prints its value as JSON.
    const result = lines.findLast((l) => l.startsWith('print: '));
    if (!result) throw new Error(lines.join(' | ') || 'no result');
    return JSON.parse(result.slice(7));
  };
  const closeScript = async () => {
    if (!(await page.locator('.script-console').count())) return;
    await page.locator('.script-console .close').click();
    await page.waitForSelector('.script-console', { state: 'detached' });
  };

  await page.goto(URL_);
  const t0 = Date.now();
  await page.setInputFiles('input[type=file]', file);
  const opened = Promise.all([
    page.waitForSelector('.side-item', { timeout: TIMEOUT }).then(() => (out['open → list'] = Date.now() - t0)),
    page.waitForSelector('.row.insn', { timeout: TIMEOUT }).then(() => (out['open → disasm'] = Date.now() - t0)),
    SKIP.has('pseudo') ? null : page.waitForSelector('.pane-pseudo .pline', { timeout: TIMEOUT }).then(() => (out['open → pseudo'] = Date.now() - t0)),
  ]);
  await opened.catch((e) => (out['open error'] = e.message.split('\n')[0]));
  await page.waitForFunction(() => !document.querySelector('.busy')?.textContent?.includes('Discovering'), null, { timeout: TIMEOUT, polling: 200 });
  out.discovery = Date.now() - t0;
  out.functions = Number((await page.locator('.statusbar span', { hasText: / functions/ }).textContent()).match(/(\d+) functions/)?.[1] ?? 0);
  out['rss after open'] = browserRss();

  // The first requests at the final revision build OpenDecomp's per-revision indexes (every
  // function, symbol and reference record read back): timed apart, so they do not land in
  // whichever phase comes first.
  await timed('settle', async () => {
    await runScript('const f = (await or.functions()).find((x) => !x.importStub); await or.disasm(f); await or.xrefsTo(f); print("[]")');
  });
  // A large function (90th percentile of the sizes, import stubs left out): its listing and
  // graph; a median one: its pseudocode (decompiling takes up to seconds per function).
  const [target, median] = await runScript(
    'const fs = (await or.functions()).filter((f) => !f.importStub).sort((a, b) => a.size - b.size); print(JSON.stringify([0.9, 0.5].map((q) => fs[Math.floor(fs.length * q)]).map((f) => ({ name: f.name, entry: f.entry, size: f.size }))))',
  );
  out.target = `${target.name} (${target.size} bytes)`;
  await closeScript();
  const goto = async (entry) => {
    await page.keyboard.press('g');
    await page.fill('.modal-input', entry);
    await page.keyboard.press('Enter');
  };
  // Without the pseudocode pane (Tab): its decompile would share the engine with the listing.
  await page.keyboard.press('Tab');
  await page.waitForSelector('.pane-pseudo', { state: 'detached', timeout: 5000 }).catch(() => (out['note'] = 'pseudocode pane stayed open'));
  await goto(target.entry);
  await timed('fn disasm', async () => {
    await page.waitForFunction((e) => [...document.querySelectorAll('.row.insn.cur-fn .addr')].some((a) => BigInt(`0x${a.textContent}`) === BigInt(e)), target.entry, { timeout: TIMEOUT, polling: 50 });
  });
  if (!SKIP.has('graph')) {
    const t = Date.now();
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Space');
    await page.waitForSelector('.gline', { timeout: TIMEOUT }).then(() => (out['fn graph'] = Date.now() - t), () => (out['fn graph'] = null));
    await page.keyboard.press('Space');
  }
  await page.keyboard.press('Tab');
  if (!SKIP.has('pseudo')) {
    out['pseudo target'] = `${median.name} (${median.size} bytes)`;
    await goto(median.entry);
    await timed('fn pseudo', async () => {
      // Its pseudocode, or the error OpenDecomp gave.
      await page.waitForFunction(
        (n) => document.querySelector('.pane-pseudo .placeholder.error') || [...document.querySelectorAll('.pane-pseudo .pline')].some((l) => l.textContent.includes(n)),
        // C spells a Mach-O symbol without its leading underscore.
        median.name.replace(/^_/, ''),
        { timeout: Math.min(TIMEOUT, 300000), polling: 100 },
      );
      const error = (await page.locator('.pane-pseudo .placeholder.error').count()) ? await page.locator('.pane-pseudo .placeholder.error').textContent() : null;
      return error ? { 'fn pseudo error': error.replace(/\s+/g, ' ').slice(0, 120) } : undefined;
    });
  }

  // Every function's instructions, as immediate search and the diff's signatures need them.
  await timed('whole disasm', async () => {
    const r = await runScript('const t = performance.now(); const hits = await or.search.immediate(0x7a3c5e1f); print(JSON.stringify([hits.length, Math.round(performance.now() - t)]))');
    return { 'whole disasm hits': r[0] };
  });
  await timed('whole disasm (again)', async () => void (await runScript('print(JSON.stringify([(await or.search.immediate(0x7a3c5e1f)).length]))')));
  await timed('diff sigs', async () => {
    const r = await runScript('let n = 0; for (const f of await or.functions()) if (!f.importStub) n += (await or.disasm(f)).length; print(JSON.stringify([n]))');
    return { instructions: r[0] };
  });
  await closeScript();

  // Scroll the linear listing: 10 extensions of the slice past its bottom edge.
  await timed('scroll', async () => {
    await page.locator('.side-item').first().click();
    await page.waitForSelector('.row.insn.cur-fn', { timeout: TIMEOUT });
    const r = await page.evaluate(async (timeout) => {
      const el = document.querySelector('.code-scroll');
      const last = () => [...el.querySelectorAll('.row .addr')].at(-1)?.textContent;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      el.scrollTop = el.scrollHeight;
      await sleep(300);
      let steps = 0;
      const t = performance.now();
      for (; steps < 10; steps++) {
        const before = last();
        el.scrollTop = el.scrollHeight;
        const s = performance.now();
        while (last() === before && performance.now() - s < timeout) {
          await sleep(10);
          el.scrollTop = el.scrollHeight;
        }
        if (last() === before) break;
      }
      return { steps, ms: performance.now() - t };
    }, 5000);
    return { 'scroll steps': r.steps };
  });

  // Find (Ctrl+F) in the linear listing, from the first function on: a word no line has, so
  // the search reads the rest of the image (Enter goes on past the loaded slice).
  await timed('find', async () => {
    await page.locator('.side-item').first().click();
    await page.waitForSelector('.row.insn.cur-fn', { timeout: TIMEOUT });
    await page.locator('.row.insn.cur-fn').first().click();
    await page.keyboard.press('Control+f');
    await page.keyboard.type('zq_no_such_text');
    await page.keyboard.press('Enter');
    const done = () => {
      const count = document.querySelector('.pane-main .find-count')?.textContent ?? '';
      const toast = document.querySelector('.toast')?.textContent ?? '';
      return /^\d+\/\d+/.test(count) || /^no match$/.test(count) || toast.startsWith('Find:');
    };
    await page.waitForFunction(done, null, { timeout: TIMEOUT, polling: 50 });
    const toast = (await page.locator('.toast').count()) ? await page.locator('.toast').textContent() : null;
    return { 'find result': toast ?? (await page.locator('.pane-main .find-count').textContent()) };
  });
  await page.keyboard.press('Escape');

  out.engine = (await page.locator('.status-memory').textContent().catch(() => '')).replace('engine ', '');
  out['rss peak'] = peak;
  clearInterval(sampler);
  if (errors.length) out.errors = errors.slice(0, 5);
  await browser.close();
  return out;
}

const results = [];
for (const file of targets) {
  if (!existsSync(file)) {
    console.log(`skip ${file} (absent)`);
    continue;
  }
  console.log(`bench ${file}`);
  const r = await bench(file);
  results.push(r);
  for (const [k, v] of Object.entries(r)) {
    if (k === 'binary') continue;
    const text = typeof v === 'number' && /rss/.test(k) ? mb(v) : typeof v === 'number' && !/functions|instructions|hits|steps|size/.test(k) ? secs(v) : JSON.stringify(v);
    console.log(`  ${k.padEnd(22)} ${text}`);
  }
}
if (process.env.BENCH_JSON) writeFileSync(process.env.BENCH_JSON, JSON.stringify(results, null, 2));
