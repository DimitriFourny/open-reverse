// The script console (Shift+F2): an editor on the left (Ctrl+Enter runs, ↑/↓ in an empty or
// unchanged editor walk the history), the output on the right.

import { useEffect, useRef, useState } from 'react';
import { clearOutput, closeConsole, EXAMPLES, getConsole, runScript, setCode, showHelp, stopScript, toggleConsole, useConsole } from '../scripting.ts';

/** The last focus request the editor honoured. */
let focused = 0;

export function ScriptConsole() {
  const c = useConsole((x) => x);
  const editor = useRef<HTMLTextAreaElement>(null);
  const out = useRef<HTMLDivElement>(null);
  /** Position in the history while ↑/↓ walk it (null: editing). */
  const [walk, setWalk] = useState<number | null>(null);

  useEffect(() => {
    // Only when asked for (Shift+F2, Script): not when the panel mounts again with another binary.
    if (c.open && c.focus !== focused) {
      focused = c.focus;
      editor.current?.focus();
    }
  }, [c.open, c.focus]);
  useEffect(() => {
    const el = out.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [c.output]);

  if (!c.open) return null;
  const recall = (i: number | null) => {
    setWalk(i);
    setCode(i === null ? '' : c.history[i]!);
  };
  const onKeys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { history, code } = getConsole();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setWalk(null);
      void runScript();
    } else if (e.key === 'F2' && e.shiftKey) {
      e.preventDefault();
      toggleConsole();
    } else if (e.key === 'Escape' && getConsole().running) {
      e.preventDefault();
      stopScript();
    } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && history.length) {
      // Only an empty editor, or one still showing a history entry, walks the history.
      const browsing = walk !== null && code === history[walk];
      if (code.trim() && !browsing) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') recall(walk === null || !browsing ? history.length - 1 : Math.max(0, walk - 1));
      else if (browsing) recall(walk + 1 < history.length ? walk + 1 : null);
    }
  };
  return (
    <div className="bottom-panel script-console">
      <div className="panel-head">
        <span>Script</span>
        <span className="dim">JavaScript · or.* API · Ctrl+Enter runs</span>
        <button className="primary" disabled={c.running || !c.code.trim()} onClick={() => void runScript()} title="Run (Ctrl+Enter)">
          Run
        </button>
        <button disabled={!c.running} onClick={stopScript} title="Stop: the script's next API call throws (Esc)">
          Stop
        </button>
        <select
          value=""
          onChange={(e) => {
            const ex = EXAMPLES[Number(e.target.value)];
            if (ex) setCode(ex.code);
            setWalk(null);
            editor.current?.focus();
          }}
          title="Load an example script"
        >
          <option value="">Examples…</option>
          {EXAMPLES.map((ex, i) => (
            <option key={i} value={i}>
              {ex.title}
            </option>
          ))}
        </select>
        <select
          value=""
          disabled={!c.history.length}
          onChange={(e) => {
            if (e.target.value !== '') recall(Number(e.target.value));
            editor.current?.focus();
          }}
          title="Scripts run before (kept in this browser); ↑/↓ in an empty editor also walk them"
        >
          <option value="">History ({c.history.length})</option>
          {c.history
            .map((h, i) => [h, i] as const)
            .reverse()
            .map(([h, i]) => (
              <option key={i} value={i}>
                {h.split('\n')[0]!.slice(0, 70)}
              </option>
            ))}
        </select>
        <button onClick={showHelp} title="List the API">
          Help
        </button>
        <button onClick={clearOutput} title="Clear the output">
          Clear
        </button>
        <button className="close" onClick={closeConsole} title="Close (Shift+F2)">
          ×
        </button>
      </div>
      <div className="script-body">
        <textarea
          ref={editor}
          className="script-editor"
          spellCheck={false}
          value={c.code}
          placeholder={'// e.g.\nconst fns = await or.functions();\nprint(fns.length, "functions");'}
          onChange={(e) => {
            setWalk(null);
            setCode(e.target.value);
          }}
          onKeyDown={onKeys}
        />
        <div className="script-output" ref={out} tabIndex={-1}>
          {c.output.map((l, i) => (
            <pre key={i} className={`out-${l.kind}`}>
              {l.text}
            </pre>
          ))}
          {c.running && <pre className="out-info busy">running… (Stop or Esc)</pre>}
        </div>
      </div>
    </div>
  );
}
