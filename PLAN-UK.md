# Al Ijaz Travel — UK build plan

**Written 20 Aug 2026.** Supersedes the Pakistan-market scope in `../al-ijaz-build-plan.html`.
Target: match `alhabibtravel.co.uk` page-for-page, on our own UI, for the UK market.

Companion documents:
- `GAPS.md` — running register of open items, with stable IDs
- `README.md` — how the repo works

---

## 1. What actually changed

| | Before | Now |
|---|---|---|
| Market | Pakistan | **United Kingdom** |
| Currency | PKR (`285,000`) | **GBP (`£1,095`)** |
| Pages | 16 | **~250** |
| Departures | not modelled | **6 UK airports** |
| Regulation | none | **ATOL / Package Travel Regulations 2018** |
| Competitor | Al Habib, as a reference | Al Habib, as a **parity target** |

The UI, design system, component library, image pipeline, export verifier and quote flow
all carry over. The **content model and routing layer are rebuilt.**

---

## 2. The page map, measured

Taken from their `sitemap.xml` on 20 Aug 2026 — counted, not estimated.

| Group | Count | Route shape |
|---|---|---|
| Top level | 8 | `/`, `/packages`, `/monthly-packages`, `/city-packages`, `/ramadan-umrah-packages`, `/blog`, `/terms-and-conditions`, `/privacy-policy` |
| Tier hubs | 3 | `/packages/{3,4,5}-star` |
| Package detail (base) | 15 | `/packages/[tier]/[n]-nights-[tier]-umrah-package` — 3 tiers × 5 durations |
| **Package detail (month)** | **179** | `/packages/[tier]/[n]-nights-[tier]-[month]-umrah-package` — 3 × 5 × 12 |
| Month hubs | 12 | `/monthly-packages/[month]-umrah-packages` |
| City hubs | 14 | `/city-packages/[city]-umrah-packages` |
| Blog posts | 12 | `/blog/[slug]` |
| **Sitemap total** | **~243** | |
| Footer-only pages | 7 | About, Contact, Travel Insurance, Payment Security, Our Responsibility, assurance page, Download |
| **Site total** | **~250** | |

### The thing that matters

**179 of those 243 URLs are one template.** `tier × nights × month` is a loop, not a
workload. The entire site is roughly **ten** page templates driven by a data model —
which is exactly what `generateStaticParams` is built for, and exactly how we already
generate package detail pages today.

So "250 pages" is a data problem, not a 250-page build.

---

## 3. Architecture

```
app/
  page.tsx                                          home
  packages/
    page.tsx                                        all packages hub
    [tier]/page.tsx                                 3 tier hubs
    [tier]/[slug]/page.tsx                          194 detail pages (base + month)
  monthly-packages/
    page.tsx  [month]/page.tsx                      1 + 12
  city-packages/
    page.tsx  [city]/page.tsx                       1 + 6 (see 5.3)
  ramadan-umrah-packages/page.tsx
  visa/page.tsx                                     NEW — Umrah / ETA / Tourist
  blog/
    page.tsx  [slug]/page.tsx                       1 + 12
  about/ contact/ faq/ quote/ quote/sent/           carried over
  terms-and-conditions/ privacy-policy/
  travel-insurance/ payment-security/ our-responsibility/
  sitemap.ts  robots.ts

data/
  tiers.ts        3 | 4 | 5 with positioning copy
  durations.ts    7, 8, 10, 12, 14, 20, 21 nights
  months.ts       12 months + seasonal notes, Ramadan/Hajj dates
  airports.ts     the 6 UK departure points
  cities.ts       city -> airport mapping, local copy
  hotels.ts       canonical hotel registry (carried over, re-costed)
  packages.ts     generated matrix + hand-authored overrides
  blog/           12 MDX or structured articles
  visa.ts         the three visa types
```

### The one type everything hangs off

```ts
type Package = {
  tier: 3 | 4 | 5
  nights: { makkah: number; madinah: number }
  month?: MonthKey                 // absent = the evergreen base package
  price: { gbp: number; basis: 'per person'; sharing: 'quad'|'triple'|'double' }
  hotels: { city: 'makkah'|'madinah'; hotelId: string; nights: number }[]
  departures: AirportCode[]        // which of the 6 this is bookable from
  inclusions: string[]             // Flight · Visa · Transport · Accommodation
  exclusions: string[]             // Meals · Insurance
  atolProtected: boolean           // drives the badge — never hardcode true
}
```

`price.gbp` as an integer of pounds. `distanceToHaramM` stays the highest-leverage
field in the model, exactly as before — it is what pilgrims actually compare, and Al
Habib already leads with it (`200m from Haram`).

---

## 4. Three things I need to flag before we build

### 4.1 ATOL is a legal matter, not a badge — **blocking for launch**

Al Habib displays **"ATOL Protected"** and **"IATA Registered"**. In the UK, selling
flight-inclusive package holidays without an ATOL is a **criminal offence** under the
Civil Aviation (ATOL) Regulations, and displaying an ATOL logo or number you do not hold
is separately actionable by the CAA.

I will build the badge component and the data slot. **I will not populate it.** Same rule
as the old `data/trust.ts`: a credential you do not hold is a liability, not a design
detail.

You also fall under the **Package Travel and Linked Travel Arrangements Regulations 2018**
once you sell flight + hotel together, which mandates specific pre-contract disclosures.
The Terms page has to reflect that. **Have a solicitor review it** — I will draft
structure and plain-English content, but I am not the right source for the binding text.

### 4.2 179 near-duplicate pages is an SEO risk, not a free win

`10-nights-5-star-january-umrah-package` and `...-february-...` will differ by a month
name and a price. Google's guidance on scaled content and doorway pages targets exactly
this shape, and the risk landed on thin programmatic pages, not on the technique itself.

Al Habib doing it is not evidence it works for them — we cannot see their rankings.

**My recommendation, and what the plan assumes:** build the full matrix, but earn each
page. Every month page carries genuinely month-specific content — real seasonal pricing,
Ramadan and Hajj date windows, UK school-holiday overlap, Makkah weather, crowd levels.
Where we cannot differentiate a variant, it gets `<link rel="canonical">` to its base
package instead of standing alone. That gets the coverage without the spam signature.

**Say the word if you would rather copy their structure exactly** and I will build all 179
as standalone indexable pages. It is your call — I want the reasoning on record either way.

### 4.3 "Scotland" is not an airport

Your list: London, Manchester, Birmingham, Newcastle, Glasgow, **Scotland**. Glasgow is
*in* Scotland, so that last entry is ambiguous. Most likely you mean **Edinburgh** —
Al Habib runs a separate Edinburgh city page, and it is the obvious second Scottish
departure point. Aberdeen is the other candidate.

**Assumption until you correct me: Edinburgh.** Trivial to change — it is one line in
`data/airports.ts`.

Also worth deciding: Al Habib has **14** city pages; you have given me **6** airports.
I am building city pages for the 6 we actually fly from, because a Leeds page that routes
you to Manchester is a page that cannot answer its own question. The template scales to 14
the moment you add airports.

---

## 5. Build order

Ten chunks. Each one ends in something you can look at, and nothing gets built twice.
Estimates assume the existing design system carries over — which it does.

---

### Chunk 0 — Re-scope the foundation · ~0.5 day · **DONE 20 Aug 2026**

Currency and market change before anything is built on top of them.

- `lib/format.ts`: `formatPkrCompact` → `formatGbp`. `£1,095`, not `£1095.00`.
- `data/site.ts`: UK company details, `en-GB` locale, GBP throughout.
- JSON-LD `priceCurrency` → `GBP`. `TravelAgency` → UK address schema.
- Delete the 6 PKR packages. They are the wrong market and wrong currency; keeping them
  as "examples" would leak into a build.
- `data/airports.ts` — the 6 departure points, with IATA codes and served cities.

~~**Done when:** `npm run verify` is green with an empty catalogue.~~ **This criterion was
wrong.** Next refuses an empty `generateStaticParams()` under `output: 'export'` — *"at
least one route must be generated"* — so an empty catalogue is not a buildable state and
Chunks 0 and 1 have to land together. Corrected and done.

**Delivered:** `formatGbp` / `formatPriceFrom` (`£1,095`, no pence), `en-GB` throughout,
`priceCurrency: 'GBP'`, `<html lang="en-GB">`, `data/airports.ts` with the six departure
points, UK company and accreditation slots in `data/site.ts`, and the new three-tier
navigation. The six PKR packages were deleted, not converted.

---

### Chunk 1 — Content model and the generated matrix · ~1.5 days · **DONE 20 Aug 2026**

The heart of the rebuild. Everything downstream reads from this.

- `tiers.ts`, `durations.ts`, `months.ts`, `cities.ts`, `hotels.ts`
- The generator: `tier × nights` → 15 base packages; `× month` → 179 variants
- Hand-authored overrides so a specific package can depart from the generated defaults
- Canonical policy from 4.2 encoded in data, not scattered through templates
- Unit tests in `lib/` for the generator, the canonical rules, and price bounds

**Done when:** the matrix generates the full set, unit tests pass with no React involved,
and every generated slug matches the URL shape in §2. **All met.**

**Count correction: 195, not 194.** Al Habib publishes 179 month variants because their
October 5-star set is missing its 21-night page — that reads as an oversight, not a
decision, and reproducing an accidental gap would be silly. We generate the complete
3 × 5 × 12 = 180, plus 15 evergreen.

**Delivered:** `data/tiers.ts`, `data/durations.ts`, `data/months.ts`, `lib/catalogue.ts`,
and 15 unit tests in `lib/catalogue.test.ts`.

Two things in there worth knowing:

- **Pricing splits fixed from per-night cost.** A flight does not get cheaper on a shorter
  trip, so a flat per-night model prices 7-night packages visibly wrong. There is a test
  asserting 14 nights costs less than double 7 nights.
- **`atolProtected` can never be `true` from the generator**, and a test enforces it. It
  has to come from real accreditation data, because it is a legal claim.

**Measured after this chunk:** 205 pages, 2,250 asset references all resolving, 41 unit
tests, full `npm run verify` in **1m17s** — comfortably inside the 3-minute build budget
set in Chunk 10.

---

### Chunk 2 — Luxury design system uplift · ~2 days · **DONE 20 Aug 2026**

You asked for a luxurious feel. That is mostly restraint, contrast and typography — not
more decoration.

- Keep the OKLCH engine and contrast gate; extend the palette with deeper greens, a
  warmer gold, and a true near-black for premium surfaces
- Add a display serif for hero and section headings; tighten the type scale
- Elevation and edge treatment: hairline gold rules, generous whitespace, 8-point khatam
  used sparingly as texture rather than pattern
- **Motion system** — a single `lib/motion.ts` with named, reusable variants so animation
  is consistent rather than per-component improvisation. Scroll-reveal, staggered card
  entrances, parallax hero, animated counters, page transitions. All CSS/Web Animations
  where possible; every one gated behind `prefers-reduced-motion`.
- **New logo** — the Nabawi-to-Kaaba flight path idea, drawn properly as an SVG mark plus
  a wordmark lockup, in light and dark variants

**Done when:** a specimen page renders every token, type step, elevation and motion
variant; no text pairing falls below 4.5:1; the whole page is still calm with motion off.

---

### Chunk 3 — Photography · ~1 day · **DONE 20 Aug 2026**

The visual argument. The pipeline already exists (`npm run images`).

- Source from **Unsplash and Pexels only** — their licences permit commercial use.
  Competitor images are copyrighted and are not an option.
- Makkah, Madinah, Haram at night, Nabawi green dome, Kaaba, Zamzam, ihram, hotel
  interiors, UK airport departure
- Run through the pipeline: AVIF + WebP at 4 widths, EXIF stripped, keys typed
- Art direction: consistent grade so the set reads as one commissioned shoot

**Done when:** every template has real photography, `npm run images` is deterministic,
and the licence for each file is recorded in `assets/photos/CREDITS.md`.

---

### Chunk 4 — Home · ~2 days · **DONE 20 Aug 2026**

The page that carries the whole "better than Al Habib" claim.

Hero with the animated flight path · airport picker · featured tiers · trust row (ATOL
slot, empty until 4.1 resolves) · distance-led comparison table · process · testimonials ·
FAQ · seasonal Ramadan banner.

**Done when:** it holds up beside `alhabibtravel.co.uk` on a real phone, and LCP is under
2 s on throttled 4G with real photography loaded.

---

### Chunk 5 — Packages: hub, tiers, detail · ~2.5 days · **DONE 20 Aug 2026**

- `/packages` with URL-driven filters (tier, nights, month, airport, price)
- 3 tier hubs with genuine positioning copy per tier
- 194 detail pages: hotel cards leading on walking distance, itinerary timeline,
  inclusions and exclusions at equal weight, transfer details, sticky price rail,
  per-page `TouristTrip` + `Offer` JSON-LD
- Canonical rules from 4.2 applied

**Done when:** every package prerenders to its own document with unique title,
description and canonical; a filtered URL restores exactly on a cold load; the listing
prerenders its catalogue (the `2.1c` fix, carried forward).

---

### Chunk 6 — Monthly, city and Ramadan hubs · ~1.5 days · **DONE 20 Aug 2026**

- 12 month pages with real seasonal content — pricing, weather, crowds, school holidays
- 6 city pages, each naming its actual airport and routing honestly
- Ramadan page with the last-ten-nights emphasis Al Habib leads on

**Done when:** no two hub pages share a paragraph of body copy, and each links into a
correctly pre-filtered listing.

---

### Chunk 7 — Visa page (new) · ~0.5 day · **DONE 20 Aug 2026**

Not in Al Habib's map — your addition, and a genuine differentiator.

- **Umrah Visa** — eligibility, documents, processing time, what we handle
- **Saudi ETA** — who qualifies, cost, validity, how it differs from an Umrah visa
- **Tourist Visa** — when it is the right route, and when it is not

Comparison table, eligibility checker, `FAQPage` JSON-LD. Every claim dated and sourced,
because visa rules change and stale visa advice damages trust worse than none.

**Done when:** the three routes are distinguishable at a glance, and every factual claim
carries a "checked on" date.

---

### Chunk 8 — Blog · ~2 days

12 articles matching their topic map — Umrah cost from the UK, visa cost, step-by-step
guide, Hajj vs Umrah, how long Umrah takes, what a package includes, Ramadan explained.

- MDX or structured content, `Article` JSON-LD, reading time, related posts
- These are their top organic entry points. Thin copies will not outrank them; each needs
  to be genuinely better — more specific, better structured, honestly sourced.

**Done when:** each post is substantive and internally links to the relevant packages.

---

### Chunk 9 — Legal, trust and conversion · ~1.5 days

- Terms and Conditions, Privacy Policy (UK GDPR), Travel Insurance, Payment Security,
  Our Responsibility, booking-conditions download
- ATOL and Package Travel Regulations disclosures — **structure drafted by me, binding
  text reviewed by your solicitor**
- Cookie consent if any analytics are added
- Quote flow updated: airport selection, GBP, tier and month prefill; WhatsApp handoff
  once you supply the number

**Done when:** every regulatory disclosure has a home, and nothing claims a credential
you do not hold.

---

### Chunk 10 — Verification · ~1.5 days

- Browser harness: Playwright against installed Chrome
- axe across every template; keyboard-only run through the quote flow
- Lighthouse ≥95 on home, a hub and a detail page
- Export check across ~250 pages — expect a few thousand asset references
- Build-time budget: keep a full build under 3 minutes

**Done when:** the four launch numbers are measured, not asserted — LCP under 2 s on
throttled 4G, CLS under 0.05, zero WCAG AA failures, every package its own indexable
document.

---

## 6. Totals

| | |
|---|---|
| Chunks | 11 (0–10) |
| Estimate | **~16.5 days** of build |
| Pages produced | ~250 |
| Templates written | ~10 |
| Carried over | design system, image pipeline, export verifier, quote flow, filter logic |

---

## 7. Open decisions

### Decided 20 Aug 2026

| # | Question | **Decision** |
|---|---|---|
| **D1** | "Scotland" — Edinburgh or Aberdeen? | **Edinburgh** |
| **D2** | All 179 month variants standalone, or canonicalised where thin? | **All 179 standalone**, matching Al Habib exactly |
| **D3** | 6 city pages or all 14? | **6**, matching real departures |
| **D4** | ATOL / IATA held? | **Yes** — numbers and artwork to follow |

**On D2.** I recommended canonicalising the thin variants; the call went the other way,
and that is the client's to make. Building all 179 as standalone indexable pages.

Within that decision I will still push every month page as far from its siblings as the
data allows — real seasonal pricing, Ramadan and Hajj windows, UK school-holiday overlap,
Makkah weather and crowd levels. That improves the chosen approach rather than quietly
reversing it, and it is the difference between 179 pages that earn their place and 179
that look automated.

**On D4.** Badge component, data slot and the Package Travel Regulations disclosures get
built ready to switch on. Nothing renders until the real numbers and artwork arrive — a
placeholder ATOL number is the one thing on this site that could draw a CAA enforcement
letter, so the slot stays empty rather than filled with something plausible.

### Still open

| # | Question | Assumption until answered |
|---|---|---|
| **D5** | Blog: 12 posts now or later? | **Chunk 8**, after the money pages |
| **D6** | Real GBP prices, or researched placeholders? | **Placeholders, clearly marked** |
| **D7** | UK address, company number, VAT number? | Blocks Chunk 9 |
| **D8** | WhatsApp number | Client supplying later |

---

## 8. What I would start now

**Chunk 0 → Chunk 1.** They are unblocked apart from D1 and D3, and every other chunk
depends on the data model landing first. That is roughly two days to a generated
194-package catalogue with tests, at which point the shape of the whole site is visible
and the remaining chunks are largely presentation.
