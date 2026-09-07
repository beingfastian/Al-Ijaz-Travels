/**
 * The Open Graph share card.
 *
 *   npm run og    →  public/og.jpg   (1200×630)
 *
 * Why a committed file rather than a generated route: Next can build these with
 * `opengraph-image.tsx` and ImageResponse, but that pulls a Satori/Resvg
 * toolchain into every build to produce one image that changes roughly never.
 * This site already has sharp in the pipeline for scripts/images.mjs, so the
 * cheaper answer is to render the card once, commit it, and let it be a static
 * asset like every other photo.
 *
 * Why it matters at all: with no og:image, WhatsApp — which is where this
 * audience actually forwards a link — unfurls a bare grey box with a URL under
 * it. That is the first impression of the business for anyone receiving a
 * recommendation from a family member, which is this site's best acquisition
 * channel and the one it was doing nothing with.
 *
 * Run it again after changing the site name, the tagline, or the photo below.
 */

import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SOURCE = join(ROOT, 'assets', 'photos', 'kaaba-day.jpg');
const OUT_DIR = join(ROOT, 'public');
const OUT = join(OUT_DIR, 'og.jpg');

/** Facebook, WhatsApp, LinkedIn and X all crop toward 1.91:1. */
const WIDTH = 1200;
const HEIGHT = 630;

/** From app/tokens.css. Repeated rather than parsed — three constants. */
const NOIR = '#010704';
const SAND = '#FAF8F5';
const GOLD = '#8C6932';

const NAME = 'Al Ijaz Travel';
const TAGLINE = 'Umrah from the UK, arranged with care';
const PROOF = 'Real walking distances · Per-person pricing · ATOL protected';

/**
 * Text is drawn as SVG and composited, so it stays crisp rather than being
 * scaled with the photo.
 *
 * Font families are named as stacks ending in the generic `serif` / `sans-serif`
 * so this renders on any machine: librsvg resolves what it finds locally, and
 * the worst case is a slightly different face rather than blank text. The output
 * is committed, so the face in the shipped card is whichever one rendered here —
 * check public/og.jpg by eye after running this on a new machine.
 */
function overlay() {
  return Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Left-weighted scrim. The photograph stays legible on the right while the
         type sits on a field dark enough to hold 4.5:1 against sand. -->
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${NOIR}" stop-opacity="0.94"/>
      <stop offset="55%"  stop-color="${NOIR}" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="${NOIR}" stop-opacity="0.30"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>

  <!-- Gold hairline, the same device the site uses to open a premium surface. -->
  <rect x="72" y="150" width="64" height="3" fill="${GOLD}"/>

  <text x="72" y="238"
        font-family="Playfair Display, Georgia, Times New Roman, serif"
        font-size="76" font-weight="600" fill="${SAND}">${NAME}</text>

  <text x="72" y="300"
        font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="32" fill="${SAND}" fill-opacity="0.86">${TAGLINE}</text>

  <text x="72" y="470"
        font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="23" letter-spacing="0.4" fill="${SAND}" fill-opacity="0.72">${PROOF}</text>
</svg>`);
}

await mkdir(OUT_DIR, { recursive: true });

await sharp(SOURCE)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
  .composite([{ input: overlay(), top: 0, left: 0 }])
  // Quality 82 keeps this comfortably under the ~300 KB that WhatsApp will
  // fetch before giving up and showing no image at all.
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

// stat, not sharp's metadata — `size` there describes the decoded input, and is
// undefined when the input is a path rather than a buffer.
const { size } = await stat(OUT);
console.log(`og.jpg  ${WIDTH}×${HEIGHT}  ${Math.round(size / 1024)} KB  →  public/og.jpg`);
