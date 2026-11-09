// A macrotask without setTimeout's clamping. Browsers delay a setTimeout(fn, 0) nested more
// than four timers deep by at least 4 ms, and the in-thread project worker's protocol is a
// chain of such hops (request, admission, progress, result): about 25 ms of idle time per
// OpenDecomp request. A MessageChannel message is a task too (callbacks run in order, one
// per task, as Node's setImmediate), but it is never clamped.

const queue: (() => void)[] = [];
let channel: MessageChannel | null = null;
/** Under Node (unit tests), its own setImmediate: an open MessagePort keeps a process alive. */
const nodeImmediate = (globalThis as { process?: { release?: { name?: string } } }).process?.release?.name === 'node' ? globalThis.setImmediate : null;

export function setImmediateTask(fn: () => void): void {
  if (nodeImmediate) {
    nodeImmediate(fn);
    return;
  }
  if (!channel) {
    channel = new MessageChannel();
    channel.port1.onmessage = () => queue.shift()?.();
  }
  queue.push(fn);
  channel.port2.postMessage(null);
}
