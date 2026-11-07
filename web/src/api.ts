// Typed client for the OpenReverse server API (server/app.ts).

export interface BinaryRecord {
  id: string;
  name: string;
  sha256: string;
  size: number;
  addedAt: string;
}

export interface FunctionSummary {
  id: string;
  name: string;
  originalName: string | null;
  renamed: boolean;
  entry: string;
  size: number;
  boundary: string;
  analysis: string;
  importStub: boolean;
}

export interface Discovery {
  state: 'idle' | 'running' | 'done' | 'failed';
  message: string | null;
}

export interface ImageInfo {
  record: BinaryRecord;
  image: {
    id: string;
    sha256: string;
    byte_length: string;
    image_base: string | null;
    target: { format: string; architecture: string; abi: string; endian: string; address_bits: number };
    entry_points: { value: string }[];
    capabilities: { layer: string; feature: string; status: string; limitations: string[] }[];
  };
  revision: number;
  projectPath: string;
  functionCount: number;
  functionIndex: string;
  discovery: Discovery;
}

export interface OperandRef {
  text: string;
  addr: string;
  kind: 'function' | 'string' | 'code' | 'data';
  label: string;
}

export interface Instruction {
  addr: string;
  size: number;
  bytes: string;
  mnemonic: string;
  operands: string;
  valid: boolean;
  flow: { kind: string; targets: string[]; conditional: boolean };
  refs: OperandRef[];
}

export interface Block {
  id: string;
  start: string;
  insns: string[];
  edges: { to: string | null; target: string | null; kind: string; conditional: boolean }[];
}

export interface Listing {
  function: FunctionSummary;
  instructions: Instruction[];
  blocks: Block[];
  comments: Record<string, string>;
}

export interface Mapping {
  start: number;
  end: number;
  addrs: string[];
}

export interface Decompilation {
  function: FunctionSummary;
  text: string;
  language: string;
  state: string;
  cache: string;
  diagnostics: { severity: string; code: string; message: string }[];
  declarationSpan: { start: number; end: number } | null;
  mappings: Mapping[];
}

export interface Xref {
  from: string | null;
  to: string | null;
  fromFunction: { id: string; name: string; entry: string } | null;
  toName: string | null;
  kind: string;
  status: string;
  role: string;
}

export interface StringItem {
  addr: string;
  text: string;
  encoding: string;
  id: string;
}

export interface SymbolItem {
  id: string;
  name: string;
  kind: string;
  addr: string | null;
  size: number;
  binding: string | null;
}

export interface Section {
  id: string;
  name: string;
  kind: string;
  start: string | null;
  size: number;
  fileOffset: string | null;
  fileSize: number;
  permissions: string[];
}

export interface MemoryChunk {
  addr: string;
  length: number;
  segments: { kind: string; start: string; size: number; hex: string | null }[];
}

export interface DecompileOptions {
  language: 'c-like' | 'python-like';
  inference: 'proven' | 'likely';
  view: 'source' | 'checked';
}

async function request<T>(method: string, url: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const init: RequestInit = { method, ...(signal ? { signal } : {}) };
  if (body instanceof Blob) {
    init.body = body;
    init.headers = { 'content-type': 'application/octet-stream' };
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'content-type': 'application/json' };
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (!res.ok) throw new Error((data as { error?: string } | null)?.error ?? `${res.status} ${res.statusText}`);
  return data as T;
}

const b = (bid: string) => `/api/b/${encodeURIComponent(bid)}`;
const q = (params: Record<string, string>) => new URLSearchParams(params).toString();

export const api = {
  binaries: () => request<{ binaries: BinaryRecord[]; open: string[] }>('GET', '/api/binaries'),
  upload: (file: File) => request<BinaryRecord>('POST', `/api/binaries?${q({ name: file.name })}`, file),
  remove: (bid: string) => request<{ ok: true }>('DELETE', `/api/binaries/${bid}`),
  info: (bid: string) => request<ImageInfo>('GET', `${b(bid)}/info`),
  functions: (bid: string) =>
    request<{ revision: number; indexState: string; discovery: Discovery; functions: FunctionSummary[] }>('GET', `${b(bid)}/functions`),
  functionAt: (bid: string, addr: string) => request<{ function: FunctionSummary | null }>('GET', `${b(bid)}/function-at?${q({ addr })}`),
  listing: (bid: string, fid: string) => request<Listing>('GET', `${b(bid)}/functions/${fid}/listing`),
  decompile: (bid: string, fid: string, o: DecompileOptions, signal?: AbortSignal) =>
    request<Decompilation>('GET', `${b(bid)}/functions/${fid}/decompile?${q({ ...o })}`, undefined, signal),
  xrefs: (bid: string, target: { id?: string; addr?: string }, direction = 'incoming') =>
    request<{ xrefs: Xref[] }>('GET', `${b(bid)}/xrefs?${q({ ...(target.id ? { id: target.id } : { addr: target.addr! }), direction })}`),
  strings: (bid: string) => request<{ strings: StringItem[] }>('GET', `${b(bid)}/strings`),
  symbols: (bid: string) => request<{ symbols: SymbolItem[] }>('GET', `${b(bid)}/symbols`),
  sections: (bid: string) => request<{ sections: Section[] }>('GET', `${b(bid)}/sections`),
  types: (bid: string) => request<{ text: string; state: string }>('GET', `${b(bid)}/types`),
  memory: (bid: string, addr: string, length: number) => request<MemoryChunk>('GET', `${b(bid)}/memory?${q({ addr, length: String(length) })}`),
  comments: (bid: string) => request<{ comments: Record<string, string> }>('GET', `${b(bid)}/comments`),
  rename: (bid: string, target: { id?: string; addr?: string }, name: string) =>
    request<{ revision: number }>('POST', `${b(bid)}/rename`, { ...target, name }),
  comment: (bid: string, addr: string, text: string) =>
    request<{ comments: Record<string, string> }>('POST', `${b(bid)}/comment`, { addr, text }),
};
