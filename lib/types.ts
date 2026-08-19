// Type-only, and relative with an explicit extension: lib/ is imported directly by
// node --test, whose ESM resolver handles neither the @/ alias nor a missing extension.
import type { ImageKey } from '../data/images.generated.ts';

/** Star tier of a package. Drives the primary filter facet. */
export type Tier = 3 | 4 | 5;

/** The six UK departure points. Defined here so data/ depends on lib/, not the reverse. */
export type AirportCode = 'LHR' | 'MAN' | 'BHX' | 'NCL' | 'GLA' | 'EDI';

/**
 * Lowercase English month name — the segment Al Habib uses in its URLs
 * (`10-nights-5-star-january-umrah-package`), so it is the segment we use too.
 */
export type MonthKey =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

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
    gbp: number;
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
  /**
   * Set on a month variant, absent on the evergreen base package. This is the
   * axis that turns 15 packages into 195, and it is what makes a month page a
   * page rather than a filtered view.
   */
  month?: MonthKey;
  /**
   * Which of the six UK airports this package is bookable from. Modelled per
   * package because a 21-night 5-star departure will not run from every regional
   * airport, and discovering that at quote stage is the complaint we are trying
   * to design out.
   */
  departures: AirportCode[];
  /**
   * Whether this specific departure is ATOL protected. Never hardcode `true` —
   * it is a legal claim, and it is read from data/site.ts holding a real number.
   */
  atolProtected: boolean;
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

/**
 * Walking distance to Masjid al-Haram, from the Makkah hotel only.
 *
 * This is the number the site means when it says "from the Haram", and using
 * anything else is the exact dishonesty the whole project is positioned against.
 *
 * `nearestHaramDistanceM` takes the minimum across both cities, so a package with
 * a 500 m hotel in Madinah and a 1,400 m hotel in Makkah reported "500 m from the
 * Haram" — the flattering number under the wrong label. Colloquially "the Haram"
 * is Masjid al-Haram; Madinah's mosque is Masjid an-Nabawi, and conflating them
 * to produce a better figure is precisely what the comparison table on the home
 * page accuses competitors of.
 *
 * Cards, the price rail, the distance filter and the distance sort all use this.
 * `nearestHaramDistanceM` is kept for anywhere that genuinely wants the closest
 * of the two, and named so it cannot be mistaken for this one.
 */
export function makkahHaramDistanceM(pkg: Package): number | null {
  const makkah = pkg.hotels.filter((h) => h.city === 'makkah');
  if (makkah.length === 0) return null;
  return Math.min(...makkah.map((h) => h.distanceToHaramM));
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
  /** Inclusive upper bound on per-person price in GBP. */
  maxPriceGbp: number | null;
  /** Inclusive upper bound on walking distance to the nearest Haram, in metres. */
  maxDistanceM: number | null;
  month: string | null;
  /**
   * Departure airport. A UK-market filter the reference site has no equivalent
   * of: it sells city landing pages, but you cannot narrow the catalogue to
   * "what can I actually fly on from Newcastle". Long stays do not run from
   * every airport, so this is a real constraint and not a preference.
   */
  airport: AirportCode | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: PackageFilters = {
  tiers: [],
  minNights: null,
  maxNights: null,
  maxPriceGbp: null,
  maxDistanceM: null,
  month: null,
  airport: null,
  sort: 'price-asc',
};
