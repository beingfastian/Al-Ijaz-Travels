import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { seasonalBanner } from '@/data/trust';

/**
 * Seasonal strip for Ramadan / Hajj season.
 *
 * Returns null when the season is off rather than hiding with CSS, so a stale
 * banner cannot ship in the markup. It sits above the hero because in season it
 * is the most time-sensitive thing on the page — allocation near the Haram runs
 * out months ahead, and that is genuinely useful to know before scrolling.
 */
export function SeasonalBanner() {
  if (!seasonalBanner.active) return null;

  return (
    <Link
      href={seasonalBanner.href}
      className="group block bg-green-950 text-sand-50 transition-colors hover:bg-green-900"
    >
      <div className="max-container padding-container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-3 text-center">
        <span className="text-label uppercase tracking-[0.14em] font-semibold text-gold-300">
          {seasonalBanner.label}
        </span>
        <span className="text-body-sm text-gold-100">{seasonalBanner.message}</span>
        <span className="inline-flex items-center gap-1 text-body-sm font-medium text-sand-50 underline underline-offset-2">
          {seasonalBanner.cta}
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
