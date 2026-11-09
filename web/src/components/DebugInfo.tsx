// Debug information of the open binary: a top-bar badge and the dialog that adds,
// replaces or removes its companion debug file (dSYM, ELF debug file, PDB).

import { useRef, useState } from 'react';
import type { DebugSummary } from '../api.ts';
import { addDebugFile, debugSummaryText, removeDebugFile, setState, useStore } from '../store.ts';
import { fmtSize } from '../util.ts';

const KIND_LABEL = { dsym: 'dSYM', elf: 'ELF debug file', pdb: 'PDB' } as const;

/** What to call the debug data of the open binary in a few characters. */
function badgeText(d: DebugSummary | undefined, companion: boolean): string {
  if (!d || d.source === 'none') return companion ? 'debug ⚠' : '+ debug';
  if (d.source === 'companion') return d.matched_by === 'uuid' ? 'dSYM ✓' : d.matched_by === 'guid-age' ? 'PDB ✓' : 'debug file ✓';
  return 'DWARF';
}

export function DebugBadge() {
  const info = useStore((s) => s.info);
  if (!info) return null;
  const d = info.image.debug;
  const record = info.record.debug;
  const loaded = !!d && d.source !== 'none';
  return (
    <button
      className={`debug-badge${loaded ? ' loaded' : ''}${record && d?.source !== 'companion' ? ' warn' : ''}`}
      onClick={() => setState({ dialog: { kind: 'debugInfo' } })}
      title={`${d ? debugSummaryText(d) : 'Debug information'}. Click to add, replace or remove a debug file (dSYM, ELF debug file, PDB).`}
    >
      {badgeText(d, !!record)}
    </button>
  );
}

export function DebugInfoDialog({ onClose }: { onClose: () => void }) {
  const info = useStore((s) => s.info);
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  if (!info) return null;
  const d = info.image.debug;
  const record = info.record.debug;
  const format = info.image.target.format;
  const expected = format === 'macho' ? 'the DWARF file of its .dSYM bundle (Contents/Resources/DWARF/…) or the zipped .dSYM' : format === 'elf' ? 'its separate debug file (objcopy --only-keep-debug, /usr/lib/debug/…)' : 'its .pdb (the program database the linker wrote next to it)';
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal debug-dialog" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onClose())}>
        <div className="modal-title">Debug information · {info.record.name}</div>
        <table className="debug-table">
          <tbody>
            <tr>
              <th>Status</th>
              <td className="debug-status">{d ? debugSummaryText(d) : 'Unknown (OpenDecomp reported nothing)'}</td>
            </tr>
            {record && (
              <tr>
                <th>Debug file</th>
                <td>
                  {record.name} <span className="dim">({KIND_LABEL[record.kind]}, {fmtSize(record.size)})</span>
                </td>
              </tr>
            )}
            {d?.uuid && (
              <tr>
                <th>UUID</th>
                <td className="mono">{d.uuid}</td>
              </tr>
            )}
            {d?.build_id && (
              <tr>
                <th>Build ID</th>
                <td className="mono">{d.build_id}</td>
              </tr>
            )}
            {d?.pdb && (
              <tr>
                <th>PDB</th>
                <td className="mono">
                  GUID {d.pdb.guid} · age {d.pdb.age}
                </td>
              </tr>
            )}
            {d && d.diagnostics.length > 0 && (
              <tr>
                <th>Limits</th>
                <td>
                  <ul className="debug-diagnostics">
                    {d.diagnostics.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="dim">
          Add {expected}. OpenDecomp checks it belongs to this binary (UUID, GNU build ID, .gnu_debuglink CRC, or the PDB GUID and age the binary records) and uses its function names, prototypes, types, globals and local names. The binary with its debug file is analysed in a project of its own: renames and types made without it stay there and come back if you remove it.
        </p>
        <div className="modal-foot">
          <button className="primary" disabled={busy} onClick={() => ref.current?.click()}>
            {record ? 'Replace debug file…' : 'Add debug file…'}
          </button>
          {record && (
            <button disabled={busy} onClick={() => void run(async () => (onClose(), await removeDebugFile()))}>
              Remove debug file
            </button>
          )}
          <button onClick={onClose}>Close</button>
        </div>
        <input
          ref={ref}
          type="file"
          hidden
          data-testid="debug-file-input"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) void run(async () => (onClose(), await addDebugFile(f)));
          }}
        />
      </div>
    </div>
  );
}
