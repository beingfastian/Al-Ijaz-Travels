/**
 * Hotel photography importer.
 *
 *   npm run photos:audit                    # what we have, what is missing
 *   npm run photos:match                    # build a reviewable supplier mapping
 *   npm run photos:fetch -- --rights-confirmed
 *
 * WHY THIS IS THREE COMMANDS AND NOT ONE
 *
 * The dangerous failure here is not a network error, it is a photograph of the
 * wrong tower appearing under a named property. Our hotel names and a
 * wholesaler's hotel names do not agree, and the near-misses are hazardous rather
 * than cosmetic: "M Millennium Makkah" against "Millennium Makkah Al Naseem" is a
 * genuinely different hotel several kilometres further out, and "Dar Al Eiman
 * Grand" against "Dar Al Eiman Ajyad" are sibling properties in one group. A
 * script that fuzzy-matched and downloaded in one pass would publish all of them.
 *
 * So matching is separated from fetching by a file a human has to edit.
 * `match` proposes, writes confidence scores, and confirms nothing. `fetch`
 * downloads only entries a person has marked `"confirmed": true`. There is no
 * flag to skip that step.
 *
 * ⚠ LICENSING. A wholesaler's content API serves images; it does not by itself
 * grant the right to re-host them on our domain. That right comes from the
 * distribution contract, and some agreements require hotlinking their CDN
 * instead. `fetch` refuses to run without --rights-confirmed, which is a claim
 * that someone has read the contract. See assets/photos/HOTEL-PHOTOS.md.
 *
 * PROVIDERS
 *
 * Set the credentials you have and the provider is chosen for you. Each adapter
 * implements two methods — `listProperties()` and `bestImage(code)` — so adding
 * one is small. The auth schemes below are from published documentation; the
 * property-listing call on each wants one live smoke run before a bulk match, and
 * `--provider=mock` exercises the whole pipeline offline without credentials.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PHOTOS = join(ROOT, 'assets', 'photos');
const MAP_FILE = join(PHOTOS, 'supplier-map.json');

const argv = process.argv.slice(2);
const command = argv.find((a) => !a.startsWith('-')) ?? 'audit';
const has = (flag) => argv.includes(flag);
const flagValue = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};

/* ------------------------------------------------------------ our 42 hotels */

/**
 * Read the registry without importing it.
 *
 * data/hotels.ts imports the generated image manifest, which is fine under Next
 * but drags a chain of type-stripped modules into a plain node script for no
 * benefit. The ids and names are what we need and they are unambiguous in source.
 */
async function ourHotels() {
  const src = await readFile(join(ROOT, 'data', 'hotels.ts'), 'utf8');
  const body = src.slice(src.indexOf('const REGISTRY'), src.indexOf('} as const satisfies'));
  const out = [];
  const entry =
    /id:\s*'([^']+)',\s*\n\s*city:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*stars:\s*(\d)/g;
  for (const m of body.matchAll(entry)) {
    out.push({ id: m[1], city: m[2], name: m[3], stars: Number(m[4]) });
  }
  return out;
}

/* ------------------------------------------------------------------- audit */

/** Photography that is not hotel photography, and so is never an orphan. */
const SCENIC_KEYS = new Set([
  'haram-night', 'kaaba-day', 'haram-courtyard', 'pilgrims-ihram', 'kiswah-detail',
  'nabawi-green-dome', 'nabawi-twilight', 'makkah-skyline-night', 'tawaf-crowd',
]);

async function existingPhotos() {
  try {
    const files = await readdir(PHOTOS, { withFileTypes: true });
    return new Set(
      files
        .filter(
          (f) =>
            f.isFile() && ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f.name).toLowerCase())
        )
        .map((f) => basename(f.name, extname(f.name)))
    );
  } catch {
    return new Set();
  }
}

async function audit() {
  const hotels = await ourHotels();
  const present = await existingPhotos();

  const missing = hotels.filter((h) => !present.has(h.id));

  console.log('\nHotel photography coverage\n');
  console.log(`  hotels in the registry   ${hotels.length}`);
  console.log(`  photographed             ${hotels.length - missing.length}`);
  console.log(`  still needed             ${missing.length}\n`);

  for (const band of [5, 4, 3]) {
    for (const city of ['makkah', 'madinah']) {
      const set = hotels.filter((h) => h.stars === band && h.city === city);
      const got = set.filter((h) => present.has(h.id)).length;
      const flag =
        got === set.length ? 'complete — thumbnails will show' : `${set.length - got} missing`;
      console.log(`  ${band}-star ${city.padEnd(8)} ${got}/${set.length}  ${flag}`);
    }
  }

  if (missing.length) {
    console.log('\n  Missing, by the filename each one needs:\n');
    for (const h of missing) console.log(`    ${`${h.id}.jpg`.padEnd(38)} ${h.name}`);
  }

  // A file matching no hotel id is never rendered, and is usually a typo in a
  // filename rather than a spare image.
  const ids = new Set(hotels.map((h) => h.id));
  const orphans = [...present].filter((p) => !ids.has(p) && !SCENIC_KEYS.has(p));
  if (orphans.length) {
    console.log('\n  ⚠ In assets/photos/ but matching no hotel id — check for a typo:');
    for (const o of orphans) console.log(`    ${o}`);
  }
  console.log('');
}

/* --------------------------------------------------------------- providers */

function need(vars) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length) throw new Error(`Set ${missing.join(' and ')} in the environment.`);
  return vars.map((v) => process.env[v]);
}

async function getJson(url, headers) {
  const res = await fetch(url, { headers: { Accept: 'application/json', ...headers } });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} on ${url}\n${(await res.text()).slice(0, 400)}`);
  }
  return res.json();
}

/**
 * Hotelbeds / HBX Content API.
 *
 * Auth per developer.hotelbeds.com: an `Api-key` header plus a rolling
 * `X-Signature`, the hex SHA-256 of apiKey + secret + UNIX seconds. Images come
 * back as paths to append to the photo CDN, which serves seven sizes.
 */
const hotelbeds = {
  name: 'hotelbeds',
  envVars: ['HOTELBEDS_API_KEY', 'HOTELBEDS_SECRET'],
  photoBase: 'https://photos.hotelbeds.com/giata/original/',

  base() {
    return process.env.HOTELBEDS_ENV === 'production'
      ? 'https://api.hotelbeds.com/hotel-content-api/1.0'
      : 'https://api.test.hotelbeds.com/hotel-content-api/1.0';
  },

  headers() {
    const [apiKey, secret] = need(this.envVars);
    const stamp = Math.floor(Date.now() / 1000);
    return {
      'Api-key': apiKey,
      'X-Signature': createHash('sha256').update(`${apiKey}${secret}${stamp}`).digest('hex'),
    };
  },

  get(path) {
    return getJson(`${this.base()}${path}`, this.headers());
  },

  /**
   * Destination codes are resolved by name rather than hardcoded. An invented
   * code returns a plausible-looking empty result, which is worse than an error.
   */
  async listProperties() {
    const data = await this.get(
      '/locations/destinations?countryCodes=SA&language=ENG&from=1&to=500'
    );
    const wanted = /\bmakkah\b|\bmecca\b|\bmadinah\b|\bmedina\b/i;
    const destinations = (data.destinations ?? [])
      .filter((d) => wanted.test(d.name?.content ?? ''))
      .map((d) => ({ code: d.code, name: d.name.content }));

    if (!destinations.length) throw new Error('No Makkah/Madinah destinations returned.');
    for (const d of destinations) console.log(`  destination ${d.code}  ${d.name}`);

    const out = [];
    for (const d of destinations) {
      const page = 1000;
      for (let from = 1; ; from += page) {
        const data = await this.get(
          `/hotels?fields=code,name&destinationCodes=${d.code}` +
            `&language=ENG&from=${from}&to=${from + page - 1}`
        );
        const batch = data.hotels ?? [];
        out.push(...batch.map((h) => ({ code: String(h.code), name: h.name?.content ?? '' })));
        if (batch.length < page) break;
      }
      console.log(`  ${d.code}: ${out.length} hotels so far`);
    }
    return out;
  },

  async bestImage(code) {
    const detail = await this.get(`/hotels/${code}/details?language=ENG`);
    const images = detail.hotel?.images ?? [];
    // General views and exteriors first: the slots are 16:10 and centre-cropped,
    // so a bathroom close-up is a poor card image even when it is the right hotel.
    const rank = (i) => (i.imageTypeCode === 'GEN' ? 0 : i.imageTypeCode === 'COM' ? 1 : 2);
    const best = [...images].sort((a, b) => rank(a) - rank(b) || (a.order ?? 99) - (b.order ?? 99))[0];
    return best ? { url: `${this.photoBase}${best.path}`, caption: best.imageTypeCode ?? '' } : null;
  },
};

/**
 * Expedia Rapid (EAN) Content API.
 *
 * Auth per developers.expediagroup.com: `Authorization: EAN APIKey=<key>,
 * Signature=<hash>,timestamp=<seconds>` where the signature is the unsalted
 * hex SHA-512 of apiKey + sharedSecret + UNIX seconds. Rapid tolerates five
 * minutes of clock drift either way.
 *
 * Images arrive as an `images[]` array whose `links` object carries sized hrefs
 * — `1000px`, `350px`, `70px` — with `hero_image` and `category` alongside.
 */
const expedia = {
  name: 'expedia',
  envVars: ['EXPEDIA_API_KEY', 'EXPEDIA_SHARED_SECRET'],
  base: 'https://api.ean.com/v3',

  headers() {
    const [apiKey, secret] = need(this.envVars);
    const stamp = Math.floor(Date.now() / 1000);
    const signature = createHash('sha512').update(`${apiKey}${secret}${stamp}`).digest('hex');
    return { Authorization: `EAN APIKey=${apiKey},Signature=${signature},timestamp=${stamp}` };
  },

  get(path) {
    return getJson(`${this.base}${path}`, this.headers());
  },

  /**
   * Rapid returns content keyed by property id. There is no destination-name
   * lookup, so this pulls Saudi properties and filters on the city field.
   *
   * ⚠ This is the one call in this adapter worth a live smoke run before a bulk
   * match: the Saudi content set is large, and if your contract scopes content
   * differently you may need the paginated content-download endpoint instead.
   */
  async listProperties() {
    const data = await this.get(
      '/properties/content?language=en-US&supply_source=expedia&country_code=SA'
    );
    const wanted = /\bmakkah\b|\bmecca\b|\bmadinah\b|\bmedina\b/i;
    const out = [];
    for (const [id, property] of Object.entries(data ?? {})) {
      const city = property?.address?.city ?? '';
      if (!wanted.test(city)) continue;
      out.push({ code: id, name: property?.name ?? '', images: property?.images ?? [] });
    }
    console.log(`  ${out.length} Makkah/Madinah properties in the Saudi content set`);
    this._cache = new Map(out.map((p) => [p.code, p]));
    return out.map(({ code, name }) => ({ code, name }));
  },

  async bestImage(code) {
    const cached = this._cache?.get(code);
    const property =
      cached ??
      Object.values(
        await this.get(`/properties/content?language=en-US&supply_source=expedia&property_id=${code}`)
      )[0];

    const images = property?.images ?? [];
    // Hero first, then anything else — Rapid's hero is the exterior/general view.
    const best = [...images].sort((a, b) => Number(b.hero_image) - Number(a.hero_image))[0];
    const href = best?.links?.['1000px']?.href ?? best?.links?.['350px']?.href;
    return href ? { url: href, caption: best?.caption ?? '' } : null;
  },
};

/**
 * Offline provider, so the pipeline can be proven without credentials.
 *
 * Includes the real near-miss names from this portfolio, which is what makes it
 * worth having: it demonstrates that the review gate catches sibling properties
 * and same-brand-different-hotel cases rather than only that the happy path runs.
 */
const mock = {
  name: 'mock',
  envVars: [],
  async listProperties() {
    return [
      { code: 'MK001', name: 'Raffles Makkah Palace' },
      { code: 'MK002', name: 'Swissotel Makkah' },
      { code: 'MK003', name: 'Millennium Makkah Al Naseem' },
      { code: 'MD001', name: 'Movenpick Hotel Anwar Al Madinah' },
      { code: 'MD002', name: 'The Oberoi Madina' },
      { code: 'MD003', name: 'Dar Al Eiman Ajyad' },
    ];
  },
  async bestImage(code) {
    return { url: `https://example.invalid/${code}.jpg`, caption: 'mock' };
  },
};

const PROVIDERS = { hotelbeds, expedia, mock };

/**
 * Explicit choice wins; otherwise the provider is inferred from whichever
 * credentials are actually set, so there is nothing extra to configure.
 */
function pickProvider() {
  const named = flagValue('provider') ?? process.env.PHOTO_PROVIDER;
  if (named) {
    const found = PROVIDERS[named.toLowerCase()];
    if (!found) {
      throw new Error(
        `No adapter for "${named}". Implemented: ${Object.keys(PROVIDERS).join(', ')}.`
      );
    }
    return found;
  }

  const available = Object.values(PROVIDERS).filter(
    (p) => p.envVars.length && p.envVars.every((v) => process.env[v])
  );
  if (available.length === 1) return available[0];
  if (available.length > 1) {
    throw new Error(
      `Credentials found for ${available.map((p) => p.name).join(' and ')}.\n` +
        '  Choose one with --provider=<name>.'
    );
  }

  throw new Error(
    'No supplier credentials found. Set one of:\n\n' +
      '  Hotelbeds / HBX   HOTELBEDS_API_KEY, HOTELBEDS_SECRET  (+ HOTELBEDS_ENV=production)\n' +
      '  Expedia Rapid     EXPEDIA_API_KEY, EXPEDIA_SHARED_SECRET\n\n' +
      '  Or exercise the pipeline with no credentials at all:\n' +
      '    node scripts/hotel-photos.mjs match --provider=mock\n\n' +
      '  WebBeds and Dida expose equivalent content endpoints — each adapter is\n' +
      '  two methods, listProperties() and bestImage(), so say which you use.'
  );
}

/* --------------------------------------------------------------- matching */

/**
 * Confidence needed before a match is proposed without a review flag. Verified
 * against the real near-miss cases in this portfolio — see HOTEL-PHOTOS.md.
 */
const MATCH_THRESHOLD = 0.7;

/** Tokens, diacritics folded, so "Swissôtel" and "Swissotel" compare equal. */
function tokens(s) {
  return new Set(
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .filter((t) => t && !['hotel', 'hotels', 'the', 'by', 'and'].includes(t))
  );
}

/** Jaccard overlap. Deliberately blunt — it proposes, a human decides. */
function score(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared++;
  return shared / new Set([...A, ...B]).size;
}

async function match() {
  const api = pickProvider();
  const hotels = await ourHotels();

  console.log(`\nMatching ${hotels.length} properties against ${api.name}\n`);
  const supply = await api.listProperties();
  if (!supply.length) throw new Error('The supplier returned no properties to match against.');

  const entries = hotels.map((h) => {
    const ranked = supply
      .map((s) => ({ s, score: score(h.name, s.name) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const best = ranked[0];
    const confident = best && best.score >= MATCH_THRESHOLD;

    return {
      id: h.id,
      ourName: h.name,
      city: h.city,
      stars: h.stars,
      supplierCode: best?.s.code ?? null,
      supplierName: best?.s.name ?? null,
      score: best ? Number(best.score.toFixed(2)) : 0,
      confirmed: false,
      needsReview: !confident,
      alternatives: ranked.slice(1).map((r) => ({
        code: r.s.code,
        name: r.s.name,
        score: Number(r.score.toFixed(2)),
      })),
    };
  });

  await mkdir(PHOTOS, { recursive: true });
  await writeFile(MAP_FILE, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');

  const strong = entries.filter((e) => !e.needsReview).length;
  console.log(`\n  wrote ${MAP_FILE}`);
  console.log(`  ${strong} of ${entries.length} matched at or above ${MATCH_THRESHOLD}`);
  console.log(`  ${entries.length - strong} need a decision — see "needsReview": true\n`);
  console.log('  NOTHING is confirmed. Open the file, check each supplierName against');
  console.log('  ourName, pick from "alternatives" where the top hit is wrong, then set');
  console.log('  "confirmed": true on the rows you have verified. Only those download.\n');
}

/* ---------------------------------------------------------------- fetching */

async function fetchPhotos() {
  if (!has('--rights-confirmed')) {
    console.error(
      '\nRefusing to download.\n\n' +
        '  A content API serves images; it does not grant the right to re-host them on\n' +
        '  our domain. That comes from the distribution contract, and some agreements\n' +
        '  require hotlinking the supplier CDN instead.\n\n' +
        '  Once someone has actually read it:  npm run photos:fetch -- --rights-confirmed\n'
    );
    process.exitCode = 1;
    return;
  }

  const api = pickProvider();
  let map;
  try {
    map = JSON.parse(await readFile(MAP_FILE, 'utf8'));
  } catch {
    throw new Error(`No ${MAP_FILE}. Run "npm run photos:match" first.`);
  }

  const ready = map.filter((e) => e.confirmed === true && e.supplierCode);
  const skipped = map.length - ready.length;
  if (!ready.length) {
    console.log(`\n  Nothing marked "confirmed": true in ${MAP_FILE}. Nothing to do.\n`);
    return;
  }

  console.log(`\nFetching ${ready.length} confirmed properties (${skipped} unconfirmed, skipped)\n`);

  // Some adapters populate a cache during listProperties; give them the chance.
  if (api.listProperties && api._cache === undefined && api.name === 'expedia') {
    await api.listProperties().catch(() => {});
  }

  const report = [];
  for (const entry of ready) {
    try {
      const image = await api.bestImage(entry.supplierCode);
      if (!image) {
        report.push({ id: entry.id, status: 'no images returned' });
        continue;
      }

      const res = await fetch(image.url);
      if (!res.ok) {
        report.push({ id: entry.id, status: `${res.status} fetching image` });
        continue;
      }

      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      await writeFile(join(PHOTOS, `${entry.id}.jpg`), buf);

      report.push({
        id: entry.id,
        status: 'saved',
        size: `${meta.width}×${meta.height}`,
        // Landscape only: the pipeline never upscales and the slots centre-crop,
        // so a portrait source loses the building it is of.
        warn: meta.height > meta.width ? 'PORTRAIT — will crop badly' : null,
      });
    } catch (err) {
      report.push({ id: entry.id, status: `failed: ${err.message.split('\n')[0]}` });
    }
  }

  console.log('  Result\n');
  for (const r of report) {
    const bits = [r.id.padEnd(34), r.status];
    if (r.size) bits.push(r.size);
    if (r.warn) bits.push(`⚠ ${r.warn}`);
    console.log(`    ${bits.join('  ')}`);
  }

  const saved = report.filter((r) => r.status === 'saved');
  console.log(`\n  ${saved.length} saved into assets/photos/\n`);
  console.log('  Before committing, three things that are not optional:\n');
  console.log('    1. LOOK AT EVERY IMAGE. A confirmed code can still be the wrong');
  console.log('       property in the supplier database. Open them.');
  console.log('    2. npm run images   — encode and regenerate the manifest.');
  console.log("    3. Add rows to assets/photos/CREDITS.md naming the source and the");
  console.log('       permission relied on, with today\'s date.\n');
  if (saved.some((r) => r.warn)) {
    console.log('  Some sources are portrait. Re-crop to landscape or pick another image.\n');
  }
}

/* -------------------------------------------------------------------- main */

const COMMANDS = { audit, match, fetch: fetchPhotos };

/** Exported so the matching threshold can be checked without hitting an API. */
export { score, tokens, MATCH_THRESHOLD, PROVIDERS };

// Only run as a CLI. Importing this module for the scorer must not fire a command.
const invokedDirectly = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));

if (invokedDirectly) {
  try {
    const run = COMMANDS[command];
    if (!run) {
      console.error(`Unknown command "${command}". Use: ${Object.keys(COMMANDS).join(' | ')}`);
      process.exitCode = 1;
    } else {
      await run();
    }
  } catch (err) {
    console.error(`\n${err.message}\n`);
    process.exitCode = 1;
  }
}
