'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { packages, allDepartureMonths } from '@/data/packages';
import {
  applyFilters,
  filterBounds,
  filtersFromSearchParams,
  isDefaultFilters,
  searchParamsFromFilters,
} from '@/lib/filter';
import type { PackageFilters, SortKey } from '@/lib/types';
import Link from 'next/link';
import { tiers } from '@/data/tiers';
import { formatGbp } from '@/lib/format';
import { tierHref } from '@/lib/routes';
import { PackageCard } from './PackageCard';
import { FilterPanel } from './FilterPanel';

/**
 * Filter state lives in the URL, not a store.
 *
 * The Tripix reference keeps it in Zustand, which costs the two things that
 * matter most here: a consultant cannot send a client a link to "5-star, 10
 * nights, under 400k", and the state vanishes on refresh. Everything below reads
 * from useSearchParams and writes with router.replace.
 *
 * This component owns routing; FilterPanel owns presentation; lib/filter.ts owns
 * the logic and is unit tested without either.
 */

/** Cards rendered per page. Twelve fills three rows on a wide screen. */
const PAGE_SIZE = 12;

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'price-asc', label: 'Price, lowest first' },
  { value: 'price-desc', label: 'Price, highest first' },
  { value: 'nights-desc', label: 'Longest stay' },
  { value: 'distance-asc', label: 'Closest to the Haram' },
];

export function PackageListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => filtersFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const bounds = useMemo(() => filterBounds(packages), []);
  const months = useMemo(() => allDepartureMonths(), []);
  const results = useMemo(() => applyFilters(packages, filters), [filters]);

  /**
   * Render in pages rather than all at once.
   *
   * The catalogue is 195 packages. Rendering every match put ~195 cards in the
   * DOM, and Lighthouse measured the consequence honestly: first contentful
   * paint at 8.3 s on a throttled phone and nearly a second of blocking time.
   * Nobody scrolls 195 cards; the filters exist so they do not have to.
   *
   * Reset on filter change, so narrowing the results never leaves a visitor
   * looking at page three of a set that now has eight items in it.
   */
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => setVisible(PAGE_SIZE), [filters]);

  const shown = results.slice(0, visible);

  const update = useCallback(
    (patch: Partial<PackageFilters>) => {
      const qs = searchParamsFromFilters({ ...filters, ...patch });
      // replace, not push: filtering is refinement, not navigation. Otherwise the
      // back button walks through every checkbox the visitor touched.
      router.replace(qs ? `/packages/?${qs}` : '/packages/', { scroll: false });
    },
    [filters, router]
  );

  const clear = useCallback(() => {
    router.replace('/packages/', { scroll: false });
  }, [router]);

  const cleared = isDefaultFilters(filters);

  return (
    <div className="max-container padding-container grid gap-10 py-12 lg:grid-cols-[280px_1fr] lg:py-16">
      <FilterPanel
        filters={filters}
        bounds={bounds}
        months={months}
        cleared={cleared}
        onChange={update}
        onClear={clear}
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-text-muted" role="status" aria-live="polite">
            {results.length} package{results.length === 1 ? '' : 's'}
            {!cleared && ' match your filters'}
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-body-sm text-text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="rounded-card border border-border bg-surface px-3 py-2 text-body-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-panel border border-border bg-surface p-12 text-center">
            <p className="font-serif text-subheading text-green-900">
              No packages match those filters
            </p>
            <p className="mt-2 text-body text-text-muted">
              Try widening the price or distance range — or ask us directly and we
              will put something together.
            </p>
          </div>
        ) : cleared ? (
          /*
            Unfiltered: group by tier, the way the audience thinks and the way the
            competitor lays it out. "5 star umrah packages" is a search; a flat
            grid of 195 cards sorted by price is a database view, and the first
            thing it hides is the one distinction anyone is actually choosing on.

            Evergreen packages only in this view. The 180 month variants belong on
            their month pages, and pouring them into a tier section would bury the
            five durations that matter under sixty near-identical cards.
          */
          <div className="flex flex-col gap-14">
            {tiers.map((tier) => {
              const list = results.filter((p) => p.tier === tier.tier && !p.month);
              if (list.length === 0) return null;
              const from = Math.min(...list.map((p) => p.price.gbp));

              return (
                <section key={tier.slug} aria-labelledby={`tier-${tier.slug}`} className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 id={`tier-${tier.slug}`} className="font-serif text-heading text-green-900">
                        {tier.tier}-Star Packages
                      </h2>
                      <p className="prose-column text-body-sm text-text-muted">{tier.summary}</p>
                    </div>
                    <Link
                      href={tierHref(tier.tier)}
                      className="inline-flex shrink-0 items-center gap-1.5 text-body-sm text-link underline"
                    >
                      All {tier.tier}-star from {formatGbp(from)}
                    </Link>
                  </div>

                  <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {list.map((pkg) => (
                      <li key={pkg.slug} className="flex">
                        <PackageCard pkg={pkg} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <p className="text-body-sm text-text-muted">
              Looking for a specific month? Use the filters, or browse{' '}
              <Link href="/monthly-packages/" className="text-link underline">
                packages by month
              </Link>{' '}
              — every departure month is priced separately.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((pkg) => (
              <li key={pkg.slug} className="flex">
                <PackageCard pkg={pkg} />
              </li>
            ))}
          </ul>
        )}

        {!cleared && shown.length < results.length && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <p className="text-body-sm text-text-muted" role="status" aria-live="polite">
              Showing {shown.length} of {results.length}
            </p>
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border border-green-300 bg-surface px-6 py-3 text-body font-medium text-green-900 transition-colors hover:border-green-700 hover:bg-green-50"
            >
              Show {Math.min(PAGE_SIZE, results.length - shown.length)} more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
