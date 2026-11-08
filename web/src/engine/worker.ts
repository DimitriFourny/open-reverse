// Entry of every OpenReverse Web Worker. One bundle serves both roles, so the
// OpenDecomp code is downloaded and compiled once:
//   - the engine (engine-worker.ts), started by the page;
//   - request-worker helpers (helper.ts), started by the engine with this same
//     script URL and a name beginning with "open-reverse-helper".

import './globals.ts';
import './early.ts';

if (self.name.startsWith('open-reverse-helper')) await import('./helper.ts');
else await import('./engine-worker.ts');
