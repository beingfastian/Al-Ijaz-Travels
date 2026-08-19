import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  applyFilters,
  filterBounds,
  filtersFromSearchParams,
  isDefaultFilters,
  matchesFilters,
  searchParamsFromFilters,
  sortPackages,
} from './filter.ts';
import { DEFAULT_FILTERS, type Package, type PackageFilters } from './types.ts';

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
