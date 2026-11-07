#!/usr/bin/env node
// OpenReverse server entry point.
//
//   node server/main.ts [options] [binary ...]
//
// Binaries given on the command line are imported into the workspace.

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { buildApp } from './app.ts';
import { Workspace } from './workspace.ts';

const HELP = `Usage: open-reverse [options] [binary ...]

Options:
  --host HOST         Interface to listen on (default 127.0.0.1)
  --port PORT         Port (default 5174)
  --workspace DIR     Workspace directory (default ./workspace, or $OPEN_REVERSE_WORKSPACE)
  --dev               API only; the UI is served by Vite (npm run dev)
  -h, --help          Show this help

OpenReverse has no authentication: anyone who can reach the port can upload
binaries and read their analysis. Keep the default loopback host unless you
put it behind an authenticating proxy.
`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '5174' },
    workspace: { type: 'string' },
    dev: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = new Workspace(
  resolve(values.workspace ?? process.env.OPEN_REVERSE_WORKSPACE ?? join(process.cwd(), 'workspace')),
);
await workspace.init();

for (const path of positionals) {
  const record = await workspace.add(path, await readFile(path));
  console.log(`Imported ${path} as ${record.id}`);
}

const webRoot = join(repoRoot, 'web', 'dist');
if (!values.dev && !existsSync(join(webRoot, 'index.html')))
  console.warn('web/dist is missing: run "npm run build" (or "npm run dev" for development).');

const app = await buildApp({
  workspace,
  webRoot: values.dev || !existsSync(webRoot) ? undefined : webRoot,
  logger: values.dev,
});
const port = Number(values.port);
await app.listen({ host: values.host, port });
console.log(`OpenReverse ${values.dev ? 'API' : ''} listening on http://${values.host}:${port}  (workspace: ${workspace.root})`);

for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.once(signal, () => {
    void app.close().then(() => process.exit(0));
  });
