import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

// OpenReverse is a static site: OpenDecomp runs in a Web Worker in the browser.
// Node built-ins are replaced by shims (web/src/engine/shims), and three
// OpenDecomp/dependency sources get small build-time rewrites (below). The
// submodule itself is left untouched.

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const shim = (name: string) => here(`./src/engine/shims/${name}`);
const OD = here('../vendor/open-decomp/dist/src');
const ODM = here('../vendor/open-decomp/node_modules');

const nodeShims: Record<string, string> = {
  fs: shim('fs.ts'),
  'fs/promises': shim('fs-promises.ts'),
  path: shim('path.ts'),
  crypto: shim('crypto.ts'),
  sqlite: shim('sqlite.ts'),
  zlib: shim('zlib.ts'),
  os: shim('os.ts'),
  url: shim('url.ts'),
  util: shim('util.ts'),
  v8: shim('v8.ts'),
  perf_hooks: shim('perf_hooks.ts'),
  'timers/promises': shim('timers-promises.ts'),
  child_process: shim('child_process.ts'),
  readline: shim('stub.ts'),
  stream: shim('stub.ts'),
  net: shim('stub.ts'),
  http: shim('stub.ts'),
  https: shim('stub.ts'),
};

function replaceOnce(code: string, from: string, to: string, file: string): string {
  if (!code.includes(from)) throw new Error(`open-reverse build: expected source not found in ${file}:\n${from}`);
  return code.replace(from, to);
}

function openDecompBrowser(): Plugin {
  return {
    name: 'open-reverse:open-decomp-browser',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0]!;
      // iced-x86 ships only a CommonJS wasm-bindgen build that reads its .wasm
      // from disk: expose it as ESM and take the bytes the worker preloaded.
      if (file.endsWith('/iced-x86/iced_x86.js')) {
        let code = readFileSync(file, 'utf8');
        code = replaceOnce(code, 'const { TextDecoder, TextEncoder } = require(`util`);', '', file);
        code = replaceOnce(
          code,
          "const path = require('path').join(__dirname, 'iced_x86_bg.wasm');\nconst bytes = require('fs').readFileSync(path);",
          'const bytes = globalThis.__icedWasmBytes;',
          file,
        );
        const names = [...new Set([...code.matchAll(/^module\.exports\.([A-Za-z_$][\w$]*)\s*=/gm)].map((m) => m[1]!))];
        const bindings = names.map((n, i) => `const __iced${i} = module.exports.${n};`).join('\n');
        const exports = names.map((n, i) => `__iced${i} as ${n}`).join(', ');
        return `const module = { exports: {} };\n${code}\n${bindings}\nexport { ${exports} };\nexport default module.exports;\n`;
      }
      return null;
    },
    transform(code, id) {
      const file = id.split('?')[0]!;
      if (!file.startsWith(OD)) return null;
      // Each in-thread "child process" gets its own process object.
      // A failure outside a command's own error reply stops the owner; say why in the console.
      if (file.endsWith('/workers/runtime.js'))
        return replaceOnce(
          replaceOnce(code, 'export function runProjectWorker(handler, observer) {', 'export function runProjectWorker(handler, observer, process = globalThis.process) {', file),
          '            .catch(() => {\n            process.exitCode = 1;',
          "            .catch((__error) => {\n            console.error('[open-reverse] project owner stopped', __error);\n            process.exitCode = 1;",
          file,
        );
      // The C++ demangler's WASM is fetched as a bundled asset.
      if (file.endsWith('/metadata/symbols/index.js'))
        return `import __geckoWasmUrl from 'gecko-profiler-demangle/index_bg.wasm?url';\n${replaceOnce(
          code,
          "await readFile(new URL(import.meta.resolve('gecko-profiler-demangle/index_bg.wasm')))",
          'new Uint8Array(await (await fetch(__geckoWasmUrl)).arrayBuffer())',
          file,
        )}`;
      return null;
    },
  };
}

const alias = [
  { find: /^@od\/(.*)$/, replacement: `${OD}/$1` },
  { find: /^@odm\/(.*)$/, replacement: `${ODM}/$1` },
  ...Object.entries(nodeShims).flatMap(([name, file]) => [
    { find: new RegExp(`^node:${name.replace('/', '\\/')}$`), replacement: file },
    { find: new RegExp(`^${name.replace('/', '\\/')}$`), replacement: file },
  ]),
];

export default defineConfig({
  root: here('.'),
  base: './',
  plugins: [openDecompBrowser(), react()],
  resolve: { alias },
  worker: { format: 'es', plugins: () => [openDecompBrowser()] },
  optimizeDeps: { exclude: ['@sqlite.org/sqlite-wasm'] },
  server: { port: 5173, fs: { allow: [here('..')] } },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2023', chunkSizeWarningLimit: 4000, minify: process.env.OR_MINIFY !== '0', sourcemap: process.env.OR_MINIFY === '0' },
});
