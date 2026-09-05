import type { AirportCode, MonthKey, Package, Tier } from './types.ts';
import type { ImageKey } from '../data/images.generated.ts';
import { tiers, leadPairing, type TierDefinition } from '../data/tiers.ts';
import { baseDurations, monthDurations, type Duration } from '../data/durations.ts';
import { months, type MonthDefinition } from '../data/months.ts';
import { hotel } from '../data/hotels.ts';

/* ============================================================================
 * THE CATALOGUE GENERATOR
 *
 * 3 tiers x 5 base durations              =  15 evergreen packages
 * 3 tiers x 5 month durations x 12 months = 180 month packages
 *                                           195 total
 *
 * Pure functions over the data files, with no React and no framework, so the
 * whole matrix is unit-testable directly — which matters far more here than it
 * did with six hand-written packages. A pricing bug in a hand-authored file is
 * one wrong number; a pricing bug in here is 195 wrong numbers.
 *
 * Slug shapes mirror the competitor's exactly, because they are the URLs the
 * audience already reaches for:
 *
 *   10-nights-5-star-umrah-package
 *   10-nights-5-star-january-umrah-package
 * ========================================================================== */

/** Every airport, unless a package restricts itself. */
const ALL_AIRPORTS: AirportCode[] = ['LHR', 'MAN', 'BHX', 'NCL', 'GLA', 'EDI'];

/**
 * The longest stays run from the direct-flight airports only.
 *
 * A 20- or 21-night package out of Newcastle or Edinburgh means two connections
 * and a punishing total journey time, and it is not something we would actually
 * sell. Modelling it here means the filter never offers a departure we would
 * have to walk back at quote stage.
 */
const DIRECT_ONLY: AirportCode[] = ['LHR', 'MAN', 'BHX'];

function departuresFor(nights: number): AirportCode[] {
  return nights >= 20 ? DIRECT_ONLY : ALL_AIRPORTS;
}

/**
 * Photography, assigned by tier.
 *
 * Landscape crops only. The card slot is 16:10 and the detail hero is wider
 * still, so a portrait source gets centre-cropped to a strip — which on
 * `nabawi-green-dome` means losing the dome, the one thing the image is of.
 * Those portraits earn their place elsewhere, not here.
 *
 * The pairing is deliberate rather than decorative: the tier a visitor is
 * looking at should show them the view that tier actually buys. Five-star is
 * the night Haram seen from the arcade — which is what 100 m from the gates
 * looks like at Isha. Three-star is the courtyard from further out.
 */
const TIER_IMAGE: Record<Tier, { key: ImageKey; alt: string }> = {
  5: {
    key: 'haram-courtyard',
    alt: 'The Masjid al-Haram courtyard seen from an upper level, the Kaaba at its centre',
  },
  4: {
    key: 'nabawi-twilight',
    alt: 'Masjid an-Nabawi in Madinah at twilight, its minarets lit against a pink sky',
  },
  3: {
    key: 'makkah-skyline-night',
    alt: 'Makkah at night, the Haram and the clock tower above the surrounding city',
  },
};

/** Prices are quoted in whole pounds and read better rounded to a clean step. */
function roundPrice(amount: number): number {
  return Math.round(amount / 5) * 5;
}

export function priceFor(tier: TierDefinition, duration: Duration, month?: MonthDefinition): number {
  const base = tier.price.fixed + tier.price.perNight * duration.nights;
  return roundPrice(base * (month?.priceIndex ?? 1));
}

export function slugFor(tier: Tier, duration: Duration, month?: MonthKey): string {
  const middle = month ? `${tier}-star-${month}` : `${tier}-star`;
  return `${duration.nights}-nights-${middle}-umrah-package`;
}

function nameFor(tier: Tier, duration: Duration, month?: MonthDefinition): string {
  const suffix = month ? ` — ${month.name}` : '';
  return `${duration.nights} Nights ${tier}-Star Umrah${suffix}`;
}

function summaryFor(
  tierDef: TierDefinition,
  duration: Duration,
  month?: MonthDefinition
): string {
  const makkahHotel = hotel(leadPairing(tierDef).makkah);
  const when = month ? `Departing ${month.name}. ` : '';
  return (
    `${when}${duration.nights} nights — ${duration.makkah} in Makkah, ${duration.madinah} in Madinah. ` +
    `${makkahHotel.name}, ${makkahHotel.distanceToHaramM} m from the Haram. ` +
    `Flights, visa, transfers and accommodation included.`
  );
}

function itineraryFor(duration: Duration): Package['itinerary'] {
  return [
    {
      day: 1,
      title: 'Depart the UK for Jeddah',
      detail:
        'Your group leader meets you at the airport. Ihram may be entered before departure or at the designated miqat en route.',
    },
    {
      day: 2,
      title: 'Arrive in Makkah and perform Umrah',
      detail:
        'Private transfer from Jeddah to your hotel. After settling in, you perform tawaf and sa‘i with your guide.',
    },
    {
      day: 3,
      title: `Makkah — ${duration.makkah} nights in total`,
      detail:
        'Prayers at the Haram, optional Ziyarat to Mina, Arafat, Jabal al-Nour and the Cave of Hira.',
    },
    {
      day: duration.makkah + 1,
      title: 'Transfer to Madinah',
      detail:
        'Road transfer to Madinah and check-in close to Masjid an-Nabawi. The Rawdah and the Prophet’s Mosque are the focus of this leg.',
    },
    {
      day: duration.makkah + 2,
      title: `Madinah — ${duration.madinah} nights in total`,
      detail:
        'Ziyarat to Quba Mosque, Masjid al-Qiblatayn, and the martyrs of Uhud, alongside prayers at the Nabawi.',
    },
    {
      day: duration.nights + 1,
      title: 'Return to the UK',
      detail: 'Transfer to the airport for your return flight.',
    },
  ];
}

const INCLUSIONS = [
  'Return flights from your chosen UK airport',
  'Umrah visa processing',
  'Hotel accommodation in Makkah and Madinah',
  'All ground transfers — airport, intercity and hotel',
  'Guided Umrah on arrival',
  'Ziyarat tours in both cities',
];

/**
 * Stated as plainly as the inclusions and given the same visual weight. The
 * agencies that bury these generate the angry phone call later; publishing them
 * is the cheaper trade.
 */
const EXCLUSIONS = [
  'Travel insurance — required, and we can arrange it',
  'Meals beyond hotel breakfast',
  'Vaccinations where required',
  'Personal expenses, laundry and room service',
  'Excess baggage charges',
];

function buildPackage(
  tierDef: TierDefinition,
  duration: Duration,
  month?: MonthDefinition
): Package {
  const makkahHotel = hotel(leadPairing(tierDef).makkah);
  const madinahHotel = hotel(leadPairing(tierDef).madinah);

  return {
    slug: slugFor(tierDef.tier, duration, month?.key),
    name: nameFor(tierDef.tier, duration, month),
    summary: summaryFor(tierDef, duration, month),
    tier: tierDef.tier,
    nights: { makkah: duration.makkah, madinah: duration.madinah },
    ...(month ? { month: month.key } : {}),
    price: {
      gbp: priceFor(tierDef, duration, month),
      perPerson: true,
      sharing: tierDef.sharing,
    },
    hotels: [makkahHotel, madinahHotel],
    itinerary: itineraryFor(duration),
    inclusions: INCLUSIONS,
    exclusions: EXCLUSIONS,
    departures: departuresFor(duration.nights),
    // Read from real accreditation data at render time; never asserted here.
    atolProtected: false,
    departureMonths: month ? [month.key] : months.map((m) => m.key),
    images: [TIER_IMAGE[tierDef.tier]],
    // The mid-tier 10-night package is the one most people actually book.
    featured: !month && duration.nights === 10,
  };
}

/** The 15 evergreen packages. */
export function baseCatalogue(): Package[] {
  return tiers.flatMap((tierDef) => baseDurations.map((d) => buildPackage(tierDef, d)));
}

/** The 180 month variants. */
export function monthCatalogue(): Package[] {
  return tiers.flatMap((tierDef) =>
    monthDurations.flatMap((d) => months.map((m) => buildPackage(tierDef, d, m)))
  );
}

/** Everything, base packages first. */
export function buildCatalogue(): Package[] {
  return [...baseCatalogue(), ...monthCatalogue()];
}
