import type { Package, Sharing } from './types.ts';
import { totalNights } from './types.ts';

/**
 * Display formatting. UK market, so prices are GBP in the en-GB locale.
 *
 * Umrah packages are quoted in whole pounds — `£1,095`, never `£1,095.00`. The
 * pence are noise on a four-figure price and they make a card column ragged.
 */

const GBP = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function formatGbp(amount: number): string {
  return GBP.format(amount);
}

/**
 * The headline price on a card.
 *
 * "from £1,095" is the honest framing: the figure is the lowest departure across
 * the airports and dates this package runs, so a bare "£1,095" would read as a
 * fixed price and generate the complaint at quote stage. Al Habib prints a bare
 * number; stating the basis is the cheaper choice for us.
 */
export function formatPriceFrom(amount: number): string {
  return `from ${GBP.format(amount)}`;
}

/** "7 nights · 4 Makkah / 3 Madinah" */
export function formatNights(pkg: Package): string {
  const total = totalNights(pkg);
  return `${total} night${total === 1 ? '' : 's'} · ${pkg.nights.makkah} Makkah / ${pkg.nights.madinah} Madinah`;
}

/**
 * Walking distance, rounded the way a person would say it.
 * Sub-kilometre stays in metres because that is the range pilgrims care about.
 */
export function formatDistance(metres: number): string {
  if (metres < 1000) {
    const rounded = metres < 100 ? metres : Math.round(metres / 10) * 10;
    return `${rounded} m`;
  }
  return `${(metres / 1000).toFixed(1)} km`;
}

const SHARING_LABEL: Record<Sharing, string> = {
  quad: 'quad sharing',
  triple: 'triple sharing',
  double: 'double sharing',
};

export function formatSharing(sharing: Sharing): string {
  return SHARING_LABEL[sharing];
}

/** 'ramadan-2027' -> 'Ramadan 2027'; '2027-03' -> 'March 2027'. */
export function formatMonthKey(key: string): string {
  const named = /^([a-z]+)-(\d{4})$/.exec(key);
  if (named && named[1] && named[2]) {
    return `${named[1][0]!.toUpperCase()}${named[1].slice(1)} ${named[2]}`;
  }
  const numeric = /^(\d{4})-(\d{2})$/.exec(key);
  if (numeric && numeric[1] && numeric[2]) {
    // Day 1 at UTC noon: avoids the month sliding backwards in negative offsets.
    const date = new Date(Date.UTC(Number(numeric[1]), Number(numeric[2]) - 1, 1, 12));
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return key;
}

export function formatStars(tier: number): string {
  return `${tier}-star`;
}
