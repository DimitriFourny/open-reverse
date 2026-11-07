// Run the API server (watch mode) and the Vite dev server together.
import { spawn } from 'node:child_process';

const children = [
  spawn('npm', ['run', 'dev:server', '--', ...process.argv.slice(2)], { stdio: 'inherit' }),
  spawn('npm', ['run', 'dev:web'], { stdio: 'inherit' }),
];
const stop = () => {
  for (const c of children) c.kill('SIGTERM');
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const c of children) c.on('exit', (code) => code && stop());
