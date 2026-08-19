/**
 * A static file server that behaves like a plain static host.
 *
 * This exists because `next dev` is not evidence. The base repo this design came
 * from (adrianhajdin/travel_ui_ux) builds with exit code 0 and still ships a
 * broken site — in dev the image optimizer is running, so nothing looks wrong
 * until the export is on a host that has no optimizer.
 *
 * So both the automated gate (verify-export.mjs) and the manual check
 * (serve-out.mjs) must look at the same thing: the real out/ directory, served
 * the way a static host would serve it. One implementation, used by both, so the
 * two can never drift apart and disagree about what "working" means.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';

export const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

/**
 * Resolve a request path to a file inside `root`, the way a static host does.
 *
 * `trailingSlash: true` means every route is a directory containing index.html,
 * so /packages/ has to resolve to out/packages/index.html. Returns null for any
 * path that escapes root — a local tool, but there is no reason to serve the
 * whole disk to answer a `..` in a URL.
 */
async function resolveFile(root, urlPath) {
  const candidate = normalize(join(root, urlPath));
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;

  try {
    if ((await stat(candidate)).isDirectory()) return join(candidate, 'index.html');
  } catch {
    // Not a directory, or does not exist. Try the path as given, then 404.
  }
  return candidate;
}

/**
 * Start the server and resolve once it is listening.
 *
 * Pass `port: 0` to bind an ephemeral port, then read `server.address().port`.
 * That is the default for the automated checks: a fixed port fails the whole gate
 * if a previous run has not released it yet, and a gate that fails intermittently
 * teaches people to re-run rather than investigate.
 *
 * @param {{ root: string, port?: number, onRequest?: (info: { path: string, status: number }) => void }} options
 * @returns {Promise<import('node:http').Server>}
 */
export function serveStatic({ root, port = 0, onRequest }) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
      const file = await resolveFile(root, path);

      let status = 200;
      try {
        if (file === null) throw new Error('outside root');
        const body = await readFile(file);
        res.setHeader('content-type', MIME[extname(file)] ?? 'application/octet-stream');
        res.end(body);
      } catch {
        status = 404;
        res.statusCode = 404;
        res.end('not found');
      }

      onRequest?.({ path, status });
    });

    // A port already in use should fail loudly rather than hang the caller.
    server.once('error', reject);
    server.listen(port, () => resolve(server));
  });
}
