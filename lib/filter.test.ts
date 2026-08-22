import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  applyFilters,
  filterBounds,
  topStop,
  sliderHasUsefulResolution,
  PRICE_STEP_GBP,
  DISTANCE_STEP_M,
  DISTANCE_MIN_M,
  filtersFromSearchParams,
  isDefaultFilters,
  matchesFilters,
  searchParamsFromFilters,
  sortPackages,
} from './filter.ts';
import { DEFAULT_FILTERS, type Package, type PackageFilters } from './types.ts';
// The REAL 195-package catalogue, not the three-package fixture below. The
// slider-resolution tests are only meaningful against live prices: the bug they
// guard was a step that suited the old rupee figures and was larger than the
// entire GBP span.
import { buildCatalogue } from './catalogue.ts';

/** Minimal package factory — only the fields the filters read. */
function pkg(over: Partial<Package> & { slug: string }): Package {
  return {
    name: over.slug,
    summary: '',
    tier: 4,
    nights: { makkah: 4, madinah: 3 },
    price: { gbp: 300_000, perPerson: true, sharing: 'quad' },
    hotels: [{ city: 'makkah', name: 'H', stars: 4, distanceToHaramM: 500 }],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    departureMonths: ['february'],
    departures: ['LHR', 'MAN'],
    atolProtected: false,
    images: [],
    ...over,
  };
}

const filters = (over: Partial<PackageFilters> = {}): PackageFilters => ({
  ...DEFAULT_FILTERS,
  ...over,
});

const CATALOGUE: Package[] = [
  pkg({
    slug: 'cheap-far',
    tier: 3,
    price: { gbp: 250_000, perPerson: true, sharing: 'quad' },
    hotels: [{ city: 'makkah', name: 'Far', stars: 3, distanceToHaramM: 1400 }],
    nights: { makkah: 6, madinah: 4 },
    departureMonths: ['2027-02', '2027-04'],
  }),
  pkg({
    slug: 'mid-close',
    tier: 4,
    price: { gbp: 465_000, perPerson: true, sharing: 'triple' },
    hotels: [{ city: 'makkah', name: 'Near', stars: 4, distanceToHaramM: 300 }],
    nights: { makkah: 8, madinah: 6 },
    departureMonths: ['2027-02'],
  }),
  pkg({
    slug: 'premium-closest',
    tier: 5,
    price: { gbp: 745_000, perPerson: true, sharing: 'double' },
    hotels: [{ city: 'makkah', name: 'Closest', stars: 5, distanceToHaramM: 120 }],
    nights: { makkah: 6, madinah: 4 },
    departureMonths: ['ramadan-2027'],
  }),
];

test('bounds are derived from the catalogue, not hardcoded', () => {
  const b = filterBounds(CATALOGUE);
  assert.equal(b.minPriceGbp, 250_000);
  assert.equal(b.maxPriceGbp, 745_000);
  assert.equal(b.minNights, 10);
  assert.equal(b.maxNights, 14);
  assert.equal(b.maxDistanceM, 1400);
});

test('empty catalogue yields zeroed bounds rather than Infinity', () => {
  // Math.min() of an empty spread returns Infinity, which would render as
  // "Up to £Infinity" on the slider label.
  const b = filterBounds([]);
  assert.equal(b.maxPriceGbp, 0);
  assert.equal(b.minNights, 0);
});

test('no filters matches everything', () => {
  assert.equal(applyFilters(CATALOGUE, filters()).length, 3);
});

test('tier filter is a union, not an intersection', () => {
  const out = applyFilters(CATALOGUE, filters({ tiers: [3, 5] }));
  assert.deepEqual(
    out.map((p) => p.slug),
    ['cheap-far', 'premium-closest']
  );
});

test('price ceiling is inclusive', () => {
  assert.ok(matchesFilters(CATALOGUE[1]!, filters({ maxPriceGbp: 465_000 })));
  assert.ok(!matchesFilters(CATALOGUE[1]!, filters({ maxPriceGbp: 464_999 })));
});

test('distance filter measures Makkah only, never the flattering city', () => {
  const multi = pkg({
    slug: 'multi',
    hotels: [
      { city: 'makkah', name: 'Far', stars: 4, distanceToHaramM: 1200 },
      { city: 'madinah', name: 'Close', stars: 4, distanceToHaramM: 150 },
    ],
  });

  // "Within 200 m of the Haram" means Masjid al-Haram, in Makkah. This package
  // is 1,200 m from it. Taking the minimum across both cities — which is what
  // this did until a screenshot showed a card claiming "500 m from the Haram"
  // for a package whose Makkah hotel was 1,400 m away — would match it here on
  // the strength of a Madinah hotel, and Madinah's mosque is not the Haram.
  assert.ok(!matchesFilters(multi, filters({ maxDistanceM: 200 })));
  assert.ok(matchesFilters(multi, filters({ maxDistanceM: 1200 })), 'inclusive at the boundary');
});

test('a package with only a Madinah hotel cannot satisfy a Haram distance filter', () => {
  const madinahOnly = pkg({
    slug: 'madinah-only',
    hotels: [{ city: 'madinah', name: 'Close', stars: 4, distanceToHaramM: 100 }],
  });
  assert.ok(!matchesFilters(madinahOnly, filters({ maxDistanceM: 500 })));
});

test('airport filter matches only packages that actually depart from it', () => {
  const regional = pkg({ slug: 'regional', departures: ['LHR', 'MAN', 'BHX', 'NCL', 'GLA', 'EDI'] });
  const longStay = pkg({ slug: 'long', departures: ['LHR', 'MAN', 'BHX'] });

  assert.ok(matchesFilters(regional, filters({ airport: 'NCL' })));
  assert.ok(
    !matchesFilters(longStay, filters({ airport: 'NCL' })),
    'a 20-night package does not run from Newcastle, and the filter must not pretend otherwise'
  );
  assert.ok(matchesFilters(longStay, filters({ airport: 'LHR' })));
});

test('an unknown airport code clears the filter rather than matching nothing', () => {
  // Showing the whole catalogue is recoverable; showing an empty listing reads as
  // "this agency has no packages", which is the worse failure by a distance.
  const p = new URLSearchParams('airport=XYZ');
  assert.equal(filtersFromSearchParams(p).airport, null);

  const lower = new URLSearchParams('airport=man');
  assert.equal(filtersFromSearchParams(lower).airport, 'MAN', 'case is normalised');
});

test('a package with no hotel data is excluded by a distance filter', () => {
  const noHotels = pkg({ slug: 'none', hotels: [] });
  assert.ok(!matchesFilters(noHotels, filters({ maxDistanceM: 5000 })));
  // ...but is not excluded when no distance filter is applied.
  assert.ok(matchesFilters(noHotels, filters()));
});

test('nights bounds are inclusive on both ends', () => {
  const out = applyFilters(CATALOGUE, filters({ minNights: 10, maxNights: 10 }));
  assert.deepEqual(
    out.map((p) => p.slug).sort(),
    ['cheap-far', 'premium-closest']
  );
});

test('month filter matches any listed departure', () => {
  assert.equal(applyFilters(CATALOGUE, filters({ month: '2027-04' })).length, 1);
  assert.equal(applyFilters(CATALOGUE, filters({ month: 'ramadan-2027' })).length, 1);
  assert.equal(applyFilters(CATALOGUE, filters({ month: '2029-01' })).length, 0);
});

test('sorts do not mutate the input array', () => {
  const original = CATALOGUE.map((p) => p.slug);
  sortPackages(CATALOGUE, 'price-desc');
  assert.deepEqual(
    CATALOGUE.map((p) => p.slug),
    original
  );
});

test('distance sort puts packages without hotel data last', () => {
  const withNone = [...CATALOGUE, pkg({ slug: 'no-hotels', hotels: [] })];
  const out = sortPackages(withNone, 'distance-asc');
  assert.equal(out.at(-1)!.slug, 'no-hotels');
  assert.equal(out[0]!.slug, 'premium-closest');
});

/* ------------------------------------------------------------------ URL state */

test('filters survive a round trip through the query string', () => {
  const original = filters({
    tiers: [4, 5],
    minNights: 7,
    maxPriceGbp: 500_000,
    maxDistanceM: 400,
    month: '2027-02',
    sort: 'distance-asc',
  });
  const restored = filtersFromSearchParams(new URLSearchParams(searchParamsFromFilters(original)));
  assert.deepEqual(restored, original);
});

test('defaults produce a clean URL with no empty params', () => {
  assert.equal(searchParamsFromFilters(DEFAULT_FILTERS), '');
});

test('malformed URL params degrade to defaults instead of throwing', () => {
  const restored = filtersFromSearchParams(
    new URLSearchParams('tier=9,abc&maxPrice=-5&minNights=three&sort=nonsense&month=')
  );
  assert.deepEqual(restored.tiers, []);
  assert.equal(restored.maxPriceGbp, null);
  assert.equal(restored.minNights, null);
  assert.equal(restored.month, null);
  assert.equal(restored.sort, DEFAULT_FILTERS.sort);
});

test('duplicate and unsorted tiers are normalised', () => {
  const restored = filtersFromSearchParams(new URLSearchParams('tier=5,3,5'));
  assert.deepEqual(restored.tiers, [3, 5]);
});

test('isDefaultFilters ignores sort order', () => {
  assert.ok(isDefaultFilters(filters({ sort: 'price-desc' })));
  assert.ok(!isDefaultFilters(filters({ tiers: [5] })));
});

/* ------------------------------------------------------- slider control bounds */

/**
 * These three tests exist because of a real, shipped fault, not a hypothetical.
 *
 * The price slider carried `step={5000}` — correct when this catalogue was priced
 * in rupees, nonsense once it moved to GBP. The entire price span is £3,885, so a
 * 5,000 step left the control with exactly ONE reachable value: the minimum. The
 * browser clamped the thumb to the far left while the label beside it read "Up to
 * £4,515", so the panel contradicted itself on screen, and the only thing a
 * visitor could ask for was packages under £630.
 *
 * Nothing caught it. It is not a type error, axe has no opinion on it, and a
 * screenshot looks like a slider at its minimum rather than a broken one. These
 * assertions run against the real catalogue bounds, so if the pricing shifts by
 * an order of magnitude again the test fails instead of the customer.
 */

test('price slider step gives the control real resolution against live bounds', () => {
  const b = filterBounds(buildCatalogue());
  assert.ok(
    sliderHasUsefulResolution(b.minPriceGbp, b.maxPriceGbp, PRICE_STEP_GBP),
    `price step ${PRICE_STEP_GBP} over a span of ${b.maxPriceGbp - b.minPriceGbp} ` +
      `leaves only ${Math.floor((b.maxPriceGbp - b.minPriceGbp) / PRICE_STEP_GBP) + 1} positions`
  );
});

test('distance slider step gives the control real resolution against live bounds', () => {
  const b = filterBounds(buildCatalogue());
  assert.ok(
    sliderHasUsefulResolution(DISTANCE_MIN_M, b.maxDistanceM, DISTANCE_STEP_M),
    `distance step ${DISTANCE_STEP_M} over a span of ${b.maxDistanceM - DISTANCE_MIN_M}`
  );
});

test('topStop returns the highest value a range input can actually reach', () => {
  // Span divides evenly: the max is reachable.
  assert.equal(topStop(100, 1400, 50), 1400);
  // Span does not divide evenly: the max is NOT reachable, and this is the point.
  assert.equal(topStop(630, 4515, 25), 4505);
  assert.equal(topStop(0, 10, 3), 9);
  // Degenerate inputs must not produce NaN or Infinity for a `value` prop.
  assert.equal(topStop(0, 0, 25), 0);
  assert.equal(topStop(500, 100, 25), 500);
  assert.equal(topStop(100, 200, 0), 100);
});

test('a slider parked at its top stop reads as "no filter", not as a filter at max', () => {
  // The regression this guards: comparing against `max` rather than the top stop
  // means dragging fully right leaves maxPrice pinned one step below the most
  // expensive package, so the dearest package vanishes and "Clear all" never
  // goes away — with the thumb sitting hard right, looking untouched.
  const live = buildCatalogue();
  const b = filterBounds(live);
  const top = topStop(b.minPriceGbp, b.maxPriceGbp, PRICE_STEP_GBP);
  assert.ok(top < b.maxPriceGbp, 'this catalogue is the case where max is unreachable');

  const atTop = applyFilters(live, { ...DEFAULT_FILTERS, maxPriceGbp: null });
  assert.equal(atTop.length, live.length, 'null means unfiltered');

  const atTopStop = applyFilters(live, { ...DEFAULT_FILTERS, maxPriceGbp: top });
  assert.ok(
    atTopStop.length < live.length,
    'filtering AT the top stop does drop the dearest package — which is exactly why ' +
      'the control must report null there rather than the numeric value'
  );
});
