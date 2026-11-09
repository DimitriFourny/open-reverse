// Types view, "Type libraries" (IDA's Shift+F11): the header structures, unions and typedefs
// OpenDecomp bundles for the binary's platform (glibc, Darwin libc or mingw-w64, laid out
// for its ABI), browsable with their C declarations, and importable into the image's type
// library so `Y` retypes, signatures and the structure editor can use them.

import { useEffect, useMemo, useState } from 'react';
import { api, type BundledTypes } from '../api.ts';
import { declareTypes, getState, toast, useStore } from '../store.ts';
import { splitLines, tokenize } from '../syntax.ts';

/** Shift+F11: the search box takes the focus once the Types view shows it (it loads first). */
export function focusTypeLibraries(): void {
  let tries = 0;
  const timer = setInterval(() => {
    const input = document.querySelector<HTMLInputElement>('.bundled-search');
    if (input && document.activeElement === input) return clearInterval(timer);
    input?.focus();
    input?.scrollIntoView({ block: 'nearest' });
    if (++tries > 50) clearInterval(timer);
  }, 100);
}

const LIMIT = 300;

/** One-line declarations (`struct a { int32_t x; };`) laid out one member per line. */
function layoutC(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const m = /^((?:typedef )?(?:struct|union)(?: \w+)?) \{ (.*) \}(.*);$/.exec(line);
      if (!m) return line;
      const members = m[2]!.match(/(?:[^;{}]|\{[^}]*\})+;/g) ?? [m[2]!];
      return `${m[1]} {\n${members.map((s) => `  ${s.trim()}`).join('\n')}\n}${m[3]};`;
    })
    .join('\n');
}

function Code({ text }: { text: string }) {
  const lines = useMemo(() => splitLines(tokenize(text, 'c-like')), [text]);
  return (
    <div className="bundled-code">
      {lines.map((line, n) => (
        <div key={n} className="pline">
          <span className="ptext">
            {line.map((t) => (
              <span key={t.start} className={`tok t-${t.kind}`}>
                {t.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TypeLibraries() {
  const bid = useStore((s) => s.bid);
  const library = useStore((s) => s.types.data?.library);
  const [catalog, setCatalog] = useState<BundledTypes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<{ name: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!bid) return;
    let live = true;
    api.bundledTypes(bid).then(
      (c) => live && setCatalog(c),
      (e: unknown) => live && setError(e instanceof Error ? e.message : String(e)),
    );
    return () => void (live = false);
  }, [bid]);
  const declared = useMemo(() => new Set((library ?? []).flatMap((t) => (t.name ? [t.name] : []))), [library]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (catalog?.entries ?? []).filter((e) => !q || e.name.toLowerCase().includes(q) || e.record.toLowerCase().includes(q) || e.header.toLowerCase().includes(q));
  }, [catalog, query]);

  const show = async (name: string) => {
    if (open?.name === name) return setOpen(null);
    try {
      setOpen({ name, text: layoutC((await api.bundledTypeDeclaration(getState().bid!, name)).text) });
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), 'error');
    }
  };
  const importType = async (name: string) => {
    setBusy(true);
    try {
      const { text } = await api.bundledTypeDeclaration(getState().bid!, name);
      const err = await declareTypes(text);
      if (err) toast(err, 'error');
    } finally {
      setBusy(false);
    }
  };

  const bareName = (name: string) => name.replace(/^(?:struct|union) /, '');
  return (
    <>
      <div className="types-section">
        Type libraries
        {catalog && (
          <span className="dim">
            {' '}
            · {catalog.entries.length} header types for {catalog.abi} · {catalog.source}
          </span>
        )}
      </div>
      {error ? (
        <div className="view-note error">{error}</div>
      ) : !catalog ? (
        <div className="view-note dim busy">Loading…</div>
      ) : (
        <div className="bundled">
          <input
            className="bundled-search"
            value={query}
            spellCheck={false}
            placeholder="Search bundled types (stat, FILE, OVERLAPPED, sockaddr…) — Shift+F11"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches[0]) void show(matches[0].name);
              else if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
            }}
          />
          {matches.slice(0, LIMIT).map((e) => (
            <div key={e.name} className={`bundled-type${open?.name === e.name ? ' open' : ''}`}>
              <div className="bundled-row" onClick={() => void show(e.name)} title="Show its C declaration">
                <span className="bundled-name">{e.name}</span>
                {e.record !== e.name && <span className="dim">{e.record}</span>}
                <span className="dim">
                  {e.kind}
                  {e.size !== null ? `, ${e.size} bytes` : ''}
                </span>
                <span className="bundled-header dim">&lt;{e.header}&gt;</span>
                {declared.has(bareName(e.name)) && <span className="bundled-in">in library</span>}
                <button
                  className="link"
                  disabled={busy}
                  onClick={(ev) => (ev.stopPropagation(), void importType(e.name))}
                  title="Declare it (and the types it holds by value) in the image's type library; Ctrl+Z undoes"
                >
                  import
                </button>
              </div>
              {open?.name === e.name && <Code text={open.text} />}
            </div>
          ))}
          {matches.length > LIMIT && <div className="view-note dim">{matches.length - LIMIT} more: refine the search.</div>}
          {matches.length === 0 && <div className="view-note dim">No bundled type matches.</div>}
        </div>
      )}
    </>
  );
}
