// Types view: an editor for the image's type library (OpenDecomp `types_declare`),
// the library's declarations, and the merged structure types recovered across the image.

import { useEffect, useMemo, useState } from 'react';
import type { LibraryType } from '../api.ts';
import { declareTypes, loadTypes, removeLibraryType, useStore } from '../store.ts';
import { splitLines, tokenize } from '../syntax.ts';
import { declaredMembers } from '../engine/structs.ts';
import { StructEditor, type StructDraft } from './StructEditor.tsx';
import { TypeLibraries } from './TypeLibraries.tsx';

/** The editor's text survives switching views. */
let savedDraft = '';

/** The structure editor's draft for a library struct or union, or null when its members cannot be edited as a table. */
function structDraft(t: LibraryType): StructDraft | null {
  const parsed = t.name ? declaredMembers(t.declaration, t.name) : null;
  return parsed && { name: t.name!, union: parsed.union, packed: false, members: parsed.members };
}

/** One-line library declarations (`struct N { int32_t a; T *b; };`) laid out one member per line. */
function formatDeclaration(decl: string): string {
  const m = /^((?:struct|union)\s+\w+\s*)\{(.*)\};$/.exec(decl.trim());
  if (!m) return decl;
  const members = m[2]!
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  return `${m[1]!.trim()} {\n${members.map((s) => `  ${s};`).join('\n')}\n};`;
}

function Code({ text }: { text: string }) {
  const lines = useMemo(() => splitLines(tokenize(text, 'c-like')), [text]);
  return (
    <>
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
    </>
  );
}

export function TypesView() {
  const types = useStore((s) => s.types);
  const [draft, setDraftState] = useState(savedDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [structure, setStructure] = useState<StructDraft | null>(null);
  useEffect(() => void loadTypes(), []);
  const setDraft = (v: string) => {
    savedDraft = v;
    setDraftState(v);
  };
  const lines = useMemo(() => (types.data ? splitLines(tokenize(types.data.text, 'c-like')) : []), [types.data]);
  const named = types.data?.library.filter((t) => t.name !== null) ?? [];
  const helpers = (types.data?.library.length ?? 0) - named.length;

  const apply = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    const err = await declareTypes(draft);
    setBusy(false);
    if (err) setErrors(err.split('\n'));
    else {
      setErrors([]);
      setDraft('');
    }
  };
  const edit = (t: LibraryType) => {
    setDraft(formatDeclaration(t.declaration));
    setErrors([]);
  };
  const remove = (t: LibraryType) => {
    if (confirm(`Remove ${t.name} from the type library?`)) void removeLibraryType(t);
  };

  return (
    <div className="types-view">
      {structure ? (
        <div className="types-editor">
          <StructEditor key={structure.name} initial={structure} onClose={() => setStructure(null)} />
        </div>
      ) : (
      <div className="types-editor">
        <div className="types-head">
          <span>Declare C types</span>
          <span className="dim"> struct · union · enum · typedef, &lt;stdint.h&gt; names, pointers, arrays, packed. Redeclaring a name replaces it.</span>
        </div>
        <textarea
          className="types-input"
          spellCheck={false}
          value={draft}
          disabled={busy}
          placeholder={'struct Node {\n  int value;\n  struct Node *next;\n};'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              void apply();
            } else if (e.key === 'Escape') (e.target as HTMLTextAreaElement).blur();
          }}
        />
        {errors.length > 0 && (
          <div className="types-errors">
            {errors.map((e, i) => (
              <div key={i} className="error">
                {e}
              </div>
            ))}
          </div>
        )}
        <div className="types-actions">
          <button className="primary" disabled={busy || !draft.trim()} onClick={() => void apply()} title="Apply (Ctrl+Enter)">
            {busy ? 'Applying…' : 'Apply'}
          </button>
          <button disabled={busy || !draft} onClick={() => (setDraft(''), setErrors([]))}>
            Clear
          </button>
          <button
            disabled={busy}
            onClick={() => setStructure({ name: '', union: false, packed: false, members: [{ type: 'uint32_t', name: 'field_0', dims: '' }] })}
            title="Edit a new structure as a table of fields"
          >
            New structure…
          </button>
          <span className="dim">Ctrl+Enter applies · named types can then be used in signatures and types (Y)</span>
        </div>
      </div>
      )}
      <div className="code-scroll pseudo types-lists">
        <div className="types-section">
          Type library
          {types.data && (
            <span className="dim">
              {' '}
              · {named.length} declared{helpers > 0 ? ` · ${helpers} helper types` : ''}
            </span>
          )}
        </div>
        {types.status === 'error' ? (
          <div className="view-note error">{types.error}</div>
        ) : !types.data ? (
          <div className="view-note dim busy">Loading… (recovering image-wide types analyzes every function body)</div>
        ) : named.length === 0 ? (
          <div className="view-note dim">No declarations yet.</div>
        ) : (
          named.map((t) => (
            <div key={t.annotationId} className="lib-type">
              <div className="lib-decl">
                <Code text={formatDeclaration(t.declaration)} />
              </div>
              <div className="lib-actions">
                {t.status !== 'asserted' && <span className="dim">{t.status}</span>}
                {structDraft(t) && (
                  <button className="link" onClick={() => setStructure(structDraft(t))} title="Edit its fields in the structure editor">
                    fields
                  </button>
                )}
                <button className="link" onClick={() => edit(t)} title="Load into the editor">
                  edit
                </button>
                <button className="link" onClick={() => remove(t)} title="Remove from the type library">
                  delete
                </button>
              </div>
            </div>
          ))
        )}
        <TypeLibraries />
        <div className="types-section">
          Recovered types
          {types.data && (
            <span className="dim">
              {' '}
              · merged structure types observed across the image
              {types.data.state === 'partial' ? ' (partial: not every function was analyzed within the budget)' : ''} ·{' '}
              <button className="link" onClick={() => void loadTypes(true)}>
                Refresh
              </button>
            </span>
          )}
        </div>
        {types.data && (
          <div className="pseudo-lines">
            {lines.map((line, n) => (
              <div key={n} className="pline">
                <span className="lineno">{n + 1}</span>
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
        )}
      </div>
    </div>
  );
}
