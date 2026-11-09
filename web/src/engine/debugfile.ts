// Companion debug files: what the user can add to a binary so OpenDecomp recovers its
// debug information (names, prototypes, types, source lines).
//
//   dsym  the DWARF file inside a Mach-O `.dSYM` bundle (Contents/Resources/DWARF/<name>),
//         added as that file or as a zipped `.dSYM` bundle; matched by LC_UUID
//   elf   a separate ELF debug file (`objcopy --only-keep-debug`); matched by GNU build ID,
//         else by the binary's .gnu_debuglink CRC-32
//   pdb   a PE program database: recognised and refused for now (no PDB reader yet)
//
// Matching is OpenDecomp's: the engine only recognises the file, stores it next to the
// binary and opens the pair; a mismatch fails the open with OpenDecomp's message.

import { zipDecode, zipEntryNames, ZipError } from './zip.ts';

export type DebugFileKind = 'dsym' | 'elf' | 'pdb';

/** What the workspace and project archives store about a binary's debug file. */
export interface DebugFileRecord {
  /** File name under the binary's `debug/` directory (sanitized). */
  name: string;
  sha256: string;
  size: number;
  kind: DebugFileKind;
  addedAt: string;
}

export class DebugFileError extends Error {}

/** Debug file kinds OpenDecomp can read: a record of another kind is stored but not opened. */
export const SUPPORTED_DEBUG_KINDS: readonly DebugFileKind[] = ['dsym', 'elf'];

const PDB_MAGIC = 'Microsoft C/C++ MSF 7.00\r\n\x1aDS\0\0\0';
const DSYM_DWARF = /(?:^|\/)[^/]+\.dSYM\/Contents\/Resources\/DWARF\/([^/]+)$/;

function u32(bytes: Uint8Array, offset: number, little: boolean): number {
  if (offset + 4 > bytes.length) return -1;
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, little);
}

/** Mach-O (thin 64-bit or universal) `filetype`s, or null when `bytes` is not Mach-O. */
function machoFileTypes(bytes: Uint8Array): number[] | null {
  const magic = u32(bytes, 0, false);
  if (magic === 0xcffaedfe || magic === 0xfeedfacf) return [u32(bytes, 12, magic === 0xcffaedfe)];
  if (magic === 0xcafebabe || magic === 0xcafebabf) {
    const count = u32(bytes, 4, false);
    // A Java class file shares 0xcafebabe; its "count" is a version far above any slice count.
    if (count < 1 || count > 64) return null;
    const fat64 = magic === 0xcafebabf;
    const types: number[] = [];
    for (let i = 0; i < count; i++) {
      // fat_arch(_64): cputype, cpusubtype, then the slice offset (32 or 64 bits).
      const field = 8 + i * (fat64 ? 32 : 20) + 8;
      if (field + (fat64 ? 8 : 4) > bytes.length) return null;
      const at = fat64 ? Number(new DataView(bytes.buffer, bytes.byteOffset).getBigUint64(field, false)) : u32(bytes, field, false);
      const inner = bytes.subarray(at);
      const m = u32(inner, 0, false);
      if (m !== 0xcffaedfe && m !== 0xfeedfacf) return null;
      types.push(u32(inner, 12, m === 0xcffaedfe));
    }
    return types;
  }
  return null;
}

/** ELF64 little-endian section headers: whether `.text` is SHT_NOBITS, as in
 * `objcopy --only-keep-debug` output; null when `bytes` is not such an ELF file. */
function elfCodeStripped(bytes: Uint8Array): boolean | null {
  if (bytes.length < 64 || bytes[0] !== 0x7f || bytes[1] !== 0x45 || bytes[2] !== 0x4c || bytes[3] !== 0x46) return null;
  if (bytes[4] !== 2 || bytes[5] !== 1) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const shoff = Number(view.getBigUint64(0x28, true));
  const shentsize = view.getUint16(0x3a, true),
    shnum = view.getUint16(0x3c, true),
    shstrndx = view.getUint16(0x3e, true);
  if (shentsize !== 64 || shstrndx >= shnum || shoff + shnum * 64 > bytes.length) return null;
  const names = shoff + shstrndx * 64;
  const strOffset = Number(view.getBigUint64(names + 24, true));
  for (let i = 1; i < shnum; i++) {
    const h = shoff + i * 64;
    let name = '';
    for (let p = strOffset + view.getUint32(h, true); p < bytes.length && bytes[p] && name.length < 64; p++) name += String.fromCharCode(bytes[p]!);
    if (name === '.text') return view.getUint32(h + 4, true) === 8;
  }
  return false;
}

/**
 * The kind of debug file `bytes` is, or null when it is not one (a binary to analyse, an
 * archive...). A zipped `.dSYM` bundle is `dsym-zip` (its DWARF file is extracted by
 * `extractDsym`). Recognition is by content; the name only breaks no ties.
 */
export function sniffDebugFile(bytes: Uint8Array): DebugFileKind | 'dsym-zip' | null {
  if (bytes.length >= PDB_MAGIC.length && [...PDB_MAGIC].every((c, i) => bytes[i] === c.charCodeAt(0))) return 'pdb';
  const types = machoFileTypes(bytes);
  if (types) return types.length > 0 && types.every((t) => t === 10) ? 'dsym' : null; // MH_DSYM
  if (elfCodeStripped(bytes)) return 'elf';
  const names = zipEntryNames(bytes);
  if (names?.some((n) => DSYM_DWARF.test(n))) return 'dsym-zip';
  return null;
}

/** The DWARF file of a zipped `.dSYM` bundle: `Contents/Resources/DWARF/<name>`. */
export async function extractDsym(zip: Uint8Array): Promise<{ name: string; bytes: Uint8Array }> {
  let entries;
  try {
    entries = await zipDecode(zip);
  } catch (e) {
    throw new DebugFileError(`Not a readable zip: ${e instanceof ZipError ? e.message : String(e)}`);
  }
  const found = entries.flatMap((e) => {
    const m = DSYM_DWARF.exec(e.path);
    return m && e.data.length ? [{ name: m[1]!, bytes: e.data }] : [];
  });
  if (found.length === 0) throw new DebugFileError('The zip holds no .dSYM bundle (no Contents/Resources/DWARF/ file)');
  if (found.length > 1) throw new DebugFileError(`The zip holds ${found.length} DWARF files (${found.map((f) => f.name).join(', ')}); zip one .dSYM bundle`);
  return found[0]!;
}

/**
 * A dropped or picked file as a debug file for a binary: the DWARF file of a dSYM (also
 * from a zipped bundle), an ELF debug file. Refuses anything else with a clear message.
 */
export async function readDebugFile(name: string, bytes: Uint8Array): Promise<{ name: string; bytes: Uint8Array; kind: DebugFileKind }> {
  const kind = sniffDebugFile(bytes);
  if (kind === 'dsym-zip') {
    const inner = await extractDsym(bytes);
    return { ...inner, kind: 'dsym' };
  }
  if (kind === 'pdb') throw new DebugFileError(`${name} is a PDB: PE debug information is not supported yet`);
  if (kind === null)
    throw new DebugFileError(
      `${name} is not a debug file OpenReverse reads: add the DWARF file inside a .dSYM bundle (Contents/Resources/DWARF/…, or the zipped .dSYM), or an ELF debug file (objcopy --only-keep-debug)`,
    );
  return { name, bytes, kind };
}

/** Whether a dropped file is a debug file rather than a binary (by content, then name). */
export function looksLikeDebugFile(name: string, bytes: Uint8Array): boolean {
  const kind = sniffDebugFile(bytes);
  if (kind !== null) return true;
  return /\.(debug|dsym\.zip|pdb)$/i.test(name);
}
