/**
 * Browser verification.
 *
 *   npm run verify:browser
 *
 * Everything else in the gate checks structure: does it typecheck, does it
 * build, do the pure functions behave, does every asset URL resolve. None of it
 * can see a page. This one opens the real export in a real browser and checks
 * the things that only exist at runtime:
 *
 *   - accessibility violations, via axe
 *   - console errors, which is where React hydration mismatches surface
 *   - that content is visible with JavaScript disabled
 *   - that content is visible with prefers-reduced-motion: reduce
 *   - screenshots, so the result can actually be looked at
 *
 * Those last two matter more than they sound. The scroll-reveal system hides
 * elements by default and reveals them on scroll; if the guard around that ever
 * breaks, the site still builds, still passes every other check, and ships a
 * blank page. This is the only thing that would catch it.
 *
 * Uses playwright-core against the browser already installed on the machine, so
 * there is no 300 MB browser download in the dependency tree.
 */

import { chromium } from 'playwright-core';
import axeCore from 'axe-core';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from './static-server.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const SHOTS = join(ROOT, 'screenshots');
const PORT = 4321;

/** One page per template. Checking all 206 would be slow and tell us no more. */
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/specimen/', name: 'specimen' },
  { path: '/packages/', name: 'packages-listing' },
  { path: '/packages/5-star/', name: 'tier-hub' },
  { path: '/packages/5-star/10-nights-5-star-umrah-package/', name: 'package-detail' },
  { path: '/packages/3-star/7-nights-3-star-may-umrah-package/', name: 'package-restricted-month' },
  { path: '/monthly-packages/', name: 'month-hub' },
  { path: '/monthly-packages/march-umrah-packages/', name: 'month-ramadan' },
  { path: '/city-packages/', name: 'city-hub' },
  { path: '/city-packages/newcastle-umrah-packages/', name: 'city-connecting' },
  { path: '/ramadan-umrah-packages/', name: 'ramadan' },
  { path: '/quote/', name: 'quote' },
  { path: '/about/', name: 'about' },
  { path: '/contact/', name: 'contact' },
  { path: '/faq/', name: 'faq' },
];

/**
 * Console noise we do not control or care about. Kept deliberately short — the
 * temptation with a list like this is to grow it until the check passes, which
 * is how a hydration warning ends up silenced.
 */
const IGNORED_CONSOLE = [
  /favicon/i,
  /Download the React DevTools/i,
  /**
   * Chrome logs a bare "Failed to load resource: ... 404" with no URL in the
   * message body, so filtering these by text is impossible — and pretending
   * otherwise silently passes every broken asset. Failed requests are tracked
   * separately below, by URL, where they can actually be identified.
   */
  /Failed to load resource/i,
];

/**
 * Failed requests that are not our bug.
 *
 * Next's client router requests RSC prefetch payloads at a flat, dot-joined path
 * (`__next.packages.__PAGE__.txt`) while `output: 'export'` writes them as nested
 * directories (`__next.packages/__PAGE__.txt`). Verified by hand: the nested path
 * serves 200, the dotted path 404s.
 *
 * A framework quirk with no user-visible effect — a failed prefetch degrades to a
 * normal document navigation, and every route is fully prerendered. Filtered
 * rather than fixed, because the fix means shimming Next's internal file naming,
 * which breaks in a worse way on the next upgrade. Tracked in GAPS.md.
 */
const IGNORED_REQUESTS = [/__next\..*__PAGE__\.txt$/];

const failures = [];
const notes = [];

function record(page, kind, detail) {
  failures.push({ page, kind, detail });
}

async function runAxe(page) {
  await page.evaluate(axeCore.source);
  return page.evaluate(async () => {
    // Colour contrast is asserted at build time by scripts/palette.mjs against
    // the actual token values, which is stricter than sampling rendered pixels.
    const results = await window.axe.run(document, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: true } },
    });
    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
    }));
  });
}

await rm(SHOTS, { recursive: true, force: true });
await mkdir(SHOTS, { recursive: true });

const server = await serveStatic({ root: OUT, port: PORT });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = `http://localhost:${PORT}`;

console.log('\nBrowser verification');
console.log(`  chrome ${browser.version()}\n`);

/* ------------------------------------------------- 1. axe + console + shots */

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const { path, name } of PAGES) {
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    consoleErrors.push(`${msg.type()}: ${text}`);
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  // Tracked by URL, which is the only way a failed request can be identified.
  page.on('response', (res) => {
    if (res.status() < 400) return;
    const path = new URL(res.url()).pathname;
    if (IGNORED_REQUESTS.some((re) => re.test(path))) return;
    failedRequests.push(`${res.status()} ${path}`);
  });

  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });

  // Let scroll-reveals settle so the screenshot shows the finished page.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const violations = await runAxe(page);
  const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

  await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });

  const clean = serious.length === 0 && consoleErrors.length === 0 && failedRequests.length === 0;
  console.log(
    `  ${(clean ? 'ok' : 'FAIL').padEnd(5)} ${path.padEnd(46)} ` +
      `axe:${violations.length} (${serious.length} serious)  ` +
      `console:${consoleErrors.length}  404s:${failedRequests.length}`
  );

  for (const v of serious) record(path, 'axe', `${v.id} [${v.impact}] ${v.help} — ${v.nodes[0]}`);
  for (const e of consoleErrors) record(path, 'console', e);
  for (const r of failedRequests) record(path, 'request', r);

  // Minor violations are reported but do not fail the gate, so the signal stays
  // meaningful. They are still printed, because "reported and ignored" is how
  // a minor issue becomes permanent.
  for (const v of violations.filter((v) => !serious.includes(v))) {
    notes.push(`${path}  ${v.id} [${v.impact}] ${v.help}`);
  }

  await page.close();
}

/* --------------------------------------------- 2. content survives no-JS */

console.log('');
{
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const page = await noJs.newPage();
  await page.goto(`${base}/specimen/`, { waitUntil: 'load' });

  const hidden = await page.evaluate(() => {
    const els = [...document.querySelectorAll('[data-reveal]')];
    return els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
  });
  const total = await page.evaluate(() => document.querySelectorAll('[data-reveal]').length);

  await page.screenshot({ path: join(SHOTS, 'no-js.png'), fullPage: true });

  if (hidden > 0) {
    record('/specimen/', 'no-js', `${hidden} of ${total} reveal elements are invisible without JS`);
    console.log(`  FAIL  no JavaScript — ${hidden}/${total} reveal elements hidden`);
  } else {
    console.log(`  ok    no JavaScript — all ${total} reveal elements visible`);
  }
  await noJs.close();
}

/* ------------------------------------ 3. content survives reduced motion */

{
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await reduced.newPage();
  await page.goto(`${base}/specimen/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const hidden = await page.evaluate(() => {
    const els = [...document.querySelectorAll('[data-reveal]')];
    return els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
  });
  const total = await page.evaluate(() => document.querySelectorAll('[data-reveal]').length);

  await page.screenshot({ path: join(SHOTS, 'reduced-motion.png'), fullPage: true });

  if (hidden > 0) {
    record('/specimen/', 'reduced-motion', `${hidden} of ${total} reveal elements hidden`);
    console.log(`  FAIL  reduced motion — ${hidden}/${total} reveal elements hidden`);
  } else {
    console.log(`  ok    reduced motion — all ${total} reveal elements visible`);
  }
  await reduced.close();
}

/* ------------------------------------------- 4. the quote draft persists */

{
  const page = await context.newPage();
  await page.goto(`${base}/quote/`, { waitUntil: 'networkidle' });

  await page.fill('#adults', '4');
  await page.waitForTimeout(400); // let the draft write

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600); // rehydration happens in an effect

  const restored = await page.inputValue('#adults');
  const noticeShown = await page.getByText('We kept the answers you started earlier.').count();

  if (restored === '4' && noticeShown > 0) {
    console.log('  ok    quote draft — survives a reload, and says so');
  } else {
    record('/quote/', 'draft', `after reload adults="${restored}", notice shown: ${noticeShown}`);
    console.log(`  FAIL  quote draft — adults="${restored}" after reload (expected "4")`);
  }

  await page.screenshot({ path: join(SHOTS, 'quote-draft-restored.png'), fullPage: true });
  await page.close();
}

/* ------------------------------------------------- 5. keyboard reachability */

{
  const page = await context.newPage();
  await page.goto(`${base}/quote/`, { waitUntil: 'networkidle' });

  const reachable = await page.evaluate(() => {
    const sel =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(sel)].filter((el) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden';
    }).length;
  });

  // Every interactive element must show a visible focus ring.
  await page.keyboard.press('Tab');
  const hasVisibleFocus = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el);
    return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
  });

  if (reachable > 0 && hasVisibleFocus) {
    console.log(`  ok    keyboard — ${reachable} focusable elements, first Tab shows a focus ring`);
  } else {
    record('/quote/', 'keyboard', `focusable=${reachable}, visible focus ring=${hasVisibleFocus}`);
    console.log(`  FAIL  keyboard — focusable=${reachable}, visible focus=${hasVisibleFocus}`);
  }
  await page.close();
}

/* ------------------------------------------ 6. LCP on a throttled mobile 4G */

{
  /**
   * The plan pins LCP under 2 s on throttled 4G. Measured rather than asserted,
   * on a phone-sized viewport with the network actually throttled, because an
   * LCP number from an unthrottled desktop headless run is meaningless — it is
   * always fast, and it is never what a pilgrim on a train sees.
   *
   * Fast 4G per Lighthouse's own definition: 1.6 Mbps down, 150 ms RTT.
   */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await mobile.newPage();

  const cdp = await mobile.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });

  await page.goto(`${base}/`, { waitUntil: 'load' });

  const lcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let value = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) value = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        // LCP is only final once the page stops changing; settle, then report.
        setTimeout(() => resolve(Math.round(value)), 3500);
      })
  );

  const cls = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) total += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(Number(total.toFixed(4))), 1200);
      })
  );

  /**
   * Viewport only, not fullPage.
   *
   * A full-page mobile capture is 390 px wide by ~9,500 tall, multiplied again by
   * the device scale factor — an image so extremely tall that any viewer scales
   * it to a sliver and it becomes unreadable. It is worse than useless: it looks
   * like evidence while showing nothing. The top viewport is what "does it hold
   * up on a phone" actually asks about.
   */
  await page.screenshot({ path: join(SHOTS, 'home-mobile.png') });

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const screens = (pageHeight / 844).toFixed(1);
  console.log(`  ok    mobile page length — ${pageHeight} px, about ${screens} phone screens`);

  const LCP_BUDGET = 2000;
  const CLS_BUDGET = 0.05;
  const lcpOk = lcp > 0 && lcp <= LCP_BUDGET;
  const clsOk = cls <= CLS_BUDGET;

  console.log(
    `  ${lcpOk && clsOk ? 'ok   ' : 'FAIL '} mobile 4G — LCP ${lcp} ms (budget ${LCP_BUDGET}), CLS ${cls} (budget ${CLS_BUDGET})`
  );
  if (!lcpOk) record('/', 'lcp', `${lcp} ms on throttled 4G, budget ${LCP_BUDGET} ms`);
  if (!clsOk) record('/', 'cls', `${cls}, budget ${CLS_BUDGET}`);

  await mobile.close();
}

await context.close();
await browser.close();
server.close();

/* ------------------------------------------------------------------ report */

if (notes.length > 0) {
  console.log(`\n  ${notes.length} minor axe note(s), not gating:`);
  for (const n of notes.slice(0, 12)) console.log(`    ${n}`);
}

console.log(`\n  screenshots: screenshots/`);

if (failures.length > 0) {
  console.error(`\n  ${failures.length} FAILURE(S):\n`);
  for (const f of failures) console.error(`    [${f.kind}] ${f.page}\n      ${f.detail}`);
  console.error('');
  process.exit(1);
}

console.log('  all browser checks passed\n');
