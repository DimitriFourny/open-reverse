// Getting data in and out of the browser: project archives, the pseudocode
// export, and storage accounting. Runs in the engine worker.

import type { BinarySession } from '@od/api/index.js';
import type { AnalysisSession } from './session.ts';
import type { TaskContext } from './tasks.ts';
import { vfs } from './vfs.ts';
import type { BinaryRecord, Workspace } from './workspace.ts';
import { zipEncode, type ZipEntry } from './zip.ts';
import type { ProjectArchive } from './archive.ts';

/** Waits until no database of the subtree is inside a transaction. */
async function quiesce(prefix: string, signal: AbortSignal): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (vfs.liveBusy(prefix)) {
    signal.throwIfAborted();
    if (Date.now() > deadline) throw new Error('The project stayed busy for a minute; try exporting again');
    await new Promise((r) => setTimeout(r, 20));
  }
}

/**
 * A consistent copy of a binary's files. The binary's directory must be
 * loaded. Open SQLite databases are serialized at an instant where none has
 * an open transaction, and every file is copied in the same synchronous step,
 * so the project database and its artifact files agree.
 */
export async function snapshotProject(workspace: Workspace, record: BinaryRecord, ctx: TaskContext): Promise<ProjectArchive> {
  const root = workspace.projectRoot(record.id);
  ctx.progress({ phase: 'snapshot', done: 0, total: null });
  await quiesce(workspace.dir(record.id), ctx.signal);
  // No await from here on: nothing else runs while the snapshot is taken.
  const binary = vfs.snapshot(workspace.binaryPath(record));
  const project = new Map<string, Uint8Array>();
  for (const [path, node] of vfs.nodes)
    if (node.kind === 'file' && path.startsWith(`${root}/`)) project.set(path.slice(root.length + 1), vfs.snapshot(path));
  const comments = await workspace.comments(record.id);
  const data = await workspace.data(record.id);
  return { record, binary, comments, data, project };
}

// ---------------------------------------------------------------- pseudocode

export interface PseudocodeExportSummary {
  functions: number;
  complete: number;
  partial: number;
  failed: number;
  files: number;
}

/**
 * Every function's pseudocode as a zip, written by OpenDecomp's own CLI
 * exporter (`open-decomp export` layout: functions/NAME@0xADDR.c|py, types.h
 * with `structures: 'external'`, index.tsv, strings.tsv, imports.tsv,
 * exports.tsv, README.txt) into scratch space, then zipped.
 */
export async function exportPseudocode(
  session: AnalysisSession,
  options: { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely' },
  ctx: TaskContext,
): Promise<{ name: string; bytes: Uint8Array; summary: PseudocodeExportSummary }> {
  const { exportBinary } = await import('@od/cli/export.js');
  const index = await session.functions();
  const names = new Map(index.list.map((f) => [f.id, f.name]));
  let total: number | null = null;
  let done = 0;
  const target = session.binary;
  // Report each decompile as it starts and ends; everything else passes through.
  const reporting = new Proxy(target, {
    get(t, key) {
      if (key === 'decompileFunction')
        return async (id: string, ...rest: unknown[]) => {
          ctx.progress({ phase: 'decompile', done, total, detail: names.get(id) ?? id });
          try {
            // OpenDecomp's job deadline counts from submission, queueing for a helper included,
            // and an expired job restarts the project owner (failing every request in flight).
            // Give export decompiles the longest deadline OpenDecomp accepts.
            const [opts, ...more] = rest as [{ budget?: Record<string, unknown> } | undefined, ...unknown[]];
            const withDeadline = { ...opts, budget: { deadline_ms: 300_000, ...opts?.budget } };
            return await session.gate.shared(() => (t.decompileFunction as (...a: unknown[]) => Promise<unknown>).call(t, id, withDeadline, ...more));
          } finally {
            done++;
            ctx.progress({ phase: 'decompile', done, total, detail: names.get(id) ?? id });
          }
        };
      if (key === 'types' || key === 'typeDeclarations')
        return (...args: unknown[]) => session.gate.exclusive(() => (t[key] as (...a: unknown[]) => Promise<unknown>).apply(t, args));
      const value = Reflect.get(t, key, t) as unknown;
      return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(t) : value;
    },
  }) as BinarySession;
  const out = `/tmp/open-reverse-export-${session.record.id}-${Date.now().toString(36)}`;
  const folder = `${session.record.name}-${options.language === 'python-like' ? 'py' : 'c'}`;
  ctx.progress({ phase: 'prepare', done: 0, total: null });
  try {
    const summary = await exportBinary(
      reporting,
      { out, language: options.language, inference: options.inference, jobs: session.threads > 1 ? 2 : 1 },
      ctx.signal,
      (message: string) => {
        const m = /^export: (\d+) functions/.exec(message);
        if (m) {
          total = Number(m[1]);
          ctx.progress({ phase: 'decompile', done, total });
        }
      },
    );
    ctx.signal.throwIfAborted();
    const entries: ZipEntry[] = [];
    const walk = (dir: string, rel: string) => {
      for (const child of vfs.readdir(dir)) {
        const path = `${dir}/${child}`;
        if (vfs.stat(path).kind === 'dir') walk(path, `${rel}${child}/`);
        else if (!child.startsWith('.')) entries.push({ path: `${folder}/${rel}${child}`, data: vfs.read(path) });
      }
    };
    walk(out, '');
    entries.sort((a, b) => (a.path < b.path ? -1 : 1));
    const bytes = await zipEncode(entries, {
      signal: ctx.signal,
      onEntry: (i) => ctx.progress({ phase: 'zip', done: i + 1, total: entries.length }),
    });
    return {
      name: `${folder}.zip`,
      bytes,
      summary: { functions: summary.functions, complete: summary.complete, partial: summary.partial, failed: summary.failed, files: summary.files },
    };
  } finally {
    vfs.rm(out, { recursive: true, force: true });
  }
}

// ------------------------------------------------------------------- storage

export interface BinaryUsage {
  id: string;
  binary: number;
  project: number;
  meta: number;
  total: number;
}

export async function storageUsage(workspace: Workspace): Promise<BinaryUsage[]> {
  const out: BinaryUsage[] = [];
  for (const record of workspace.list()) {
    const sizes = await vfs.usage(workspace.dir(record.id));
    const binaryPath = workspace.binaryPath(record);
    const root = `${workspace.projectRoot(record.id)}/`;
    let binary = 0;
    let project = 0;
    for (const [path, size] of sizes) {
      if (path === binaryPath) binary += size;
      else if (path.startsWith(root)) project += size;
      else project += size;
    }
    const meta = workspace.metaPaths(record.id).reduce((n, p) => n + (vfs.get(p) ? vfs.size(p) : 0), 0);
    out.push({ id: record.id, binary, project, meta, total: binary + project + meta });
  }
  return out;
}
