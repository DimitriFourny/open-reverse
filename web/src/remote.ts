// Opening a binary or a project archive from a URL: `?open=<URL>` in the page URL or the
// home screen's URL field. The browser downloads the file itself (the server must allow
// it with CORS); nothing is uploaded anywhere.

import { zipEntryNames } from './engine/zip.ts';

/** The page URL parameter that names a file to open. */
export const OPEN_PARAM = 'open';
/** The entry every project archive starts with (see engine/archive.ts). */
const ARCHIVE_MANIFEST = 'open-reverse.json';

/** An http(s) URL, or null for anything else (a typo, `javascript:`, `file:`, a relative path). */
export function parseRemoteUrl(text: string): URL | null {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

/** The file name of a download: the server's Content-Disposition, else the URL's last path segment. */
export function remoteFileName(url: URL, disposition: string | null): string {
  const star = disposition && /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/.exec(disposition);
  const plain = disposition && /filename\s*=\s*"?([^";]+)"?/.exec(disposition);
  let name = '';
  try {
    name = star ? decodeURIComponent(star[1]!.trim()) : plain ? plain[1]!.trim() : decodeURIComponent(url.pathname.split('/').pop() ?? '');
  } catch {
    name = url.pathname.split('/').pop() ?? '';
  }
  name = name.replace(/[/\\]/g, '_').trim();
  return name || url.hostname || 'download';
}

/** Whether the bytes are an OpenReverse project archive (a ZIP holding the manifest), whatever the file is called. */
export function isProjectArchiveBytes(bytes: Uint8Array): boolean {
  return zipEntryNames(bytes)?.includes(ARCHIVE_MANIFEST) ?? false;
}

export interface DownloadProgress {
  done: number;
  total: number | null;
}

/** Downloads `url` in the browser, reporting bytes received; rejects with a readable reason. */
export async function download(url: URL, onProgress: (p: DownloadProgress) => void, signal: AbortSignal): Promise<File> {
  let res: Response;
  try {
    // No credentials: a link must not be able to fetch what only the user's cookies can reach.
    res = await fetch(url, { signal, credentials: 'omit', redirect: 'follow' });
  } catch (e) {
    if (signal.aborted) throw e;
    // fetch() reports a CORS refusal and an unreachable host the same way, without detail.
    throw new Error('the server is unreachable or does not allow downloads from other sites (no CORS Access-Control-Allow-Origin header)');
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`);
  const length = Number(res.headers.get('content-length'));
  // A compressed response's length is not the length of the body we read.
  const total = length > 0 && !res.headers.get('content-encoding') ? length : null;
  const chunks: Uint8Array[] = [];
  let done = 0;
  onProgress({ done, total });
  if (res.body) {
    const reader = res.body.getReader();
    for (;;) {
      const { done: end, value } = await reader.read();
      if (end) break;
      chunks.push(value);
      done += value.byteLength;
      onProgress({ done, total });
    }
  } else chunks.push(new Uint8Array(await res.arrayBuffer()));
  return new File(chunks as Uint8Array<ArrayBuffer>[], remoteFileName(new URL(res.url || url.href), res.headers.get('content-disposition')));
}
