'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import type { PackageFilters, Tier } from '@/lib/types';
import type { filterBounds } from '@/lib/filter';
import { formatMonthKey, formatGbp } from '@/lib/format';
import { airports } from '@/data/airports';
import type { AirportCode } from '@/lib/types';

/**
 * Filter controls for the package listing.
 *
 * Presentational only: it receives the current filters and reports changes
 * upward. All state lives in the URL — see PackageListing. Keeping this
 * component free of routing means the filter logic stays testable and the panel
 * can be reused by a seasonal landing page later.
 *
 * Every bound is passed in, derived from the catalogue. Nothing here is a magic
 * number; the Tripix reference hardcodes a [0,500] USD range that matches no real
 * package at all.
 */

const TIERS: Tier[] = [5, 4, 3];

export function FilterPanel({
  filters,
  bounds,
  months,
  cleared,
  onChange,
  onClear,
}: {
  filters: PackageFilters;
  bounds: ReturnType<typeof filterBounds>;
  months: string[];
  cleared: boolean;
  onChange: (patch: Partial<PackageFilters>) => void;
  onClear: () => void;
}) {
  const toggleTier = (tier: Tier) => {
    onChange({
      tiers: filters.tiers.includes(tier)
        ? filters.tiers.filter((t) => t !== tier)
        : [...filters.tiers, tier],
    });
  };

  return (
    <aside
      aria-label="Filter packages"
      className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start"
    >
      <div className="flex-between">
        <h2 className="inline-flex items-center gap-2 font-serif text-subheading">
          <SlidersHorizontal size={18} aria-hidden />
          Filter
        </h2>
        {!cleared && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-body-sm text-gold-text hover:text-green-900"
          >
            <X size={14} aria-hidden />
            Clear all
          </button>
        )}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-label uppercase tracking-[0.14em] text-text-muted">
          Hotel rating
        </legend>
        {TIERS.map((tier) => (
          <label key={tier} className="flex items-center gap-3 text-body">
            <input
              type="checkbox"
              checked={filters.tiers.includes(tier)}
              onChange={() => toggleTier(tier)}
              className="size-4 accent-green-700"
            />
            {tier}-star
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-3">
        <label htmlFor="maxPrice" className="text-label uppercase tracking-[0.14em] text-text-muted">
          Maximum price
        </label>
        <input
          id="maxPrice"
          type="range"
          min={bounds.minPriceGbp}
          max={bounds.maxPriceGbp}
          step={5000}
          value={filters.maxPriceGbp ?? bounds.maxPriceGbp}
          onChange={(e) => {
            const value = Number(e.target.value);
            // At the top of the range the filter is off, not "everything under max" —
            // so the URL stays clean and the "clear all" control disappears correctly.
            onChange({ maxPriceGbp: value >= bounds.maxPriceGbp ? null : value });
          }}
          className="accent-green-700"
        />
        <p className="text-body-sm text-text-muted">
          Up to {formatGbp(filters.maxPriceGbp ?? bounds.maxPriceGbp)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="maxDistance"
          className="text-label uppercase tracking-[0.14em] text-text-muted"
        >
          Walking distance to the Haram
        </label>
        <input
          id="maxDistance"
          type="range"
          min={100}
          max={bounds.maxDistanceM}
          step={50}
          value={filters.maxDistanceM ?? bounds.maxDistanceM}
          onChange={(e) => {
            const value = Number(e.target.value);
            onChange({ maxDistanceM: value >= bounds.maxDistanceM ? null : value });
          }}
          className="accent-green-700"
        />
        <p className="text-body-sm text-text-muted">
          Within {filters.maxDistanceM ?? bounds.maxDistanceM} m
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="airport" className="text-label uppercase tracking-[0.14em] text-text-muted">
          Departing from
        </label>
        <select
          id="airport"
          value={filters.airport ?? ''}
          onChange={(e) =>
            onChange({ airport: e.target.value === '' ? null : (e.target.value as AirportCode) })
          }
          className="rounded-card border border-border bg-surface px-3 py-2 text-body-sm"
        >
          <option value="">Any UK airport</option>
          {airports.map((a) => (
            <option key={a.code} value={a.code}>
              {a.city} ({a.code})
            </option>
          ))}
        </select>
        {/* Stated rather than discovered: the longest stays do not run from the
            regional airports, so narrowing here genuinely removes packages. */}
        <p className="text-body-sm text-text-muted">
          Long stays run from London, Manchester and Birmingham only.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="month" className="text-label uppercase tracking-[0.14em] text-text-muted">
          Departure
        </label>
        <select
          id="month"
          value={filters.month ?? ''}
          onChange={(e) => onChange({ month: e.target.value || null })}
          className="rounded-card border border-border bg-surface px-3 py-2 text-body"
        >
          <option value="">Any month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthKey(m)}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
