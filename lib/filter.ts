import {
  DEFAULT_FILTERS,
  makkahHaramDistanceM,
  totalNights,
  type AirportCode,
  type Package,
  type PackageFilters,
  type SortKey,
  type Tier,
} from './types.ts';

/**
 * Pure filter/sort/URL functions. No React, no store — so they can be unit tested
 * directly and reused by the listing page, the home page's featured strip, and any
 * seasonal landing page.
 *
 * Filter bounds are always DERIVED from the data (see `filterBounds`), never
 * hardcoded. The Tripix reference hardcodes `priceRange: [0, 500]` in USD, which
 * against GBP-denominated packages silently matches nothing at all.
 */

const SORT_KEYS: readonly SortKey[] = [
  'price-asc',
  'price-desc',
  'nights-desc',
  'distance-asc',
];

const VALID_TIERS: readonly Tier[] = [3, 4, 5];

/** Real min/max across the catalogue, for slider ends and sanity checks. */
export function filterBounds(packages: Package[]) {
  if (packages.length === 0) {
    return { minPriceGbp: 0, maxPriceGbp: 0, minNights: 0, maxNights: 0, maxDistanceM: 0 };
  }
  const prices = packages.map((p) => p.price.gbp);
  const nights = packages.map(totalNights);
  const distances = packages
    .map(makkahHaramDistanceM)
    .filter((d): d is number => d !== null);

  return {
    minPriceGbp: Math.min(...prices),
    maxPriceGbp: Math.max(...prices),
    minNights: Math.min(...nights),
    maxNights: Math.max(...nights),
    maxDistanceM: distances.length > 0 ? Math.max(...distances) : 0,
  };
}

const AIRPORT_CODES: AirportCode[] = ['LHR', 'MAN', 'BHX', 'NCL', 'GLA', 'EDI'];

/**
 * Parse an airport from the query string, rejecting anything not in the list.
 *
 * Deliberately strict: a bad code degrades to "no airport filter" and shows the
 * whole catalogue, rather than silently matching nothing and presenting an empty
 * listing as though we had no packages.
 */
function parseAirport(raw: string | null): AirportCode | null {
  if (raw === null) return null;
  const code = raw.trim().toUpperCase();
  return (AIRPORT_CODES as string[]).includes(code) ? (code as AirportCode) : null;
}

export function matchesFilters(pkg: Package, f: PackageFilters): boolean {
  if (f.tiers.length > 0 && !f.tiers.includes(pkg.tier)) return false;

  const nights = totalNights(pkg);
  if (f.minNights !== null && nights < f.minNights) return false;
  if (f.maxNights !== null && nights > f.maxNights) return false;

  if (f.maxPriceGbp !== null && pkg.price.gbp > f.maxPriceGbp) return false;

  if (f.maxDistanceM !== null) {
    const d = makkahHaramDistanceM(pkg);
    if (d === null || d > f.maxDistanceM) return false;
  }

  if (f.month !== null && !pkg.departureMonths.includes(f.month)) return false;

  if (f.airport !== null && !pkg.departures.includes(f.airport)) return false;

  return true;
}

export function sortPackages(packages: Package[], sort: SortKey): Package[] {
  const out = [...packages];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price.gbp - b.price.gbp);
    case 'price-desc':
      return out.sort((a, b) => b.price.gbp - a.price.gbp);
    case 'nights-desc':
      return out.sort((a, b) => totalNights(b) - totalNights(a));
    case 'distance-asc':
      return out.sort((a, b) => {
        // Packages with no hotel data sort last rather than randomly.
        const da = makkahHaramDistanceM(a) ?? Number.POSITIVE_INFINITY;
        const db = makkahHaramDistanceM(b) ?? Number.POSITIVE_INFINITY;
        return da - db;
      });
  }
}

export function applyFilters(packages: Package[], f: PackageFilters): Package[] {
  return sortPackages(
    packages.filter((p) => matchesFilters(p, f)),
    f.sort
  );
}

/* ------------------------------------------------------------------ URL state */

function parsePositiveInt(raw: string | null): number | null {
  if (raw === null || raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/**
 * Read filters out of a URLSearchParams. Anything malformed falls back to the
 * default rather than throwing — a hand-edited or stale URL should degrade to a
 * usable listing, never to an error page.
 */
export function filtersFromSearchParams(params: URLSearchParams): PackageFilters {
  const tiers = (params.get('tier') ?? '')
    .split(',')
    .map((t) => Number(t))
    .filter((t): t is Tier => VALID_TIERS.includes(t as Tier));

  const sortRaw = params.get('sort');
  const sort = SORT_KEYS.includes(sortRaw as SortKey)
    ? (sortRaw as SortKey)
    : DEFAULT_FILTERS.sort;

  const month = params.get('month');

  return {
    tiers: [...new Set(tiers)].sort((a, b) => a - b),
    minNights: parsePositiveInt(params.get('minNights')),
    maxNights: parsePositiveInt(params.get('maxNights')),
    maxPriceGbp: parsePositiveInt(params.get('maxPrice')),
    maxDistanceM: parsePositiveInt(params.get('maxDistance')),
    month: month !== null && month.trim() !== '' ? month : null,
    airport: parseAirport(params.get('airport')),
    sort,
  };
}

/**
 * Serialise filters back to a query string. Defaults are omitted so a cleared
 * listing has a clean `/packages/` URL rather than a trail of empty params.
 */
export function searchParamsFromFilters(f: PackageFilters): string {
  const params = new URLSearchParams();
  if (f.tiers.length > 0) params.set('tier', f.tiers.join(','));
  if (f.minNights !== null) params.set('minNights', String(f.minNights));
  if (f.maxNights !== null) params.set('maxNights', String(f.maxNights));
  if (f.maxPriceGbp !== null) params.set('maxPrice', String(f.maxPriceGbp));
  if (f.maxDistanceM !== null) params.set('maxDistance', String(f.maxDistanceM));
  if (f.month !== null) params.set('month', f.month);
  if (f.airport !== null) params.set('airport', f.airport);
  if (f.sort !== DEFAULT_FILTERS.sort) params.set('sort', f.sort);
  return params.toString();
}

/** True when nothing is narrowed — used to show/hide the "clear all" control. */
export function isDefaultFilters(f: PackageFilters): boolean {
  return (
    f.tiers.length === 0 &&
    f.minNights === null &&
    f.maxNights === null &&
    f.maxPriceGbp === null &&
    f.maxDistanceM === null &&
    f.month === null &&
    f.airport === null
  );
}
