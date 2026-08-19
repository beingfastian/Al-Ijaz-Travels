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
 * Each tier owns its hotel pairing and its pricing rate. Everything else about
 * a package is derived, which is what lets 3 tiers x 5 durations x 12 months
 * generate from a few dozen lines instead of a spreadsheet.
 * ========================================================================== */

export interface TierDefinition {
  tier: Tier;
  /** URL segment: /packages/5-star/ */
  slug: string;
  name: string;
  /** One line for cards and tier hub metadata. */
  summary: string;
  /** The honest pitch — what this tier actually buys you. */
  positioning: string;
  hotels: { makkah: HotelId; madinah: HotelId };
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
      'The tier most first-time pilgrims actually book. You are further from the Haram — around 1.4 km in Makkah — and the rooms are simple, but the flight, visa, transfers and accommodation are all included and nothing is hidden until later. If budget is the constraint, this is the package that does not cut corners on the things that matter.',
    hotels: { makkah: 'al-kiswah-towers', madinah: 'rawdah-suites' },
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
      'Around 300 m from the Haram in Makkah, which in practice means you can return to your room between prayers rather than committing to the whole day out. Triple sharing as standard, buffet breakfast, and hotels that hold their standard through Ramadan when the cheaper properties stop coping.',
    hotels: { makkah: 'dar-al-eiman-grand', madinah: 'frontel-al-harithia' },
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
      'Roughly 120 m from the Haram — close enough that the call to prayer is the only alarm you need. This tier exists for pilgrims travelling with elderly parents or young children, where the walk itself is the deciding factor, and for anyone who would rather spend the difference on proximity than on anything else.',
    hotels: { makkah: 'swissotel-al-maqam', madinah: 'dar-al-taqwa' },
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
