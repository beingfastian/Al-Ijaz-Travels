/**
 * Lighthouse audit.
 *
 *   npm run verify:lighthouse
 *
 * The plan pins ≥95 across all four categories on the home page, a hub and a
 * detail page. This measures it rather than asserting it, against the real
 * static export served locally, on Lighthouse's own mobile profile.
 *
 * Kept out of `npm run verify` on purpose: a full Lighthouse run takes roughly a
 * minute per page, which is too slow for a gate that should run on every change.
 * The fast checks — axe, console, LCP, CLS — live in verify-browser.mjs and run
 * every time. This is the deeper pass, run before a deploy.
 */

import { chromium } from 'playwright-core';
import lighthouse from 'lighthouse';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile, mkdir } from 'node:fs/promises';
import { serveStatic } from './static-server.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const REPORTS = join(ROOT, 'screenshots');

/** One per template shape. More would be slower without being more informative. */
const TARGETS = [
  { path: '/', name: 'home' },
  { path: '/packages/', name: 'listing' },
  { path: '/packages/5-star/', name: 'tier-hub' },
  { path: '/packages/5-star/10-nights-5-star-umrah-package/', name: 'detail' },
  { path: '/blog/umrah-cost-from-uk/', name: 'article' },
];

/**
 * Per-category budgets, because one number for all four hides the picture.
 *
 * Accessibility and SEO sit at 100 and are held there — those are regressions we
 * would want to fail a deploy over, and they cost nothing to maintain.
 *
 * Performance is set to its real target rather than to whatever currently
 * passes. It does not currently pass, and that is the honest state: a hydrated
 * React page on a simulated mid-range phone scores in the seventies here. The
 * number is left where it is so the gap stays visible instead of being defined
 * away. See PLAN-UK.md for what closing it would actually involve.
 */
const BUDGETS = {
  performance: 95,
  accessibility: 100,
  'best-practices': 95,
  seo: 100,
};
const CATEGORIES = Object.keys(BUDGETS);

await mkdir(REPORTS, { recursive: true });

const server = await serveStatic({ root: OUT });
const PORT = server.address().port;

// Lighthouse drives Chrome over the DevTools protocol, so it needs a real
// debugging port rather than Playwright's own connection.
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--remote-debugging-port=9222'],
});

console.log('\nLighthouse');
const budgetLine = CATEGORIES.map((c) => c.slice(0, 4) + ' ' + BUDGETS[c]).join(' / ');
console.log('  chrome ' + browser.version() + ' · budgets ' + budgetLine);
console.log('');

const failures = [];
const table = [];

for (const { path, name } of TARGETS) {
  const result = await lighthouse(
    `http://localhost:${PORT}${path}`,
    { port: 9222, output: 'html', logLevel: 'error' },
    undefined
  );

  if (!result) {
    failures.push({ path, detail: 'lighthouse returned no result' });
    continue;
  }

  const scores = Object.fromEntries(
    CATEGORIES.map((c) => [c, Math.round((result.lhr.categories[c]?.score ?? 0) * 100)])
  );

  await writeFile(join(REPORTS, `lighthouse-${name}.html`), result.report, 'utf8');

  const row = { path, ...scores };
  table.push(row);

  const failed = CATEGORIES.filter((c) => scores[c] < BUDGETS[c]);
  const status = failed.length === 0 ? 'ok  ' : 'FAIL';

  console.log(
    `  ${status} ${path.padEnd(48)} ` +
      CATEGORIES.map((c) => `${c.slice(0, 4)}:${String(scores[c]).padStart(3)}`).join('  ')
  );

  for (const c of failed) {
    failures.push({ path, detail: `${c} scored ${scores[c]}, budget ${BUDGETS[c]}` });
  }

  // The specific audits worth naming when something is short of budget.
  if (failed.length > 0) {
    const audits = result.lhr.audits;
    for (const key of ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']) {
      const audit = audits[key];
      if (audit?.displayValue) console.log(`         ${key}: ${audit.displayValue}`);
    }
  }
}

await browser.close();
server.close();

console.log(`\n  full reports: screenshots/lighthouse-*.html`);

if (failures.length > 0) {
  console.error(`\n  ${failures.length} score(s) below budget:\n`);
  for (const f of failures) console.error(`    ${f.path}\n      ${f.detail}`);
  console.error('');
  process.exit(1);
}

console.log('  every category at or above budget on every page\n');
