// The engine's public methods (what the UI calls through the worker RPC).
// One AnalysisSession per open binary.

import { canon, parseAddress } from './hex.ts';
import { AnalysisSession, ApiError } from './session.ts';
import { vfs } from './vfs.ts';
import { Workspace, type BinaryRecord } from './workspace.ts';

type Target = { id?: string; addr?: string };
type DecompileOptions = { language: 'c-like' | 'python-like'; inference: 'proven' | 'likely'; view: 'source' | 'checked' };

function addr(value: string | undefined, name = 'addr'): string {
  const parsed = value === undefined ? null : parseAddress(value);
  if (parsed === null) throw new ApiError(400, `Invalid or missing ${name}`);
  return canon(parsed);
}

export class Engine {
  readonly workspace = new Workspace();
  readonly #sessions = new Map<string, Promise<AnalysisSession>>();

  async init(): Promise<void> {
    await this.workspace.init();
  }

  #session(id: string): Promise<AnalysisSession> {
    let s = this.#sessions.get(id);
    if (!s) {
      s = (async () => {
        const record = this.workspace.get(id);
        if (!record) throw new ApiError(404, `Unknown binary ${id}`);
        await this.workspace.load(id);
        return AnalysisSession.open(this.workspace, record);
      })();
      this.#sessions.set(id, s);
      s.catch(() => this.#sessions.delete(id));
    }
    return s;
  }

  async #closeSession(id: string): Promise<void> {
    const s = this.#sessions.get(id);
    if (!s) return;
    this.#sessions.delete(id);
    await (await s.catch(() => null))?.close();
  }

  // ------------------------------------------------------------ binaries

  binaries(): { binaries: BinaryRecord[]; open: string[] } {
    return { binaries: this.workspace.list(), open: [...this.#sessions.keys()] };
  }

  async upload(name: string, bytes: Uint8Array): Promise<BinaryRecord> {
    if (bytes.byteLength === 0) throw new ApiError(400, 'The file is empty');
    return this.workspace.add(name, bytes);
  }

  async remove(bid: string): Promise<{ ok: true }> {
    await this.#closeSession(bid);
    await this.workspace.remove(bid);
    return { ok: true };
  }

  async close(bid: string): Promise<{ ok: true }> {
    await this.#closeSession(bid);
    await vfs.flush();
    await this.workspace.unload(bid);
    return { ok: true };
  }

  /** The raw bytes of a stored binary (download). */
  async download(bid: string): Promise<{ name: string; bytes: Uint8Array }> {
    const record = this.workspace.get(bid);
    if (!record) throw new ApiError(404, `Unknown binary ${bid}`);
    await this.workspace.load(bid);
    return { name: record.name, bytes: vfs.read(this.workspace.binaryPath(record)).slice() };
  }

  async flush(): Promise<void> {
    await vfs.flush();
  }

  // ----------------------------------------------------------- analysis

  async info(bid: string) {
    return (await this.#session(bid)).info();
  }

  async functions(bid: string) {
    const s = await this.#session(bid);
    const index = await s.functions();
    return { revision: index.revision, indexState: index.indexState, discovery: s.discovery, functions: index.list };
  }

  async functionAt(bid: string, a: string) {
    return { function: await (await this.#session(bid)).functionAt(addr(a)) };
  }

  async listing(bid: string, fid: string) {
    return (await this.#session(bid)).listing(fid);
  }

  async decompile(bid: string, fid: string, options: DecompileOptions, signal?: AbortSignal) {
    return (await this.#session(bid)).decompile(fid, options, signal);
  }

  async xrefs(bid: string, target: Target, direction: 'incoming' | 'outgoing' | 'both' = 'incoming') {
    const s = await this.#session(bid);
    return { xrefs: await s.xrefs(target.id ? { id: target.id } : { addr: addr(target.addr) }, direction) };
  }

  async strings(bid: string) {
    return { strings: await (await this.#session(bid)).strings() };
  }

  async symbols(bid: string) {
    return { symbols: await (await this.#session(bid)).symbols() };
  }

  async sections(bid: string) {
    return { sections: await (await this.#session(bid)).sections() };
  }

  async headers(bid: string) {
    return { headers: await (await this.#session(bid)).headers() };
  }

  async types(bid: string) {
    return (await this.#session(bid)).types();
  }

  async memory(bid: string, a: string, length: number) {
    return (await this.#session(bid)).memory(addr(a), Number(length) || 4096);
  }

  async comments(bid: string) {
    return { comments: await (await this.#session(bid)).comments() };
  }

  async rename(bid: string, target: Target, name: string) {
    if (typeof name !== 'string') throw new ApiError(400, 'Missing name');
    const s = await this.#session(bid);
    const result = target.id ? await s.rename({ id: target.id }, name) : await s.rename({ addr: addr(target.addr) }, name);
    void vfs.flush();
    return result;
  }

  async comment(bid: string, a: string, text: string) {
    const comments = await (await this.#session(bid)).comment(addr(a), String(text ?? ''));
    void vfs.flush();
    return { comments };
  }
}
