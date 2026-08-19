import type { MonthKey, Package, Tier } from '@/lib/types';
import { buildCatalogue } from '@/lib/catalogue';

/* ============================================================================
 * PACKAGE CATALOGUE
 *
 * Generated, not authored. 3 tiers x 5 durations = 15 evergreen packages, plus
 * 3 x 5 x 12 = 180 month variants, for 195 in total.
 *
 * The previous six PKR packages were deleted rather than converted: the currency
 * was wrong, and so were the durations, tiers, departure points and hotels. A
 * GBP figure on a package designed for a Karachi departure is a placeholder
 * wearing a disguise.
 *
 * Editing rule: change data/tiers.ts, data/durations.ts or data/months.ts, never
 * this file. The generator lives in lib/catalogue.ts and is unit tested there —
 * which matters, because a pricing bug here is 195 wrong numbers, not one.
 * ========================================================================== */

export const packages: Package[] = buildCatalogue();

export function getPackage(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function featuredPackages(): Package[] {
  return packages.filter((p) => p.featured);
}

/** Evergreen packages only — the month variants would swamp a listing. */
export function basePackages(): Package[] {
  return packages.filter((p) => !p.month);
}

export function packagesByTier(tier: Tier): Package[] {
  return packages.filter((p) => p.tier === tier);
}

export function packagesByMonth(month: MonthKey): Package[] {
  return packages.filter((p) => p.month === month);
}

/** Every month key present in the catalogue, for the month filter. */
export function allDepartureMonths(): string[] {
  return [...new Set(packages.flatMap((p) => p.departureMonths))].sort();
}
