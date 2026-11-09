# OpenReverse guide

The full reference: features, keyboard, storage, the project archive format, how it runs in the browser, and how to build and test it. For an overview, see the [README](../README.md).

## Features

- **Whole-image linear view** (like IDA's disassembly view): every mapped section in address order, with a header line per section. Functions show as their disassembly (the function under the cursor carries an accent edge, and the pseudocode follows the cursor into the next function); everything between and outside functions shows as data: strings as `db "text", 0`, pointer slots (relocations, chained fixups, GOT/import slots) as `dq` with the name they point to, symbols and renamed globals as labels (`_args:`), undefined bytes as `db` rows of 16 bytes with their ASCII, runs of zeros as `db 0x40 dup(0)` and zero-fill (bss) as `db 0x200 dup(?)`. The listing is fetched by address window and extended while you scroll, so even a large image scrolls smoothly. On a jump (and on opening) the rows around the cursor show as soon as the cursor's function is disassembled; neighbouring functions fill in right after. A new revision (a rename, background discovery) reloads the listing in place, keeping the scroll position and the cursor. Go to, double-click and Enter on references, back/forward, xrefs (`X`), comments (`;`) and renames (`N` on a data label or line) work on data lines too. Find (`Ctrl+F`) searches the loaded part of the listing (a few thousand lines around the cursor).
- **Data definitions** (IDA keys): `D` cycles byte/word/dword/qword at the cursor, `A` makes a C string, `O` a pointer, `*` an array (asks for the element count), `U` undefines. Each definition is stored in the workspace (and in project archives) and declared to OpenDecomp as an asserted `type` annotation on the global (`uint32_t`, `uint8_t[16]`, `char[6]`, `void *`; the element types are declared on the image's type library), so the pseudocode types the global too. Where OpenDecomp does not take the address as data storage, a toast says the definition is kept in the listing only. Code cannot be redefined as data: OpenDecomp has no way to undefine a function. `Y` on a data line sets the global's C type exactly as `Y` on a global of the pseudocode does (it shows the defined type, e.g. `uint16_t[4]`); both write the same OpenDecomp annotation on the global, so the last one applied is the one the decompiler uses, while the listing keeps showing the `D`/`A`/`O`/`*` definition.
- **No function creation** (`P`): OpenDecomp discovers functions itself and its `functions_discover` takes no start address, so `P` only explains that.
- **Linear disassembly** with branch labels (`loc_…`), jump arrows in a left gutter (nested lanes, conditional/unconditional colors as in the graph, the cursor's arrows emphasized), call targets shown by function name, string references as auto-comments, and optional instruction bytes.
- **Control-flow graph**: block layout from dagre, true/false/unconditional edge colors, back edges drawn dashed, the cursor block's outgoing edges emphasized, a minimap (click or drag to move), pan, Ctrl+wheel zoom, and fit-to-view.
- **Token highlighting**: click a register, number, label or name to highlight every occurrence in the disassembly, graph and pseudocode. Registers match their aliases (`rax`/`eax`/`ax`/`al`, `x0`/`w0`, `v0`/`q0`/`d0`/`s0`), numbers match in hex or decimal.
- **Find** (Ctrl+F) in the disassembly or pseudocode pane, with every match highlighted.
- **Pseudo-C / pseudo-Python** next to the disassembly, linked in both directions. Click a statement to highlight its instructions; move the cursor in the disassembly to highlight the statements it produced. This uses OpenDecomp's emission mappings. Language, `proven`/`likely` inference and `source`/`checked` view are selectable.
- **Navigation**: double-click to follow references, back/forward history, go to an address or function name with fuzzy matching, and the location kept in the URL hash so a reload keeps your place.
- **Function, string, symbol and section lists**, all filterable and virtualized so they stay fast on large binaries.
- **Cross-references** to functions, strings and data (`X`), and **from** a function or instruction (`Shift+X`): what it calls, jumps to, reads and writes. A To / From toggle in the xrefs panel switches direction for the same target; a row goes to the referencing site (to) or the target (from). Xrefs to a function include the calls to it through an import stub: OpenDecomp records a call to a Mach-O stub with the import as its target entity (`target_role` `callable_stub`), so the function is also asked for by its entry address (and the call tree's callers and `or.xrefsTo` / `or.callers` get the same answer).
- **Call tree** (the sidebar's **Calls** tab): the current function's direct callers and callees, from OpenDecomp's established `call` references. Each node expands lazily to its own callers (or callees), recursion is marked `↻`, a click goes to the function and a right-click shows its xrefs. Results are cached per project revision, and the tree reloads its open levels after an edit.
- **Bookmarks** (`Alt+M`, `Ctrl+M`, like IDA's mark position / jump to marked position): bookmark the cursor's address with an optional description, then list, filter, jump to or delete bookmarks. They are stored per binary next to the comments and travel in project archives.
- **Undo / redo** (`Ctrl+Z`, `Ctrl+Shift+Z` or `Ctrl+Y`) of every edit: function, global, parameter and local renames, comments, signatures, type-library declarations and deletions (including the structure editor), variable and global types, structures created from a pointer, bookmarks, and data definitions (`D` `A` `O` `*` `U`). Each step goes through the same OpenDecomp annotation calls as the edit itself, so pseudocode, lists and callers refresh as after any edit, and a toast says what was undone. The history is per binary and kept in memory (it does not survive a reload). How each edit is restored:
  - function renames and signatures: this app's annotations on the function (name, signature and the types it declares) are put back exactly as they were stored;
  - parameters and locals: the name shown before the rename is set again (a generated name such as `arg0` comes back as a name annotation with the same text); globals: the name this tab last gave the address, else the label the listing showed, else the original name, since OpenDecomp has no read of a single global's annotation;
  - data definitions: the definitions the edit replaced are put back over the same range (in the listing and as OpenDecomp `type` annotations), and redo puts the new one back;
  - type declarations: each redeclared name gets its previous declaration back and new names are removed (their `Name*` helper types stay, as with Delete); a deleted declaration is declared again from its C text, so it keeps its type ID and signatures using it bind again.
- **Hex view** of the section around the cursor.
- **Search** (`Alt+B` bytes, `Alt+T` text, `Alt+I` immediate, like IDA; or **Search…** in the top bar), in a panel under the code:
  - **Bytes**: hex with `??` (or `?`) wildcards, spaced or not (`48 8B ?? 05`, `488B??05`), over every section mapped in the image, read through OpenDecomp's `memory_read` in 64 KiB chunks.
  - **Text**: ASCII and/or UTF-16LE, case-insensitive unless **Aa** is checked.
  - **Immediate**: instructions with a constant among their operands (immediates and displacements, `0x862`, `862h` or decimal `2146`; `-1` also matches `0FFFFFFFFh`), from OpenDecomp's disassembly of every function. This is a background task with progress, cancellable (Esc or **Cancel**); hits stream in as they are found. Each function costs a disassembly request (about 45 s for the 428 functions of a stripped `/bin/ls` in the browser), and the instruction text is then kept for the project revision, so a second immediate search takes a fraction of a second.
  - Results show the address, the function and offset, and the bytes, string or instruction; click or `Enter` goes there (`↑` `↓` move in the list). A search stops at 1000 hits. The results stay when the panel is closed (×, Esc) and come back with it, until the next search. Searches run in the engine worker.
- **Navigation band** (IDA's colour navigation bar) under the top bar: the image's mapped sections laid end to end (the gaps between them left out), coloured by what each stretch is: functions (blue), import stubs (violet), strings (orange), data (grey: non-executable sections, data symbols) and unexplored code (olive: executable bytes in no function). The cursor is the yellow bar, bookmarks green ticks, section boundaries dark lines. Hover shows the address, section, kind and function; click or drag goes to the address under the pointer. The map is computed in the engine from the sections, the function index, strings and symbols, once per revision. **▤** in the top bar hides or shows it.
- **Demangled names**: OpenDecomp demangles C++ (Itanium and MSVC) and Swift names for display; they are shown in the function, symbol and call lists, call targets and comments of the disassembly, the xrefs panel and the status bar, with the mangled name in the tooltip. The pseudocode spells a demangled name as a C identifier (`geom__area_int__int_`); those identifiers link to their function and their tooltip shows both names. Go to and the list filters match the mangled name too. A demangled name is not marked as a rename; renaming one starts from its mangled name, and a renamed function shows its new name.
- **Types view**: an editor for the image's **type library**. Write C declarations (struct, union, enum, typedef, `<stdint.h>` names, pointers, arrays, packed) and apply them with OpenDecomp's `types_declare`; parse errors are shown inline with line and column. The library's declarations can be loaded back into the editor or deleted. Below it are the image-wide merged structure types OpenDecomp recovered (`struct_<hex>`, or the declared structure once a signature binds it).
- **Retyping from the pseudocode** (`Y` on a selected parameter, local or global, like IDA's Y and Binary Ninja's retype): type a C type such as `struct Node *`, `char *` or `uint32_t[8]` (prefilled with the current one). It is an asserted OpenDecomp `type` annotation on the variable's value subject (on the global's data entity for a global, which then prints as `extern struct Args args;` with member accesses `args.pwtype`); Reset removes it. Named types come from the type library; the anonymous types a type needs (builtins, pointers, arrays) are declared, nameless, on the type library with content-derived IDs (they show as helper types there and stay after an undo, like the helpers of a type declaration). OpenDecomp applies a variable's type only where its analysis agrees: a value whose type a callee's prototype already fixes keeps that type, and where type recovery stays partial (debug data OpenDecomp could not decode, or a call to an import whose library declaration it withheld) the pseudocode does not change; a toast says when the pseudocode did not take the type. Undo restores the type this tab set before, else OpenDecomp's own inference.
- **Globals in the pseudocode**: a global the C pseudocode declares (`extern … name; /* VA … */`) is clickable: `N` renames it (an annotation on the address), `Y` retypes it, `X` lists its xrefs.
- **Structure editor** (Types view, **New structure…** or **fields** on a library struct/union): a table of fields with offset (hex) and size laid out by OpenDecomp's own C declaration parser (the rules `types_declare` stores, with the type library's other declarations in scope), type, name and array bound; insert, delete, move, rename and retype fields, add padding or pad to a total size, struct/union and packed. Apply declares the generated C through the same path as the Types editor, so one `Ctrl+Z` undoes it. A packed library structure loads unpacked (the library's rendering does not say it was packed).
- **Create a structure from a pointer** (`S` on a pointer parameter or local, Binary Ninja's "Create structure"): OpenDecomp recovers a `struct_<hex>` for the members a function accesses through a pointer; `S` declares `struct <Name>` with those members at the same offsets (gaps become `pad_0x<offset>` arrays, a misaligned member makes it packed, pointers to other recovered structures become `void *`) and retypes the variable as `struct <Name> *`, so accesses print as `p->field_0xc` and fields can then be renamed in the structure editor. One undo step reverts both. It needs a recovered `struct_<hex> *` variable: OpenDecomp's image-wide merged types are not used (they are often empty and computing them analyzes every function).
- **Function signatures** (`Y`, like IDA): edit the function's C prototype, e.g. `int parse(struct Node *n, char *s)`. It is stored as an asserted `signature` annotation: the function and its callers are re-decompiled with the declared types and parameter names. Named types come from the type library; builtins and pointers are declared next to the signature. Changing the name in the prototype renames the function; Reset removes the signature. OpenDecomp applies a declared signature only where its reconstruction confirms it and when type recovery is complete; a toast says when it did not (for example in a function that calls an import whose library declaration OpenDecomp withheld, or whose own debug record it could not decode).
- **Renames** of functions, globals, **parameters and locals**. They are stored as OpenDecomp annotations, so every caller's pseudocode picks up the new name, and MCP agents working on the same project see them too. A parameter or local is renamed by selecting it in the pseudocode and pressing `N`: the name is a `name` annotation on the value OpenDecomp declared it from. Those values are analysis subjects, not durable addresses: the name follows the function as long as its analysis yields the same value (it survives renames, signatures and other edits), but OpenDecomp may drop it if a later analysis reshapes the function (see OpenDecomp's docs/CORE.md on value subjects). Frame-object members (`frame.local_8`) and structure members are not renameable this way; members get their names from type declarations.
- **Comments** on any address.
- **Script console** (`Shift+F2`, IDA's script snippets / Binary Ninja's Python console; or **Script** in the top bar): write JavaScript in the editor and run it with `Ctrl+Enter`. The `or` object is the API (see below; `help()` or **Help** lists it), `print(...)` writes to the output, and top-level `await` works. A script that is one expression shows its value; otherwise `return` one. Results are pretty-printed (objects and arrays indented unless short, lists cut after 100 items with a count, byte arrays as hex), errors show the script line. Scripts run before are kept in this browser's localStorage (the **History** list, or `↑` / `↓` in an empty editor), and **Examples** has a few to start from (largest functions, strings by reference count, the string argument of every call to `fprintf`, commenting calls, a hex dump). **Stop** (or `Esc`) makes the script's next API call throw.
  - Scripts run in the page, calling the same engine RPCs (`api.ts`) and store edit functions as the UI: a rename, comment, bookmark, type or data definition from a script refreshes every view and is one `Ctrl+Z` step, exactly like the same edit made by hand. API calls are asynchronous messages to the engine worker, so the page stays responsive while a script awaits them (the API also yields to the page every 30 ms); a tight loop of plain JavaScript without `await` blocks the page until it ends, and cannot be stopped. Only the script typed in the editor is evaluated; nothing is sent anywhere.
  - Targets are addresses as hex strings (`'0x401000'`, `'401000h'`), numbers, bigints, names (`'main'`, `'_fprintf'`; functions, then symbols) or objects the API returned (a function, a string, a symbol).
  - Read: `or.info()`, `or.functions()` (name, entry, size, originalName, mangled, renamed, importStub), `or.func(target)` (also an address inside a function; null when none), `or.strings()`, `or.symbols()`, `or.sections()`, `or.xrefsTo(target)`, `or.xrefsFrom(target)`, `or.callers(fn)`, `or.callees(fn)`, `or.disasm(fn)` (instructions with addr, bytes, mnemonic, operands, flow, operand refs and resolved targets such as ADRP pairs), `or.decompile(fn)` (the pseudocode text, with the toolbar's dialect and options), `or.variables(fn)`, `or.read(addr, length)` (a `Uint8Array`, shorter when the range leaves mapped memory), `or.search.bytes('48 8b ?? 05')`, `or.search.text('usage', { caseSensitive })`, `or.search.immediate(0x862)`, `or.comments()`, `or.bookmarks()`, `or.here()`, `or.hereFunction()`, `or.selection()`.
  - Write (undoable): `or.rename(target, name)`, `or.renameVar(fn, variable, name)`, `or.comment(addr, text)`, `or.bookmark(addr, text)` (null removes), `or.setType(addr, 'char *')` for a global or `or.setType({ fn, var: 'arg0' }, 'int')` for a parameter or local, `or.defineData(addr, 'cycle' | 'string' | 'ptr' | 'array' | 'undefine', count?)`, `or.undo()`, `or.redo()`. UI: `or.goto(target)`.
  - Example: the string each call to `fprintf` passes in `/tmp/sshpass` (an arm64 Mach-O) — the **Examples** entry scans the disassembly because OpenDecomp's reference index has no incoming references of an import stub (`or.xrefsTo('_fprintf')` is empty there; outgoing references from the callers name it):
    ```js
    const target = await or.func('fprintf');
    for (const f of await or.functions()) {
      if (f.importStub) continue;
      const insns = await or.disasm(f);
      insns.forEach((n, i) => {
        if (n.flow.kind !== 'call' || !n.refs.some((r) => r.addr === target.entry)) return;
        const str = insns.slice(Math.max(0, i - 8), i).reverse()
          .flatMap((p) => [...(p.resolved ?? []), ...p.refs]).find((r) => r.kind === 'string');
        print(n.addr, f.name, str ? JSON.stringify(str.label) : '(no string)');
      });
    }
    // 0x100000794 _parse_options "Conflicting password source\n"   (and 4 more)
    ```
- **Stripped binaries**: whole-image function discovery runs in the background, and the function list fills in as it progresses.
- **Debug information** (DWARF, like IDA's "Load DWARF file" and its automatic dSYM / debuglink loading): OpenDecomp reads the DWARF embedded in a binary (Mach-O, and ELF with `-g`, DWARF 2 to 5, zlib-compressed sections included) or in a **debug file** you add to it: the DWARF file of a `.dSYM` bundle (`App.dSYM/Contents/Resources/DWARF/App`, or the whole `.dSYM` zipped) for Mach-O, or a separate ELF debug file (`objcopy --only-keep-debug`, the files of `-dbg` / `-debuginfo` packages under `/usr/lib/debug`). Drop the binary and its debug file together on the home screen (or pick both with **Open…**), or use the badge next to the binary's name in the top bar (**+ debug** without debug information, **DWARF** for embedded DWARF, **dSYM ✓** / **debug file ✓** for a matched debug file): it opens a dialog with what OpenDecomp found (functions, types, variables and line rows; UUID or build ID; what it could not decode, such as unions and function-pointer types) and **Add / Replace / Remove debug file**. OpenDecomp checks that a debug file belongs to the binary, by Mach-O UUID and CPU type, by ELF GNU build ID, or by the binary's `.gnu_debuglink` CRC-32 when it has no build ID; a file of another build is refused with the reason ("build ID … does not match the image's …") and the previous state is kept. With debug information, functions of a stripped binary get their names, functions their prototypes and parameter names (`void registry_add(registry_t* reg, shape* s)`), structures their tags and member names (`reg->count`), globals their type and name (`extern registry_t global_registry;`, `global_registry.total_area`), and locals of unoptimised code their names (`uint32_t visited;`); a signature or type you set with `Y` still wins. The debug file is stored with the binary (in the browser and in project archives). A binary with a debug file is analysed in an OpenDecomp project of its own, next to the binary's own project: the renames and types you made before adding it stay in that one and come back when you remove the debug file (comments, bookmarks and data definitions are kept by OpenReverse and show either way). PE `.pdb` files are recognised and refused: OpenDecomp has no PDB reader yet. Not shown yet: types of locals and of register-located variables of optimised code, nested structure members (`s->bounds.width` prints as a cast), and source file:line (OpenDecomp parses the line table but does not expose it).
- **Objective-C** (ARM64 Mach-O): methods are listed, disassembled and decompiled as `-[Class selector:]` / `+[Class selector]` and selector stubs as `_objc_msgSend$selector` (OpenDecomp names them from the runtime metadata, also in stripped binaries), and the pseudocode shows message sends (`[ODCounter counterWithLabel:name]`). The disassembly comments a selector reference load `@selector(addValue:times:)`, a class reference `class ODCounter` and a CFString `@"hello"`, and each `objc_msgSend` or selector-stub call with the message it sends: `[ODCounter counterWithLabel:]` when the receiver comes from a class reference, `[self label]` when it is the method's own receiver, else `[id increment]` (`[super init]` for `objc_msgSendSuper2`). The receiver and selector are traced back through register moves within straight-line code (callee-saved registers across calls). In the linear view, the data sections are labelled as IDA does: `selRef_addValue_times_`, `classRef_NSString`, `superRef_ODCounter`, `cfstr_hello_fixture`, `_OBJC_CLASS_$_ODCounter`, so `__objc_classlist` and class pointers read `dq _OBJC_CLASS_$_ODCounter`. OpenDecomp's query tools do not expose the selector/class reference records, so the engine runs OpenDecomp's own runtime-metadata recovery on the image once more (once per session, only for Mach-O images with `__objc_*` or `__cfstring` sections).
- **Memory-aware decompile workers** (home screen, **Performance**): Automatic uses one less than the cores (2 to 4), but only 1 (decompiles in the engine thread) when the browser reports less than 8 GB (`navigator.deviceMemory`, which Chrome rounds and caps at 8) and at most 2 otherwise, since every worker holds its own copy of the project database and its own decompiler heaps. The engine worker's memory (SQLite heap, in-memory files, JS heap where the browser reports it) shows there and in the status bar; the helper workers' memory is not measured (in a cross-origin isolated page, the whole tab's from `performance.measureUserAgentSpecificMemory` is shown as well). Only the binary on screen holds memory: leaving it (the logo, or opening another binary) closes its OpenDecomp project, stops its helper workers and drops its files from memory; an export still running on it finishes first, and opening it again resumes the saved project.
- **Binary diffing** (BinDiff / Diaphora style, for patch diffing two versions of a program): **Diff…** in the top bar, or **Diff…** on a recent binary of the home screen, picks another stored binary (B) to compare with the open one (A). Each binary gets a signature per function, built in the background from the listing OpenDecomp gives (size, instructions, basic blocks and edges, call sites, referenced strings, named callees, a hash of the mnemonic sequence, a hash of the instructions with addresses masked, and a CFG shape hash from the blocks' in/out degrees), with progress and **Cancel**. Signature tables are cached per binary and project revision (`diffsig-v1-r<revision>.json` next to the binary; a rename or a discovery step makes a new revision), so a later diff is instant; a binary that is not open is opened only to build its table, with one worker, then closed again. Functions match in rounds, the most confident first: the same (non-generated) name, identical code, the same mnemonics and CFG shape, the same set of strings (each only when unique on both sides), then the callees and callers of matched pairs, finally the most similar remaining pairs (a weighted feature similarity of at least 0.6). The diff view shows the counts (identical, changed, only in A, only in B), a sortable, filterable table (A and B function, similarity 0..1, how it matched, size / block / instruction deltas), and the selected pair's disassembly side by side, aligned by mnemonics, with changed, removed and added lines tinted. Enter, a double-click or **go to** jumps to the A function; Esc goes back to the code (the top bar's **Diff** shows the diff again). Building a table costs about what disassembling every function does (~0.25 s per function of `/bin/ls`, so 1.5 min for its 327 functions); matching takes milliseconds. Side-by-side pseudocode is not offered (it would need B's project open).
- **Open from a URL**: the home screen's URL field (**Open URL…**), or a link to the app with `?open=<URL-encoded http(s) URL>` (e.g. `https://example.org/open-reverse/?open=https%3A%2F%2Fexample.com%2Fls`). The browser downloads the file itself, with a progress panel (and Cancel), and opens it exactly like a dropped file: a project archive is recognised by its content (a ZIP holding `open-reverse.json`), whatever its name, anything else is opened as a binary. The server must allow downloads from other sites (CORS `Access-Control-Allow-Origin`); when it does not, an error says so. No cookies are sent and nothing is uploaded. A URL that came with the page link is taken out of the address bar at once and downloaded only after a confirmation that shows it, so a link cannot make the app download anything on its own.
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
- **Reset** deletes the binary's OpenDecomp project directory and keeps the binary, comments, bookmarks and data definitions (the listing's global names go with the renames). OpenDecomp stores renames as annotations in the same `project.sqlite` as its analysis cache, and has no supported way to drop cached artifacts on their own (they are indexed by rows in that database and referenced by annotation catalogs; it never prunes them), so a reset also loses renames. Export an archive first if you want to keep them.

With a binary open, **Export ▾** in the top bar offers:

- **All pseudocode (.zip)**: OpenDecomp's own `export` (the code of `open-decomp export`, run in the worker) in the current dialect and inference: `functions/NAME@0xADDR.c` (or `.py`; `.asm` where no pseudocode could be produced), `types.h` (the image's merged types plus the structures the functions use, `structures: 'external'`), `index.tsv`, `strings.tsv`, `imports.tsv`, `exports.tsv` and `README.txt`, in one top-level folder. Progress is reported per function and it can be cancelled. Decompiling takes up to seconds per function, and the other views wait for the function being decompiled.
- **Project archive** and **Original binary**, as on the home screen.

### Project archive format (`<name>.orproj.zip`, versions 1 to 3)

A standard ZIP file (stored or deflated entries, no ZIP64, so under 4 GiB) that any unzip tool can open:

| Entry                | Contents |
| -------------------- | -------- |
| `open-reverse.json`  | Manifest: `{ "format": "open-reverse-project", "version", "generator", "createdAt", "record": { "id", "name", "sha256", "size", "addedAt" } }`. Version 3 when the binary has a debug file, else version 2 when the archive has `bookmarks.json` or `data.json`, else version 1 (which older OpenReverse versions read): an archive says the oldest version that holds everything in it. Versions 1 to 3 are read; newer ones are refused. |
| `binary/<name>`      | The binary. Its SHA-256 is `record.sha256` and `record.id` is the first 16 hex digits. |
| `debug/<name>`       | (version 3) The binary's debug file, described by `record.debug`: `{ "name", "sha256", "size", "kind": "dsym\|elf\|pdb", "addedAt" }`. Present only when the binary has one; its SHA-256 and size are checked on import. |
| `comments.json`      | `{ "<0xaddress>": "comment" }` |
| `bookmarks.json`     | `{ "<0xaddress>": "description" }` (version 2; present only when there are bookmarks) |
| `data.json`          | `{ "defs": { "<0xaddress>": { "type": "u8\|u16\|u32\|u64\|ptr\|string", "count", "od"? } }, "names": { "<0xaddress>": "name" } }` (version 2; present only when there are any): data definitions (`od`: declared to OpenDecomp too) and the listing's global names. |
| `project/<path>`     | The OpenDecomp cache root of the binary: `<sha256>.default/project.sqlite` (analysis cache, annotations such as renames), `images/`, `artifacts/`; with a debug file also `<sha256>.default.debug-<debug sha256>/` (the same, plus `debug/<debug sha256>`). |

An archive says version 2 only when it holds bookmarks, the one entry version 1 lacks: an archive without bookmarks is still version 1 and opens in older OpenReverse builds (which refuse entries they do not know). Version 1 archives import as before, without bookmarks.

The export works while the binary is open: the live in-memory SQLite database is serialized when no transaction is open, in the same synchronous step that copies the other files, so the database and the artifact files agree.

Import (the **Import project archive…** button, or drop a `.orproj.zip` on the home screen) validates the whole archive before writing anything: the format and version (a newer version is refused), the record, the binary's SHA-256, the comments and bookmarks, CRC-32 and declared sizes of every entry (inflation is capped while streaming), size limits (2 GiB archive, 1 GiB per entry, 2 GiB in total), and paths: only the entries above, with no absolute, `..`, empty, backslash, colon or control-character segments, so files can only land in `/workspace/binaries/<id>/project/`. A binary that is already in the workspace (same SHA-256) is a conflict: you are asked whether to replace it, and nothing changes if you decline. Decompilations cached in the archive are served from the cache after import.

## Requirements (to build)

- Node.js **24+** and Bun **1.4.3** (`npm i -g bun@1.4.3`), only to build OpenDecomp and the site. Nothing runs on a server.
- A recent Chromium, Firefox or Safari to use it (Web Workers, WebAssembly, IndexedDB).

## Setup and build

```sh
git clone --recurse-submodules <this repo> open-reverse
cd open-reverse
bun run setup          # builds vendor/open-decomp, installs dependencies
bun run build          # static site in web/dist/ (host it anywhere)
bun run dev            # development: http://localhost:5173 with hot reload
bun run preview        # serve web/dist locally
```

`web/dist` can be published as-is to any static host (GitHub Pages, S3, …); it uses relative paths.

## Keyboard

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `G`, `Ctrl+P`      | Go to address / function                          |
| `N`                | Rename the selected function, call target, global, parameter or local |
| `Y`                | Set the C type of the selected parameter, local or global; else edit the C prototype of the selected call target (or current function) |
| `S`                | Create a structure from the selected pointer parameter or local (`struct_<hex> *`) |
| `X`                | Cross-references to the selection (or current function) |
| `Shift+X`          | Cross-references from the selection, the cursor's instruction, or the current function |
| `Ctrl+Z`           | Undo the last edit (rename, comment, signature, type, type declaration, bookmark, data definition) |
| `Ctrl+Shift+Z`, `Ctrl+Y` | Redo                                        |
| `Alt+M`            | Bookmark the cursor's address (again: edit or remove it) |
| `Ctrl+M`           | List bookmarks: filter, `Enter` jumps, `Delete` removes |
| `;`                | Comment at the cursor                             |
| `D`                | Data at the cursor: byte → word → dword → qword (listing, hex view) |
| `A`                | C string at the cursor                            |
| `O`                | Pointer at the cursor                             |
| `*`                | Array at the cursor (element count asked)         |
| `U`                | Undefine the data definition at the cursor        |
| `P`                | Create function: not supported by OpenDecomp (explains why) |
| `Alt+B`, `Alt+T`, `Alt+I` | Search bytes, text, or an immediate value  |
| `Shift+F2`         | Script console; in the editor `Ctrl+Enter` runs, `Esc` stops, `↑` `↓` (empty editor) walk the history |
| `↑` `↓`            | Previous / next instruction (in the graph, across to the fall-through block) |
| `PgUp` `PgDn`, `Home` `End` | Page up / down (linear), first / last instruction |
| `Enter`            | Follow the selected operand, else the call/branch target under the cursor |
| `Ctrl+F`           | Find in the last clicked pane; `Enter` / `Shift+Enter` next / previous, `Esc` closes |
| `Space`            | Toggle linear / graph                             |
| `Tab`              | Toggle the pseudocode pane                        |
| `H`                | Toggle hex view                                   |
| `B`                | Toggle instruction bytes                          |
| `Esc`, `Alt+←`     | Back (Esc first closes the find bar, stops a running script, then closes the xrefs panel) |
| `Alt+→`            | Forward                                           |
| click              | Move the cursor; on a token, highlight its occurrences |
| double-click       | Follow a reference                                |

## Layout

```
web/src/
  App.tsx, components/, views/   React UI (linear, graph, pseudocode, hex, types)
  store.ts                       App state, navigation history, caches, edits and their undo entries
  undo.ts                        Undo/redo history (per binary, in memory)
  scripting.ts, scriptfmt.ts     Script console: the `or` API, running and stopping scripts; result formatting
  api.ts                         Typed RPC client to the engine worker
  engine/
    worker.ts                    Worker entry: boots WASM + SQLite, serves RPC
    engine.ts, session.ts        Per-binary OpenDecomp session and presentation
    linear.ts                    Whole-image listing: sections, functions, data items, undefined bytes, by address window
    objc.ts                      Objective-C labels and comments, the message an objc_msgSend call sends
    memory.ts                    Automatic decompile worker count (cores, device memory); engine memory use
    prototype.ts                 C prototype -> OpenDecomp signature, C type -> type ID (via its C declaration parser)
    structs.ts                   Structure layouts (OpenDecomp's parser) and declarations from recovered structures
    workspace.ts, vfs.ts         Binaries/projects (and comments, bookmarks) in a VFS persisted to IndexedDB
    archive.ts, zip.ts           Project archive format and the ZIP container
    transfer.ts, tasks.ts        Archive snapshots, pseudocode export, storage use; progress/cancel of long calls
    shims/                       Browser implementations of the Node built-ins
test/                            Node unit tests for the shims (bun run test)
test/e2e/browser.mjs             Real-browser end-to-end test (bun run test:e2e)
vendor/open-decomp               OpenDecomp (git submodule, unmodified)
```

## Tests

- `bun run test` runs unit tests under Node: the binary diff (signatures, the matching rounds including call-graph propagation, line alignment), the shims (VFS/fs, SQLite, crypto, zstd, v8), the ZIP/project archive encoder and validator (including bookmarks, data definitions and versions), the token keys used for highlighting, the C prototype and type compiler (with OpenDecomp's declaration parser), structure layouts and declarations rebuilt from recovered structures, URL checks, download file names and archive detection by content, the undo/redo history, the script console's result formatting, argument normalisation and error line numbers, the whole-image listing's layout (windows built forward and backward join without gaps), the Objective-C labels and message tracing, and the automatic worker count.
- `bun run test:e2e` drives the built site in Chromium. Start the site first with `bun run preview -- --port 5199`, and install the browser with `bun add -d playwright && bunx playwright install chromium` (or point `PLAYWRIGHT_PATH` at a playwright package installed elsewhere). It covers:
  - upload, decompilation, renames propagating to callers, comments and persistence across a reload;
  - parameter/local renames, type declarations, and signatures propagating to callers;
  - branch arrows, keyboard navigation, token highlighting, find, the graph minimap, and the graph, hex and xrefs views;
  - the whole-image listing (sections, a string, a GOT slot, data keys with undo/redo, a data rename with undo/redo, xrefs on data, `P`);
  - undo/redo of renames, comments, a local rename, a signature and a type redeclaration; xrefs from and the To/From toggle; the call tree; bookmarks (list, jump, delete, in the archive and after import);
  - the script console: listing functions, a scripted rename undone with `Ctrl+Z`, xrefs to a string, runtime and syntax error lines, Stop, the history;
  - Mach-O and PE, and a stripped binary with background discovery;
  - ARM64 Mach-O (`macho-arm64-symbols` and `-stripped`): an ADRP+ADD row resolved to its string and `X` on it, the graph, a function rename and its undo, the pseudocode export, and a data definition with undo in the stripped image;
  - Objective-C (OpenDecomp's `objc-foundation-classic` test input): method names, messages at `objc_msgSend` calls, selector/class/CFString comments and data labels;
  - the automatic worker count and the engine memory display;
  - xrefs to import stubs (`X`, the call tree's callers and the script API: `_puts` in the Mach-O fixture, `_fprintf` in sshpass);
  - data in and out: pseudocode export (and cancel), archive export, binary download, an import conflict, and an archive imported into a fresh browser profile keeping the rename, the comment and the cached decompilation, then a project reset;
  - a binary diff of `test/fixtures/diff/diffme-v1` and `-v2` (built from `diffme.c`): the changed, identical, renamed (matched by its code) and added functions, the side-by-side lines of the new branch, and going to a function;
  - opening from a URL (a local server on another origin): the `?open=` confirmation (Cancel fetches nothing), a binary, a CORS refusal, an HTTP error, and an archive with a non-archive name.
