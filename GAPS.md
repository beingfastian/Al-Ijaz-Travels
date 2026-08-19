# Gap register — Al Ijaz Travel

Draft. Audited **19 Aug 2026** against `../al-ijaz-build-plan.html`.
Every item below was reproduced locally — nothing here is inferred from the README.

**Gate status at time of audit:** `npm run verify` passes end to end.
palette OK · build exit 0 · 16/16 unit tests · 16 pages, 171 asset references, all resolving.

So the structure really is 1:1 with the plan's file tree. The gaps are **behavioural,
phase-level, and content-level** — not structural.

---

## 1. Plan requirements that are not implemented

> **All three resolved 19 Aug 2026.** Kept in full below, because the reasoning is
> the record of why they mattered. Gate after the fixes: build exit 0 · **26/26**
> tests (16 filter + 10 draft) · 16 pages, 171 references, all resolving.

### 1.1 The quote draft is not persisted — plan §03d

**Status: RESOLVED 19 Aug 2026** · was: high · code

The plan says: *"Zustand shrinks to the quote draft alone — the one piece of state that is
genuinely ephemeral and cross-route. Add `persist` so a refresh mid-quote does not wipe a
half-filled form."*

- `zustand` is in `package.json` dependencies but is imported **0 times** in the repo.
- `components/quote/QuoteFlow.tsx` holds the entire flow in `useForm` + `useState`.
- No `localStorage` / `sessionStorage` / `persist` anywhere under `components/quote/`.

**Effect:** a refresh, a back-button press, or tapping a package link mid-flow to check a
hotel distance wipes every answer. That is the exact loss the plan called out, on the one
route where a lost draft costs a real enquiry.

**Fix:** a `persist`-wrapped store holding `{ values, step }`, with `skipHydration: true` so
the prerendered HTML and the first client render cannot disagree, rehydrated from an effect
in `QuoteFlow`, and cleared at the WhatsApp handoff.

**Done —** `components/quote/draft.ts`, wired into `QuoteFlow.tsx`.

- Restoration is a *shape* check, not Zod validation: a draft is legitimately
  half-filled, and `name: ''` would fail `min(2)`. Any field stored under the wrong
  type falls back to its default, so a corrupt or hand-edited payload degrades to a
  blank form instead of throwing on page load.
- Writes are gated on `isDirty`, so merely opening `/quote/?package=x` never leaves a
  draft behind and the next visit cannot claim to have restored answers nobody typed.
- A restored draft announces itself with a **Start over** control rather than silently
  refilling the form.
- Private-mode Safari exposes `localStorage` and throws on write; the store falls back
  to memory so the draft can never break the form it is protecting.
- 10 unit tests in `components/quote/draft.test.ts` cover the half-filled case, wrong
  types, `NaN`/`Infinity`, unknown sharing values, garbage payloads, unknown-key
  stripping, step clamping, and the save/clear round trip with no browser present.

---

### 1.2 `/quote/sent/` is built but unreachable

**Status: RESOLVED 19 Aug 2026** · was: medium · code

`app/quote/sent/page.tsx` exists, exports correct `robots: { index: false }` metadata, and
prerenders into `out/quote/sent/`. But nothing in the application links to it —
`grep -rn "quote/sent"` over `app/` and `components/` returns **zero** references.

The "Send on WhatsApp" button (`components/quote/QuoteFlow.tsx:88`) is an external anchor
that opens in a new tab, leaving the user parked on the review step of a form they just
submitted, with no confirmation and no next action.

**Fix:** on handoff, clear the draft and `router.push('/quote/sent/')` in the current tab.
The wa.me link still opens in its own tab, so the confirmation page becomes the natural
landing state — which is what the plan's `quote/sent/page.tsx  confirmation` line intends.

**Done —** `handOff()` in `QuoteFlow.tsx`. Clearing the draft and navigating are the same
action, so a completed enquiry cannot be offered back as an unfinished one later.

---

### 1.3 `npm run serve:out` is a broken script entry

**Status: RESOLVED 19 Aug 2026** · was: medium · tooling

`package.json:11` declares `"serve:out": "node scripts/serve-out.mjs"`.
**`scripts/serve-out.mjs` does not exist.** The command fails immediately.

This matters more than a typo normally would: the plan's Phase 0 acceptance criterion is
*"verified against a served `out/` rather than `next dev`. That distinction is exactly what
hid the bug in the first place."* `serve:out` is the command that manual check depends on.

**Fix:** write `scripts/serve-out.mjs`. `scripts/verify-export.mjs` already contains a
working static file server (lines 55–80) — lift it into a shared `scripts/static-server.mjs`
and have both entry points use it, rather than maintaining two copies.

**Done —** `scripts/static-server.mjs` now backs both entry points, so the automated gate
and the manual check can never disagree about what a static host would send.
`serve-out.mjs` refuses to start without an export, names the discovered nested package
route (where relative-path bugs surface), logs 404s live, and reports the count on exit.
`verify-export.mjs` output is unchanged after the refactor — still 16 pages, 171
references — which is the evidence the lift was behaviour-preserving.

---

## 2. Plan phases not started

### 2.1 Build-time image pipeline — plan §04, Phase 6

**Status: RESOLVED 19 Aug 2026** · was: high once photography lands

Plan: *"Own the image pipeline. With the optimizer gone, resize and encode at build time —
an `npm run images` step producing AVIF/WebP at a few widths, referenced with explicit
`sizes`."*

There is no `images` script in `package.json` and no encoder dependency. Because
`images.unoptimized: true` is correctly set, **nothing resizes anything** — the first real
1.5 MB Haram photograph that lands in `public/` ships to phones at full size.

The pipeline can and should be built before the photography arrives, so the assets drop into
a working step instead of a missing one.

**Done —** `scripts/images.mjs` (`npm run images`, now first in the `verify` chain),
`data/images.generated.ts`, `components/ui/Photo.tsx`, `assets/photos/README.md`.

- `assets/photos/*` → AVIF + WebP at 400/800/1200/1600 plus a JPEG fallback, into
  `public/img/`. Sources live outside `public/` so originals are never downloadable.
- **A missing photo is a typecheck failure, not a 404.** `PackageImage.key` is typed
  as `ImageKey`, a union of the keys the pipeline actually produced. Naming an
  unprocessed photo fails `npm run typecheck` — the manifest is the only way in.
- Intrinsic width/height ride along in the manifest, so `<Photo>` reserves layout
  before the bytes arrive. That is the CLS budget (0.05) defended at the source.
- Nothing is upscaled; EXIF (GPS, camera serials) is stripped; re-encoding is
  incremental, so a re-run with nothing changed encodes zero.
- `sizes` is a required prop with no default — a wrong `sizes` silently downloads the
  wrong file, which is the exact cost the pipeline exists to remove.

**Verified end to end** against a synthetic 2400×1600 source: 9 variants emitted, the
manifest generated, `<picture>` present in the prerendered HTML with both srcsets, all
9 URLs resolving in the export check, and a second run encoding 0. The synthetic source
was then removed — a flat rectangle carrying alt text claiming to be the Haram has no
business in the repo.

### 2.1b The export verifier was not checking `<picture>` sources at all

**Status: RESOLVED 19 Aug 2026** · found while verifying 2.1 · **was silently degrading the gate**

Building the pipeline exposed a defect in the gate itself. `extractRefs()` matched
`srcset` case-sensitively, but React serialises the JSX prop as `srcSet`. HTML attribute
names are case-insensitive so browsers never cared — and the regex matched nothing.

Every AVIF and WebP URL in every `<picture>` went unchecked while the gate reported
success. The count gave it away: adding one photograph moved the reference total by
**+1** (the `<img>` fallback alone) where it should have moved by +9.

**Fix:** case-insensitive patterns. The same photograph now counts 171 → 180.

This is precisely the failure mode the script was written to catch — a green check over
an unverified asset — reproduced inside the checker. Worth remembering that the gate is
code too, and nothing was checking *it*.

### 2.1c The prerendered listing page contains no package links

**Severity: high · SEO · open — found 19 Aug 2026**

`PackageListing` is a client component (it reads filters from `useSearchParams`), so
`app/packages/page.tsx` wraps it in `<Suspense>`. Under `output: 'export'` that means the
**fallback** is what gets prerendered — and the fallback is a skeleton.

Measured on the built export:

| Page | Package links in static HTML |
|---|---|
| `out/packages/index.html` — the listing | **0** |
| `out/index.html` — home, 3 featured cards | 3 |

So three of the six packages have no static inbound link anywhere on the site. They are
in `sitemap.xml` and each prerenders to its own document, so they are not invisible — but
internal linking is a real ranking signal, and "the listing page" is the natural landing
surface for exactly the comparison queries this site is meant to win. It is also the page
a crawler reaches first from the nav.

**Fix:** make the Suspense fallback the complete unfiltered catalogue rather than a
skeleton. It is prerendered, so crawlers and no-JS visitors get all six cards, and the
client component takes over with filters applied on hydration. Roughly the same work as
the skeleton it replaces — but it is a visible change to what appears during load, so it
is worth deciding deliberately rather than folding into another task.

### 2.1d Detail pages have no photography slot

**Severity: medium · open — found 19 Aug 2026**

`PackageCard` is the only consumer of `images[]`. `app/packages/[slug]/page.tsx` renders
no photograph at all — so on the page where someone actually decides, the strongest trust
signal the plan identifies has nowhere to go. Worth designing before the photography
lands, not after.

### 2.2 Seasonal landing pages — Phase 6

**Severity: low · not started**

`departureMonths` exists on every package and `SeasonalBanner` already deep-links into a
filtered listing, so the data layer is ready. The routes themselves are not built.

### 2.3 Lighthouse and axe passes — Phase 6 acceptance

**Severity: high · never run**

Phase 6's done-when is *"Lighthouse ≥95 across the board on the listing and a detail page,
and axe reports zero violations."* Neither tool has been run against this build.

### 2.4 Three of the four launch numbers are unverified

Plan: *"pin it to four numbers before starting, so the claim can be verified rather than
argued."*

| Target | Status |
|---|---|
| Every package indexable as its own static document | **verified** — 6 package routes prerendered, unique metadata, `TouristTrip` + `Offer` JSON-LD |
| LCP under 2 s on throttled 4G | not measured |
| CLS under 0.05 | not measured |
| Zero WCAG AA failures | palette contrast is enforced by `scripts/palette.mjs`; the full page-level AA pass has not been run |

---

## 3. Content blockers — 9 `TODO(client)` markers

These are the plan's §06 questions. They are deliberately conspicuous rather than plausible,
which is right — but three of them are currently **leaking into the built output**, verified
by reading `out/`:

| # | What | Where | Leaks into `out/` |
|---|---|---|---|
| 1 | Real site URL | `data/site.ts:16` — `https://example.invalid` | **yes** — every `<loc>` in `sitemap.xml`, the `Sitemap:` line in `robots.txt`, and every canonical tag |
| 2 | WhatsApp business number | `data/site.ts:20` — `000000000000` | **yes** — every `wa.me/000000000000` link, i.e. the primary conversion path is a dead link |
| 3 | Phone / email / address | `data/site.ts:22–25` | **yes** — footer, contact page, `/quote/sent/` |
| 4 | Social handles | `data/site.ts:38` — empty | no (empty handles are omitted, by design) |
| 5 | Accreditation credentials + artwork | `data/trust.ts:27` — array intentionally empty | no — `TrustRow` renders nothing while empty |
| 6 | Package photography | `data/packages.ts` — all 6 `images: []` | no — khatam placeholder renders instead |
| 7 | FAQ answers vs current Saudi policy | `data/faqs.ts:1` | text ships as written |
| 8 | Company story / founding year | `app/about/page.tsx:16` | text ships as written |
| 9 | Logo SVG | `components/layout/Navbar.tsx:55` | inline mark renders meanwhile |

**Also unresolved from §06 but not marked in code:**

- Real per-person prices, and which seasons have actual allocation.
- Hotel allocation confirmed against current contracts — names and distances are real but
  unverified.
- Arabic/Urdu scope. The build implements element-level `lang="ar"` accents only, which is
  the cheap option the plan assumed. A mirrored RTL locale or an Urdu translation would be a
  re-architecture of the layout primitives, not an addition — so it has to be decided before
  more components are written, not after.

---

## 4. Minor

- **No site-level `Organization` / `TravelAgency` JSON-LD.** `TravelAgency` appears only
  nested as `provider` inside the package schema (`app/packages/[slug]/page.tsx:68`). About
  and Contact carry no structured data at all.
- **`app/sitemap.ts` emits no `lastModified`.** Harmless, but it is free signal.
- **README overstates precision.** It says *"Matches the build plan's file tree 1:1 — 36/36
  files"* while there are 54 source files. The extras (`data/site.ts`, `lib/cn.ts`,
  `ComparisonTable`, `SeasonalBanner`, `PackageListing`, `not-found.tsx`, `tokens.css`,
  `layout/Navbar`, `layout/Footer`, `quote/schema.ts`) are each justified by the plan's own
  prose — the file tree in §04 is simply abbreviated. The count is what is wrong, not the work.
- ~~**`package.json` has no `"type": "module"`,** so every `npm run test` prints a
  `MODULE_TYPELESS_PACKAGE_JSON` warning before the results.~~ **Resolved 19 Aug 2026** —
  `"type": "module"` set; the gate now reads clean. The test glob also widened to
  `components/**/*.test.ts` so colocated component tests are picked up.

---

## 5. Confirmed working

Recorded so this register is not mistaken for a list of everything outstanding.

- All three of the base repo's defects are fixed and **proven** fixed, not assumed:
  `output: 'export'` + `trailingSlash` + `images.unoptimized` are all set
  (`next.config.ts:15–17`); `verify-export.mjs` serves `out/` and resolves 171 references
  across 16 pages, including relative paths resolved against their own page — the exact
  failure mode that broke `src="menu.svg"` on nested routes.
- The palette is generated, not hand-written, and `npm run palette` fails the build on a
  contrast regression.
- Filters live in `searchParams` behind a `Suspense` boundary; 16 unit tests cover the pure
  filter/URL functions with no React involved, including the query-string round trip and
  malformed-input degradation.
- The quote form is a genuine rewrite, not a port: one `useForm`, Zod per step, `trigger()`
  gating — no `requestSubmit()`, no `setTimeout` race.
- Zoom is not locked (`app/layout.tsx:50`), and `next/font` self-hosts all three faces.

---

## Suggested order

1. ~~**1.3** `serve:out`~~ — **done 19 Aug 2026.**
2. ~~**1.1 + 1.2** draft persistence and the confirmation handoff~~ — **done 19 Aug 2026.**
   No plan-level code gaps remain.
3. ~~**2.1** image pipeline~~ — **done 19 Aug 2026**, along with **2.1b**, the verifier
   blind spot it exposed.
4. **2.1c** the listing page prerendering no package links — the highest-value item still
   open, and it is a small change. ← next
5. **3** client content — #1 and #2 are what make the site non-functional in production,
   rather than merely incomplete.
6. **2.1d** detail-page photography slot, then **2.2** seasonal pages.
7. **2.3** Lighthouse and axe, once real images and copy are in, since both change the numbers.

## Still unverified after the 19 Aug fixes

Stated plainly so it is not mistaken for tested behaviour. The draft store's logic is
covered by unit tests and the export gate is green, but three things are browser
behaviours that neither can prove:

- that a real refresh mid-flow restores the answers,
- that rehydration produces no React hydration warning in practice (the prerendered
  `/quote/index.html` contains no draft state, which is the precondition, not the proof),
- that the wa.me tab opens *and* the original tab reaches `/quote/sent/`, on iOS Safari
  in particular, where popup handling is strictest.

`npm run build && npm run serve:out` is the check. It belongs in the same pass as **2.3**.
