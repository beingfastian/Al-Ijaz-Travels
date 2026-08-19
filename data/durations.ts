/* ============================================================================
 * DURATIONS
 *
 * Two sets, deliberately — this mirrors the competitor's own URL structure.
 *
 * Their evergreen packages run 7, 8, 10, 14 and 20 nights; their month packages
 * run 7, 10, 12, 14 and 21. It looks like an inconsistency, and it may well have
 * started as one, but it is what their indexed URLs say, and page-for-page
 * parity is the brief. Two sets it is.
 *
 * The Makkah/Madinah split is not arbitrary. Pilgrims want the majority of the
 * stay in Makkah, and the Madinah leg is conventionally shorter — the Ziyarat
 * sites there are done comfortably in three to four days. Every split below
 * weights Makkah, which is what an experienced agent would actually book.
 * ========================================================================== */

export interface Duration {
  nights: number;
  makkah: number;
  madinah: number;
}

function split(nights: number, makkah: number): Duration {
  return { nights, makkah, madinah: nights - makkah };
}

/** Evergreen packages: /packages/[tier]/[n]-nights-[tier]-umrah-package */
export const baseDurations: Duration[] = [
  split(7, 4),
  split(8, 5),
  split(10, 6),
  split(14, 8),
  split(20, 12),
];

/** Month packages: /packages/[tier]/[n]-nights-[tier]-[month]-umrah-package */
export const monthDurations: Duration[] = [
  split(7, 4),
  split(10, 6),
  split(12, 7),
  split(14, 8),
  split(21, 13),
];

/** Every distinct night count across both sets, for filter bounds. */
export const allNightCounts = [
  ...new Set([...baseDurations, ...monthDurations].map((d) => d.nights)),
].sort((a, b) => a - b);
