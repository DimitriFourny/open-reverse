import type { Xref } from '../api.ts';
import { navigate, setState, setXrefsDirection, useStore, xrefsTitle } from '../store.ts';
import { padAddr } from '../util.ts';

/** `name+0x10`, or the bare name at the function's entry. */
function within(addr: string | null, fn: Xref['fromFunction']): string {
  if (!fn) return '—';
  return `${fn.name}${addr && addr !== fn.entry ? `+0x${(BigInt(addr) - BigInt(fn.entry)).toString(16)}` : ''}`;
}

export function XrefsPanel() {
  const xrefs = useStore((s) => s.xrefs);
  if (!xrefs) return null;
  const outgoing = xrefs.direction === 'outgoing';
  return (
    <div className="bottom-panel">
      <div className="panel-head">
        <span className="seg xref-dir">
          <button className={outgoing ? '' : 'active'} onClick={() => setXrefsDirection('incoming')} title="References to the target (X)">
            To
          </button>
          <button className={outgoing ? 'active' : ''} onClick={() => setXrefsDirection('outgoing')} title="References the target makes (Shift+X)">
            From
          </button>
        </span>
        <span>{xrefsTitle(xrefs.name, xrefs.direction)}</span>
        <span className="dim">{xrefs.status === 'ready' ? ` · ${xrefs.items.length} reference${xrefs.items.length === 1 ? '' : 's'}` : ''}</span>
        <button className="close" onClick={() => setState({ xrefs: null })} title="Close">×</button>
      </div>
      <div className="panel-body">
        {xrefs.status === 'loading' && <div className="placeholder">Loading…</div>}
        {xrefs.status === 'error' && <div className="placeholder error">{xrefs.error}</div>}
        {xrefs.status === 'ready' && xrefs.items.length === 0 && <div className="placeholder">No references found.</div>}
        {xrefs.status === 'ready' && xrefs.items.length > 0 && (
          <table className="xref-table">
            <thead>
              <tr>
                <th>From</th>
                <th>{outgoing ? 'At' : 'Function'}</th>
                {outgoing && <th>To</th>}
                <th>Kind</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {xrefs.items.map((x, i) => (
                <tr
                  key={i}
                  title={outgoing ? (x.to ? `Go to ${x.to}` : 'Target known only by name') : x.from ? `Go to ${x.from}` : ''}
                  onClick={() => {
                    if (outgoing) {
                      const to = x.toFunction?.entry ?? x.to;
                      if (to) void navigate(to, x.toFunction ? { fnId: x.toFunction.id } : {});
                    } else if (x.from) void navigate(x.from, x.fromFunction ? { fnId: x.fromFunction.id } : {});
                  }}
                >
                  <td className="addr">{x.from ? padAddr(x.from) : '?'}</td>
                  <td>{within(x.from, x.fromFunction)}</td>
                  {outgoing && (
                    <td>
                      {x.toName ?? (x.to ? '' : '?')}
                      {x.to && <span className="addr"> {x.toName ? `(${x.to})` : padAddr(x.to)}</span>}
                    </td>
                  )}
                  <td>
                    <span className={`kind kind-${x.kind}`}>{x.kind}</span>
                  </td>
                  <td className="dim">{x.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
