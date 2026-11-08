// Messages that reach a worker before its role module has loaded are kept here
// and replayed to the handler the role installs (a dedicated worker drops
// message events that find no listener).

const early: MessageEvent[] = [];
const keep = (e: MessageEvent) => early.push(e);
self.addEventListener('message', keep);

/** Install the role's message handler and replay what arrived before it. */
export function adopt<T>(handler: (event: MessageEvent<T>) => unknown): void {
  self.removeEventListener('message', keep);
  self.onmessage = handler as (event: MessageEvent) => unknown;
  for (const e of early.splice(0)) handler(e as MessageEvent<T>);
}
