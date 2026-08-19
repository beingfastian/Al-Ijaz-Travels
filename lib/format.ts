import type { Package, Sharing } from './types.ts';
import { totalNights } from './types.ts';

/**
 * Display formatting. Pakistani market, so prices are PKR and read in the
 * lakh-friendly grouping the en-PK locale produces.
 */

const PKR = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
});

export function formatPkr(amount: number): string {
  return PKR.format(amount);
}

/**
 * Compact price for cards, where the full figure crowds the layout.
 * 385000 -> "3.85 lakh". Lakh is how this market actually talks about price.
 */
export function formatPkrCompact(amount: number): string {
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    const text = lakh % 1 === 0 ? String(lakh) : lakh.toFixed(2).replace(/0$/, '');
    return `PKR ${text} lakh`;
  }
  return PKR.format(amount);
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
    return date.toLocaleDateString('en-PK', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return key;
}

export function formatStars(tier: number): string {
  return `${tier}-star`;
}
