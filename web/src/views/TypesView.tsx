import { useEffect, useMemo } from 'react';
import { loadTypes, useStore } from '../store.ts';
import { splitLines, tokenize } from '../syntax.ts';

export function TypesView() {
  const types = useStore((s) => s.types);
  useEffect(() => void loadTypes(), []);
  const lines = useMemo(() => (types.data ? splitLines(tokenize(types.data.text, 'c-like')) : []), [types.data]);
  if (types.status === 'loading' || types.status === 'idle') return <div className="placeholder">Recovering image-wide structure types… (analyzes every function body)</div>;
  if (types.status === 'error') return <div className="placeholder error">{types.error}</div>;
  return (
    <div className="code-scroll pseudo">
      <div className="view-note dim">
        Merged structure types recovered across the image{types.data?.state === 'partial' ? ' (partial: not every function was analyzed within the budget)' : ''}.{' '}
        <button className="link" onClick={() => void loadTypes(true)}>Refresh</button>
      </div>
      <div className="pseudo-lines">
        {lines.map((line, n) => (
          <div key={n} className="pline">
            <span className="lineno">{n + 1}</span>
            <span className="ptext">
              {line.map((t) => (
                <span key={t.start} className={`tok t-${t.kind}`}>{t.text}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
