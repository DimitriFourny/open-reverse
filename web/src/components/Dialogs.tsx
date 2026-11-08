import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createStructFromVariable,
  navigate,
  rename,
  renameVariable,
  setBookmark,
  setComment,
  setSignature,
  setState,
  setType,
  toast,
  useStore,
  type Dialog,
} from '../store.ts';
import { cmpAddr, functionOffset, mangledNote, padAddr, parseAddress } from '../util.ts';

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onClose())}>
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

const close = () => setState({ dialog: null });

function GotoDialog() {
  const functions = useStore((s) => s.functions);
  const [text, setText] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);
  const matches = useMemo(() => {
    const t = text.trim().toLowerCase();
    if (!t) return functions.slice(0, 50);
    const scored: [number, (typeof functions)[number]][] = [];
    // Demangled and mangled names both match (`geom::area`, `_ZN4geom4areaEii`).
    for (const f of functions) {
      const n = f.name.toLowerCase();
      const i = n.indexOf(t);
      const m = f.mangled?.toLowerCase().indexOf(t) ?? -1;
      if (i >= 0) scored.push([(i === 0 ? 0 : 1000) + n.length, f]);
      else if (m >= 0) scored.push([(m === 0 ? 500 : 1500) + f.mangled!.length, f]);
      else if (f.entry.includes(t)) scored.push([2000, f]);
    }
    return scored.sort((a, b) => a[0] - b[0]).slice(0, 50).map(([, f]) => f);
  }, [text, functions]);
  const addr = parseAddress(text);
  const go = (i: number) => {
    const f = matches[i];
    const exact = (x: (typeof matches)[number]) => [x.name, x.mangled].some((n) => n?.toLowerCase() === text.trim().toLowerCase());
    if (f && (!addr || exact(f))) {
      close();
      void navigate(f.entry, { fnId: f.id });
    } else if (addr) {
      close();
      void navigate(addr);
    } else toast('No such function or address', 'error');
  };
  return (
    <Modal title="Go to address or function" onClose={close}>
      <input
        ref={inputRef}
        className="modal-input"
        value={text}
        placeholder="0x401000, 401000h, main…"
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setSel(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') (e.preventDefault(), setSel((s) => Math.min(s + 1, matches.length - 1)));
          else if (e.key === 'ArrowUp') (e.preventDefault(), setSel((s) => Math.max(s - 1, 0)));
          else if (e.key === 'Enter') go(addr && !matches.some((m) => [m.name, m.mangled].some((n) => n?.toLowerCase() === text.trim().toLowerCase())) ? -1 : sel);
        }}
      />
      {addr && <div className="goto-hint dim">Enter: go to address {addr}</div>}
      <div className="goto-list">
        {matches.map((f, i) => (
          <div
            key={f.id}
            className={`goto-item${i === sel ? ' active' : ''}`}
            onMouseEnter={() => setSel(i)}
            onClick={() => go(i)}
            title={`${f.name}${mangledNote(f.mangled)}`}
          >
            <span className="goto-name">
              {f.name}
              {f.mangled && text.trim() && !f.name.toLowerCase().includes(text.trim().toLowerCase()) && <span className="dim"> {f.mangled}</span>}
            </span>
            <span className="dim">{padAddr(f.entry)}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function TextDialog({
  title,
  initial,
  hint,
  multiline,
  extra,
  onSubmit,
}: {
  title: string;
  initial: string;
  hint: string;
  multiline?: boolean;
  /** More footer buttons, before Cancel. */
  extra?: React.ReactNode;
  onSubmit: (v: string) => void;
}) {
  const [text, setText] = useState(initial);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const submit = () => {
    close();
    onSubmit(text);
  };
  return (
    <Modal title={title} onClose={close}>
      {multiline ? (
        <textarea ref={ref} className="modal-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submit())} />
      ) : (
        <input ref={ref} className="modal-input" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      )}
      <div className="modal-foot">
        <span className="dim">{hint}</span>
        {extra}
        <button onClick={close}>Cancel</button>
        <button className="primary" onClick={submit}>OK</button>
      </div>
    </Modal>
  );
}

/** IDA's Y: the function's C prototype, applied as an OpenDecomp signature annotation. */
function SignatureDialog({ dialog }: { dialog: Extract<Dialog, { kind: 'signature' }> }) {
  const [text, setText] = useState(dialog.current);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const apply = async (value: string) => {
    setBusy(true);
    setError(null);
    const err = await setSignature(dialog.fnId, value);
    setBusy(false);
    if (err) setError(err);
    else close();
  };
  return (
    <Modal title={`Signature of ${dialog.name}`} onClose={close}>
      <input
        ref={ref}
        className="modal-input"
        value={text}
        spellCheck={false}
        disabled={busy}
        placeholder="int parse(struct Node *n, char *s)"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && void apply(text)}
      />
      {error && <pre className="form-error">{error}</pre>}
      <div className="modal-foot">
        <span className="dim">
          C prototype. struct, union, enum and typedef names come from the type library (Types view). Stored as an asserted OpenDecomp
          signature; callers pick it up.
        </span>
        {dialog.declared && (
          <button disabled={busy} onClick={() => void apply('')} title="Remove the declared signature">
            Reset
          </button>
        )}
        <button onClick={close}>Cancel</button>
        <button className="primary" disabled={busy} onClick={() => void apply(text)}>
          {busy ? 'Applying…' : 'Apply'}
        </button>
      </div>
    </Modal>
  );
}

/** One-line input applied by an async edit that may fail: the error stays in the dialog. */
function ApplyDialog({
  title,
  initial,
  placeholder,
  hint,
  resetLabel,
  onApply,
}: {
  title: string;
  initial: string;
  placeholder: string;
  hint: React.ReactNode;
  /** A button applying the empty text. */
  resetLabel?: string;
  onApply: (v: string) => Promise<string | null>;
}) {
  const [text, setText] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const apply = async (value: string) => {
    setBusy(true);
    setError(null);
    const err = await onApply(value);
    setBusy(false);
    if (err) setError(err);
    else close();
  };
  return (
    <Modal title={title} onClose={close}>
      <input
        ref={ref}
        className="modal-input"
        value={text}
        spellCheck={false}
        disabled={busy}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && void apply(text)}
      />
      {error && <pre className="form-error">{error}</pre>}
      <div className="modal-foot">
        <span className="dim">{hint}</span>
        {resetLabel && (
          <button disabled={busy} onClick={() => void apply('')}>
            {resetLabel}
          </button>
        )}
        <button onClick={close}>Cancel</button>
        <button className="primary" disabled={busy} onClick={() => void apply(text)}>
          {busy ? 'Applying…' : 'Apply'}
        </button>
      </div>
    </Modal>
  );
}

/** A structure name from a variable name: `address` -> `Address`. */
function structName(variable: string): string {
  const n = variable.replace(/^_+/, '').replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  return n ? n[0]!.toUpperCase() + n.slice(1) : 'Struct';
}

export function Dialogs() {
  const dialog = useStore((s) => s.dialog);
  if (!dialog) return null;
  if (dialog.kind === 'goto') return <GotoDialog />;
  if (dialog.kind === 'rename')
    return (
      <TextDialog
        title={`Rename ${dialog.what}`}
        initial={dialog.current}
        hint="Empty restores the original name. Stored as an OpenDecomp annotation."
        onSubmit={(v) => void rename(dialog.target, v)}
      />
    );
  if (dialog.kind === 'signature') return <SignatureDialog dialog={dialog} />;
  if (dialog.kind === 'renameVar')
    return (
      <TextDialog
        title={`Rename ${dialog.parameter ? 'parameter' : 'local'} ${dialog.current}`}
        initial={dialog.current}
        hint="Empty restores the generated name. Stored as an OpenDecomp name annotation on the value."
        onSubmit={(v) => void renameVariable(dialog.fnId, dialog.valueId, v, dialog.current)}
      />
    );
  if (dialog.kind === 'retype')
    return (
      <ApplyDialog
        title={`Type of ${dialog.what}`}
        initial={dialog.current}
        placeholder="struct Node *, char *, uint32_t[8]"
        hint="C type. struct, union, enum and typedef names come from the type library (Types view). Stored as an asserted OpenDecomp type annotation."
        resetLabel="Reset"
        onApply={(v) => setType(dialog.target, v, dialog.what, dialog.current || null)}
      />
    );
  if (dialog.kind === 'createStruct')
    return (
      <ApplyDialog
        title={`Create a structure from ${dialog.variable}${dialog.type ? ` (${dialog.type})` : ''}`}
        initial={structName(dialog.variable)}
        placeholder="Name"
        hint={`Declares struct <name> with the members OpenDecomp recovered at the offsets this function accesses through ${dialog.variable}, then retypes ${dialog.variable} as struct <name> *.`}
        onApply={(v) => createStructFromVariable(dialog.fnId, dialog.valueId, dialog.variable, v)}
      />
    );
  if (dialog.kind === 'comment')
    return <TextDialog title={`Comment at ${dialog.addr}`} initial={dialog.current} hint="Empty removes the comment." multiline onSubmit={(v) => void setComment(dialog.addr, v)} />;
  if (dialog.kind === 'bookmark')
    return (
      <TextDialog
        title={`${dialog.current === null ? 'Bookmark' : 'Edit bookmark at'} ${dialog.addr}`}
        initial={dialog.current ?? ''}
        hint="Description (optional). Ctrl+M lists bookmarks."
        extra={
          dialog.current !== null && (
            <button onClick={() => (close(), void setBookmark(dialog.addr, null))} title="Remove this bookmark">
              Remove
            </button>
          )
        }
        onSubmit={(v) => void setBookmark(dialog.addr, v)}
      />
    );
  if (dialog.kind === 'bookmarks') return <BookmarksDialog />;
  return null;
}

/** Ctrl+M: every bookmark of the binary; Enter or click jumps, Delete removes. */
function BookmarksDialog() {
  const bookmarks = useStore((s) => s.bookmarks);
  const functions = useStore((s) => s.functions);
  const [text, setText] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);
  const byEntry = useMemo(() => [...functions].sort((a, b) => cmpAddr(a.entry, b.entry)), [functions]);
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    return Object.entries(bookmarks)
      .map(([addr, description]) => ({ addr, description, where: functionOffset(byEntry, addr) ?? '' }))
      .filter((r) => !t || r.addr.includes(t) || r.description.toLowerCase().includes(t) || r.where.toLowerCase().includes(t))
      .sort((a, b) => cmpAddr(a.addr, b.addr));
  }, [bookmarks, byEntry, text]);
  const current = Math.min(sel, rows.length - 1);
  const go = (i: number) => {
    const r = rows[i];
    if (!r) return;
    close();
    void navigate(r.addr);
  };
  const remove = (i: number) => {
    const r = rows[i];
    if (r) void setBookmark(r.addr, null);
    inputRef.current?.focus(); // keys keep working after a click on ×
  };
  return (
    <Modal title="Bookmarks" onClose={close}>
      <input
        ref={inputRef}
        className="modal-input"
        value={text}
        placeholder="Filter by address, function or description…"
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setSel(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') (e.preventDefault(), setSel(Math.min(current + 1, rows.length - 1)));
          else if (e.key === 'ArrowUp') (e.preventDefault(), setSel(Math.max(current - 1, 0)));
          else if (e.key === 'Enter') go(current);
          else if (e.key === 'Delete' && current >= 0) (e.preventDefault(), remove(current));
        }}
      />
      <div className="goto-list bookmark-list">
        {rows.length === 0 && (
          <div className="goto-hint dim">{Object.keys(bookmarks).length ? 'No bookmark matches.' : 'No bookmarks yet: Alt+M bookmarks the cursor.'}</div>
        )}
        {rows.map((r, i) => (
          <div key={r.addr} className={`goto-item bookmark-item${i === current ? ' active' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => go(i)}>
            <span className="addr">{padAddr(r.addr)}</span>
            <span className="bookmark-where">{r.where}</span>
            <span className="bookmark-desc">{r.description}</span>
            <button
              className="close"
              title="Remove bookmark (Delete)"
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="modal-foot">
        <span className="dim">
          {Object.keys(bookmarks).length} bookmark{Object.keys(bookmarks).length === 1 ? '' : 's'} · Enter: go · Delete: remove · Alt+M: bookmark the cursor
        </span>
        <button onClick={close}>Close</button>
      </div>
    </Modal>
  );
}
