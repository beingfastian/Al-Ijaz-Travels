/**
 * Al Ijaz Travel — brand palette generator.
 *
 * Why this exists (see the build plan, "Four departures", item a):
 * the brand green #162D23 measures L 27.5% / chroma 0.035 in OKLCH. That is a deep,
 * nearly-neutral ground colour, not a mid-scale hue. Lerping it toward white in sRGB —
 * the obvious approach — yields #F1F2F2 at step 50: a dead grey with no hue left.
 *
 * So: anchor the brand hex at 900 and build the lighter steps in OKLCH, raising
 * lightness *and* chroma through the midtones so the scale stays green.
 *
 * Run `node scripts/palette.mjs` to regenerate app/tokens.css.
 * The script asserts every contrast pairing the design system depends on and exits
 * non-zero if one regresses, so `npm run palette:check` can gate CI.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'tokens.css');

/* ---------------------------------------------------------------- colour math */

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function rgbToHex([r, g, b]) {
  const to = (v) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** sRGB hex -> OKLCH {L 0..1, C, H degrees} */
function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

/** OKLCH -> linear sRGB (may fall outside gamut) */
function oklchToLinear({ L, C, H }) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const inGamut = (rgb) => rgb.every((c) => c >= -0.0001 && c <= 1.0001);

/**
 * OKLCH -> hex, holding L and H fixed and giving up chroma until the colour fits sRGB.
 * Preserving lightness matters more than preserving saturation: lightness is what
 * carries the contrast guarantees below.
 */
function oklchToHex({ L, C, H }) {
  let lo = 0;
  let hi = C;
  if (inGamut(oklchToLinear({ L, C, H }))) hi = C;
  else {
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ L, C: mid, H }))) lo = mid;
      else hi = mid;
    }
    hi = lo;
  }
  return rgbToHex(oklchToLinear({ L, C: hi, H }).map(linearToSrgb));
}

/* ------------------------------------------------------------------- contrast */

const relLuminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function contrast(a, b) {
  const x = relLuminance(a);
  const y = relLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/* --------------------------------------------------------------------- brand */

// Sampled from the logo (see project brief). These are the fixed points.
const BRAND = {
  green: '#162D23', // primary — lands at green-900
  greenDark: '#101D17', // deepest ground — green-950
  gold: '#A88146', // primary gold — lands at gold-500
  cream: '#FAF8F5', // page ground — sand-50
  ink: '#1A1A1A', // body text / Kaaba black
};

const gA = hexToOklch(BRAND.green);
const goA = hexToOklch(BRAND.gold);

/**
 * Ramp stops as [lightness, chroma]. Chroma deliberately peaks in the midtones
 * and falls off at both ends — that curve is what keeps the light steps green
 * instead of grey, and the dark steps deep instead of muddy.
 */
const RAMPS = {
  green: {
    hue: gA.H,
    stops: {
      50: [0.972, 0.014],
      100: [0.938, 0.028],
      200: [0.885, 0.05],
      300: [0.805, 0.072],
      400: [0.715, 0.085],
      500: [0.62, 0.09],
      600: [0.525, 0.082],
      700: [0.435, 0.068],
      800: [0.35, 0.05],
      900: [gA.L, gA.C], // exact brand hex
      950: null, // exact brief hex, set below
    },
  },
  gold: {
    hue: goA.H,
    stops: {
      50: [0.975, 0.012],
      100: [0.945, 0.026],
      200: [0.893, 0.046],
      300: [0.82, 0.068],
      400: [0.725, 0.085],
      500: [goA.L, goA.C], // exact brand hex
      600: [0.545, 0.085],
      700: [0.46, 0.072],
      800: [0.375, 0.058],
      900: [0.3, 0.044],
    },
  },
  /**
   * Noir — the premium dark ground.
   *
   * green-950 is a very dark green and reads as brand. Noir is something else: a
   * near-black carrying just enough of the brand hue (chroma 0.008–0.018) that it
   * sits beside the greens without looking like a different site, but dark enough
   * to make gold look like metal rather than mustard.
   *
   * This is the single biggest lever on "does it feel expensive". Luxury in
   * interfaces is mostly deep grounds, restrained accent, and a lot of space —
   * not more ornament.
   */
  noir: {
    hue: gA.H,
    stops: {
      50: [0.965, 0.004],
      100: [0.92, 0.005],
      200: [0.84, 0.006],
      300: [0.72, 0.007],
      400: [0.58, 0.008],
      500: [0.46, 0.009],
      600: [0.37, 0.011],
      700: [0.29, 0.013],
      800: [0.22, 0.015],
      900: [0.16, 0.017],
      950: [0.115, 0.018],
    },
  },
  // Warm neutral, biased toward the cream's own hue so greys read as chosen.
  sand: {
    hue: hexToOklch(BRAND.cream).H,
    stops: {
      50: [0.98, 0.005],
      100: [0.958, 0.007],
      200: [0.915, 0.009],
      300: [0.855, 0.011],
      400: [0.755, 0.012],
      500: [0.65, 0.012],
      600: [0.545, 0.011],
      700: [0.44, 0.01],
      800: [0.335, 0.008],
      900: [0.245, 0.006],
    },
  },
};

const scale = {};
for (const [name, { hue, stops }] of Object.entries(RAMPS)) {
  scale[name] = {};
  for (const [step, lc] of Object.entries(stops)) {
    if (!lc) continue;
    scale[name][step] = oklchToHex({ L: lc[0], C: lc[1], H: hue });
  }
}
// Pin the exact sampled hexes so the brand colours survive round-tripping.
scale.green[900] = BRAND.green;
scale.green[950] = BRAND.greenDark;
scale.gold[500] = BRAND.gold;
scale.sand[50] = BRAND.cream;

/**
 * Solve for the lightest gold that still clears WCAG AA as body text.
 * Hand-picking this is how sites end up with pretty, unreadable labels; deriving
 * it means the token cannot drift out of compliance.
 *
 * Solved against 4.65 rather than 4.5 on purpose: landing exactly on the threshold
 * leaves no headroom, so an 8-bit rounding change downstream could flip it to a
 * failure. The assertion below still checks the real 4.5 requirement.
 *
 * ⚠ Solved against sand-100, NOT the cream page ground.
 *
 * It was solved against cream, and axe caught it in a real browser: the `eyebrow`
 * label on the comparison section renders on the sunk surface (sand-100), which
 * is a shade darker than cream, and the token dropped to 4.4:1 there. The token
 * passed every assertion in this file and still failed on the page, because the
 * assertions tested a pairing the components did not actually use.
 *
 * The lesson is the general one: solve a semantic colour against the DARKEST
 * ground it can legitimately land on, not the most flattering one. `danger`
 * below already did this; gold-text did not.
 */
function solveGoldText(bg, target = 4.65) {
  let lo = 0.2;
  let hi = goA.L;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const hex = oklchToHex({ L: mid, C: goA.C, H: goA.H });
    if (contrast(hex, bg) >= target) lo = mid;
    else hi = mid;
  }
  return oklchToHex({ L: lo, C: goA.C, H: goA.H });
}
const goldText = solveGoldText(scale.sand[100]);

/**
 * Muted body text, derived rather than taken straight from sand-600.
 *
 * Same failure as gold-text, found the same way: sand-600 clears AA on cream at
 * 4.69:1 and drops to ~4.4:1 on the sunk surface, which is where half the muted
 * paragraphs on the site actually sit. Picking a ramp step for a semantic text
 * role only works if every ground it lands on happens to be the one you checked.
 *
 * Solved against sand-100 for the same reason gold-text is.
 */
const SAND_HUE = hexToOklch(BRAND.cream).H;
function solveMutedText(bg, target = 4.65) {
  let lo = 0.2;
  let hi = 0.62;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const hex = oklchToHex({ L: mid, C: 0.011, H: SAND_HUE });
    if (contrast(hex, bg) >= target) lo = mid;
    else hi = mid;
  }
  return oklchToHex({ L: lo, C: 0.011, H: SAND_HUE });
}
const mutedText = solveMutedText(scale.sand[100]);

/**
 * Validation-error red. Solved the same way rather than picked, so it clears AA
 * as small text on both the page ground and the sunk card surface — error text
 * is the one thing on the site that MUST be readable on the first attempt.
 *
 * Hue 27 sits on the warm side of red so it reads as distinct from the gold
 * accent rather than as a slightly-off variant of it.
 */
const DANGER_HUE = 27;
function solveDanger(bg, target = 4.65) {
  let lo = 0.2;
  let hi = 0.62;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const hex = oklchToHex({ L: mid, C: 0.16, H: DANGER_HUE });
    if (contrast(hex, bg) >= target) lo = mid;
    else hi = mid;
  }
  return oklchToHex({ L: lo, C: 0.16, H: DANGER_HUE });
}
// Solved against the DARKER of the two grounds it appears on, so it passes on both.
const danger = solveDanger(scale.sand[100]);
const dangerSurface = oklchToHex({ L: 0.955, C: 0.02, H: DANGER_HUE });

/* ------------------------------------------------------------------ assertions
 * Every pairing the design system actually relies on. A failure here means a
 * component somewhere is about to ship unreadable text.
 */
const AA_BODY = 4.5;
const AA_LARGE = 3.0;

const checks = [
  ['body ink on cream', BRAND.ink, scale.sand[50], AA_BODY],
  ['primary CTA: cream on green-900', scale.sand[50], scale.green[900], AA_BODY],
  ['gold body text on cream (derived)', goldText, scale.sand[50], AA_BODY],
  // sand-100 (--color-surface-sunk) is the DARKEST ground gold text lands on.
  // sand-200 is --color-border only, never a background — asserting against it
  // would darken the token for a pairing that does not exist.
  ['gold body text on sunk surface — the pairing axe caught', goldText, scale.sand[100], AA_BODY],
  ['gold-100 on green-900 (dark sections)', scale.gold[100], scale.green[900], AA_BODY],
  ['gold-200 on green-950', scale.gold[200], scale.green[950], AA_BODY],
  ['muted text on cream (derived)', mutedText, scale.sand[50], AA_BODY],
  ['muted text on sunk surface — the pairing axe caught', mutedText, scale.sand[100], AA_BODY],
  ['green-700 link on cream', scale.green[700], scale.sand[50], AA_BODY],
  ['green-900 heading on cream', scale.green[900], scale.sand[50], AA_BODY],
  ['gold-500 rule on cream (non-text)', scale.gold[500], scale.sand[50], AA_LARGE],
  ['focus ring gold-600 on cream', scale.gold[600], scale.sand[50], AA_LARGE],
  ['error text on cream', danger, scale.sand[50], AA_BODY],
  ['error text on sunk card surface', danger, scale.sand[100], AA_BODY],
  ['error text on its own tinted surface', danger, dangerSurface, AA_BODY],

  // Premium noir surfaces. Every one of these is a pairing the luxury treatment
  // actually uses, so a decorative choice cannot quietly drop below AA.
  ['cream on noir-950 (premium ground)', scale.sand[50], scale.noir[950], AA_BODY],
  ['cream on noir-900', scale.sand[50], scale.noir[900], AA_BODY],
  ['gold-300 on noir-950 (accent text)', scale.gold[300], scale.noir[950], AA_BODY],
  ['gold-200 on noir-900', scale.gold[200], scale.noir[900], AA_BODY],
  ['muted text on noir-950', scale.noir[300], scale.noir[950], AA_BODY],
  ['gold-500 hairline on noir-950 (non-text)', scale.gold[500], scale.noir[950], AA_LARGE],
  ['gold-500 hairline on cream (non-text)', scale.gold[500], scale.sand[50], AA_LARGE],
  ['focus ring gold-400 on noir-950 (non-text)', scale.gold[400], scale.noir[950], AA_LARGE],
];

let failed = 0;
const rows = checks.map(([label, fg, bg, min]) => {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed++;
  return { label, fg, bg, ratio, min, ok };
});

/* ---------------------------------------------------------------------- emit */

const band = (name) =>
  Object.entries(scale[name])
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([step, hex]) => `  --color-${name}-${step}: ${hex};`)
    .join('\n');

const css = `/* GENERATED by scripts/palette.mjs — do not edit by hand.
 * Run: npm run palette
 *
 * Brand anchors, sampled from the logo:
 *   green-900 ${BRAND.green}   (OKLCH L ${(gA.L * 100).toFixed(1)}% C ${gA.C.toFixed(3)} H ${gA.H.toFixed(0)})
 *   gold-500  ${BRAND.gold}   (OKLCH L ${(goA.L * 100).toFixed(1)}% C ${goA.C.toFixed(3)} H ${goA.H.toFixed(0)})
 */

/* \`static\` matters: Tailwind 4 tree-shakes @theme variables that no utility
 * references, which silently drops most of these ramps from the built CSS. The
 * site itself survived that because it uses utilities, but any var(--color-*)
 * reference — inline styles, the specimen sheet, future one-off usage — resolved
 * to nothing. A design system has to publish its whole scale, not the subset
 * that happened to be used this week. */
@theme static {
${band('green')}

${band('gold')}

${band('noir')}

${band('sand')}

  --color-ink: ${BRAND.ink};

  /* Semantic tokens. Use these in components, never the raw ramp, so a contrast
   * rule can never be lost to a judgement call at the call site. */
  --color-ground: var(--color-sand-50);
  --color-surface: #FFFFFF;
  --color-surface-sunk: var(--color-sand-100);
  --color-border: var(--color-sand-200);
  --color-border-strong: var(--color-sand-300);

  --color-text: var(--color-ink);
  /* Derived, not sand-600: that step fails AA on the sunk surface. */
  --color-text-muted: ${mutedText};
  --color-heading: var(--color-green-900);
  --color-link: var(--color-green-700);

  /* Gold as TEXT on cream must be this value — the brand gold #A88146 measures
   * ${contrast(BRAND.gold, BRAND.cream).toFixed(2)}:1 there and fails AA. */
  --color-gold-text: ${goldText};
  /* Gold as a RULE, border, icon stroke or large numeral — never small text. */
  --color-gold-line: var(--color-gold-500);

  /* On dark green sections. */
  --color-on-dark: var(--color-sand-50);
  --color-on-dark-muted: var(--color-gold-100);

  /* Validation errors. Solved for AA against the darkest ground it sits on. */
  --color-danger: ${danger};
  --color-danger-surface: ${dangerSurface};

  /* ---- Premium surfaces -------------------------------------------------
   * The luxury treatment. Deep ground, restrained gold, generous space — the
   * expensive look comes from what is left out, not what is added. */
  --color-premium: var(--color-noir-950);
  --color-premium-raised: var(--color-noir-900);
  --color-on-premium: var(--color-sand-50);
  --color-on-premium-muted: var(--color-noir-300);
  --color-on-premium-accent: var(--color-gold-300);
  --color-rule-premium: color-mix(in oklab, var(--color-gold-500) 38%, transparent);

  /* Hairline gold rules. A 1px line at partial opacity reads as a deliberate
   * edge; a solid gold border reads as a warning label. */
  --color-rule-gold: color-mix(in oklab, var(--color-gold-500) 30%, transparent);

  /* ---- Elevation --------------------------------------------------------
   * Layered, low-opacity and warm-tinted rather than one grey blur. Neutral
   * black shadows on a cream ground are what make a page look cheap. */
  --shadow-card: 0 1px 2px color-mix(in oklab, var(--color-noir-900) 5%, transparent),
    0 2px 8px color-mix(in oklab, var(--color-noir-900) 4%, transparent);
  --shadow-lift: 0 2px 4px color-mix(in oklab, var(--color-noir-900) 5%, transparent),
    0 12px 28px color-mix(in oklab, var(--color-noir-900) 8%, transparent);
  --shadow-float: 0 4px 8px color-mix(in oklab, var(--color-noir-900) 6%, transparent),
    0 24px 56px color-mix(in oklab, var(--color-noir-900) 12%, transparent);
  --shadow-premium: 0 1px 0 color-mix(in oklab, var(--color-gold-500) 14%, transparent) inset,
    0 20px 48px color-mix(in oklab, #000 40%, transparent);

  /* ---- Motion -----------------------------------------------------------
   * Named once here so 200 pages cannot drift into 200 different easings.
   * Everything using these is gated behind prefers-reduced-motion. */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);

  --duration-fast: 180ms;
  --duration-base: 320ms;
  --duration-slow: 620ms;
  --duration-reveal: 780ms;
}
`;

writeFileSync(OUT, css, 'utf8');

/* --------------------------------------------------------------------- report */

const pad = (s, n) => String(s).padEnd(n);
console.log('\nGenerated ramps\n');
for (const name of Object.keys(scale)) {
  const steps = Object.entries(scale[name]).sort((a, b) => Number(a[0]) - Number(b[0]));
  console.log(`  ${pad(name, 6)} ${steps.map(([s, h]) => `${s}:${h}`).join('  ')}`);
}
console.log(`\n  gold-text (derived, AA on cream): ${goldText}\n`);

console.log('Contrast assertions\n');
for (const r of rows) {
  console.log(
    `  ${r.ok ? 'PASS' : 'FAIL'}  ${pad(r.ratio.toFixed(2), 6)} (min ${r.min})  ${r.label}`
  );
}
console.log(`\n  wrote ${OUT}`);

if (failed) {
  console.error(`\n  ${failed} contrast assertion(s) FAILED — fix the ramp before shipping.\n`);
  process.exit(1);
}
console.log('  all contrast assertions passed\n');
