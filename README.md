# OpenReverse

A web interface for reverse engineering native binaries, in the spirit of Binary Ninja, IDA and Ghidra, built on [OpenDecomp](https://github.com/DimitriFourny/open-decomp).

OpenDecomp loads, disassembles and decompiles the binary. OpenReverse adds a browser UI and a small HTTP server that keeps OpenDecomp projects open between requests. It supports what OpenDecomp supports: **Mach-O ARM64, PE x86-64 and ELF x86-64**.

## Features

- **Linear disassembly** with branch labels (`loc_…`), call targets shown by function name, string references as auto-comments, and optional instruction bytes.
- **Control-flow graph**: block layout from dagre, true/false/unconditional edge colors, back edges drawn dashed, pan, Ctrl+wheel zoom, and fit-to-view.
- **Pseudo-C / pseudo-Python** next to the disassembly, linked in both directions. Click a statement to highlight its instructions; move the cursor in the disassembly to highlight the statements it produced. This uses OpenDecomp's emission mappings. Language, `proven`/`likely` inference and `source`/`checked` view are selectable.
- **Navigation**: double-click to follow references, back/forward history, go to an address or function name with fuzzy matching, and the location kept in the URL hash so a reload keeps your place.
- **Function, string, symbol and section lists**, all filterable and virtualized so they stay fast on large binaries.
- **Cross-references** to functions, strings and data.
- **Hex view** of the section around the cursor.
- **Recovered types**: the image-wide merged structure types (`struct_<hex>`).
- **Renames** of functions and globals. They are stored as OpenDecomp annotations, so every caller's pseudocode picks up the new name, and MCP agents working on the same project see them too.
- **Comments** on any address.
- **Stripped binaries**: whole-image function discovery runs in the background, and the function list fills in as it progresses.

## Requirements

- Node.js **24+** (the server runs TypeScript directly with Node's type stripping, so there is no server build step)
- Bun **1.4.3**, needed only to build OpenDecomp (`npm i -g bun@1.4.3`)

## Setup

```sh
git clone --recurse-submodules <this repo> open-reverse
cd open-reverse
npm run setup          # builds vendor/open-decomp, installs dependencies
```

## Run

```sh
npm run build          # build the web UI into web/dist
npm start              # http://127.0.0.1:5174
npm start -- ./app     # also import ./app into the workspace
```

Open the page, then drop a binary on it or use **Open…**.

For development, `npm run dev` starts the API server in watch mode on :5174 and Vite with hot reload on http://127.0.0.1:5173.

Options (`node server/main.ts --help`):

| Option            | Default                                           |
| ----------------- | ------------------------------------------------- |
| `--host HOST`     | `127.0.0.1`                                       |
| `--port PORT`     | `5174`                                            |
| `--workspace DIR` | `./workspace` (or `$OPEN_REVERSE_WORKSPACE`)      |
| `--dev`           | API only; the UI is served by Vite                |

> **Security:** the server has no authentication. Anyone who can reach the port can upload binaries and read their analysis. It listens on loopback by default; put it behind an authenticating proxy before exposing it.

## Keyboard

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `G`, `Ctrl+P`      | Go to address / function                          |
| `N`                | Rename the selected function, call target or global |
| `X`                | Cross-references to the selection (or current function) |
| `;`                | Comment at the cursor                             |
| `Space`            | Toggle linear / graph                             |
| `Tab`              | Toggle the pseudocode pane                        |
| `H`                | Toggle hex view                                   |
| `B`                | Toggle instruction bytes                          |
| `Esc`, `Alt+←`     | Back (Esc first closes the xrefs panel)           |
| `Alt+→`            | Forward                                           |
| double-click       | Follow a reference                                |

## Layout

```
server/            Fastify API (Node 24, TypeScript without a build step)
  main.ts          CLI entry point
  app.ts           HTTP routes under /api
  session.ts       One open binary: OpenDecomp BinarySession + presentation
  workspace.ts     Uploaded binaries, OpenDecomp projects, comments
web/               React + Vite UI
  src/store.ts     App state, navigation history, caches
  src/views/       Linear, graph, pseudocode, hex and types views
test/              API tests over OpenDecomp's fixture binaries (npm test)
vendor/open-decomp OpenDecomp (git submodule)
```

The workspace stores each binary at `workspace/binaries/<id>/`. The id is the first 16 hex digits of the binary's SHA-256. Each directory holds a copy of the binary, its OpenDecomp project (`project/`, SQLite) and `comments.json`.

## API

All endpoints are JSON. `:bid` is a workspace binary id and `:fid` an OpenDecomp function entity id.

| Method | Path | |
| --- | --- | --- |
| GET | `/api/binaries` | Workspace binaries |
| POST | `/api/binaries?name=` | Upload (`application/octet-stream` body) |
| DELETE | `/api/binaries/:bid` | Delete a binary and its project |
| GET | `/api/b/:bid/info` | Image, target, revision, discovery status |
| GET | `/api/b/:bid/functions` | All functions |
| GET | `/api/b/:bid/function-at?addr=` | Function containing an address |
| GET | `/api/b/:bid/functions/:fid/listing` | Instructions (bytes, resolved operand refs) and CFG blocks |
| GET | `/api/b/:bid/functions/:fid/decompile?language=&inference=&view=` | Pseudocode plus text-span → address mappings |
| GET | `/api/b/:bid/xrefs?id=` or `?addr=` | Incoming references |
| GET | `/api/b/:bid/strings` · `symbols` · `sections` · `headers` · `types` | Image tables |
| GET | `/api/b/:bid/memory?addr=&length=` | Bytes (at most 64 KiB) |
| POST | `/api/b/:bid/rename` | `{id \| addr, name}`; an empty name restores the original |
| POST | `/api/b/:bid/comment` | `{addr, text}`; empty text removes the comment |
