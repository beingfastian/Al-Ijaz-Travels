import type { Hotel, HolyCity } from '@/lib/types';

/* ============================================================================
 * HOTEL REGISTRY
 *
 * Canonical record for every property we place pilgrims in. Packages reference
 * these by id rather than restating name/stars/distance, so a hotel's walking
 * distance is corrected in exactly one place — the field travellers hold us to.
 *
 * ⚠ VERIFY EACH SEASON. These are real properties and `distanceToHaramM` values
 * are approximate walking distances from published locations, but hotel
 * allocation changes contract to contract. Confirm before every season goes live.
 * ========================================================================== */

export interface HotelRecord extends Hotel {
  id: string;
}

const REGISTRY = {
  /* ---------------------------------------------------------------- Makkah */
  'swissotel-al-maqam': {
    id: 'swissotel-al-maqam',
    city: 'makkah',
    name: 'Swissôtel Al Maqam',
    stars: 5,
    distanceToHaramM: 120,
  },
  'hilton-suites-makkah': {
    id: 'hilton-suites-makkah',
    city: 'makkah',
    name: 'Hilton Suites Makkah',
    stars: 5,
    distanceToHaramM: 200,
  },
  'dar-al-eiman-grand': {
    id: 'dar-al-eiman-grand',
    city: 'makkah',
    name: 'Dar Al Eiman Grand',
    stars: 4,
    distanceToHaramM: 300,
  },
  'anjum-makkah': {
    id: 'anjum-makkah',
    city: 'makkah',
    name: 'Anjum Hotel Makkah',
    stars: 4,
    distanceToHaramM: 900,
  },
  'al-kiswah-towers': {
    id: 'al-kiswah-towers',
    city: 'makkah',
    name: 'Al Kiswah Towers',
    stars: 3,
    distanceToHaramM: 1400,
  },

  /* --------------------------------------------------------------- Madinah */
  'dar-al-taqwa': {
    id: 'dar-al-taqwa',
    city: 'madinah',
    name: 'Dar Al Taqwa',
    stars: 5,
    distanceToHaramM: 100,
  },
  'oberoi-madinah': {
    id: 'oberoi-madinah',
    city: 'madinah',
    name: 'The Oberoi Madinah',
    stars: 5,
    distanceToHaramM: 150,
  },
  'frontel-al-harithia': {
    id: 'frontel-al-harithia',
    city: 'madinah',
    name: 'Frontel Al Harithia',
    stars: 4,
    distanceToHaramM: 250,
  },
  'al-eiman-royal': {
    id: 'al-eiman-royal',
    city: 'madinah',
    name: 'Al Eiman Royal',
    stars: 4,
    distanceToHaramM: 300,
  },
  'rawdah-suites': {
    id: 'rawdah-suites',
    city: 'madinah',
    name: 'Rawdah Suites',
    stars: 3,
    distanceToHaramM: 500,
  },
} as const satisfies Record<string, HotelRecord>;

export type HotelId = keyof typeof REGISTRY;

/**
 * Resolve a hotel by id. Typed against the registry keys, so a package
 * referencing a hotel that does not exist is a compile error rather than an
 * empty card at runtime.
 */
export function hotel(id: HotelId): Hotel {
  return REGISTRY[id];
}

export const hotels: HotelRecord[] = Object.values(REGISTRY);

export function hotelsInCity(city: HolyCity): HotelRecord[] {
  return hotels.filter((h) => h.city === city);
}
