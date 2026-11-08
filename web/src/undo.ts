// Undo/redo history of user edits. Each entry knows how to put the previous value
// back and how to apply the edit again, through the same calls a normal edit makes.

export interface UndoEntry {
  /** What the edit was, for the toast: "rename of main", "comment at 0x1000". */
  label: string;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

const LIMIT = 200;

export class UndoHistory {
  #past: UndoEntry[] = [];
  #future: UndoEntry[] = [];
  /** Undo and redo run one at a time, in the order they were asked for. */
  #queue: Promise<unknown> = Promise.resolve();

  /** A new edit: it can be undone, and what was undone before can no longer be redone. */
  record(entry: UndoEntry): void {
    this.#past.push(entry);
    if (this.#past.length > LIMIT) this.#past.shift();
    this.#future = [];
  }

  /** Undoes the latest edit. Resolves to it, or null when there is none; a failed undo stays in the history and rethrows. */
  undo(): Promise<UndoEntry | null> {
    return this.#run(this.#past, this.#future, (e) => e.undo());
  }

  redo(): Promise<UndoEntry | null> {
    return this.#run(this.#future, this.#past, (e) => e.redo());
  }

  #run(from: UndoEntry[], to: UndoEntry[], apply: (e: UndoEntry) => Promise<void>): Promise<UndoEntry | null> {
    const next = this.#queue.then(async () => {
      const entry = from.at(-1);
      if (!entry) return null;
      await apply(entry);
      // An edit recorded meanwhile keeps its place: move exactly this entry.
      const i = from.lastIndexOf(entry);
      if (i >= 0) from.splice(i, 1);
      to.push(entry);
      return entry;
    });
    this.#queue = next.catch(() => undefined);
    return next;
  }
}

/** One history per binary, kept in memory for the page's lifetime. */
const histories = new Map<string, UndoHistory>();

export function historyFor(bid: string): UndoHistory {
  let h = histories.get(bid);
  if (!h) histories.set(bid, (h = new UndoHistory()));
  return h;
}
