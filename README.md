# Al Ijaz Travel — Umrah website

Static-exported Next.js site. Built against the plan in `../al-ijaz-build-plan.html`.

## Commands

```bash
npm run dev              # local dev server
npm run images           # encode assets/photos/ -> public/img/ + regenerate the manifest
npm run palette          # regenerate app/tokens.css + assert every contrast pairing
npm run build            # static export into out/
npm run test             # filter/URL + quote-draft unit tests (no test-runner dependency)
npm run serve:out        # serve out/ for manual checking, logging 404s as they happen
npm run verify:export    # serve out/ and probe every asset URL the HTML asks for
npm run verify           # images + palette + build + test + verify:export, in order
```

`npm run verify` is the gate. Run it before any deploy.

## Why `verify:export` exists

The base repo this design came from (`adrianhajdin/travel_ui_ux`) builds with exit
code 0 and still ships a broken site: 33 `<img>` tags point at
`/_next/image?url=…`, and nothing serves that path on a static host. `next dev`
hides it completely because the optimizer is running in dev.

So "the build passed" is not the gate. `verify:export` serves `out/` and requests
every local URL the exported HTML references — including relative ones resolved
against their own page, which is how that repo's `src="menu.svg"` silently 404s on
every nested route.

Current state: **16 pages, 171 asset references, all resolving.**

## Design system

`scripts/palette.mjs` generates `app/tokens.css`. Do not hand-edit the tokens file.

The brand green `#162D23` measures **L 27.5% / chroma 0.035** in OKLCH — a deep,
nearly-neutral ground colour, not a mid-scale hue. Blending it toward white (the
obvious approach) gives `#F1F2F2`: grey, no hue left. So it is anchored at **900**
and the lighter steps are built in OKLCH with chroma rising through the midtones.

Two contrast facts the palette enforces, because the pretty choice fails WCAG AA:

| Pairing | Ratio | |
|---|---|---|
| brand gold `#A88146` as body text on cream | 3.36 | fails |
| white label on a gold button | 3.56 | fails |
| **derived** `--color-gold-text` on cream | 4.69 | passes |
| cream on `green-900` — the primary CTA | 13.82 | passes |

Use the **semantic** tokens in components (`--color-gold-text`, `--color-heading`,
`--color-on-dark`), never the raw ramp. `npm run palette` exits non-zero if any
pairing regresses.

## Decisions that differ from the reference repos

- **Filters live in the URL**, not a store — so a consultant can send a client a
  link to a filtered listing and it survives a refresh. Bounds are derived from the
  catalogue; Tripix hardcodes `[0, 500]` USD, which matches no PKR package.
- **The listing prerenders its catalogue.** Because the listing reads
  `useSearchParams`, the Suspense *fallback* is what gets exported — so the fallback
  is the real, default-sorted catalogue rather than a skeleton. Without that,
  `out/packages/index.html` shipped 0 package links. It now carries all 6, and the
  order matches the hydrated default view because both call the same `applyFilters`.
- **Package pages are real routes** (`/packages/[slug]/`) with
  `generateStaticParams`, not `?id=`. Each gets its own metadata and `TouristTrip`
  JSON-LD.
- **The quote form is not a port.** Tripix submits N forms via
  `document.getElementById(...).requestSubmit()` then races a `setTimeout(…, 100)`
  against a React state update. Here: one `useForm`, a Zod schema per step,
  `trigger()` to gate advancement.
- **The draft survives a refresh.** `components/quote/draft.ts` is the only store on
  the site — filters went to the URL, which leaves the half-filled form as the one
  piece of state worth keeping. It rehydrates from an effect, never during render, so
  the prerendered HTML and the first client render cannot disagree. Restoration is a
  shape check rather than Zod validation, because a draft is *meant* to be incomplete
  and `name: ''` would fail `min(2)`.
- **Zoom is never locked.** Tripix sets `userScalable: false` (WCAG 1.4.4). This
  audience skews older; do not copy that.
- **No passport numbers at quote stage.** A quote is not a booking — collecting
  identity documents before anyone commits costs conversions and creates a
  data-protection liability for nothing.

## Photography

`images.unoptimized: true` is mandatory for a static export — but it also means
nothing resizes anything, so whatever lands in `public/` is what a phone downloads.
The resizing moves to build time instead:

```
assets/photos/haram-night.jpg      ← source, never served
  → public/img/haram-night-{400,800,1200,1600}.{avif,webp}
  → public/img/haram-night-800.jpg  ← <picture> fallback
  → data/images.generated.ts        ← manifest, with intrinsic dimensions
```

Reference photographs by **key**, not path:

```ts
images: [{ key: 'haram-night', alt: 'The Masjid al-Haram courtyard at night' }],
```

`key` is typed against the generated manifest, so naming a photo the pipeline has not
produced fails `npm run typecheck` instead of shipping an `<img>` that 404s. Intrinsic
width and height ride along in the manifest so `<Photo>` reserves layout before the
bytes arrive — that is the CLS budget defended at the source. `sizes` is a required
prop with no default, because a wrong `sizes` silently downloads the wrong file.

Do not hand-edit `data/images.generated.ts`. See `assets/photos/README.md`.

## Before launch — client input required

Search the repo for `TODO(client)`. The blocking items:

| What | Where |
|---|---|
| WhatsApp number, phone, email, address, real URL | `data/site.ts` |
| Accreditation credentials + badge artwork | `data/trust.ts` — deliberately empty; a registration you do not hold is a liability, not a design detail |
| Real per-person prices and the seasons you have allocation for | `data/packages.ts` |
| Hotel allocation verified against current contracts | `data/hotels.ts` — names and distances are real but must be confirmed |
| Seasonal banner on/off and its copy | `data/trust.ts` |
| Licensed photography | every `images: []`; an empty array renders a branded khatam placeholder, never a broken image |
| Company profile copy | `app/about/page.tsx` |
| Logo SVG | `public/brand/` — `Navbar` renders an inline mark meanwhile |

## Structure

Every file in the build plan's tree exists, at the path the plan gives it. The plan's
tree is abbreviated, so the repo also carries what that shorthand implies — `Navbar`,
`Footer`, `data/site.ts`, `lib/cn.ts`, the quote schema, and the sections named in the
phase notes but not the tree (`ComparisonTable`, `SeasonalBanner`). Layering is deliberate:

- `lib/` is pure logic with no React, so `filter.ts` is unit tested directly.
- `data/` holds content. `hotels.ts` is the canonical registry; packages reference
  hotels by id, so a corrected walking distance propagates everywhere at once.
- `components/ui/` are primitives (`Button`, `Section`, `Card`, `Pill`, `Stepper`,
  `Timeline`). `components/{home,package,quote}/` compose them.
- Routing lives only in page components and `PackageListing`. `FilterPanel` is
  presentational, which is what lets the same panel serve a seasonal landing page
  later.

## Not yet built

- A photography slot on detail pages — `PackageCard` is currently the only consumer
  of `images[]`, so the page where someone decides has no photograph on it.
- Seasonal landing pages driven by `departureMonths` (the data supports it; the
  banner already deep-links into a filtered listing)
- Lighthouse and axe passes
- A real-browser pass over the quote flow. The draft store's logic is unit tested and
  the export gate is green, but "refresh mid-flow and the answers come back", "no
  hydration warning", and "WhatsApp opens *and* this tab lands on `/quote/sent/`"
  are browser behaviours neither can prove. `npm run serve:out` is the check.

`GAPS.md` is the running register of everything outstanding, with the evidence for
each item and what is already verified.
