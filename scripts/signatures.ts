// Builds the bundled library signatures (web/public/signatures/) from the static libraries of
// this machine (Debian 13 x86-64: glibc, GCC runtime, zlib, OpenSSL, ...), with OpenDecomp's
// signature generator (vendor/open-decomp must be built). Each library is one gzip-compressed
// JSON file (`<id>.sigz`), fetched by the app only when it is applied; index.json lists them.
//   node scripts/signatures.ts            # every library whose inputs exist
//   node scripts/signatures.ts zlib-1.3.1-x86_64
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'web/public/signatures');
const sigs = await import(join(ROOT, 'vendor/open-decomp/dist/src/metadata/library-signatures/index.js'));

const L = '/usr/lib/x86_64-linux-gnu';
const G = '/usr/lib/gcc/x86_64-linux-gnu/14';
/** Debian package version of a file's owner, for the provenance line. */
function packageOf(path: string): string {
  try {
    const owner = execFileSync('dpkg', ['-S', path], { encoding: 'utf8' }).split(':')[0]!;
    const version = execFileSync('dpkg-query', ['-W', '-f=${Version}', owner], { encoding: 'utf8' });
    return `${owner} ${version}`;
  } catch {
    return 'unknown package';
  }
}

interface Bundle {
  id: string;
  title: string;
  /** Nominal import library whose C declarations the functions implement. */
  contracts: string | null;
  inputs: string[];
  /** Strings (regular expressions) that suggest the library in a binary. */
  markers: string[];
}
const BUNDLES: Bundle[] = [
  {
    id: 'glibc-2.41-x86_64',
    title: 'GNU C Library 2.41 (libc, libm, crt)',
    contracts: 'libc.so.6',
    inputs: [`${L}/libc.a`, `${L}/libm-2.41.a`, `${L}/libmvec.a`, `${L}/crt1.o`, `${L}/Scrt1.o`, `${L}/rcrt1.o`, `${L}/crti.o`, `${L}/crtn.o`],
    markers: ['^GLIBC_TUNABLES$', 'glibc: malloc', '^GNU C Library'],
  },
  {
    id: 'libgcc-14-x86_64',
    title: 'GCC 14 runtime (libgcc, libgcc_eh, crtbegin/crtend)',
    contracts: null,
    inputs: [`${G}/libgcc.a`, `${G}/libgcc_eh.a`, `${G}/crtbeginT.o`, `${G}/crtbegin.o`, `${G}/crtbeginS.o`, `${G}/crtend.o`, `${G}/crtendS.o`],
    markers: ['^GLIBC_TUNABLES$', '^GCC: \\('],
  },
  {
    id: 'libstdcxx-14-x86_64',
    title: 'GNU C++ library 14 (libstdc++, libsupc++)',
    contracts: null,
    inputs: [`${G}/libstdc++.a`],
    markers: ['^St9exception$', '^NSt7__cxx11', 'basic_string::_M_'],
  },
  {
    id: 'zlib-1.3.1-x86_64',
    title: 'zlib 1.3.1',
    contracts: null,
    inputs: [`${L}/libz.a`],
    markers: ['^ ?(deflate|inflate) 1\\.3\\.1 Copyright', '^incorrect header check$', '^invalid distance too far back$'],
  },
  {
    id: 'openssl-3.5-x86_64',
    title: 'OpenSSL 3.5.7 (libcrypto, libssl)',
    contracts: null,
    inputs: [`${L}/libcrypto.a`, `${L}/libssl.a`],
    markers: ['^OpenSSL 3\\.5', 'OPENSSL_', '^SHA256 block transform for x86_64'],
  },
  {
    id: 'pcre2-10.46-x86_64',
    title: 'PCRE2 10.46 (8-bit)',
    contracts: null,
    inputs: [`${L}/libpcre2-8.a`],
    markers: ['^\\(\\*UTF\\)', 'PCRE2'],
  },
  {
    id: 'expat-2.9-x86_64',
    title: 'Expat 2.9.0',
    contracts: null,
    inputs: [`${L}/libexpat.a`],
    markers: ['^expat_2\\.9'],
  },
  {
    id: 'libxml2-2.9-x86_64',
    title: 'libxml2 2.9.14',
    contracts: null,
    inputs: [`${L}/libxml2.a`],
    markers: ['^xmlParse', 'libxml2'],
  },
  {
    id: 'libuv-1.50-x86_64',
    title: 'libuv 1.50.0',
    contracts: null,
    inputs: [`${L}/libuv.a`],
    markers: ['^uv_'],
  },
];

mkdirSync(OUT, { recursive: true });
const wanted = process.argv.slice(2);
const indexPath = join(OUT, 'index.json');
const index: Record<string, unknown>[] = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : [];
for (const bundle of BUNDLES) {
  if (wanted.length && !wanted.includes(bundle.id)) continue;
  const missing = bundle.inputs.filter((path) => !existsSync(path));
  if (missing.length) {
    console.log(`${bundle.id}: skipped, missing ${missing.join(', ')}`);
    continue;
  }
  function* sources() {
    for (const path of bundle.inputs) {
      const bytes = new Uint8Array(readFileSync(path));
      const members = path.endsWith('.o') ? [{ name: basename(path), bytes }] : sigs.archiveMembers(bytes);
      for (const member of members) if (member.bytes[0] === 0x7f) yield* sigs.objectFunctions(member);
    }
  }
  const packages = [...new Set(bundle.inputs.map(packageOf))];
  const { library, stats } = sigs.buildSignatureLibrary(sources(), {
    id: bundle.id,
    title: bundle.title,
    architecture: 'x86_64',
    contracts: bundle.contracts,
    source: `${bundle.inputs.map((path) => basename(path)).join(', ')} (Debian 13: ${packages.join(', ')})`,
  });
  const text = sigs.encodeSignatureLibrary(library);
  const gz = gzipSync(text, { level: 9 });
  // Not `.gz`: static servers then send Content-Encoding: gzip, others do not; the app inflates it.
  const file = `${bundle.id}.sigz`;
  writeFileSync(join(OUT, file), gz);
  const entry = {
    id: bundle.id,
    title: bundle.title,
    architecture: 'x86_64',
    file,
    bytes: gz.length,
    functions: stats.bodies,
    signatures: stats.signatures,
    contracts: bundle.contracts,
    source: library.source,
    markers: bundle.markers,
  };
  const at = index.findIndex((item) => item.id === bundle.id);
  if (at < 0) index.push(entry);
  else index[at] = entry;
  console.log(`${bundle.id}: ${stats.signatures} signatures from ${stats.bodies} bodies, ${text.length} bytes JSON, ${gz.length} bytes gzip`);
}
index.sort((a, b) => BUNDLES.findIndex((x) => x.id === a.id) - BUNDLES.findIndex((x) => x.id === b.id));
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
