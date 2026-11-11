# TODO

What is left after the engine round of 2026-11-10/11 (OpenDecomp output quality and performance).
Each item says how it is known: **measured** (a run on the round's inputs), **read** (read in the code),
or **inferred**. The inputs were SQLite 3.54.1 (gcc -O2, clang -O2, Mach-O arm64, PE), Lua 5.4, zlib
minigzip and small hand-written C/C++ files.

## Where things stand

- Engine (`vendor/open-decomp`): local `main` holds the whole round. Nothing is pushed.
- App: `main` records the new engine commit. Typecheck, unit tests (149), the site build and the browser
  e2e suite (54 of 54) pass on it (measured). One e2e text assertion was updated because the engine now
  prints `reg->count = reg->count + 1;`. The check "find past the loaded slice of the listing" timed out
  once in two runs (the match was reached, the count did not show `n/m+` within 30 s; cause not looked
  for; the step now reports the count it saw). The site is not redeployed.
- To publish: push OpenDecomp first (`git push git@github.com:DimitriFourny/open-decomp.git main` from
  `vendor/open-decomp`), then this repository, then `scripts/deploy-pages.sh`.

## Decisions to take

1. **Size-scaled default budgets** (engine commits `0d0ff89b` + `dfa476f3`). A decompile request that
   gives no budget now gets one scaled to the function's size: the old defaults up to 5,000 bytes of
   instructions, then 3,000 work per byte, capped at the schema maxima (100M work, 300 s). Large functions
   print instead of failing (34 of the 35 largest SQLite functions, measured), at the cost of long requests:
   `sqlite3WhereBegin` took 94 s and 1.4 GB. Keep, or revert those two commits and let callers ask.
2. **Premises the output relies on**, each reported in the result but worth an explicit yes:
   a call returns below the caller's frame (`call_return_address_below_frame`); a stack-protector check
   that fails does not return (`stack_protector`); callees follow the platform ABI for callee-saved
   registers (`abi_conformance`); `/` and `%` in the dialect trap on a zero divisor; the direction flag is
   clear at REP string instructions when no instruction of the function can set it.
3. **Loaders degrade instead of rejecting** odd ELF/PE/Mach-O inputs (bad version-need chains, `.tbss`,
   unusual headers): the file opens with a warning. Confirm this is wanted for every case.

## App (not started)

The app was only checked to build and pass its tests against the new engine. Still to do:

- **Budgets in the browser.** `web/src/engine/session.ts` sends `deadline_ms: 120_000` for a decompile
  and `web/src/engine/transfer.ts` sends 300 s for an export; everything else is the engine default, which
  is now size-scaled. Measure in the browser build (state counts, time, peak worker heap) on
  `sqlite-gcc-O2`, including its nine largest functions, and choose what the interactive decompile and
  the export should send. The browser has a heap ceiling that the CLI does not.
- **Say why a result is partial.** Show, in plain words, what was cut: which budget ran out (and offer a
  retry with a larger one), the reason strings of an incomplete index (for example exception handlers),
  or the unsupported instruction. Keep the text that was produced.
- **Engine plumbing in the browser** (read, not verified): check that `<project>/requests/**` scratch
  directories are not persisted or kept in memory after a request; that the compressed artifacts and the
  compact store survive the VFS and the project archive (an archive from the deployed build must still
  open); that the `os.hostname`, `process.pid` and `process.kill` shims answer what the engine's job
  owner expects.
- **Features that depend on the text shape.** Address↔line sync (a block can now print twice: tail
  copies), rename and retype from the pseudocode, enum constants (`M`), library names, navigation from a
  call site that now prints a C++ function's own name, cross-references, the Python-like view.
- **Performance pass** with `test/e2e/bench.mjs`, then update the numbers and the "Known limits" list in
  `docs/GUIDE.md` (remove a limit only after checking it in the browser).

## Engine: output quality

- **C++ landing pads are not decompiled.** The engine knows only whether a function has an exception
  handler; the handler code is not in the function's graph, so most C++ functions with a destructor in
  scope are `partial (incomplete_index)` and miss their `catch`/cleanup code. Plan: parse the LSDA
  call-site tables (ELF `.gcc_except_table`, Mach-O `__gcc_except_tab`), give each call in a record with
  a pad a second successor (the call returned to the pad with every caller-saved register clobbered,
  except the two exception registers), print it without `try`/`catch` types. PE handlers stay flagged.
  With clang, a pad can still print as the fallthrough of a call the compiler knew never returns
  (measured on a small throw/catch program).
- **Few `complete` results.** A function is complete only when its whole callee closure is; hubs such as
  `sqlite3_str_vappendf` keep most of SQLite partial, and the worklist stops at 64 callees. A precomputed
  closed-summary table was tried and rejected (it changed results). Needs a design.
- **`sqlite3VdbeExec`** (41 KB) still fails at the maximum budget: 100M work is spent in the first
  structuring pass (42.9M), type recovery (28M) and SSA (15.8M), then reconstruction runs out (measured).
- **Calls into clang-built code** gain nothing from the callee register summaries: `unknown_value(...,
  "call clobbers …")` 91 and `physical_return(...)` 102 are unchanged on the clang subset (measured).
  The summaries are also refused for any callee with exception handlers.
- **Gotos.** Still 242 in the 78 JSON functions and 188 in the 40 pager functions of SQLite gcc -O2
  (measured on the final engine; 273 and 205 before the structuring merge). Not done: merging identical statements before a goto and before its label (172 gotos on the
  baseline; needs one statement mapped to two address ranges), guard conditions for joins, cheaper loop
  exits, adjacent labels. The second layout is chosen by a count of labeled edges, which sometimes adds a
  `break`/`continue` (three functions, measured) and on one test fixture prints a goto into an `if` arm
  where `a || (x = f()) == 0` printed before.
- **Too many locals**: 0.17 declarations per line on the JSON subset; `jsonLookupStep` declares 152
  (measured before the last merges). Declare at first use and merge non-overlapping values of one register.
- **Parameters** are numbered by the registers a function reads; a function that skips a lower argument
  register gets a shifted list (inferred from outputs).
- **Huge bodies** print `aligned1_*` and `boundary(...)` records without bound.
- **arm64 instructions** still unlifted on the inputs: ZIP1, UZP1, XTN, USHL, LD1R, FRINTM, FCCMP,
  FCVTZS, FRINTP, FCVTMS (52 sites in 14 functions of the SQLite and Lua subsets, measured).
- **Statically linked runtimes**: `__cxa_throw`, `abort`, `__stack_chk_fail` as local functions are not
  known to never return (names are trusted for imports only), so code prints after them.
- A failed request reports the default budget in its envelope; the limit it really ran with is only in
  `error.details`.
- To confirm on arm64 (read for the x86 lifter only): every coverage reason other than the unwinder ones
  leaves an unknown exit or effect in the IR, which the callee register summaries rely on.

## Engine: to verify first

- **Stored SSA replayed onto a truncated lift** (read in code by the performance agent, not reproduced):
  `nativeUnitLoader` reuses a stored, completed SSA (`stored.ssa`) without checking that the current lift
  is of the same untruncated graph. When the lift was redone from a graph cut by the instruction
  capacity, a full-body SSA is paired with a truncated base. A guard exists on the side branch
  `od/perf-cpu-ssacut` (commit `ddb63391`, the `recorded` check). Reproduce, then fix.

## Engine: performance and size

- **Where the time goes** (CPU profile of 60 SQLite functions, measured): loading callee units is 35% of
  decompile time (the callee worklist 56 s, image-type exploration 182 s of 672 s), and 17% is spent
  preparing units that hit a limit and are thrown away. Image-type exploration prepares the same large
  hub again for every caller (`sqlite3WhereBegin` four times at 28.7 s each). Options: make a limited
  preparation resumable (tried on `od/perf-cpu-ssacut`, reverted: six functions failed with "Maximum call
  stack size exceeded" and one charged 8,745 less work, cause not found), or stop exploring callers
  above about 5 KB.
- A memo of evidence reads per project revision (about 3% estimated), catalog validation in
  `nativeAnnotations` (2%), jump-table proofs in discovery (5.5%).
- Peak memory per request was measured only as RSS (1.2–1.4 GB for the largest functions); no heap
  retainer analysis was done. The new selector-key memo adds 17–49 MB (single runs).

- No quiet-machine before/after measurement of a full SQLite export was taken; the round's numbers come
  from subsets, run while other jobs shared the machine.
- Request scratch directories held one copy of `project.sqlite` per project revision after the storage
  merge (measured then, not re-checked since).
- Older limits, unchanged: the project database is about 700× the binary; a 33 MB ELF does not import;
  discovery of `python3.13` dies past 2 GB or on a function with more than 1,000 evidence records; the
  first request after a discovery step reads every record back (about 8 s for `/bin/ls`).

## Older follow-ups (from the previous rounds)

- Discovery misses about 15% of library functions.
- No bundled library signatures for ARM64 or PE.
- PE calls with stack arguments stay untyped (7-argument `CreateFileW`).
- Nested struct members and function-pointer types are opaque.
- Register locals of -O2 code are untyped.

## Tests that fail for reasons of the machine

- `test/cli/export.test.ts` "export writes one file per indexed function" needs `/usr/bin/clang`.
- `test/mcp/stdio.test.ts` "official SDK source-entry workflows" times out at 360 s.
- Nine oracle tests run only on darwin-arm64 and are skipped elsewhere.

## Working material (on the build machine only, not in git)

`/home/debian/od-work/`: `BASELINE.md` (every measurement and merge of the round), `briefs/` (work
packages, including the two not started: `app.md` and `eh-pads.md`), `bin/` and `small/` (the input
binaries), `exp/`, `merge*/` (exports), `agents/<name>/` (each agent's checkout and scripts). The engine
repository keeps the merged branches as local `od/<name>` branches, plus `od/perf-cpu-ssacut` (not merged).
It holds 12 GB, mostly caches that can be deleted once the numbers are no longer needed.
