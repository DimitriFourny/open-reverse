export const tmpdir = () => '/tmp';
export const homedir = () => '/home/web';
export const availableParallelism = () => 1;
export const cpus = () => [{ model: 'browser', speed: 0 }];
export const platform = () => 'browser';
export const EOL = '\n';
export default { tmpdir, homedir, availableParallelism, cpus, platform, EOL };
