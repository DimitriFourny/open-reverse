// Library signatures (IDA FLIRT, Binary Ninja WARP): OpenDecomp's signature format, generator
// and matcher (vendor/open-decomp src/metadata/library-signatures) used from the browser.
//
//   - bundled libraries: web/public/signatures/<id>.sigz, gzip JSON (scripts/signatures.ts), listed in
//     index.json and fetched only when applied;
//   - the user's libraries: /workspace/signatures/<id>.json, made from a dropped `.a`/`.o` or
//     from a binary with symbols (the "signature kit" workflow), kept with the user's data.

import {
  archiveMembers,
  buildSignatureLibrary,
  decodeSignatureLibrary,
  encodeSignatureLibrary,
  objectFunctions,
  ObjectFormatError,
  type SignatureArchitecture,
  type SignatureLibrary,
  type SignatureSource,
} from '@od/metadata/library-signatures/index.js';
import { vfs } from './vfs.ts';

export type { SignatureLibrary };
export { linkedSource, suggestLibraries, type LinkedInstruction } from './sigsource.ts';

/** One library the Signatures panel lists. */
export interface SignatureInfo {
  id: string;
  title: string;
  kind: 'bundled' | 'user';
  architecture: SignatureArchitecture;
  /** Signatures in the library. */
  signatures: number;
  /** Size of its file (compressed for a bundled one). */
  bytes: number;
  source: string;
  /** Nominal library whose C declarations matched functions get (`libc.so.6`), or null. */
  contracts: string | null;
  /** Strings (regular expressions) that suggest the library in a binary (bundled only). */
  markers?: string[];
  /** Bundled: file name under signatures/. */
  file?: string;
}

const USER_DIR = '/workspace/signatures';
const enc = new TextEncoder();
const dec = new TextDecoder();

/** Signature libraries the engine can apply: the bundled index and the user's. */
export class SignatureStore {
  #bundled: Promise<SignatureInfo[]> | null = null;
  #base = '';
  readonly #loaded = new Map<string, Promise<SignatureLibrary>>();

  async init(): Promise<void> {
    await vfs.mount(USER_DIR);
    vfs.mkdir(USER_DIR, true);
  }

  /** `base`: the URL of the bundled signatures directory (the page knows where it is served). */
  async list(base: string): Promise<SignatureInfo[]> {
    if (base !== this.#base || !this.#bundled) {
      this.#base = base;
      this.#bundled = fetch(new URL('index.json', base))
        .then((r) => (r.ok ? (r.json() as Promise<Omit<SignatureInfo, 'kind'>[]>) : []))
        .then((items) => items.map((item) => ({ ...item, kind: 'bundled' as const })))
        .catch(() => []);
    }
    return [...(await this.#bundled), ...this.#user()];
  }

  #user(): SignatureInfo[] {
    return vfs
      .readdir(USER_DIR)
      .filter((name) => name.endsWith('.json'))
      .flatMap((name) => {
        try {
          const bytes = vfs.read(`${USER_DIR}/${name}`);
          const library = this.#cached(name.slice(0, -5), bytes);
          return [info(library, 'user', bytes.length)];
        } catch {
          return [];
        }
      });
  }

  readonly #userCache = new Map<string, { size: number; library: SignatureLibrary }>();
  #cached(id: string, bytes: Uint8Array): SignatureLibrary {
    const hit = this.#userCache.get(id);
    if (hit && hit.size === bytes.length) return hit.library;
    const library = decodeSignatureLibrary(dec.decode(bytes));
    this.#userCache.set(id, { size: bytes.length, library });
    return library;
  }

  /** A library by id: the user's from the workspace, a bundled one fetched (once) and inflated. */
  async load(id: string): Promise<SignatureLibrary> {
    const path = `${USER_DIR}/${fileId(id)}.json`;
    if (vfs.get(path)) return this.#cached(fileId(id), vfs.read(path));
    let p = this.#loaded.get(id);
    if (!p) {
      p = (async () => {
        const entry = (await this.list(this.#base)).find((item) => item.id === id && item.kind === 'bundled');
        if (!entry?.file) throw new Error(`Unknown signature library ${id}`);
        const response = await fetch(new URL(entry.file, this.#base));
        if (!response.ok) throw new Error(`Could not fetch ${entry.file} (HTTP ${response.status})`);
        return decodeSignatureLibrary(await inflated(new Uint8Array(await response.arrayBuffer())));
      })();
      this.#loaded.set(id, p);
      p.catch(() => this.#loaded.delete(id));
    }
    return p;
  }

  /** Store a user library (replacing one with the same id). */
  save(library: SignatureLibrary): SignatureInfo {
    const bytes = enc.encode(encodeSignatureLibrary(library));
    vfs.write(`${USER_DIR}/${fileId(library.id)}.json`, bytes);
    this.#userCache.delete(fileId(library.id));
    return info(library, 'user', bytes.length);
  }

  remove(id: string): void {
    const path = `${USER_DIR}/${fileId(id)}.json`;
    if (vfs.get(path)) vfs.unlink(path);
    this.#userCache.delete(fileId(id));
  }

  /** The file of a user library (to download and share). */
  file(id: string): { name: string; bytes: Uint8Array } {
    const path = `${USER_DIR}/${fileId(id)}.json`;
    if (!vfs.get(path)) throw new Error(`Unknown signature library ${id}`);
    return { name: `${fileId(id)}.sig.json`, bytes: vfs.read(path).slice() };
  }
}

/** The text of a gzip file, or of a file a server already inflated (Content-Encoding). */
async function inflated(bytes: Uint8Array): Promise<string> {
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return dec.decode(bytes);
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

/** A file-safe library id. */
function fileId(id: string): string {
  return id.replace(/[^A-Za-z0-9._+-]/g, '_').slice(0, 120);
}

function info(library: SignatureLibrary, kind: 'bundled' | 'user', bytes: number): SignatureInfo {
  return {
    id: library.id,
    title: library.title,
    kind,
    architecture: library.architecture,
    signatures: library.functions.length,
    bytes,
    source: library.source,
    contracts: library.contracts,
  };
}

/** A library id for a user library named `name` (unique enough: the name and a content hash). */
export function userLibraryId(name: string, architecture: SignatureArchitecture, salt: string): string {
  const base = name.replace(/\.(a|o|lib|obj)$/i, '').replace(/[^A-Za-z0-9._+-]/g, '_').slice(0, 64) || 'library';
  return `user-${base}-${architecture}-${salt.slice(0, 8)}`;
}

/** Function bodies of dropped static libraries or objects (ELF x86-64 `.a` / `.o`). */
export function objectSources(files: { name: string; bytes: Uint8Array }[]): SignatureSource[] {
  const out: SignatureSource[] = [];
  for (const file of files) {
    const elf = file.bytes[0] === 0x7f && file.bytes[1] === 0x45;
    const members = elf ? [{ name: file.name, bytes: file.bytes }] : archiveMembers(file.bytes);
    for (const member of members) {
      if (member.bytes[0] !== 0x7f) continue; // not an ELF object (a linker script, another format)
      try {
        out.push(...objectFunctions(member));
      } catch (error) {
        // One object of another ISA or type does not spoil the archive; a lone one does.
        if (members.length === 1 || !(error instanceof ObjectFormatError)) throw error;
      }
    }
  }
  return out;
}

export { buildSignatureLibrary, ObjectFormatError };
