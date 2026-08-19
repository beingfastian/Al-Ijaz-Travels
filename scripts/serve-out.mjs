/**
 * Serve the real static export for manual checking.
 *
 *   npm run build && npm run serve:out
 *
 * The counterpart to verify-export.mjs: that script proves every referenced URL
 * resolves, this one lets a human look at the result. Both serve out/ through the
 * same server, because the whole point is to look at what a static host would
 * actually send — Phase 0 is only done when a nested route renders with every
 * image loading, verified here rather than in `next dev`.
 *
 * 404s are printed as they happen, so a missing asset announces itself while you
 * are looking at the page that asked for it.
 */

import { readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './static-server.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const PORT = Number(process.env.PORT ?? 4320);

try {
  await access(join(OUT, 'index.html'));
} catch {
  console.error('\n  No export found at out/index.html.\n  Run `npm run build` first.\n');
  process.exit(1);
}

/** Show a real nested route, since that is where relative-path bugs surface. */
async function firstPackageRoute() {
  try {
    const entries = await readdir(join(OUT, 'packages'), { withFileTypes: true });
    const dir = entries.find((entry) => entry.isDirectory());
    return dir ? `/packages/${dir.name}/` : null;
  } catch {
    return null;
  }
}

let notFound = 0;

const server = await serveStatic({
  root: OUT,
  port: PORT,
  onRequest: ({ path, status }) => {
    if (status === 404) {
      notFound++;
      console.error(`  404  ${path}`);
    }
  },
}).catch((err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} is in use. Try: PORT=4321 npm run serve:out\n`);
    process.exit(1);
  }
  throw err;
});

const base = `http://localhost:${PORT}`;
const nested = await firstPackageRoute();

console.log(`\n  Serving out/ at ${base}`);
console.log(`    home      ${base}/`);
console.log(`    listing   ${base}/packages/`);
if (nested) console.log(`    package   ${base}${nested}`);
console.log(`    quote     ${base}/quote/`);
console.log(`\n  404s are logged below as they happen. Ctrl+C to stop.\n`);

process.on('SIGINT', () => {
  server.close();
  console.log(
    notFound === 0
      ? '\n  Stopped. No 404s while serving.\n'
      : `\n  Stopped. ${notFound} request(s) 404'd — see above.\n`
  );
  process.exit(0);
});
