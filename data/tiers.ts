import type { Tier } from '@/lib/types';
import type { HotelId } from './hotels';

/* ============================================================================
 * TIERS
 *
 * Three star bands, which is how this market segments itself and how the
 * audience searches — "5 star umrah packages" is a query, "premium umrah" is
 * not. Matching the competitor's vocabulary here is not imitation, it is
 * meeting people where they already are.
 *
 * Each tier owns seven hotel pairings and its pricing rate. Everything else
 * about a package is derived, which is what lets 3 tiers x 5 durations x 12
 * months generate from a few dozen lines instead of a spreadsheet.
 *
 * WHY SEVEN PAIRINGS AND NOT ONE
 *
 * A tier used to be a promise about two named properties. It is now a promise
 * about a named set of seven, paired Makkah-to-Madinah, because that is what the
 * allocation actually is — we hold rooms across a block of hotels in each band
 * and confirm which one at booking. Pretending otherwise reads better on a page
 * and produces the substitution phone call later.
 *
 * `pairings[0]` is the lead pairing: the one the generated packages name, the
 * one quoted first, and the default a booking gets unless it is full. The other
 * six are same-tier alternatives, published so the substitution is a list the
 * traveller has already seen rather than a surprise. See data/assurance.ts.
 * ========================================================================== */

/** One Makkah hotel and the Madinah hotel it is sold with. */
export interface HotelPairing {
  makkah: HotelId;
  madinah: HotelId;
}

export interface TierDefinition {
  tier: Tier;
  /** URL segment: /packages/5-star/ */
  slug: string;
  name: string;
  /** One line for cards and tier hub metadata. */
  summary: string;
  /** The honest pitch — what this tier actually buys you. */
  positioning: string;
  /**
   * The seven pairings for this band, in allocation order. `pairings[0]` is the
   * lead pairing and is the one the catalogue names; see the file header.
   *
   * Both hotels in every pairing must carry this tier's star rating — enforced
   * in lib/catalogue.test.ts, because a 4-star property quietly sold on a
   * 5-star pairing is the single complaint this whole model exists to prevent.
   */
  pairings: HotelPairing[];
  /**
   * Per-person price model, in whole pounds.
   *
   * `fixed` is the part that does not scale with length of stay — return flight,
   * visa processing, and the Jeddah/Makkah/Madinah transfer set. `perNight` is
   * accommodation and the rest.
   *
   * Splitting it this way is what makes short packages price sensibly: a 7-night
   * trip is not half the price of a 14-night one, because the flight does not
   * get cheaper. A flat per-night model gets this visibly wrong.
   *
   * One rate covers all seven pairings in the band. That is a deliberate
   * simplification and it has a limit: if two properties in the same band are
   * far apart on cost, the band is wrong, not the rate.
   */
  price: { fixed: number; perNight: number };
  /** Room basis the headline price assumes. Lower tiers quote on more sharing. */
  sharing: 'quad' | 'triple' | 'double';
}

export const tiers: TierDefinition[] = [
  {
    tier: 3,
    slug: '3-star',
    name: '3-Star Umrah Packages',
    summary:
      'Clean, well-run hotels within a short walk or a brief shuttle of the Haram, at the lowest honest price.',
    positioning:
      'The tier most first-time pilgrims actually book. Our seven Makkah properties in this band run from roughly 450 m to 1.5 km from the Haram, which is a real spread: at the near end it is a walk, at the far end you will use the shuttle several times a day. We name which pairing you are on before you pay rather than averaging it into a phrase. The rooms are simple, but the flight, visa, transfers and accommodation are all included and nothing is held back until later.',
    pairings: [
      { makkah: 'le-meridien-towers-makkah', madinah: 'new-madinah-hotel' },
      { makkah: 'al-sofwah-royale-orchid', madinah: 'al-eiman-ohud' },
      { makkah: 'emaar-al-manar', madinah: 'ishraq-al-madinah' },
      { makkah: 'snood-ajyad', madinah: 'diyar-al-salam' },
      { makkah: 'rehab-al-bait', madinah: 'golden-tulip-al-zahabi' },
      { makkah: 'dar-al-eiman-ajyad', madinah: 'al-ansar-golden-tulip' },
      { makkah: 'ruwad-al-bait', madinah: 'elaf-grand-al-majeedi' },
    ],
    price: { fixed: 450, perNight: 38 },
    sharing: 'quad',
  },
  {
    tier: 4,
    slug: '4-star',
    name: '4-Star Umrah Packages',
    summary:
      'The balance most families choose — a genuinely walkable distance to the Haram without the five-star premium.',
    positioning:
      'Seven Makkah properties from roughly 300 m to 1.4 km from the Haram, and in Madinah none of them further than about 500 m from the Nabawi. At the near end of that range you can return to your room between prayers rather than committing to the whole day out, which is the thing families are really buying. Triple sharing as standard, buffet breakfast, and hotels that hold their standard through Ramadan when the cheaper properties stop coping.',
    pairings: [
      { makkah: 'doubletree-jabal-omar', madinah: 'novotel-madinah' },
      { makkah: 'emaar-grand-hotel-mecca', madinah: 'dar-al-eiman-grand' },
      { makkah: 'voco-makkah', madinah: 'salihiya-golden' },
      { makkah: 'al-kiswah-towers', madinah: 'taiba-front' },
      { makkah: 'makarem-ajyad-makkah', madinah: 'al-madinah-harmony' },
      { makkah: 'm-millennium-makkah', madinah: 'leader-al-muna-kareem' },
      { makkah: 'emaar-elite-makkah', madinah: 'golden-tulip-al-mkal' },
    ],
    price: { fixed: 450, perNight: 62 },
    sharing: 'triple',
  },
  {
    tier: 5,
    slug: '5-star',
    name: '5-Star Umrah Packages',
    summary:
      'Haram-facing hotels a few minutes from the gates, on a double-occupancy basis.',
    positioning:
      'Seven Makkah properties from roughly 100 m to 700 m from the gates — most of them inside the Abraj Al Bait and Jabal Omar precincts, close enough that the call to prayer is the only alarm you need. In Madinah every pairing sits within about 300 m of the Nabawi. This tier exists for pilgrims travelling with elderly parents or young children, where the walk itself is the deciding factor, and for anyone who would rather spend the difference on proximity than on anything else.',
    pairings: [
      { makkah: 'raffles-makkah-palace', madinah: 'anwar-al-madinah-movenpick' },
      { makkah: 'jabal-omar-marriott', madinah: 'pullman-zamzam-madinah' },
      { makkah: 'swissotel-makkah', madinah: 'crowne-plaza-madinah' },
      { makkah: 'fairmont-clock-royal-tower', madinah: 'emaar-royal-hotel-medina' },
      { makkah: 'pullman-zamzam-makkah', madinah: 'oberoi-madinah' },
      { makkah: 'hilton-suites-makkah', madinah: 'madinah-hilton' },
      { makkah: 'sheraton-makkah-jabal-al-kaaba', madinah: 'dar-al-taqwa' },
    ],
    price: { fixed: 450, perNight: 105 },
    sharing: 'double',
  },
];

export function getTier(tier: Tier): TierDefinition {
  const found = tiers.find((t) => t.tier === tier);
  if (!found) throw new Error(`No tier definition for ${tier}`);
  return found;
}

export function getTierBySlug(slug: string): TierDefinition | undefined {
  return tiers.find((t) => t.slug === slug);
}

/**
 * The pairing a package is generated against and quoted on.
 *
 * Every caller that needs "the" hotels for a tier goes through here rather than
 * indexing `pairings` itself, so changing which pairing leads is a one-line edit
 * in the data and not a hunt through the pages.
 */
export function leadPairing(def: TierDefinition): HotelPairing {
  const lead = def.pairings[0];
  // A tier with no pairings would otherwise render as a package with no hotels
  // and no distance — the one thing this site must never publish. Fail loudly at
  // build time instead, since the catalogue is generated at build time.
  if (!lead) throw new Error(`Tier ${def.slug} has no hotel pairings`);
  return lead;
}
