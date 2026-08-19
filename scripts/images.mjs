/**
 * Build-time image pipeline.
 *
 *   npm run images
 *
 * `images.unoptimized: true` is not optional here — there is no optimizer on a
 * static host, and leaving it off is what makes the base repo ship 33 broken URLs.
 * But turning it off means nothing resizes anything either: whatever lands in
 * public/ is what a phone downloads. On a site whose whole visual argument is real
 * Haram photography, that is the difference between a 2 s LCP and a 9 s one.
 *
 * So the resizing moves here, to build time:
 *
 *   assets/photos/haram-night.jpg          ← source, never shipped
 *     → public/img/haram-night-{400,800,1200,1600}.avif
 *     → public/img/haram-night-{400,800,1200,1600}.webp
 *     → public/img/haram-night-800.jpg     ← fallback for <picture>
 *     → data/images.generated.ts           ← manifest, with intrinsic dimensions
 *
 * The manifest is the point. It carries real width and height, so <Photo> can
 * reserve the right space before the bytes arrive (the CLS budget is 0.05), and
 * its keys are a union type — referencing a photo that was never processed is a
 * typecheck failure, not a 404 discovered by a visitor.
 */

import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SOURCES = join(ROOT, 'assets', 'photos');
const OUT_DIR = join(ROOT, 'public', 'img');
const MANIFEST = join(ROOT, 'data', 'images.generated.ts');

/** Public URL prefix for everything this script writes. */
const URL_BASE = '/img';

const WIDTHS = [400, 800, 1200, 1600];
/** The <img> inside <picture> — universally supported, so it is the safety net. */
const FALLBACK_WIDTH = 800;

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);

/**
 * Filenames become URLs and manifest keys, so they have to survive both. A photo
 * arriving from a client as "Haram at Night (final) copy.JPG" would otherwise
 * produce a URL that needs escaping and a key that cannot be written in TS.
 */
const SAFE_NAME = /^[a-z0-9][a-z0-9-]*$/;

async function sourceFiles() {
  try {
    const entries = await readdir(SOURCES, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return null; // Directory does not exist yet.
  }
}

/** Encode only what is missing or stale — AVIF is slow enough to matter. */
async function isStale(target, sourceMtime) {
  try {
    return (await stat(target)).mtimeMs < sourceMtime;
  } catch {
    return true; // Missing.
  }
}

async function processImage(name) {
  const file = join(SOURCES, name);
  const key = basename(name, extname(name)).toLowerCase();

  if (!SAFE_NAME.test(key)) {
    throw new Error(
      `"${name}" is not a usable name.\n` +
        `      Filenames become URLs and manifest keys, so use lowercase letters,\n` +
        `      digits and hyphens only — e.g. haram-night.jpg`
    );
  }

  const sourceMtime = (await stat(file)).mtimeMs;
  const image = sharp(file);
  const meta = await image.metadata();

  if (!meta.width || !meta.height) throw new Error(`Cannot read dimensions of "${name}"`);

  // Never upscale. A 900px source gets 400 and 800, not a blurry 1600.
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  const largest = widths[widths.length - 1];
  const fallbackWidth = widths.includes(FALLBACK_WIDTH) ? FALLBACK_WIDTH : largest;

  const avif = [];
  const webp = [];
  let encoded = 0;

  for (const width of widths) {
    // sharp drops EXIF unless asked to keep it — which is what we want. Client
    // photography routinely carries GPS coordinates and camera serial numbers,
    // and none of that belongs on a public URL.
    const resized = image.clone().resize({ width, withoutEnlargement: true });

    for (const [format, list, options] of [
      ['avif', avif, { quality: 55, effort: 4 }],
      ['webp', webp, { quality: 78 }],
    ]) {
      const out = join(OUT_DIR, `${key}-${width}.${format}`);
      if (await isStale(out, sourceMtime)) {
        await resized.clone().toFormat(format, options).toFile(out);
        encoded++;
      }
      list.push(`${URL_BASE}/${key}-${width}.${format} ${width}w`);
    }
  }

  const fallback = join(OUT_DIR, `${key}-${fallbackWidth}.jpg`);
  if (await isStale(fallback, sourceMtime)) {
    await image
      .clone()
      .resize({ width: fallbackWidth, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toFile(fallback);
    encoded++;
  }

  const height = Math.round((meta.height / meta.width) * largest);

  return {
    key,
    encoded,
    entry: {
      width: largest,
      height,
      avif,
      webp,
      fallback: `${URL_BASE}/${key}-${fallbackWidth}.jpg`,
    },
  };
}

function renderManifest(entries) {
  const body = entries
    .map(({ key, entry }) => {
      const srcset = (list) => list.map((line) => `      '${line}',`).join('\n');
      return [
        `  '${key}': {`,
        `    width: ${entry.width},`,
        `    height: ${entry.height},`,
        `    avif: [`,
        srcset(entry.avif),
        `    ],`,
        `    webp: [`,
        srcset(entry.webp),
        `    ],`,
        `    fallback: '${entry.fallback}',`,
        `  },`,
      ].join('\n');
    })
    .join('\n');

  return `/* GENERATED BY scripts/images.mjs — DO NOT EDIT.
 *
 * Run \`npm run images\` after adding or replacing anything in assets/photos/.
 *
 * The keys below are the only photographs that exist. Because PackageImage.key is
 * typed as ImageKey, referring to one that has not been processed fails
 * \`npm run typecheck\` instead of shipping a broken <img> — which is the failure
 * this whole pipeline exists to make impossible.
 */

export interface GeneratedImage {
  /** Intrinsic size of the largest variant, so layout can be reserved up front. */
  readonly width: number;
  readonly height: number;
  /** Ready-made srcset entries, widest-capable format first. */
  readonly avif: readonly string[];
  readonly webp: readonly string[];
  /** Plain JPEG for the <img> inside <picture>. */
  readonly fallback: string;
}

export const IMAGES = {
${body}
} as const satisfies Record<string, GeneratedImage>;

/** Every processed photograph. Empty until assets/photos/ has something in it. */
export type ImageKey = keyof typeof IMAGES;
`;
}

const names = await sourceFiles();

if (names === null) {
  console.log(`\nImage pipeline`);
  console.log(`  no assets/photos/ directory yet — writing an empty manifest`);
  console.log(`  drop licensed photography there as <name>.jpg and re-run\n`);
}

await mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const name of names ?? []) {
  results.push(await processImage(name));
}

await writeFile(MANIFEST, renderManifest(results), 'utf8');

if (names !== null) {
  const encoded = results.reduce((sum, r) => sum + r.encoded, 0);
  console.log(`\nImage pipeline`);
  console.log(`  sources:  ${results.length}`);
  console.log(`  variants: ${encoded} encoded, ${results.length * (WIDTHS.length * 2 + 1) - encoded} already current`);
  for (const { key, entry } of results) {
    console.log(`    ${key}  ${entry.width}×${entry.height}  ${entry.avif.length} widths`);
  }
  console.log(`  manifest: data/images.generated.ts\n`);
}
