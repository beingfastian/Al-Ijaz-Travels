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
import { existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './static-server.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'out');


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

/**
 * Every internal destination the HTML links to.
 *
 * Separate from asset references on purpose: an <img> that 404s is a visible
 * hole, but an <a> that 404s is a dead end a visitor only finds by clicking, and
 * a crawler finds immediately. This check exists because exactly that shipped —
 * the navbar linked to four routes that had not been built, every page 404'd on
 * prefetch, and the asset check reported success because it never looked at
 * navigation targets.
 */
function extractLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/gi)) {
    const href = match[1];
    if (!href) continue;
    if (/^(https?:|data:|mailto:|tel:|#|\/\/)/.test(href)) continue;
    if (!href.startsWith('/')) continue; // relative links are covered by the asset pass
    links.add(href.split('#')[0].split('?')[0]);
  }
  return links;
}

/*
 * 127.0.0.1, not localhost.
 *
 * `localhost` resolves to both ::1 and 127.0.0.1, and the order is not fixed.
 * The static server binds one stack, so a fetch that happens to try the other
 * fails with ECONNREFUSED — which showed up as this check passing twice and
 * failing once in three consecutive runs, with a bare "TypeError: fetch failed"
 * and no indication that the cause was name resolution rather than a genuinely
 * missing asset. An intermittent gate is worse than no gate: it teaches people
 * to re-run instead of to investigate.
 */
const server = await serveStatic({ root: OUT });
const PORT = server.address().port;

const files = await walk(OUT);
const pages = files.filter((f) => f.endsWith('.html'));

let checked = 0;
let linksChecked = 0;
const failures = [];
const deadLinks = [];
const optimizerRefs = [];
/** Destination -> the pages that link to it. Cached so 206 pages stay fast. */
const linkTargets = new Map();

for (const page of pages) {
  const rel = relative(OUT, page).split('\\').join('/');
  const pageUrl = '/' + rel.replace(/index\.html$/, '');
  const html = await readFile(page, 'utf8');

  for (const href of extractLinks(html)) {
    if (!linkTargets.has(href)) linkTargets.set(href, new Set());
    linkTargets.get(href).add(pageUrl);
  }

  for (const ref of extractRefs(html, pageUrl)) {
    // Special-case the base repo's exact failure so the message is unmistakable.
    if (ref.startsWith('/_next/image')) optimizerRefs.push({ pageUrl, ref });

    const res = await fetch(`http://127.0.0.1:${PORT}${ref}`);
    checked++;
    if (!res.ok) failures.push({ pageUrl, ref, status: res.status });
  }
}

/**
 * Metadata uniqueness.
 *
 * With 195 generated detail pages, duplicate titles and descriptions are the
 * likeliest way this site quietly fails: a template bug gives every month
 * variant the same `<title>`, everything still builds, every URL still resolves,
 * and the pages compete with each other instead of ranking. Nothing else in the
 * gate would notice.
 *
 * `/404/` and `/_not-found/` are Next's own error documents and legitimately
 * share the site default, so they are excluded rather than special-cased later.
 */
const EXEMPT_FROM_METADATA = [/^\/404\/?$/, /^\/_not-found\//];

const meta = { titles: new Map(), descriptions: new Map(), missingCanonical: [] };

/**
 * Structured-data faults, which no other check here can see.
 *
 * Two failure modes, both silent. A JSON-LD block that does not parse is ignored
 * wholesale by Google — the page simply has no markup, and nothing in the build
 * or in this gate would say so. And a `{ "@id": … }` reference that names a node
 * no longer present on the page resolves to nothing, which is worse than absence:
 * the site's packages are attributed to a seller that does not exist.
 *
 * The second is the live risk on this site specifically. Every package, article
 * and offer points at the organisation node emitted once in the root layout
 * (lib/seo.ts). Anyone who moves or removes that block breaks the attribution on
 * ~250 pages at once and sees no error anywhere.
 */
const schema = { unparseable: [], danglingRefs: [], refCount: 0 };
/**
 * Pages whose share card is missing, broken, or missing an inherited field.
 *
 * `noLocale` exists because the og:image check alone was not enough. Both are
 * set once in the root layout and both are silently dropped by any page that
 * declares its own `openGraph` — so they fail together, and checking only one
 * let the second ship. See inheritedOpenGraph() in lib/seo.ts.
 */
const shareImages = { missing: [], broken: [], noLocale: [] };

/** Every `@id` a node defines, and every `@id` a node merely points at. */
function collectIds(node, defined, referenced) {
  if (Array.isArray(node)) {
    for (const item of node) collectIds(item, defined, referenced);
    return;
  }
  if (!node || typeof node !== 'object') return;

  // A bare `{"@id": "…"}` with no other meaningful key is a pointer; anything
  // carrying a @type alongside is a definition. That is exactly the distinction
  // Google draws when it resolves a graph.
  const id = node['@id'];
  if (typeof id === 'string') {
    if (node['@type']) defined.add(id);
    else referenced.add(id);
  }
  for (const [key, value] of Object.entries(node)) {
    if (key !== '@id') collectIds(value, defined, referenced);
  }
}

for (const page of pages) {
  const rel = relative(OUT, page).split('\\').join('/');
  const pageUrl = '/' + rel.replace(/index\.html$/, '');
  if (EXEMPT_FROM_METADATA.some((re) => re.test(pageUrl))) continue;
  if (!rel.endsWith('index.html')) continue;

  const html = await readFile(page, 'utf8');

  // A noindex page is not competing in search, so it needs neither a canonical
  // nor a distinct title. Checking it anyway would push us toward adding
  // metadata to satisfy a script rather than to serve a reader.
  if (/<meta name="robots"[^>]*content="[^"]*noindex/.test(html)) continue;

  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '';
  const description = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? '';

  if (!/<link rel="canonical"/.test(html)) meta.missingCanonical.push(pageUrl);

  // --- structured data on this page, across every ld+json block it carries.
  const defined = new Set();
  const referenced = new Set();
  for (const [, raw] of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs
  )) {
    try {
      collectIds(JSON.parse(raw), defined, referenced);
    } catch (error) {
      schema.unparseable.push({ pageUrl, message: error.message });
    }
  }
  schema.refCount += referenced.size;
  for (const id of referenced) {
    if (!defined.has(id)) schema.danglingRefs.push({ pageUrl, id });
  }

  // --- the share card. Absolute, so it cannot be fetched from the local server
  // like every other asset; checked against out/ on disk instead.
  if (!/<meta property="og:locale" content=/.test(html)) shareImages.noLocale.push(pageUrl);

  const og = (html.match(/<meta property="og:image" content="([^"]*)"/) ?? [])[1];
  if (!og) {
    shareImages.missing.push(pageUrl);
  } else {
    const path = og.replace(/^https?:\/\/[^/]+/, '');
    if (!existsSync(join(OUT, path))) shareImages.broken.push({ pageUrl, og });
  }
  if (!meta.titles.has(title)) meta.titles.set(title, []);
  meta.titles.get(title).push(pageUrl);
  if (!meta.descriptions.has(description)) meta.descriptions.set(description, []);
  meta.descriptions.get(description).push(pageUrl);
}

const dupTitles = [...meta.titles].filter(([, urls]) => urls.length > 1);
const dupDescriptions = [...meta.descriptions].filter(([, urls]) => urls.length > 1);

// Each distinct destination is requested once, however many pages link to it.
for (const [href, sources] of linkTargets) {
  const res = await fetch(`http://127.0.0.1:${PORT}${href}`);
  linksChecked++;
  if (!res.ok) deadLinks.push({ href, status: res.status, sources: [...sources] });
}

server.close();

console.log(`\nStatic export check`);
console.log(`  pages:            ${pages.length}`);
console.log(`  asset references: ${checked}`);
console.log(`  internal links:   ${linksChecked} distinct destinations`);
console.log(`  structured data:  ${schema.refCount} @id references, all resolved`);

if (optimizerRefs.length > 0) {
  console.error(
    `\n  ${optimizerRefs.length} reference(s) point at the image optimizer (/_next/image).`
  );
  console.error(`  There is no optimizer on a static host. Set images.unoptimized in next.config.`);
}

const schemaProblems = schema.unparseable.length + schema.danglingRefs.length;
if (schemaProblems > 0) {
  console.error(`
  STRUCTURED DATA problems — silently ignored by search engines:
`);
  for (const u of schema.unparseable.slice(0, 6)) {
    console.error(`    unparseable JSON-LD on ${u.pageUrl}
          ${u.message}`);
  }
  // Grouped by id: one removed node produces the same dangling ref on every page.
  const byId = new Map();
  for (const d of schema.danglingRefs) {
    if (!byId.has(d.id)) byId.set(d.id, []);
    byId.get(d.id).push(d.pageUrl);
  }
  for (const [id, urls] of [...byId].slice(0, 6)) {
    console.error(`    @id "${id}" is referenced but never defined — on ${urls.length} page(s)`);
    console.error(`      e.g. ${urls.slice(0, 3).join(', ')}`);
  }
  console.error('');
  process.exit(1);
}

if (shareImages.missing.length > 0 || shareImages.broken.length > 0 || shareImages.noLocale.length > 0) {
  console.error(`
  SHARE CARD problems — links to these unfurl as a blank box:
`);
  if (shareImages.missing.length > 0) {
    console.error(`    ${shareImages.missing.length} page(s) with no og:image`);
    console.error(`      e.g. ${shareImages.missing.slice(0, 3).join(', ')}`);
  }
  if (shareImages.noLocale.length > 0) {
    console.error(`    ${shareImages.noLocale.length} page(s) with no og:locale`);
    console.error(`      e.g. ${shareImages.noLocale.slice(0, 3).join(', ')}`);
    console.error(`      a page declaring its own openGraph must spread inheritedOpenGraph()`);
  }
  for (const b of shareImages.broken.slice(0, 3)) {
    console.error(`    og:image does not exist in out/: ${b.og}
          on ${b.pageUrl}`);
    console.error(`      run \`npm run og\` to regenerate it`);
  }
  console.error('');
  process.exit(1);
}

const metaProblems = dupTitles.length + dupDescriptions.length + meta.missingCanonical.length;
if (metaProblems > 0) {
  console.error(`\n  METADATA problems — these pages compete with each other in search:\n`);
  for (const [title, urls] of dupTitles.slice(0, 6)) {
    console.error(`    ${urls.length} pages share the title "${title.slice(0, 60)}"`);
    console.error(`      e.g. ${urls.slice(0, 3).join(', ')}`);
  }
  for (const [, urls] of dupDescriptions.slice(0, 6)) {
    console.error(`    ${urls.length} pages share a description — e.g. ${urls.slice(0, 3).join(', ')}`);
  }
  if (meta.missingCanonical.length > 0) {
    console.error(`    ${meta.missingCanonical.length} page(s) with no canonical:`);
    console.error(`      ${meta.missingCanonical.slice(0, 6).join(', ')}`);
  }
  console.error('');
  process.exit(1);
}

if (deadLinks.length > 0) {
  console.error(`\n  ${deadLinks.length} DEAD internal link(s) — a visitor clicking these gets a 404:\n`);
  for (const d of deadLinks.slice(0, 20)) {
    const from = d.sources.slice(0, 3).join(', ');
    const more = d.sources.length > 3 ? ` …and ${d.sources.length - 3} more pages` : '';
    console.error(`    ${d.status}  ${d.href}\n          linked from ${from}${more}`);
  }
  console.error('');
  process.exit(1);
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
