// node:url helpers for file: URLs over the VFS.
export function fileURLToPath(url: string | URL): string {
  const u = typeof url === 'string' ? new URL(url) : url;
  if (u.protocol !== 'file:') return u.pathname;
  return decodeURIComponent(u.pathname);
}
export function pathToFileURL(path: string): URL {
  return new URL(`file://${encodeURI(path).replace(/\?/g, '%3F').replace(/#/g, '%23')}`);
}
const NodeURL = globalThis.URL;
export { NodeURL as URL };
export const URLSearchParams = globalThis.URLSearchParams;
export default { fileURLToPath, pathToFileURL, URL: NodeURL, URLSearchParams };
