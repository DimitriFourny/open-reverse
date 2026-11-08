import { useEffect, useMemo, useRef, useState } from 'react';
import { defineData, loadSidebar, navigate, rename, renameVariable, setComment, setSignature, setState, toast, useStore, type Dialog } from '../store.ts';
import { padAddr, parseAddress } from '../util.ts';

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

/** A Go to target: a function, or a data symbol (globals such as `_args`, imports' slots excluded). */
interface Target {
  key: string;
  name: string;
  entry: string;
  fnId: string | null;
}

function GotoDialog() {
  const functions = useStore((s) => s.functions);
  const symbols = useStore((s) => s.symbols.data);
  const [text, setText] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => void loadSidebar('symbols'), []);
  const targets = useMemo(() => {
    const out: Target[] = functions.map((f) => ({ key: f.id, name: f.name, entry: f.entry, fnId: f.id }));
    const entries = new Set(functions.map((f) => f.entry));
    for (const s of symbols ?? []) if (s.name && s.addr && s.addr !== '0x0' && s.kind !== 'function' && !entries.has(s.addr)) out.push({ key: s.id, name: s.name, entry: s.addr, fnId: null });
    return out;
  }, [functions, symbols]);
  const matches = useMemo(() => {
    const t = text.trim().toLowerCase();
    if (!t) return targets.slice(0, 50);
    const scored: [number, Target][] = [];
    for (const f of targets) {
      const n = f.name.toLowerCase();
      const i = n.indexOf(t);
      if (i >= 0) scored.push([(i === 0 ? 0 : 1000) + n.length, f]);
      else if (f.entry.includes(t)) scored.push([2000, f]);
    }
    return scored.sort((a, b) => a[0] - b[0]).slice(0, 50).map(([, f]) => f);
  }, [text, targets]);
  const addr = parseAddress(text);
  const go = (i: number) => {
    const f = matches[i];
    if (f && (!addr || f.name.toLowerCase() === text.trim().toLowerCase())) {
      close();
      void navigate(f.entry, f.fnId ? { fnId: f.fnId } : {});
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
          else if (e.key === 'Enter') go(addr && !matches.some((m) => m.name.toLowerCase() === text.trim().toLowerCase()) ? -1 : sel);
        }}
      />
      {addr && <div className="goto-hint dim">Enter: go to address {addr}</div>}
      <div className="goto-list">
        {matches.map((f, i) => (
          <div key={f.key} className={`goto-item${i === sel ? ' active' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => go(i)}>
            <span>
              {f.name}
              {!f.fnId && <span className="dim"> · data</span>}
            </span>
            <span className="dim">{padAddr(f.entry)}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function TextDialog({ title, initial, hint, multiline, onSubmit }: { title: string; initial: string; hint: string; multiline?: boolean; onSubmit: (v: string) => void }) {
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
        onSubmit={(v) => void renameVariable(dialog.fnId, dialog.valueId, v)}
      />
    );
  if (dialog.kind === 'array')
    return (
      <TextDialog
        title={`Array of ${dialog.type} at ${dialog.addr}`}
        initial={String(dialog.current)}
        hint={`Number of elements (up to ${dialog.max} before the next item). The element type is the one defined there (D), else bytes.`}
        onSubmit={(v) => {
          const n = Number(v.trim().startsWith('0x') ? parseInt(v.trim(), 16) : v.trim());
          if (!Number.isSafeInteger(n) || n < 1) return toast('An array needs a positive element count', 'error');
          void defineData('array', n, dialog.addr);
        }}
      />
    );
  if (dialog.kind === 'comment')
    return <TextDialog title={`Comment at ${dialog.addr}`} initial={dialog.current} hint="Empty removes the comment." multiline onSubmit={(v) => void setComment(dialog.addr, v)} />;
  return null;
}
