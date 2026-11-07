// node:path (POSIX) for the browser.
import pathBrowserify from 'path-browserify';

export const posix = pathBrowserify;
export const { join, resolve, dirname, basename, extname, relative, normalize, isAbsolute, parse, format, sep, delimiter } = pathBrowserify;
export const win32 = pathBrowserify;
export default pathBrowserify;
