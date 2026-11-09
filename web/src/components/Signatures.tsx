// Shift+F5: library signatures (IDA's signatures window, Binary Ninja WARP / signature kit).
// Lists the bundled and the user's signature libraries, applies them to the open binary
// (one undo step), shows what each named and what stayed ambiguous, and makes new libraries
// from this binary's symbols or from dropped static libraries / objects.

import { useEffect, useMemo, useRef, useState } from 'react';
import { api, type SignatureApplication, type SignatureInfo } from '../api.ts';
import { applySignatures, navigate, toast, useStore } from '../store.ts';
import { fmtSize, padAddr } from '../util.ts';

/** Where the site serves its bundled signature libraries. */
export const signaturesBase = () => new URL('signatures/', document.baseURI).href;

function download(name: string, bytes: Uint8Array): void {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SignaturesDialog({ onClose }: { onClose: () => void }) {
  const bid = useStore((s) => s.bid);
  const info = useStore((s) => s.info);
  const functions = useStore((s) => s.functions);
  const discovery = useStore((s) => s.discovery);
  const [libraries, setLibraries] = useState<SignatureInfo[] | null>(null);
  const [suggested, setSuggested] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<SignatureApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const abort = useRef<AbortController | null>(null);
  const files = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  // Focus the dialog so Esc closes it before anything inside was clicked.
  useEffect(() => dialog.current?.focus(), []);

  const reload = async () => {
    try {
      setLibraries((await api.signatureLibraries(signaturesBase())).libraries);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };
  // The list first; suggestions read the binary's strings, which waits for running analysis.
  const touched = useRef(false);
  useEffect(() => {
    void reload();
    if (!bid) return;
    let live = true;
    void api.signatureLibraries(signaturesBase(), bid).then(
      (r) => {
        if (!live) return;
        setSuggested(r.suggested);
        if (!touched.current) setChecked(new Set(Object.keys(r.suggested)));
      },
      () => undefined,
    );
    return () => void (live = false);
  }, [bid]); // eslint-disable-line react-hooks/exhaustive-deps

  const named = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of functions) if (f.library) m.set(f.library, (m.get(f.library) ?? 0) + 1);
    return m;
  }, [functions]);
  const unnamed = useMemo(() => functions.filter((f) => !f.importStub && !f.library && !f.renamed && !f.originalName).length, [functions]);
  const arch = info?.image.target.architecture;
  const usable = (l: SignatureInfo) => l.architecture === arch;

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await fn();
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
      abort.current = null;
      // The button clicked was disabled meanwhile: keep the keys (Esc) on the dialog.
      dialog.current?.focus();
    }
  };
  const apply = () =>
    run('Matching…', async () => {
      const ids = [...checked].filter((id) => libraries?.some((l) => l.id === id && usable(l)));
      if (!ids.length) return;
      const r = await applySignatures(ids, ids.length === 1 ? ids[0]! : `${ids.length} libraries`);
      if (r) setResult(r);
    });
  const fromBinary = () =>
    run('Reading functions…', async () => {
      abort.current = new AbortController();
      const r = await api.makeSignatures(bid!, title.trim(), (p) => setBusy(`Reading functions… ${p.done}/${p.total ?? '?'}`), abort.current.signal);
      toast(`Signature library ${r.library.title}: ${r.stats.signatures} signatures from ${r.stats.bodies} functions`);
      await reload();
    });
  const fromFiles = (list: File[]) =>
    run('Reading objects…', async () => {
      const r = await api.makeObjectSignatures(title.trim(), list);
      toast(`Signature library ${r.library.title}: ${r.stats.signatures} signatures from ${r.stats.bodies} functions`);
      await reload();
    });

  const toggle = (id: string) => {
    touched.current = true;
    setChecked((c) => {
      const next = new Set(c);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} tabIndex={-1} className="modal signatures-dialog" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), abort.current?.abort(), onClose())}>
        <div className="modal-title">Signatures · {info?.record.name}</div>
        <p className="dim sig-intro">
          Names library functions in stripped and statically linked binaries by their bytes (relocated bytes masked), with call-graph and
          object-layout checks; a body several functions share stays unnamed. Named functions get the library's C prototype, so their callers'
          pseudocode is typed. {unnamed} function{unnamed === 1 ? '' : 's'} without a name.
          {discovery?.state === 'running' && ' Function discovery is still running: functions found later are not matched.'}
        </p>
        <table className="sig-table">
          <thead>
            <tr>
              <th />
              <th>Library</th>
              <th className="num">Signatures</th>
              <th className="num">Size</th>
              <th className="num">Named here</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {libraries === null && (
              <tr>
                <td colSpan={6} className="dim">
                  Loading…
                </td>
              </tr>
            )}
            {libraries?.map((l) => (
              <tr key={l.id} className={usable(l) ? '' : 'dim'} title={`${l.id}\n${l.source}${l.contracts ? `\nPrototypes: ${l.contracts}` : ''}`}>
                <td>
                  <input type="checkbox" aria-label={l.id} disabled={!usable(l)} checked={checked.has(l.id)} onChange={() => toggle(l.id)} />
                </td>
                <td>
                  <span className="sig-title">{l.title}</span> <span className="dim mono">{l.id}</span>
                  {l.kind === 'user' && <span className="sig-badge">yours</span>}
                  {suggested[l.id] && (
                    <span className="sig-badge suggested" title={`Suggested: ${suggested[l.id]}`}>
                      suggested
                    </span>
                  )}
                </td>
                <td className="num">{l.signatures.toLocaleString()}</td>
                <td className="num">{fmtSize(l.bytes)}</td>
                <td className="num">{named.get(l.id) ?? ''}</td>
                <td>
                  {l.kind === 'user' && (
                    <>
                      <button className="link" title="Download this library" onClick={() => void api.exportSignatures(l.id).then((f) => download(f.name, f.bytes))}>
                        ⬇
                      </button>
                      <button
                        className="link"
                        title="Delete this library (names it gave stay)"
                        onClick={() => void run('Deleting…', async () => (await api.deleteSignatures(l.id), await reload()))}
                      >
                        ×
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {result && (
          <div className="sig-result" data-testid="sig-result">
            <div>
              Named{' '}
              {Object.entries(result.matched)
                .map(([id, n]) => `${n} from ${id}`)
                .join(', ')}
              {result.stubs ? ` (${result.stubs} IFUNC PLT entries)` : ''} in {(result.ms / 1000).toFixed(1)} s, of {result.unnamed} unnamed functions.
              {!!result.ambiguous.length && ` ${result.ambiguous.length} left unnamed: several functions share their body.`}
            </div>
            {!!result.ambiguous.length && (
              <div className="sig-ambiguous">
                {result.ambiguous.slice(0, 200).map((a) => (
                  <div key={a.entry} className="sig-ambiguous-row" onClick={() => void navigate(a.entry)} title="Go to this function">
                    <span className="addr">{padAddr(a.entry)}</span> one of {a.candidates.join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {error && <div className="sig-error">{error}</div>}
        <div className="sig-make">
          <span>New library:</span>
          <input className="modal-input" value={title} placeholder="Name (optional)" spellCheck={false} onChange={(e) => setTitle(e.target.value)} />
          <button disabled={!!busy || !bid} onClick={() => void fromBinary()} title="Signatures of this binary's functions that have symbols (to name them in a stripped build)">
            From this binary's symbols
          </button>
          <button disabled={!!busy} onClick={() => files.current?.click()} title="Signatures from ELF x86-64 static libraries (.a) or objects (.o)">
            From .a / .o files…
          </button>
          <input
            ref={files}
            type="file"
            multiple
            hidden
            data-testid="sig-files"
            accept=".a,.o,.lib,.obj"
            onChange={(e) => {
              const list = [...(e.target.files ?? [])];
              e.target.value = '';
              if (list.length) void fromFiles(list);
            }}
          />
        </div>
        <div className="modal-foot">
          <span className="dim">{busy ?? 'Ctrl+Z undoes an application. Your libraries are kept in this browser.'}</span>
          {busy && abort.current && <button onClick={() => abort.current?.abort()}>Cancel</button>}
          <button className="primary" disabled={!!busy || ![...checked].length} onClick={() => void apply()}>
            Apply {checked.size > 1 ? `${checked.size} libraries` : ''}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
