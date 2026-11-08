# OpenReverse

A web interface for reverse engineering native binaries, in the spirit of Binary Ninja, IDA and Ghidra, built on [OpenDecomp](https://github.com/DimitriFourny/open-decomp).

OpenDecomp loads, disassembles and decompiles the binary, and OpenReverse runs it **entirely client-side**: nothing is uploaded and no server executes anything. It supports what OpenDecomp supports: **Mach-O ARM64, PE x86-64 and ELF x86-64**.

## Features

- **Whole-image linear view** (like IDA's disassembly view): every mapped section in address order, with a header line per section. Functions show as their disassembly (the function under the cursor carries an accent edge, and the pseudocode follows the cursor into the next function); everything between and outside functions shows as data: strings as `db "text", 0`, pointer slots (relocations, chained fixups, GOT/import slots) as `dq` with the name they point to, symbols and renamed globals as labels (`_args:`), undefined bytes as `db` rows of 16 bytes with their ASCII, runs of zeros as `db 0x40 dup(0)` and zero-fill (bss) as `db 0x200 dup(?)`. The listing is fetched by address window and extended while you scroll, so even a large image scrolls smoothly. Go to, double-click and Enter on references, back/forward, xrefs (`X`), comments (`;`) and renames (`N` on a data label or line) work on data lines too. Find (`Ctrl+F`) searches the loaded part of the listing (a few thousand lines around the cursor).
- **Data definitions** (IDA keys): `D` cycles byte/word/dword/qword at the cursor, `A` makes a C string, `O` a pointer, `*` an array (asks for the element count), `U` undefines. Each definition is stored in the workspace (and in project archives) and declared to OpenDecomp as an asserted `type` annotation on the global (`uint32_t`, `uint8_t[16]`, `char[6]`, `void *`; the element types are declared on the image's type library), so the pseudocode types the global too. Where OpenDecomp does not take the address as data storage, a toast says the definition is kept in the listing only. Code cannot be redefined as data: OpenDecomp has no way to undefine a function.
- **No function creation** (`P`): OpenDecomp discovers functions itself and its `functions_discover` takes no start address, so `P` only explains that.
- **Linear disassembly** with branch labels (`loc_…`), jump arrows in a left gutter (nested lanes, conditional/unconditional colors as in the graph, the cursor's arrows emphasized), call targets shown by function name, string references as auto-comments, and optional instruction bytes.
- **Control-flow graph**: block layout from dagre, true/false/unconditional edge colors, back edges drawn dashed, the cursor block's outgoing edges emphasized, a minimap (click or drag to move), pan, Ctrl+wheel zoom, and fit-to-view.
- **Token highlighting**: click a register, number, label or name to highlight every occurrence in the disassembly, graph and pseudocode. Registers match their aliases (`rax`/`eax`/`ax`/`al`, `x0`/`w0`, `v0`/`q0`/`d0`/`s0`), numbers match in hex or decimal.
- **Find** (Ctrl+F) in the disassembly or pseudocode pane, with every match highlighted.
- **Pseudo-C / pseudo-Python** next to the disassembly, linked in both directions. Click a statement to highlight its instructions; move the cursor in the disassembly to highlight the statements it produced. This uses OpenDecomp's emission mappings. Language, `proven`/`likely` inference and `source`/`checked` view are selectable.
- **Navigation**: double-click to follow references, back/forward history, go to an address or function name with fuzzy matching, and the location kept in the URL hash so a reload keeps your place.
- **Function, string, symbol and section lists**, all filterable and virtualized so they stay fast on large binaries.
- **Cross-references** to functions, strings and data.
- **Hex view** of the section around the cursor.
- **Types view**: an editor for the image's **type library**. Write C declarations (struct, union, enum, typedef, `<stdint.h>` names, pointers, arrays, packed) and apply them with OpenDecomp's `types_declare`; parse errors are shown inline with line and column. The library's declarations can be loaded back into the editor or deleted. Below it are the image-wide merged structure types OpenDecomp recovered (`struct_<hex>`, or the declared structure once a signature binds it).
- **Function signatures** (`Y`, like IDA): edit the function's C prototype, e.g. `int parse(struct Node *n, char *s)`. It is stored as an asserted `signature` annotation: the function and its callers are re-decompiled with the declared types and parameter names. Named types come from the type library; builtins and pointers are declared next to the signature. Changing the name in the prototype renames the function; Reset removes the signature. OpenDecomp applies a declared signature only where its reconstruction confirms it and when type recovery is complete; a toast says when it did not (for example on ELF images, whose type recovery stays partial because OpenDecomp has no ELF DWARF reader).
- **Renames** of functions, globals, **parameters and locals**. They are stored as OpenDecomp annotations, so every caller's pseudocode picks up the new name, and MCP agents working on the same project see them too. A parameter or local is renamed by selecting it in the pseudocode and pressing `N`: the name is a `name` annotation on the value OpenDecomp declared it from. Those values are analysis subjects, not durable addresses: the name follows the function as long as its analysis yields the same value (it survives renames, signatures and other edits), but OpenDecomp may drop it if a later analysis reshapes the function (see OpenDecomp's docs/CORE.md on value subjects). Frame-object members (`frame.local_8`) and structure members are not renameable this way; members get their names from type declarations.
- **Comments** on any address.
- **Stripped binaries**: whole-image function discovery runs in the background, and the function list fills in as it progresses.
- **Your data, in and out** (see [Data and storage](#data-and-storage)): project archives to back up or move a project to another browser, a zip of every function's pseudocode, download of the original binary, per-binary storage use, persistent storage, and project reset.

## How it runs

**Everything runs in your browser.** OpenReverse is a static site with no backend. The binaries you open never leave the tab:

- OpenDecomp (loaders, decoders, lifters, the decompiler and its SQLite project store) runs in a **Web Worker**.
- Node built-ins are swapped for browser shims at build time (`web/src/engine/shims/`):
  - `node:sqlite` uses the official SQLite WASM build, with in-memory databases serialized into the virtual filesystem;
  - `node:fs` uses an in-memory filesystem persisted to **IndexedDB**;
  - `node:crypto` uses synchronous SHA-256 from `@noble/hashes`;
  - `node:v8` uses a structured-clone serializer;
  - `node:child_process` runs OpenDecomp's project worker in the same thread, keeping its framed protocol.
- The `iced-x86`, C++, MSVC and Swift demangler WASM modules are bundled as assets.
- Projects, renames and comments are saved in IndexedDB and are there again after a reload. Delete a binary from the home screen to remove its data.
- Only one tab at a time owns the projects; a second tab is told to close the first.

The OpenDecomp submodule is not modified. The three source rewrites needed in the browser are in `web/vite.config.ts`:
- loading `iced-x86` as ESM;
- giving each in-thread project worker its own `process` object;
- fetching the C++ demangler WASM.

## Data and storage

Everything lives in the browser's IndexedDB. The home screen shows what each binary takes (binary, OpenDecomp project, comments), the browser's usage and quota (`navigator.storage.estimate()`), and a **Make storage persistent** button (`navigator.storage.persist()`): without it the browser may evict the data when the disk runs low. Each recent binary has:

- **⬇** downloads the original binary.
- **Export** saves a project archive (below).
- **Reset** deletes the binary's OpenDecomp project directory and keeps the binary, comments and data definitions (the listing's global names go with the renames). OpenDecomp stores renames as annotations in the same `project.sqlite` as its analysis cache, and has no supported way to drop cached artifacts on their own (they are indexed by rows in that database and referenced by annotation catalogs; it never prunes them), so a reset also loses renames. Export an archive first if you want to keep them.

With a binary open, **Export ▾** in the top bar offers:

- **All pseudocode (.zip)**: OpenDecomp's own `export` (the code of `open-decomp export`, run in the worker) in the current dialect and inference: `functions/NAME@0xADDR.c` (or `.py`; `.asm` where no pseudocode could be produced), `types.h` (the image's merged types plus the structures the functions use, `structures: 'external'`), `index.tsv`, `strings.tsv`, `imports.tsv`, `exports.tsv` and `README.txt`, in one top-level folder. Progress is reported per function and it can be cancelled. Decompiling takes up to seconds per function, and the other views wait for the function being decompiled.
- **Project archive** and **Original binary**, as on the home screen.

### Project archive format (`<name>.orproj.zip`, version 2)

A standard ZIP file (stored or deflated entries, no ZIP64, so under 4 GiB) that any unzip tool can open:

| Entry                | Contents |
| -------------------- | -------- |
| `open-reverse.json`  | Manifest: `{ "format": "open-reverse-project", "version": 1 or 2, "generator", "createdAt", "record": { "id", "name", "sha256", "size", "addedAt" } }` |
| `binary/<name>`      | The binary. Its SHA-256 is `record.sha256` and `record.id` is the first 16 hex digits. |
| `comments.json`      | `{ "<0xaddress>": "comment" }` |
| `data.json`          | Version 2 only: `{ "defs": { "<0xaddress>": { "type": "u8\|u16\|u32\|u64\|ptr\|string", "count", "od"? } }, "names": { "<0xaddress>": "name" } }`: data definitions (`od`: declared to OpenDecomp too) and the listing's global names. An archive without any is written as version 1, which older OpenReverse versions read; version 1 archives are still read. |
| `project/<path>`     | The OpenDecomp cache root of the binary: `<sha256>.default/project.sqlite` (analysis cache, annotations such as renames), `images/`, `artifacts/`. |

The export works while the binary is open: the live in-memory SQLite database is serialized when no transaction is open, in the same synchronous step that copies the other files, so the database and the artifact files agree.

Import (the **Import project archive…** button, or drop a `.orproj.zip` on the home screen) validates the whole archive before writing anything: the format and version (a newer version is refused), the record, the binary's SHA-256, the comments, CRC-32 and declared sizes of every entry (inflation is capped while streaming), size limits (2 GiB archive, 1 GiB per entry, 2 GiB in total), and paths: only the entries above, with no absolute, `..`, empty, backslash, colon or control-character segments, so files can only land in `/workspace/binaries/<id>/project/`. A binary that is already in the workspace (same SHA-256) is a conflict: you are asked whether to replace it, and nothing changes if you decline. Decompilations cached in the archive are served from the cache after import.

## Requirements (to build)

- Node.js **24+** and Bun **1.4.3** (`npm i -g bun@1.4.3`), only to build OpenDecomp and the site. Nothing runs on a server.
- A recent Chromium, Firefox or Safari to use it (Web Workers, WebAssembly, IndexedDB).

## Setup and build

```sh
git clone --recurse-submodules <this repo> open-reverse
cd open-reverse
npm run setup          # builds vendor/open-decomp, installs dependencies
npm run build          # static site in web/dist/ (host it anywhere)
npm run dev            # development: http://localhost:5173 with hot reload
npm run preview        # serve web/dist locally
```

`web/dist` can be published as-is to any static host (GitHub Pages, S3, …); it uses relative paths.

## Keyboard

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `G`, `Ctrl+P`      | Go to address / function                          |
| `N`                | Rename the selected function, call target, global, parameter or local |
| `Y`                | Edit the C prototype of the selected call target (or current function) |
| `X`                | Cross-references to the selection (or current function) |
| `;`                | Comment at the cursor                             |
| `D`                | Data at the cursor: byte → word → dword → qword (listing, hex view) |
| `A`                | C string at the cursor                            |
| `O`                | Pointer at the cursor                             |
| `*`                | Array at the cursor (element count asked)         |
| `U`                | Undefine the data definition at the cursor        |
| `P`                | Create function: not supported by OpenDecomp (explains why) |
| `↑` `↓`            | Previous / next instruction (in the graph, across to the fall-through block) |
| `PgUp` `PgDn`, `Home` `End` | Page up / down (linear), first / last instruction |
| `Enter`            | Follow the selected operand, else the call/branch target under the cursor |
| `Ctrl+F`           | Find in the last clicked pane; `Enter` / `Shift+Enter` next / previous, `Esc` closes |
| `Space`            | Toggle linear / graph                             |
| `Tab`              | Toggle the pseudocode pane                        |
| `H`                | Toggle hex view                                   |
| `B`                | Toggle instruction bytes                          |
| `Esc`, `Alt+←`     | Back (Esc first closes the find bar, then the xrefs panel) |
| `Alt+→`            | Forward                                           |
| click              | Move the cursor; on a token, highlight its occurrences |
| double-click       | Follow a reference                                |

## Layout

```
web/src/
  App.tsx, components/, views/   React UI (linear, graph, pseudocode, hex, types)
  store.ts                       App state, navigation history, caches
  api.ts                         Typed RPC client to the engine worker
  engine/
    worker.ts                    Worker entry: boots WASM + SQLite, serves RPC
    engine.ts, session.ts        Per-binary OpenDecomp session and presentation
    linear.ts                    Whole-image listing: sections, functions, data items, undefined bytes, by address window
    prototype.ts                 C prototype -> OpenDecomp signature (via its C declaration parser)
    workspace.ts, vfs.ts         Binaries/projects in a VFS persisted to IndexedDB
    archive.ts, zip.ts           Project archive format and the ZIP container
    transfer.ts, tasks.ts        Archive snapshots, pseudocode export, storage use; progress/cancel of long calls
    shims/                       Browser implementations of the Node built-ins
test/                            Node unit tests for the shims (npm test)
test/e2e/browser.mjs             Real-browser end-to-end test (npm run test:e2e)
vendor/open-decomp               OpenDecomp (git submodule, unmodified)
```

## Tests

- `npm test` runs unit tests under Node: the shims (VFS/fs, SQLite, crypto, zstd, v8), the ZIP/project archive encoder and validator, the token keys used for highlighting, and the C prototype compiler (with OpenDecomp's declaration parser), and the whole-image listing's layout (windows built forward and backward join without gaps).
- `npm run test:e2e` drives the built site in Chromium. Start the site first with `npm run preview -- --port 5199`, and install the browser with `npm i -D playwright && npx playwright install chromium` (or point `PLAYWRIGHT_PATH` at a playwright package installed elsewhere). It covers:
  - upload, decompilation, renames propagating to callers, comments and persistence across a reload;
  - parameter/local renames, type declarations, and signatures propagating to callers;
  - branch arrows, keyboard navigation, token highlighting, find, the graph minimap, and the graph, hex and xrefs views;
  - Mach-O and PE, and a stripped binary with background discovery;
  - data in and out: pseudocode export (and cancel), archive export, binary download, an import conflict, and an archive imported into a fresh browser profile keeping the rename, the comment and the cached decompilation, then a project reset.
