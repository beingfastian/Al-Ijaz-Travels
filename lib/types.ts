// Type-only, and relative with an explicit extension: lib/ is imported directly by
// node --test, whose ESM resolver handles neither the @/ alias nor a missing extension.
import type { ImageKey } from '../data/images.generated.ts';

/** Star tier of a package. Drives the primary filter facet. */
export type Tier = 3 | 4 | 5;

export type HolyCity = 'makkah' | 'madinah';

/** Room occupancy the quoted price assumes. Umrah pricing is always per-person. */
export type Sharing = 'quad' | 'triple' | 'double';

export interface Hotel {
  city: HolyCity;
  name: string;
  stars: number;
  /**
   * Walking distance to the Haram, in metres.
   *
   * The single highest-leverage field in this model: it is the number pilgrims
   * actually compare between agencies. Stored as a number (not "approx 5 min walk")
   * so it can be sorted, filtered, and rendered as a badge.
   */
  distanceToHaramM: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  detail: string;
}

export interface PackageImage {
  /**
   * A key from the generated manifest, not a path — `haram-night`, not
   * `/img/haram-night.jpg`. The pipeline decides which widths and formats exist,
   * so naming one it has not produced fails `npm run typecheck` rather than
   * shipping an <img> that 404s. See scripts/images.mjs.
   */
  key: ImageKey;
  /** Never decorative — these carry the trust signal, so they get real alt text. */
  alt: string;
  /** Attribution, where the licence requires it. */
  credit?: string;
}

export interface Package {
  /** Route segment for /packages/[slug] — also the SEO surface. Keep stable. */
  slug: string;
  name: string;
  /** One sentence. Used on cards and as the page meta description. */
  summary: string;
  tier: Tier;
  nights: { makkah: number; madinah: number };
  price: {
    pkr: number;
    perPerson: true;
    sharing: Sharing;
  };
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  /**
   * Stated plainly and given equal visual weight to inclusions. Agencies that
   * hide exclusions generate the angry phone call later; showing them is a trust
   * signal, not a risk.
   */
  exclusions: string[];
  /** Month keys, e.g. 'ramadan-2027'. Drives seasonal landing pages and filtering. */
  departureMonths: string[];
  images: PackageImage[];
  featured?: boolean;
}

/** Total nights in the Haramain. */
export function totalNights(pkg: Package): number {
  return pkg.nights.makkah + pkg.nights.madinah;
}

/** Closest approach to either Haram — used for the headline distance badge. */
export function nearestHaramDistanceM(pkg: Package): number | null {
  if (pkg.hotels.length === 0) return null;
  return Math.min(...pkg.hotels.map((h) => h.distanceToHaramM));
}

/* -------------------------------------------------------------- filter state */

export type SortKey = 'price-asc' | 'price-desc' | 'nights-desc' | 'distance-asc';

/**
 * Filter state is serialised into the URL, not held in a store — so an agent can
 * send a client a link to "5-star, 10 nights, under 400k" and search engines can
 * crawl the listing. See lib/filter.ts for the encode/decode pair.
 */
export interface PackageFilters {
  tiers: Tier[];
  /** Inclusive bounds on total nights. */
  minNights: number | null;
  maxNights: number | null;
  /** Inclusive upper bound on per-person price in PKR. */
  maxPricePkr: number | null;
  /** Inclusive upper bound on walking distance to the nearest Haram, in metres. */
  maxDistanceM: number | null;
  month: string | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: PackageFilters = {
  tiers: [],
  minNights: null,
  maxNights: null,
  maxPricePkr: null,
  maxDistanceM: null,
  month: null,
  sort: 'price-asc',
};
