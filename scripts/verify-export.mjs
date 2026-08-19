/**
 * Static export verifier.
 *
 * The base repo (adrianhajdin/travel_ui_ux) builds with exit code 0 and still
 * ships a broken site: 33 <img> references point at /_next/image?url=… and nothing
 * serves that path on a static host. `next dev` hides it completely, because in dev
 * the optimizer is running.
 *
 * So the gate is not "did the build succeed" — it is "does every URL the exported
 * HTML asks for actually resolve inside out/". This script serves out/ over HTTP
 * and requests every local asset referenced by every page.
 *
 *   node scripts/verify-export.mjs
 *
 * Exits non-zero on the first broken reference, so it can gate a deploy.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './static-server.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const PORT = 4319;

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else found.push(full);
  }
  return found;
}

/** Every local URL the HTML asks the browser to fetch. */
function extractRefs(html, pageUrl) {
  const refs = new Set();

  // Case-insensitive, and it matters: React serialises the JSX prop `srcSet` as
  // `srcSet`, not `srcset`. HTML attribute names are case-insensitive so browsers
  // do not care — but a case-sensitive regex silently matches nothing, and every
  // AVIF and WebP URL in every <picture> goes unchecked while the gate reports
  // success. That is the same shape of failure this whole script exists to catch.
  const patterns = [
    /<img[^>]+src="([^"]+)"/gi,
    /<img[^>]+srcset="([^"]+)"/gi,
    /<source[^>]+srcset="([^"]+)"/gi,
    /<link[^>]+href="([^"]+)"/gi,
    /<script[^>]+src="([^"]+)"/gi,
    /url\((['"]?)(\/[^)'"]+)\1\)/gi,
  ];

  for (const re of patterns) {
    for (const match of html.matchAll(re)) {
      const raw = re.source.includes('url\\(') ? match[2] : match[1];
      if (!raw) continue;
      // srcset is a comma-separated list of "url descriptor" pairs.
      for (const candidate of raw.split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (!url) continue;
        if (/^(https?:|data:|mailto:|tel:|#|\/\/)/.test(url)) continue;

        if (url.startsWith('/')) {
          refs.add(url);
        } else {
          // Relative path — resolved against the PAGE, which is how the base repo's
          // src="menu.svg" silently breaks on every nested route.
          refs.add(posix.join(posix.dirname(pageUrl), url));
        }
      }
    }
  }
  return refs;
}

const server = await serveStatic({ root: OUT, port: PORT });

const files = await walk(OUT);
const pages = files.filter((f) => f.endsWith('.html'));

let checked = 0;
const failures = [];
const optimizerRefs = [];

for (const page of pages) {
  const rel = relative(OUT, page).split('\\').join('/');
  const pageUrl = '/' + rel.replace(/index\.html$/, '');
  const html = await readFile(page, 'utf8');

  for (const ref of extractRefs(html, pageUrl)) {
    // Special-case the base repo's exact failure so the message is unmistakable.
    if (ref.startsWith('/_next/image')) optimizerRefs.push({ pageUrl, ref });

    const res = await fetch(`http://localhost:${PORT}${ref}`);
    checked++;
    if (!res.ok) failures.push({ pageUrl, ref, status: res.status });
  }
}

server.close();

console.log(`\nStatic export check`);
console.log(`  pages:            ${pages.length}`);
console.log(`  asset references: ${checked}`);

if (optimizerRefs.length > 0) {
  console.error(
    `\n  ${optimizerRefs.length} reference(s) point at the image optimizer (/_next/image).`
  );
  console.error(`  There is no optimizer on a static host. Set images.unoptimized in next.config.`);
}

if (failures.length > 0) {
  console.error(`\n  ${failures.length} BROKEN reference(s):\n`);
  for (const f of failures.slice(0, 40)) {
    console.error(`    ${f.status}  ${f.ref}\n          referenced by ${f.pageUrl}`);
  }
  if (failures.length > 40) console.error(`    …and ${failures.length - 40} more`);
  console.error('');
  process.exit(1);
}

console.log(`  all references resolve\n`);
