import type { Package } from '@/lib/types';
import { hotel } from './hotels';

/* ============================================================================
 * PACKAGE CATALOGUE
 *
 * ⚠ BEFORE LAUNCH — two fields in every entry below need Al Ijaz's real numbers:
 *
 *   price.pkr        Representative market rates, NOT quoted rates. Replace with
 *                    the actual contracted per-person price for each season.
 *   departureMonths  Replace with the seasons you actually have allocation for.
 *
 * Hotels are referenced by id from data/hotels.ts, so a corrected walking distance
 * propagates to every package at once. Verify that registry against your current
 * contracts each season — allocation changes, and distance is the one number
 * pilgrims will hold you to.
 *
 * `images: []` is deliberate and safe: the UI renders a branded khatam placeholder
 * for an empty array rather than a broken <img>. Fill these in once licensed
 * photography is cleared (see the build plan's open question on image rights).
 * ========================================================================== */

export const packages: Package[] = [
  {
    slug: 'economy-umrah-10-nights',
    name: 'Economy Umrah — 10 Nights',
    summary:
      'A complete ten-night Umrah on a considered budget, with clean 3-star hotels on the Haram shuttle routes in both cities.',
    tier: 3,
    nights: { makkah: 6, madinah: 4 },
    price: { pkr: 285_000, perPerson: true, sharing: 'quad' },
    hotels: [hotel('al-kiswah-towers'), hotel('rawdah-suites')],
    itinerary: [
      {
        day: 1,
        title: 'Departure and arrival in Jeddah',
        detail:
          'Flight from Karachi or Lahore. Ihram is assumed before the Meeqat. Our representative meets you at Jeddah and transfers you to Makkah by coach.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail:
          'Performing Tawaf and Sa‘i with a group guide, followed by rest. Your guide walks the route with you beforehand so nothing is unfamiliar.',
      },
      {
        day: 3,
        title: 'Makkah — ziyarat',
        detail:
          'Guided visits to Jabal al-Nour, Mina, Muzdalifah and Arafat, with the historical context explained in Urdu.',
      },
      {
        day: 4,
        title: 'Free days in Makkah',
        detail: 'Prayers at the Haram at your own pace. Shuttle runs every 30 minutes.',
      },
      {
        day: 7,
        title: 'Transfer to Madinah',
        detail: 'Coach to Madinah, checking in close to the Haram shuttle route.',
      },
      {
        day: 8,
        title: 'Madinah — ziyarat',
        detail:
          'Masjid an-Nabawi, Riyadh ul-Jannah guidance and permit help, Masjid Quba, Masjid Qiblatain and Uhud.',
      },
      {
        day: 11,
        title: 'Return',
        detail: 'Transfer to Madinah airport for the return flight.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return economy airfare',
      'Hotel accommodation, quad sharing',
      'All intercity transfers by air-conditioned coach',
      'Guided ziyarat in both cities',
      'Urdu-speaking group leader',
      'Zamzam allowance as permitted by the airline',
    ],
    exclusions: [
      'Meals (hotels are room-only; food courts are nearby)',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
      'Anything arising from flight schedule changes by the airline',
    ],
    departureMonths: ['2027-02', '2027-04', '2027-05'],
    images: [],
  },

  {
    slug: 'family-umrah-14-nights',
    name: 'Family Umrah — 14 Nights',
    summary:
      'Fourteen nights built around families: walkable 4-star hotels, triple-sharing rooms, and a slower ziyarat pace.',
    tier: 4,
    nights: { makkah: 8, madinah: 6 },
    price: { pkr: 465_000, perPerson: true, sharing: 'triple' },
    hotels: [hotel('dar-al-eiman-grand'), hotel('frontel-al-harithia')],
    itinerary: [
      {
        day: 1,
        title: 'Departure and arrival in Jeddah',
        detail:
          'Direct flight where the schedule allows. Meet-and-assist at Jeddah, then a private coach to Makkah.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail:
          'Tawaf and Sa‘i with a guide who stays with the family group throughout. Wheelchair assistance arranged in advance on request.',
      },
      {
        day: 3,
        title: 'Rest day',
        detail: 'Deliberately unscheduled. The hotel is a 300 m walk from the Haram.',
      },
      {
        day: 4,
        title: 'Makkah — ziyarat',
        detail: 'Half-day guided tour, timed to avoid the midday heat.',
      },
      {
        day: 9,
        title: 'Transfer to Madinah',
        detail: 'Coach to Madinah. Rooms held for early check-in.',
      },
      {
        day: 10,
        title: 'Madinah — ziyarat',
        detail:
          'Masjid an-Nabawi with Riyadh ul-Jannah permit assistance for each family member, then Quba, Qiblatain and Uhud.',
      },
      {
        day: 15,
        title: 'Return',
        detail: 'Transfer to Madinah airport for the return flight.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return economy airfare',
      'Hotel accommodation, triple sharing',
      'Daily breakfast in both cities',
      'All intercity transfers by private coach',
      'Guided ziyarat in both cities',
      'Riyadh ul-Jannah permit assistance',
      'Urdu-speaking group leader',
    ],
    exclusions: [
      'Lunch and dinner',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
      'Optional Taif or Jeddah excursions',
    ],
    departureMonths: ['2027-01', '2027-02', '2027-06', '2027-07'],
    images: [],
    featured: true,
  },

  {
    slug: 'premium-umrah-10-nights',
    name: 'Premium Umrah — 10 Nights',
    summary:
      'Ten nights in 5-star hotels inside the Haram precinct, close enough that every prayer is a short walk.',
    tier: 5,
    nights: { makkah: 6, madinah: 4 },
    price: { pkr: 745_000, perPerson: true, sharing: 'double' },
    hotels: [hotel('swissotel-al-maqam'), hotel('dar-al-taqwa')],
    itinerary: [
      {
        day: 1,
        title: 'Departure and arrival in Jeddah',
        detail: 'Private transfer from Jeddah to Makkah on arrival, no group waiting time.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail: 'Tawaf and Sa‘i with a private guide at a time of your choosing.',
      },
      {
        day: 3,
        title: 'Makkah at your own pace',
        detail:
          'The hotel sits inside the Haram precinct — roughly a two-minute walk to the Mataf.',
      },
      {
        day: 4,
        title: 'Makkah — private ziyarat',
        detail: 'Private car and guide for the historical sites.',
      },
      {
        day: 7,
        title: 'Transfer to Madinah',
        detail: 'Haramain high-speed rail in business class, or private car on request.',
      },
      {
        day: 8,
        title: 'Madinah — private ziyarat',
        detail: 'Riyadh ul-Jannah permits arranged, then the outer sites by private car.',
      },
      {
        day: 11,
        title: 'Return',
        detail: 'Private transfer to Madinah airport.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return airfare',
      'Hotel accommodation, double sharing',
      'Daily breakfast and dinner',
      'Private transfers throughout',
      'Haramain high-speed rail, Makkah to Madinah',
      'Private guide for ziyarat in both cities',
      'Riyadh ul-Jannah permit assistance',
    ],
    exclusions: [
      'Lunch',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
    ],
    departureMonths: ['2027-01', '2027-02', '2027-05', '2027-06'],
    images: [],
    featured: true,
  },

  {
    slug: 'ramadan-umrah-last-ten-nights',
    name: 'Ramadan Umrah — Last Ten Nights',
    summary:
      'The last ten nights of Ramadan in Makkah, with hotels held within walking distance for Taraweeh and Qiyam.',
    tier: 5,
    nights: { makkah: 10, madinah: 4 },
    price: { pkr: 1_150_000, perPerson: true, sharing: 'quad' },
    hotels: [hotel('hilton-suites-makkah'), hotel('oberoi-madinah')],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Makkah before the last ten',
        detail:
          'Arriving with time to settle before the 21st night, so you are not travelling during the nights that matter most.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail:
          'Tawaf and Sa‘i scheduled after Fajr or late at night, when the Mataf is at its calmest during Ramadan.',
      },
      {
        day: 3,
        title: 'The last ten nights',
        detail:
          'Taraweeh and Qiyam at the Haram. Walking distance matters more in Ramadan than in any other season — the hotel is 200 m out, so you are not dependent on shuttles at 2 a.m.',
      },
      {
        day: 11,
        title: 'Transfer to Madinah',
        detail: 'Coach to Madinah after Eid, with rooms held for early check-in.',
      },
      {
        day: 12,
        title: 'Madinah',
        detail: 'Masjid an-Nabawi, Riyadh ul-Jannah permit assistance, and guided ziyarat.',
      },
      {
        day: 15,
        title: 'Return',
        detail: 'Transfer to Madinah airport for the return flight.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return airfare',
      'Hotel accommodation, quad sharing',
      'Suhoor and Iftar daily in Makkah',
      'All intercity transfers',
      'Guided ziyarat in both cities',
      'Riyadh ul-Jannah permit assistance',
      'Urdu-speaking group leader',
    ],
    exclusions: [
      'Meals outside Suhoor and Iftar',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
    ],
    departureMonths: ['ramadan-2027'],
    images: [],
    featured: true,
  },

  {
    slug: 'short-umrah-7-nights',
    name: 'Short Umrah — 7 Nights',
    summary:
      'Seven nights for travellers on limited leave, without cutting the Madinah stay down to a single night.',
    tier: 4,
    nights: { makkah: 4, madinah: 3 },
    price: { pkr: 335_000, perPerson: true, sharing: 'quad' },
    hotels: [hotel('anjum-makkah'), hotel('al-eiman-royal')],
    itinerary: [
      {
        day: 1,
        title: 'Departure and arrival in Jeddah',
        detail: 'Meet-and-assist at Jeddah, then coach transfer to Makkah.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail: 'Tawaf and Sa‘i with a group guide on the morning after arrival.',
      },
      {
        day: 3,
        title: 'Makkah — ziyarat',
        detail: 'Half-day guided tour of the historical sites.',
      },
      {
        day: 5,
        title: 'Transfer to Madinah',
        detail: 'Coach to Madinah, arriving in time for Maghrib at the Haram.',
      },
      {
        day: 6,
        title: 'Madinah — ziyarat',
        detail: 'Masjid an-Nabawi, Quba, Qiblatain and Uhud with a guide.',
      },
      {
        day: 8,
        title: 'Return',
        detail: 'Transfer to Madinah airport for the return flight.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return economy airfare',
      'Hotel accommodation, quad sharing',
      'Daily breakfast',
      'All intercity transfers by coach',
      'Guided ziyarat in both cities',
      'Urdu-speaking group leader',
    ],
    exclusions: [
      'Lunch and dinner',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
    ],
    departureMonths: ['2027-02', '2027-03', '2027-04', '2027-09'],
    images: [],
  },

  {
    slug: 'group-umrah-21-nights',
    name: 'Group Umrah — 21 Nights',
    summary:
      'Three weeks in the Haramain for groups travelling together, with a dedicated coach and group leader throughout.',
    tier: 3,
    nights: { makkah: 12, madinah: 9 },
    price: { pkr: 425_000, perPerson: true, sharing: 'quad' },
    hotels: [hotel('al-kiswah-towers'), hotel('rawdah-suites')],
    itinerary: [
      {
        day: 1,
        title: 'Departure and arrival in Jeddah',
        detail: 'Group check-in at the departure airport, then coach transfer from Jeddah.',
      },
      {
        day: 2,
        title: 'Umrah',
        detail: 'Tawaf and Sa‘i with the group leader, in staggered batches to keep the group together.',
      },
      {
        day: 4,
        title: 'Makkah — ziyarat',
        detail: 'Full-day guided tour with the group coach.',
      },
      {
        day: 13,
        title: 'Transfer to Madinah',
        detail: 'Group coach to Madinah.',
      },
      {
        day: 14,
        title: 'Madinah — ziyarat',
        detail: 'Masjid an-Nabawi and the outer sites over two half-days.',
      },
      {
        day: 22,
        title: 'Return',
        detail: 'Group transfer to Madinah airport.',
      },
    ],
    inclusions: [
      'Umrah visa processing',
      'Return economy airfare',
      'Hotel accommodation, quad sharing',
      'Dedicated group coach for the full stay',
      'Guided ziyarat in both cities',
      'Urdu-speaking group leader throughout',
      'Zamzam allowance as permitted by the airline',
    ],
    exclusions: [
      'Meals',
      'Travel insurance',
      'Passport fees',
      'Personal expenses and shopping',
    ],
    departureMonths: ['2027-04', '2027-05', '2027-10'],
    images: [],
  },
];

export function getPackage(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function featuredPackages(): Package[] {
  return packages.filter((p) => p.featured);
}

/** Every month key present in the catalogue, for the month filter. */
export function allDepartureMonths(): string[] {
  return [...new Set(packages.flatMap((p) => p.departureMonths))].sort();
}
