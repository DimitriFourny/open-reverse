import { navigate, setState, useStore } from '../store.ts';
import { padAddr } from '../util.ts';

export function XrefsPanel() {
  const xrefs = useStore((s) => s.xrefs);
  if (!xrefs) return null;
  return (
    <div className="bottom-panel">
      <div className="panel-head">
        <span>{xrefs.title}</span>
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
                <th>Function</th>
                <th>Kind</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {xrefs.items.map((x, i) => (
                <tr
                  key={i}
                  onClick={() => {
                    if (x.from) void navigate(x.from, x.fromFunction ? { fnId: x.fromFunction.id } : {});
                  }}
                >
                  <td className="addr">{x.from ? padAddr(x.from) : '?'}</td>
                  <td>{x.fromFunction ? `${x.fromFunction.name}${x.from && x.from !== x.fromFunction.entry ? `+0x${(BigInt(x.from) - BigInt(x.fromFunction.entry)).toString(16)}` : ''}` : '—'}</td>
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
