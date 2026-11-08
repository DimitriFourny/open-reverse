// Structure editor of the Types view: one struct or union of the type library as a table
// of fields, with the offsets and sizes OpenDecomp's C declaration parser lays out. Apply
// declares the C text through the Types view's declareTypes path (one undo step).

import { useEffect, useMemo, useState } from 'react';
import { api, type StructLayout } from '../api.ts';
import { structSource, type Member } from '../engine/structs.ts';
import { declareTypes, getState, useStore } from '../store.ts';

export interface StructDraft {
  name: string;
  union: boolean;
  packed: boolean;
  members: Member[];
}

const hex = (n: number) => `0x${n.toString(16)}`;

/** A member name not used yet: `field_<n>` (or `pad_<n>`). */
function freshName(members: Member[], prefix: string): string {
  const used = new Set(members.map((m) => m.name));
  for (let i = members.length; ; i++) if (!used.has(`${prefix}${i}`)) return `${prefix}${i}`;
}

export function StructEditor({ initial, onClose }: { initial: StructDraft; onClose: () => void }) {
  const library = useStore((s) => s.types.data?.library);
  const [draft, setDraft] = useState(initial);
  const [layout, setLayout] = useState<StructLayout | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [padTo, setPadTo] = useState('');
  const source = useMemo(() => structSource(draft.name.trim() || 'unnamed', draft.members, draft), [draft]);

  // The other library declarations are in scope, so members can use them.
  const scope = useMemo(
    () => (library ?? []).filter((t) => t.name && t.name !== draft.name.trim()).map((t) => t.declaration),
    [library, draft.name],
  );
  useEffect(() => {
    const bid = getState().bid;
    if (!bid) return;
    let live = true;
    const timer = setTimeout(() => {
      api.layoutStructure(bid, source, draft.name.trim() || 'unnamed', scope).then(
        (l) => live && setLayout(l),
        (e) => live && setLayout({ errors: [e instanceof Error ? e.message : String(e)] }),
      );
    }, 200);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [source, scope, draft.name]);

  const fields = layout && !('errors' in layout) ? layout.fields : null;
  const set = (patch: Partial<StructDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setMember = (i: number, patch: Partial<Member>) =>
    setDraft((d) => ({ ...d, members: d.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));
  const insert = (i: number, m: Member) => setDraft((d) => ({ ...d, members: [...d.members.slice(0, i), m, ...d.members.slice(i)] }));
  const remove = (i: number) => setDraft((d) => ({ ...d, members: d.members.filter((_, j) => j !== i) }));
  const move = (i: number, by: number) =>
    setDraft((d) => {
      const j = i + by;
      if (j < 0 || j >= d.members.length) return d;
      const members = [...d.members];
      [members[i], members[j]] = [members[j]!, members[i]!];
      return { ...d, members };
    });
  const field = (): Member => ({ type: 'uint32_t', name: freshName(draft.members, 'field_'), dims: '' });
  const pad = (bytes: number): Member => ({ type: 'uint8_t', name: freshName(draft.members, 'pad_'), dims: `[${bytes}]` });

  /** Appends padding so the structure's members end at `padTo` bytes. */
  const padToSize = () => {
    const target = Number(padTo);
    if (!fields || !Number.isInteger(target) || target <= 0) return;
    const end = Math.max(0, ...fields.map((f) => f.offset + (f.size ?? 0)));
    if (target > end) insert(draft.members.length, pad(target - end));
  };

  const apply = async () => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(draft.name.trim())) return setErrors(['The structure needs a C identifier as its name']);
    if (draft.members.length === 0) return setErrors(['A structure needs at least one field']);
    setBusy(true);
    const err = await declareTypes(source);
    setBusy(false);
    if (err) setErrors(err.split('\n'));
    else onClose();
  };

  return (
    <div className="struct-editor">
      <div className="struct-head">
        <select value={draft.union ? 'union' : 'struct'} disabled={busy} onChange={(e) => set({ union: e.target.value === 'union' })}>
          <option value="struct">struct</option>
          <option value="union">union</option>
        </select>
        <input className="struct-name" value={draft.name} placeholder="Name" spellCheck={false} disabled={busy} onChange={(e) => set({ name: e.target.value })} />
        <label className="dim">
          <input type="checkbox" checked={draft.packed} disabled={busy} onChange={(e) => set({ packed: e.target.checked })} /> packed
        </label>
        <span className="dim struct-size">
          {fields && layout && !('errors' in layout)
            ? `size ${layout.size === null ? '?' : `${hex(layout.size)} (${layout.size})`} · align ${layout.alignment ?? '?'}`
            : ''}
        </span>
      </div>
      <div className="struct-table-wrap">
        <table className="struct-table">
          <thead>
            <tr>
              <th>Offset</th>
              <th>Size</th>
              <th>Type</th>
              <th>Name</th>
              <th>Array</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {draft.members.map((m, i) => (
              <tr key={i}>
                <td className="addr">{fields?.[i] ? hex(fields[i]!.offset) : '?'}</td>
                <td className="dim">{fields?.[i]?.size ?? '?'}</td>
                <td>
                  <input value={m.type} spellCheck={false} disabled={busy} onChange={(e) => setMember(i, { type: e.target.value })} />
                </td>
                <td>
                  <input value={m.name} spellCheck={false} disabled={busy} onChange={(e) => setMember(i, { name: e.target.value })} />
                </td>
                <td>
                  <input className="struct-dims" value={m.dims} placeholder="[n]" spellCheck={false} disabled={busy} onChange={(e) => setMember(i, { dims: e.target.value.trim() })} />
                </td>
                <td className="struct-row-actions">
                  <button className="link" title="Insert a field above" disabled={busy} onClick={() => insert(i, field())}>
                    +
                  </button>
                  <button className="link" title="Move up" disabled={busy || i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button className="link" title="Move down" disabled={busy || i === draft.members.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button className="link" title="Delete the field" disabled={busy} onClick={() => remove(i)}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(errors.length > 0 || (layout && 'errors' in layout)) && (
        <div className="types-errors">
          {[...errors, ...(layout && 'errors' in layout ? layout.errors : [])].map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
      <div className="types-actions">
        <button disabled={busy} onClick={() => insert(draft.members.length, field())}>
          Add field
        </button>
        <button disabled={busy} onClick={() => insert(draft.members.length, pad(4))}>
          Add padding
        </button>
        <input className="struct-padto" value={padTo} placeholder="size" spellCheck={false} disabled={busy} onChange={(e) => setPadTo(e.target.value)} />
        <button disabled={busy || !fields} onClick={padToSize} title="Append padding so the members end at this size (bytes, 0x… allowed)">
          Pad to size
        </button>
        <span className="flex" />
        <button disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button className="primary" disabled={busy} onClick={() => void apply()} title="Declare it in the type library">
          {busy ? 'Applying…' : 'Apply'}
        </button>
      </div>
      <pre className="struct-source dim">{source}</pre>
    </div>
  );
}
