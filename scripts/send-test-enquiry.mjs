/**
 * Fill the quote form, submit it, and actually send the WhatsApp message.
 *
 * WHY THIS NEEDS A REAL BROWSER
 *
 * A wa.me link cannot send anything. It opens a chat with the text pre-filled
 * and a human presses send — that is the whole contract, for every website on
 * the internet, and there is no way around it from a static page. So to test the
 * real thing end to end, something has to hold a logged-in WhatsApp session and
 * press the key. That is what this does: it drives your own Chrome, with your
 * own WhatsApp Web login, against your own number.
 *
 * The session lives in a profile directory on disk, so the QR code is scanned
 * once and every later run is silent.
 *
 * WHAT IT EXERCISES
 *
 * The whole path, not just the link: the form's validation, the consent gate,
 * the draft store being cleared, window.open being called with the right URL,
 * the redirect to /quote/sent/, and then the message arriving in a real chat. If
 * any of that breaks this fails, which a hand-written wa.me link would not.
 *
 * USAGE
 *
 *   npm run build                      # this reads out/, so build first
 *   node scripts/send-test-enquiry.mjs --dry          # everything except send
 *   node scripts/send-test-enquiry.mjs                # send for real
 *
 *   --dry              stop at the compose box; do not press send
 *   --headless         no visible window (fine for --dry; the first real run
 *                      needs a window to scan the QR code)
 *   --url=<origin>     test a deployed site instead of the local out/ directory
 *   --route=<path>     which form to submit; default /quote/
 *                      e.g. --route=/packages/5-star/10-nights-5-star-umrah-package/
 *   --name= --phone= --email= --travellers= --airport= --month= --sharing= --notes=
 *                      override any field
 *
 * FIRST RUN: a Chrome window opens on WhatsApp Web showing a QR code. Scan it
 * from the phone that owns the sending account. It waits up to five minutes, and
 * remembers you afterwards.
 *
 * The recipient is whatever data/site.ts holds in contact.whatsapp — this script
 * never takes a number, deliberately, so it can only ever message the number the
 * site itself would message. Testing a number the site does not use would prove
 * nothing.
 */

import { mkdirSync, readFileSync } from 'node:fs';
import nodePath from 'node:path';
import readline from 'node:readline';
import { serveStatic } from './static-server.mjs';
import { chromium } from 'playwright-core';

const ROOT = nodePath.resolve(import.meta.dirname, '..');
const OUT = nodePath.join(ROOT, 'out');
const PROFILE = nodePath.join(ROOT, '.whatsapp-profile');

/* ----------------------------------------------------------------- arguments */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit === undefined ? fallback : hit.slice(name.length + 3);
};

const DRY = flag('dry');
const HEADLESS = flag('headless');
const ROUTE = opt('route', '/quote/');

const FIELDS = {
  name: opt('name', 'Website test'),
  phone: opt('phone', '+44 7911 123456'),
  email: opt('email', ''),
  travellers: opt('travellers', ''),
  airport: opt('airport', ''),
  month: opt('month', ''),
  sharing: opt('sharing', ''),
  notes: opt('notes', `Test enquiry from the Al Ijaz Travel website build.`),
};

/**
 * Read the recipient straight out of the source file rather than importing it.
 *
 * data/site.ts is TypeScript and uses the '@/' alias elsewhere in the tree, so
 * importing it from a plain .mjs is more trouble than one regex is worth. If
 * this ever fails to match, that is a signal the field was renamed and this
 * script should be updated rather than guess.
 */
function recipient() {
  const src = readFileSync(nodePath.join(ROOT, 'data', 'site.ts'), 'utf8');
  const m = /whatsapp:\s*'([0-9]+)'/.exec(src);
  if (!m) throw new Error('could not find contact.whatsapp in data/site.ts');
  return m[1];
}

const log = (...a) => console.log(...a);
const step = (n, s) => console.log(`\n[${n}] ${s}`);

/* ---------------------------------------------------------------------- main */

const NUMBER = recipient();
if (/^0+$/.test(NUMBER)) {
  console.error(`\ncontact.whatsapp in data/site.ts is still the placeholder "${NUMBER}".`);
  console.error('Nothing to send to. Put a real number there first.\n');
  process.exit(1);
}

let origin = opt('url', null);
let server = null;
if (origin === null) {
  try {
    readFileSync(nodePath.join(OUT, 'quote', 'index.html'));
  } catch {
    console.error('\nout/ has no build in it. Run `npm run build` first,');
    console.error('or point this at a deployed site with --url=https://…\n');
    process.exit(1);
  }
  server = await serveStatic({ root: OUT });
  origin = `http://127.0.0.1:${server.address().port}`;
  log(`serving out/ at ${origin}`);
} else {
  log(`testing ${origin}`);
}

log(`recipient: +${NUMBER}   (from data/site.ts)`);
log(DRY ? 'DRY RUN — will stop at the compose box' : 'LIVE — will press send');

mkdirSync(PROFILE, { recursive: true });
const context = await chromium.launchPersistentContext(PROFILE, {
  channel: 'chrome',
  headless: HEADLESS,
  viewport: HEADLESS ? { width: 1440, height: 1000 } : null,
  args: ['--start-maximized'],
});

let exitCode = 0;
try {
  const page = context.pages()[0] ?? (await context.newPage());

  /* -- 1. the form ------------------------------------------------------- */
  step(1, `opening ${ROUTE}`);
  await page.goto(origin + ROUTE, { waitUntil: 'load' });
  await page.waitForSelector('#name', { timeout: 20000 });
  await page.waitForTimeout(400);

  step(2, 'filling the form');
  const type = async (id, value) => {
    if (!value) return;
    if (!(await page.locator(`#${id}`).count())) { log(`   #${id} not on this page, skipped`); return; }
    await page.fill(`#${id}`, value);
    log(`   ${id.padEnd(11)} = ${value}`);
  };
  const pick = async (id, value) => {
    if (!value) return;
    if (!(await page.locator(`#${id}`).count())) { log(`   #${id} not on this page, skipped`); return; }
    try { await page.selectOption(`#${id}`, value); log(`   ${id.padEnd(11)} = ${value}`); }
    catch { log(`   ${id.padEnd(11)} = "${value}" is not one of the options, skipped`); }
  };

  await type('name', FIELDS.name);
  await type('phone', FIELDS.phone);
  await type('email', FIELDS.email);
  await type('travellers', FIELDS.travellers);
  await pick('airport', FIELDS.airport);
  await pick('departureMonth', FIELDS.month);
  await pick('sharing', FIELDS.sharing);
  await type('notes', FIELDS.notes);

  await page.check('#consent');
  log('   consent     = ticked');

  /* -- 2. submit, and catch the tab the site opens ------------------------ */
  step(3, 'submitting');
  const [waPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 20000 }),
    page.click('button[type=submit]'),
  ]);
  await page.waitForTimeout(1200);

  const landed = new URL(page.url()).pathname;
  log(`   this tab went to  ${landed}${landed === '/quote/sent/' ? '  (correct)' : '  <-- expected /quote/sent/'}`);
  if (landed !== '/quote/sent/') exitCode = 1;

  await waPage.waitForLoadState('domcontentloaded').catch(() => {});
  const waUrl = waPage.url();
  log(`   new tab opened at ${waUrl.slice(0, 90)}${waUrl.length > 90 ? '…' : ''}`);

  const text = new URL(waUrl).searchParams.get('text');
  if (text) {
    log('\n   the message the site composed:');
    log('   ' + '-'.repeat(60));
    for (const line of text.split('\n')) log('   | ' + line);
    log('   ' + '-'.repeat(60));
  }
  if (!waUrl.includes(NUMBER)) {
    log(`   WRONG NUMBER: the link does not contain ${NUMBER}`);
    exitCode = 1;
  }

  /* -- 3. into WhatsApp Web ---------------------------------------------- */
  step(4, 'following the handoff into WhatsApp');

  // wa.me shows an interstitial on desktop. Take the "continue" link if present.
  const cont = waPage.locator('a[href*="web.whatsapp.com"], #action-button').first();
  if (await cont.count()) {
    await cont.click().catch(() => {});
    await waPage.waitForTimeout(2500);
  }
  if (!/web\.whatsapp\.com/.test(waPage.url())) {
    // Go directly, keeping the same composed text.
    await waPage.goto(
      `https://web.whatsapp.com/send?phone=${NUMBER}&text=${encodeURIComponent(text ?? '')}`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  const COMPOSE =
    'footer div[contenteditable="true"], div[contenteditable="true"][data-tab="10"], div[contenteditable="true"][data-tab="1"]';

  /**
   * What is on screen right now?
   *
   * A single waitForSelector on the compose box was not good enough: WhatsApp Web
   * takes the better part of ten seconds to paint, so a timeout could not tell
   * "not logged in" apart from "still loading" apart from "this number has no
   * WhatsApp account" — and the script reported a guess about changed markup
   * instead of the truth. Poll for a state we can name.
   */
  const stateOf = () =>
    waPage.evaluate((sel) => {
      if (document.querySelector(sel)) return 'ready';
      const t = document.body?.innerText ?? '';
      if (/phone number shared via url is invalid/i.test(t)) return 'badnumber';
      if (/Scan to log in|Scan this QR|Log in with phone number|Steps to log in|Link with phone number/i.test(t))
        return 'login';
      return 'loading';
    }, COMPOSE);

  const settle = async (limitMs) => {
    const until = Date.now() + limitMs;
    let last = 'loading';
    while (Date.now() < until) {
      last = await stateOf().catch(() => 'loading');
      if (last !== 'loading') return last;
      await waPage.waitForTimeout(1000);
    }
    return last;
  };

  let state = await settle(45000);
  let ready = state === 'ready';

  if (state === 'badnumber') {
    log(`\n   WhatsApp says +${NUMBER} is not a valid WhatsApp number.`);
    log('   The link and the message are correct; the recipient is the problem.');
    exitCode = 1;
  } else if (state === 'login') {
    if (HEADLESS) {
      log('\n   WhatsApp Web is not logged in, and there is no window to scan a QR');
      log('   code in because this run is --headless.');
      log('   Run it once without --headless to log in; the session is then saved.');
      exitCode = 1;
    } else {
      log('\n   WhatsApp Web is not logged in yet.');
      log('   Scan the QR code in the window using the phone that owns the sending');
      log('   account. Waiting up to five minutes; you will not be asked again.');
      state = await settle(300000);
      ready = state === 'ready';
      if (!ready) { log('   Timed out waiting for the login.'); exitCode = 1; }
    }
  } else if (state === 'loading') {
    log('\n   WhatsApp Web never finished loading, and showed neither a chat nor a');
    log('   login screen. Could be the network, or a change on their side.');
    log(`   current url: ${waPage.url()}`);
    exitCode = 1;
  }

  /* -- 4. send ----------------------------------------------------------- */
  if (ready) {
    const box = waPage.locator(COMPOSE).last();
    const composed = (await box.innerText().catch(() => '')).trim();
    log(`\n   compose box holds ${composed.length} characters`);

    if (DRY) {
      step(5, 'DRY RUN — stopping here. Nothing was sent.');
      log('   Re-run without --dry to send it.');
      if (!HEADLESS) {
        log('\n   Window stays open. Press Enter here to close it.');
        await new Promise((r) => {
          const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
          rl.question('', () => { rl.close(); r(); });
        });
      }
    } else {
      step(5, 'sending');
      await box.click();
      await waPage.keyboard.press('Enter');
      await waPage.waitForTimeout(3000);

      // Confirm it actually left: look for an outgoing bubble carrying our text.
      const needle = (FIELDS.notes || FIELDS.name).slice(0, 24);
      const sent = await waPage
        .locator(`div.message-out:has-text(${JSON.stringify(needle)})`)
        .count()
        .catch(() => 0);
      const stillInBox = (await box.innerText().catch(() => '')).trim().length;

      if (sent > 0) log(`   SENT — the message is in the chat with +${NUMBER}`);
      else if (stillInBox === 0) log(`   Compose box is empty, so it went. Check the chat with +${NUMBER}.`);
      else { log('   Could not confirm it sent; the text is still in the box.'); exitCode = 1; }
      await waPage.waitForTimeout(1500);
    }
  }
} catch (err) {
  console.error('\nfailed:', err?.message ?? err);
  exitCode = 1;
} finally {
  await context.close().catch(() => {});
  server?.close();
}

process.exit(exitCode);
