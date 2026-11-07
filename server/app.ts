// HTTP API. All routes live under /api; binaries are addressed by workspace id.

import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { parseAddress, canon } from './hex.ts';
import { AnalysisSession, ApiError } from './session.ts';
import type { Workspace } from './workspace.ts';

export interface AppOptions {
  workspace: Workspace;
  /** Directory with the built web UI, served at /. */
  webRoot?: string | undefined;
  logger?: boolean;
  maxUploadBytes?: number;
}

export async function buildApp(options: AppOptions): Promise<FastifyInstance> {
  const { workspace } = options;
  const app = Fastify({
    logger: options.logger ?? false,
    bodyLimit: options.maxUploadBytes ?? 1024 * 1024 * 1024,
  });
  const sessions = new Map<string, Promise<AnalysisSession>>();

  app.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, (_req, body, done) => done(null, body));

  app.setErrorHandler((error: Error & { statusCode?: number }, _req, reply) => {
    const status = error instanceof ApiError ? error.status : (error.statusCode ?? 500);
    if (status >= 500) app.log.error(error);
    void reply.status(status).send({ error: error.message });
  });

  function session(id: string): Promise<AnalysisSession> {
    let s = sessions.get(id);
    if (!s) {
      s = (async () => {
        const record = await workspace.get(id);
        if (!record) throw new ApiError(404, `Unknown binary ${id}`);
        return AnalysisSession.open(workspace, record);
      })();
      sessions.set(id, s);
      s.catch(() => sessions.delete(id));
    }
    return s;
  }

  const S = (req: FastifyRequest) => session((req.params as { bid: string }).bid);
  const query = (req: FastifyRequest) => req.query as Record<string, string | undefined>;
  const addrParam = (value: string | undefined, name = 'addr'): string => {
    const parsed = value === undefined ? null : parseAddress(value);
    if (parsed === null) throw new ApiError(400, `Invalid or missing ${name}`);
    return canon(parsed);
  };
  const oneOf = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T =>
    value !== undefined && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;

  // ------------------------------------------------------------ binaries

  app.get('/api/binaries', async () => ({ binaries: await workspace.list(), open: [...sessions.keys()] }));

  app.post('/api/binaries', async (req) => {
    const name = query(req).name;
    if (!name) throw new ApiError(400, 'Missing ?name=');
    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) throw new ApiError(400, 'Send the binary as application/octet-stream');
    return workspace.add(name, body);
  });

  app.delete('/api/binaries/:bid', async (req) => {
    const { bid } = req.params as { bid: string };
    const s = sessions.get(bid);
    if (s) {
      sessions.delete(bid);
      await (await s.catch(() => null))?.close();
    }
    await workspace.remove(bid);
    return { ok: true };
  });

  app.post('/api/binaries/:bid/close', async (req) => {
    const { bid } = req.params as { bid: string };
    const s = sessions.get(bid);
    sessions.delete(bid);
    if (s) await (await s.catch(() => null))?.close();
    return { ok: true };
  });

  // ----------------------------------------------------------- analysis

  app.get('/api/b/:bid/info', async (req) => (await S(req)).info());
  app.get('/api/b/:bid/functions', async (req) => {
    const s = await S(req);
    const index = await s.functions();
    return { revision: index.revision, indexState: index.indexState, discovery: s.discovery, functions: index.list };
  });
  app.get('/api/b/:bid/function-at', async (req) => ({ function: await (await S(req)).functionAt(addrParam(query(req).addr)) }));
  app.get('/api/b/:bid/functions/:fid/listing', async (req) =>
    (await S(req)).listing((req.params as { fid: string }).fid),
  );
  app.get('/api/b/:bid/functions/:fid/decompile', async (req) => {
    const q = query(req);
    return (await S(req)).decompile((req.params as { fid: string }).fid, {
      language: oneOf(q.language, ['c-like', 'python-like'] as const, 'c-like'),
      inference: oneOf(q.inference, ['proven', 'likely'] as const, 'proven'),
      view: oneOf(q.view, ['source', 'checked'] as const, 'source'),
    });
  });
  app.get('/api/b/:bid/xrefs', async (req) => {
    const q = query(req);
    const direction = oneOf(q.direction, ['incoming', 'outgoing', 'both'] as const, 'incoming');
    if (q.id) return { xrefs: await (await S(req)).xrefs({ id: q.id }, direction) };
    return { xrefs: await (await S(req)).xrefs({ addr: addrParam(q.addr) }, direction) };
  });
  app.get('/api/b/:bid/strings', async (req) => ({ strings: await (await S(req)).strings() }));
  app.get('/api/b/:bid/symbols', async (req) => ({ symbols: await (await S(req)).symbols() }));
  app.get('/api/b/:bid/sections', async (req) => ({ sections: await (await S(req)).sections() }));
  app.get('/api/b/:bid/headers', async (req) => ({ headers: await (await S(req)).headers() }));
  app.get('/api/b/:bid/types', async (req) => (await S(req)).types());
  app.get('/api/b/:bid/memory', async (req) => {
    const q = query(req);
    return (await S(req)).memory(addrParam(q.addr), Number(q.length ?? 4096) || 4096);
  });
  app.get('/api/b/:bid/comments', async (req) => ({ comments: await (await S(req)).comments() }));

  app.post('/api/b/:bid/rename', async (req) => {
    const body = (req.body ?? {}) as { id?: string; addr?: string; name?: string };
    if (typeof body.name !== 'string') throw new ApiError(400, 'Missing name');
    const s = await S(req);
    if (body.id) return s.rename({ id: body.id }, body.name);
    return s.rename({ addr: addrParam(body.addr) }, body.name);
  });
  app.post('/api/b/:bid/comment', async (req) => {
    const body = (req.body ?? {}) as { addr?: string; text?: string };
    return { comments: await (await S(req)).comment(addrParam(body.addr), String(body.text ?? '')) };
  });

  app.all('/api/*', async () => {
    throw new ApiError(404, 'Unknown API route');
  });

  // ----------------------------------------------------------- web UI

  if (options.webRoot) {
    const { default: fastifyStatic } = await import('@fastify/static');
    await app.register(fastifyStatic, { root: options.webRoot });
    app.setNotFoundHandler((_req, reply) => reply.sendFile('index.html'));
  }

  app.addHook('onClose', async () => {
    await Promise.all(
      [...sessions.values()].map(async (s) => (await s.catch(() => null))?.close()),
    );
    sessions.clear();
  });

  return app;
}
