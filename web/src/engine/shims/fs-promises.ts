import { promises } from './fs.ts';

export const { open, stat, lstat, realpath, mkdir, mkdtemp, readdir, readFile, writeFile, unlink, rm, rmdir, rename, cp, copyFile, access, constants } = promises;
export default promises;
