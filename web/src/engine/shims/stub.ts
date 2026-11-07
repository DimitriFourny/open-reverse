// Node modules OpenDecomp imports only from code paths the browser never runs
// (MCP HTTP server, CLI, helper processes).
const unavailable = (name: string) => () => {
  throw new Error(`${name} is not available in the browser`);
};
export const createInterface = unavailable('readline.createInterface');
export const createServer = unavailable('createServer');
export const request = unavailable('request');
export const isIP = () => 0;
export class Writable {}
export class Readable {}
export class Socket {}
export class Server {}
export default { createInterface, createServer, request, isIP, Writable, Readable, Socket, Server };
