import type { Hotel, HolyCity } from '@/lib/types';
import { IMAGES, type ImageKey } from './images.generated.ts';

/* ============================================================================
 * HOTEL REGISTRY
 *
 * Canonical record for every property we place pilgrims in. Tiers reference
 * these by id rather than restating name/stars/distance, so a hotel's walking
 * distance is corrected in exactly one place — the field travellers hold us to.
 *
 * Seven Makkah properties and seven Madinah properties per star band, ordered
 * as the allocation list orders them. The pairings live in data/tiers.ts; this
 * file only says what each property is and how far it is.
 *
 * ⚠ EVERY `distanceToHaramM` BELOW IS AN APPROXIMATION AND MUST BE VERIFIED
 * BEFORE THIS GOES LIVE. These are real properties, but the numbers here are
 * estimated walking distances from published locations — not measured routes,
 * and not confirmed against this season's contracts. Publishing a checkable
 * number is the whole positioning of this site, which is exactly why an
 * unverified one is worse here than a vague phrase would be elsewhere. Walk the
 * list with the supplier, correct the metres, then ship.
 *
 * ⚠ STAR BANDS FOLLOW OUR CONTRACTED ALLOCATION, not the brand's own marketing.
 * Several sit below where the chain rates itself — Le Méridien Towers Makkah is
 * carried at 3-star here, Emaar Grand Hotel Mecca and Voco Makkah at 4-star.
 * Confirm these are the bands we are actually selling before the tier pages go
 * out, because the star badge and the tier price have to agree.
 * ========================================================================== */

export interface HotelRecord extends Hotel {
  id: string;
}

/**
 * A registry entry before its photograph is resolved.
 *
 * `photoAlt` is where real alt text goes once someone has actually looked at the
 * file — "the lobby atrium, glass lifts rising behind reception" rather than the
 * property name. It stays optional so a photo can land before the copy does, but
 * the fallback describes the property rather than guessing at the picture.
 */
interface HotelSource extends HotelRecord {
  photoAlt?: string;
}

const REGISTRY = {
  /* ------------------------------------------------------- Makkah — 5-star */
  'raffles-makkah-palace': {
    id: 'raffles-makkah-palace',
    city: 'makkah',
    name: 'Raffles Makkah Palace',
    stars: 5,
    distanceToHaramM: 150,
  },
  'jabal-omar-marriott': {
    id: 'jabal-omar-marriott',
    city: 'makkah',
    name: 'Jabal Omar Marriott Hotel, Makkah',
    stars: 5,
    distanceToHaramM: 500,
  },
  'swissotel-makkah': {
    id: 'swissotel-makkah',
    city: 'makkah',
    name: 'Swissôtel Makkah',
    stars: 5,
    distanceToHaramM: 180,
  },
  'fairmont-clock-royal-tower': {
    id: 'fairmont-clock-royal-tower',
    city: 'makkah',
    name: 'Fairmont Makkah Clock Royal Tower',
    stars: 5,
    distanceToHaramM: 100,
  },
  'pullman-zamzam-makkah': {
    id: 'pullman-zamzam-makkah',
    city: 'makkah',
    name: 'Pullman Zamzam Makkah',
    stars: 5,
    distanceToHaramM: 220,
  },
  'hilton-suites-makkah': {
    id: 'hilton-suites-makkah',
    city: 'makkah',
    name: 'Hilton Suites Makkah',
    stars: 5,
    distanceToHaramM: 350,
  },
  'sheraton-makkah-jabal-al-kaaba': {
    id: 'sheraton-makkah-jabal-al-kaaba',
    city: 'makkah',
    name: 'Sheraton Makkah Jabal Al Kaaba',
    stars: 5,
    distanceToHaramM: 700,
  },

  /* ------------------------------------------------------- Makkah — 4-star */
  'doubletree-jabal-omar': {
    id: 'doubletree-jabal-omar',
    city: 'makkah',
    name: 'DoubleTree by Hilton Jabal Omar Makkah',
    stars: 4,
    distanceToHaramM: 600,
  },
  'emaar-grand-hotel-mecca': {
    id: 'emaar-grand-hotel-mecca',
    city: 'makkah',
    name: 'Emaar Grand Hotel Mecca',
    stars: 4,
    distanceToHaramM: 300,
  },
  'voco-makkah': {
    id: 'voco-makkah',
    city: 'makkah',
    name: 'Voco Makkah',
    stars: 4,
    distanceToHaramM: 550,
  },
  'al-kiswah-towers': {
    id: 'al-kiswah-towers',
    city: 'makkah',
    name: 'Al Kiswah Towers',
    stars: 4,
    distanceToHaramM: 1400,
  },
  'makarem-ajyad-makkah': {
    id: 'makarem-ajyad-makkah',
    city: 'makkah',
    name: 'Makarem Ajyad Makkah Hotel',
    stars: 4,
    distanceToHaramM: 450,
  },
  'm-millennium-makkah': {
    id: 'm-millennium-makkah',
    city: 'makkah',
    name: 'M Millennium Makkah',
    stars: 4,
    distanceToHaramM: 800,
  },
  'emaar-elite-makkah': {
    id: 'emaar-elite-makkah',
    city: 'makkah',
    name: 'Emaar Elite Makkah Hotel',
    stars: 4,
    distanceToHaramM: 900,
  },

  /* ------------------------------------------------------- Makkah — 3-star */
  'le-meridien-towers-makkah': {
    id: 'le-meridien-towers-makkah',
    city: 'makkah',
    name: 'Le Méridien Towers Makkah',
    stars: 3,
    distanceToHaramM: 450,
  },
  'al-sofwah-royale-orchid': {
    id: 'al-sofwah-royale-orchid',
    city: 'makkah',
    name: 'Al Sofwah Royale Orchid',
    stars: 3,
    distanceToHaramM: 900,
  },
  'emaar-al-manar': {
    id: 'emaar-al-manar',
    city: 'makkah',
    name: 'Emaar Al Manar Hotel',
    stars: 3,
    distanceToHaramM: 1100,
  },
  'snood-ajyad': {
    id: 'snood-ajyad',
    city: 'makkah',
    name: 'Snood Ajyad Hotel',
    stars: 3,
    distanceToHaramM: 700,
  },
  'rehab-al-bait': {
    id: 'rehab-al-bait',
    city: 'makkah',
    name: 'Rehab Al Bait Hotel',
    stars: 3,
    distanceToHaramM: 1300,
  },
  'dar-al-eiman-ajyad': {
    id: 'dar-al-eiman-ajyad',
    city: 'makkah',
    name: 'Dar Al Eiman Ajyad',
    stars: 3,
    distanceToHaramM: 800,
  },
  'ruwad-al-bait': {
    id: 'ruwad-al-bait',
    city: 'makkah',
    name: 'Ruwad Al Bait Hotel',
    stars: 3,
    distanceToHaramM: 1500,
  },

  /* ------------------------------------------------------ Madinah — 5-star */
  'anwar-al-madinah-movenpick': {
    id: 'anwar-al-madinah-movenpick',
    city: 'madinah',
    name: 'Anwar Al Madinah Mövenpick',
    stars: 5,
    distanceToHaramM: 100,
  },
  'pullman-zamzam-madinah': {
    id: 'pullman-zamzam-madinah',
    city: 'madinah',
    name: 'Pullman Zamzam Madinah',
    stars: 5,
    distanceToHaramM: 180,
  },
  'crowne-plaza-madinah': {
    id: 'crowne-plaza-madinah',
    city: 'madinah',
    name: 'Crowne Plaza Madinah by IHG',
    stars: 5,
    distanceToHaramM: 220,
  },
  'emaar-royal-hotel-medina': {
    id: 'emaar-royal-hotel-medina',
    city: 'madinah',
    name: 'Emaar Royal Hotel Medina',
    stars: 5,
    distanceToHaramM: 300,
  },
  'oberoi-madinah': {
    id: 'oberoi-madinah',
    city: 'madinah',
    name: 'Oberoi, Madina',
    stars: 5,
    distanceToHaramM: 160,
  },
  'madinah-hilton': {
    id: 'madinah-hilton',
    city: 'madinah',
    name: 'Madinah Hilton',
    stars: 5,
    distanceToHaramM: 140,
  },
  'dar-al-taqwa': {
    id: 'dar-al-taqwa',
    city: 'madinah',
    name: 'Dar Al Taqwa Hotel',
    stars: 5,
    distanceToHaramM: 120,
  },

  /* ------------------------------------------------------ Madinah — 4-star */
  'novotel-madinah': {
    id: 'novotel-madinah',
    city: 'madinah',
    name: 'Novotel Madinah',
    stars: 4,
    distanceToHaramM: 400,
  },
  'dar-al-eiman-grand': {
    id: 'dar-al-eiman-grand',
    city: 'madinah',
    name: 'Dar Al Eiman Grand',
    stars: 4,
    distanceToHaramM: 350,
  },
  'salihiya-golden': {
    id: 'salihiya-golden',
    city: 'madinah',
    name: 'Salihiya Golden Hotel',
    stars: 4,
    distanceToHaramM: 380,
  },
  'taiba-front': {
    id: 'taiba-front',
    city: 'madinah',
    name: 'Taiba Front Hotel',
    stars: 4,
    distanceToHaramM: 200,
  },
  'al-madinah-harmony': {
    id: 'al-madinah-harmony',
    city: 'madinah',
    name: 'Al Madinah Harmony Hotel',
    stars: 4,
    distanceToHaramM: 450,
  },
  'leader-al-muna-kareem': {
    id: 'leader-al-muna-kareem',
    city: 'madinah',
    name: 'Leader Al Muna Kareem',
    stars: 4,
    distanceToHaramM: 300,
  },
  'golden-tulip-al-mkal': {
    id: 'golden-tulip-al-mkal',
    city: 'madinah',
    name: 'Golden Tulip Al Mkal',
    stars: 4,
    distanceToHaramM: 500,
  },

  /* ------------------------------------------------------ Madinah — 3-star */
  'new-madinah-hotel': {
    id: 'new-madinah-hotel',
    city: 'madinah',
    name: 'New Madinah Hotel',
    stars: 3,
    distanceToHaramM: 600,
  },
  'al-eiman-ohud': {
    id: 'al-eiman-ohud',
    city: 'madinah',
    name: 'Al Eiman Ohud',
    stars: 3,
    distanceToHaramM: 700,
  },
  'ishraq-al-madinah': {
    id: 'ishraq-al-madinah',
    city: 'madinah',
    name: 'Ishraq Al Madinah Hotel',
    stars: 3,
    distanceToHaramM: 500,
  },
  'diyar-al-salam': {
    id: 'diyar-al-salam',
    city: 'madinah',
    name: 'Diyar Al Salam Hotel',
    stars: 3,
    distanceToHaramM: 800,
  },
  'golden-tulip-al-zahabi': {
    id: 'golden-tulip-al-zahabi',
    city: 'madinah',
    name: 'Golden Tulip Al Zahabi',
    stars: 3,
    distanceToHaramM: 650,
  },
  'al-ansar-golden-tulip': {
    id: 'al-ansar-golden-tulip',
    city: 'madinah',
    name: 'Al Ansar Golden Tulip',
    stars: 3,
    distanceToHaramM: 550,
  },
  'elaf-grand-al-majeedi': {
    id: 'elaf-grand-al-majeedi',
    city: 'madinah',
    name: 'Elaf Grand Al Majeedi',
    stars: 3,
    distanceToHaramM: 450,
  },
} as const satisfies Record<string, HotelSource>;

export type HotelId = keyof typeof REGISTRY;

/* ============================================================================
 * PROPERTY PHOTOGRAPHY
 *
 * A hotel's photograph is found by convention, not wired up per hotel: drop
 * `assets/photos/<hotel id>.jpg` in place, run `npm run images`, and it appears.
 * `raffles-makkah-palace.jpg` becomes the photo on Raffles Makkah Palace with no
 * edit to this file or to any page.
 *
 * The convention is doing real work. The alternative — a `photo:` line on each of
 * 42 records — is 42 chances to point a card at the wrong building, and a card
 * that names one property while showing another is a worse failure here than
 * having no photograph at all.
 *
 * ⚠ ON SOURCING THESE. A hotel's own photography is owned by the hotel or its
 * chain, and being published on their website is not a licence to republish it
 * on ours. See assets/photos/HOTEL-PHOTOS.md for the routes that do grant one —
 * the chain trade-media libraries, and the bed-bank content APIs whose licence
 * comes with the distribution contract. Nothing goes in this directory until its
 * permission is written down in CREDITS.md.
 * ========================================================================== */

/** Fallback alt text: accurate about the property even before anyone writes better. */
function defaultAlt(record: HotelSource): string {
  const city = record.city === 'makkah' ? 'Makkah' : 'Madinah';
  return `${record.name}, ${city}`;
}

/**
 * Attach the photograph if one has been processed for this id.
 *
 * `Photo` already renders nothing for a missing key, but resolving it here means
 * pages can ask "does this hotel have a picture" and lay themselves out
 * accordingly, instead of leaving a hole where an image was assumed.
 */
function resolve(record: HotelSource): HotelRecord {
  if (!(record.id in IMAGES)) return record;
  return {
    ...record,
    photo: { key: record.id as ImageKey, alt: record.photoAlt ?? defaultAlt(record) },
  };
}

const RESOLVED = Object.fromEntries(
  Object.entries(REGISTRY).map(([id, record]) => [id, resolve(record)])
) as Record<HotelId, HotelRecord>;

/**
 * Resolve a hotel by id. Typed against the registry keys, so a tier pairing
 * naming a hotel that does not exist is a compile error rather than an empty
 * card at runtime.
 */
export function hotel(id: HotelId): Hotel {
  return RESOLVED[id];
}

export const hotels: HotelRecord[] = Object.values(RESOLVED);

/** How many of the 42 currently have licensed photography. Drives the layout. */
export function hotelsWithPhotos(list: readonly Hotel[]): number {
  return list.filter((h) => h.photo).length;
}

export function hotelsInCity(city: HolyCity): HotelRecord[] {
  return hotels.filter((h) => h.city === city);
}

/**
 * One city, one star band — the unit the hotels page renders as a block.
 *
 * With 42 properties, a flat list per city is a wall of cards a visitor has to
 * read all of to reach the seven that apply to them. Splitting by band lets each
 * section carry its own distance range, which is the number they came for.
 */
export function hotelsInCityAtTier(city: HolyCity, stars: number): HotelRecord[] {
  return hotels.filter((h) => h.city === city && h.stars === stars);
}

/**
 * Closest and furthest walk across a set of hotels, for the range copy on the
 * tier and city sections.
 *
 * Returns null for an empty set rather than letting Math.min produce Infinity,
 * so a band with nothing in it renders as nothing instead of as "∞ m away".
 */
export function distanceRange(list: readonly Hotel[]): { min: number; max: number } | null {
  if (list.length === 0) return null;
  const metres = list.map((h) => h.distanceToHaramM);
  return { min: Math.min(...metres), max: Math.max(...metres) };
}
