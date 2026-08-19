import type { MonthKey } from '@/lib/types';

/* ============================================================================
 * MONTHS
 *
 * This file is the reason the 180 month pages are worth having.
 *
 * The client chose to publish every tier x duration x month combination as its
 * own indexable page (PLAN-UK.md, D2). That decision is only safe if each page
 * has something real to say — 180 pages differing by a month name and a price
 * is the exact shape search engines classify as scaled content.
 *
 * So every month below carries genuine, checkable substance: what the weather
 * actually does, how crowded the Haram actually gets, whether UK school holidays
 * overlap, and whether Umrah is even available that month. That last one matters
 * more than anything else here and most competitors ignore it.
 *
 * ⚠ DATES ARE APPROXIMATE. Islamic months follow the lunar calendar and shift
 * ~11 days earlier each Gregorian year, and Hajj/Ramadan windows are confirmed
 * by moon sighting. Every date below is marked with the year it was calculated
 * for and must be re-checked annually.
 * ========================================================================== */

export type Availability = 'open' | 'restricted' | 'peak';

export interface MonthDefinition {
  key: MonthKey;
  /** Display name and URL segment source. */
  name: string;
  /** Calendar position, for sorting. */
  index: number;
  /**
   * Price multiplier against the tier's base rate. Demand for Umrah is violently
   * seasonal — Ramadan is not "a bit busier", it is the entire year's peak.
   */
  priceIndex: number;
  availability: Availability;
  /** Daytime high in Makkah, °C. Genuinely decision-relevant for older pilgrims. */
  makkahHighC: number;
  /** How busy the Haram is, in plain words rather than a star rating. */
  crowds: string;
  /** UK school holiday overlap — the constraint families actually plan around. */
  schoolHolidays: string | null;
  /** The honest paragraph for this month's landing page. */
  note: string;
}

/** Calculated for the 2027 season. Re-check every year. */
export const months: MonthDefinition[] = [
  {
    key: 'january',
    name: 'January',
    index: 1,
    priceIndex: 0.92,
    availability: 'open',
    makkahHighC: 30,
    crowds: 'Quiet. The Haram is walkable at almost any hour and tawaf on the mataf is realistic.',
    schoolHolidays: null,
    note: 'The cheapest month of the year to perform Umrah from the UK, and the most comfortable weather in Makkah. The trade-off is that it falls in term time, so it suits retired pilgrims and couples far better than families with school-age children.',
  },
  {
    key: 'february',
    name: 'February',
    index: 2,
    priceIndex: 1.45,
    availability: 'peak',
    makkahHighC: 31,
    crowds: 'Rising sharply through the month as Ramadan approaches.',
    schoolHolidays: 'February half term, mid-month',
    note: 'Ramadan 1448 is expected to begin in early February 2027, which makes this month the single most contested in the Umrah calendar. Prices climb steeply and hotel allocation near the Haram is gone months ahead. Book early or choose January.',
  },
  {
    key: 'march',
    name: 'March',
    index: 3,
    priceIndex: 1.7,
    availability: 'peak',
    makkahHighC: 34,
    crowds: 'The busiest of the year. The last ten nights fill the Haram and its courtyards completely.',
    schoolHolidays: null,
    note: 'The bulk of Ramadan 1448 falls in March 2027, including the last ten nights and Laylat al-Qadr. This is the most rewarding time to be in Makkah and by some distance the most expensive and most crowded. Expect to pray in the courtyards rather than inside.',
  },
  {
    key: 'april',
    name: 'April',
    index: 4,
    priceIndex: 1.0,
    availability: 'open',
    makkahHighC: 38,
    crowds: 'Falls away quickly after Eid. One of the calmest windows of the year.',
    schoolHolidays: 'Easter holidays, roughly two weeks',
    note: 'The window immediately after Ramadan is consistently underrated. Prices drop back to normal within days of Eid, the Haram empties, and the Easter holidays make it one of the few genuinely family-friendly months. Heat is beginning to build but is still manageable.',
  },
  {
    key: 'may',
    name: 'May',
    index: 5,
    priceIndex: 0.95,
    availability: 'restricted',
    makkahHighC: 42,
    crowds: 'Quiet, but access tightens as Hajj preparations begin.',
    schoolHolidays: 'May half term, late in the month',
    note: 'Umrah visas are typically suspended in the weeks before Hajj so that Makkah can be prepared for pilgrims. Hajj 1448 falls around May 2027, so late-May departures may not be available at all. We will tell you before you book rather than after — check with us before planning around this month.',
  },
  {
    key: 'june',
    name: 'June',
    index: 6,
    priceIndex: 0.95,
    availability: 'restricted',
    makkahHighC: 43,
    crowds: 'Hajj season. Umrah is generally not performed during this window.',
    schoolHolidays: null,
    note: 'Hajj 1448 is expected in this window, and Umrah is normally suspended around it. Departures resume once the Hajj season closes. If you are looking at June specifically, speak to us first — this is the one month where an advertised package may simply not be operable.',
  },
  {
    key: 'july',
    name: 'July',
    index: 7,
    priceIndex: 1.15,
    availability: 'open',
    makkahHighC: 43,
    crowds: 'Busy with families once UK schools break up, though the Haram itself stays manageable.',
    schoolHolidays: 'Summer holidays begin, roughly from the third week',
    note: 'Umrah reopens after Hajj and UK families travel in volume. The heat is the real consideration: 43°C means moving between the hotel and the Haram in the early morning and after Maghrib. This is exactly where a hotel 120 m away stops being a luxury.',
  },
  {
    key: 'august',
    name: 'August',
    index: 8,
    priceIndex: 1.2,
    availability: 'open',
    makkahHighC: 43,
    crowds: 'The busiest non-Ramadan month, driven almost entirely by school holidays.',
    schoolHolidays: 'Full month',
    note: 'The peak family month for UK pilgrims, and priced accordingly. Everything about July applies here with more people. If you are travelling with children or elderly parents in August, the walking distance to the Haram is the most important number on the page.',
  },
  {
    key: 'september',
    name: 'September',
    index: 9,
    priceIndex: 0.88,
    availability: 'open',
    makkahHighC: 41,
    crowds: 'Empties out sharply once UK schools return.',
    schoolHolidays: null,
    note: 'Prices fall the moment the schools go back, and the Haram becomes noticeably calmer within the first week. Still hot, but the best value of the second half of the year for anyone not tied to term dates.',
  },
  {
    key: 'october',
    name: 'October',
    index: 10,
    priceIndex: 0.9,
    availability: 'open',
    makkahHighC: 38,
    crowds: 'Comfortable throughout, with a brief lift over half term.',
    schoolHolidays: 'October half term, one week',
    note: 'Arguably the best all-round month of the year: the heat has broken, the crowds are moderate, prices are near their lowest, and half term gives families a workable week. If someone asks us when to go and has no constraints, this is usually the answer.',
  },
  {
    key: 'november',
    name: 'November',
    index: 11,
    priceIndex: 0.9,
    availability: 'open',
    makkahHighC: 34,
    crowds: 'Quiet and steady. Good conditions for a slower, less rushed Umrah.',
    schoolHolidays: null,
    note: 'Mild weather, low prices and thin crowds. November suits first-time pilgrims who would rather not contend with the density of Ramadan while learning the rites, and older travellers who find the summer heat prohibitive.',
  },
  {
    key: 'december',
    name: 'December',
    index: 12,
    priceIndex: 1.25,
    availability: 'open',
    makkahHighC: 31,
    crowds: 'Busy over the Christmas fortnight, quiet either side of it.',
    schoolHolidays: 'Christmas holidays, roughly two weeks',
    note: 'The best weather of the year in Makkah combined with a two-week school holiday makes late December a genuine peak. Early December is materially cheaper for the same conditions, so if your dates are flexible by even a week, move earlier.',
  },
];

export function getMonth(key: string): MonthDefinition | undefined {
  return months.find((m) => m.key === key);
}

export const monthKeys = months.map((m) => m.key);

/** Months where a package may not be operable. Surfaced, never hidden. */
export function restrictedMonths(): MonthDefinition[] {
  return months.filter((m) => m.availability === 'restricted');
}
