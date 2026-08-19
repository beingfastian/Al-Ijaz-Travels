import type { Package } from '@/lib/types';
import { nearestHaramDistanceM, totalNights } from '@/lib/types';
import { formatDistance, formatMonthKey, formatGbp, formatSharing } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { whatsappUrl } from '@/lib/whatsapp';
import { site } from '@/data/site';

/**
 * Sticky price and CTA rail on the package detail page.
 *
 * The primary CTA carries the package slug into the quote flow, so the form
 * arrives pre-selected and the visitor never re-picks what they were just
 * reading about. The WhatsApp link carries the package name and URL for the
 * same reason — a consultant should not have to ask "which package?".
 */
export function PriceRail({ pkg }: { pkg: Package }) {
  const distance = nearestHaramDistanceM(pkg);
  const nights = totalNights(pkg);

  return (
    <div className="flex flex-col gap-5 rounded-panel border border-border bg-surface p-6 shadow-card">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-heading text-green-900">{formatGbp(pkg.price.gbp)}</span>
        <span className="text-body-sm text-text-muted">
          per person, {formatSharing(pkg.price.sharing)}
        </span>
      </div>

      <dl className="flex flex-col gap-3 border-y border-border py-4 text-body-sm">
        <div className="flex-between gap-4">
          <dt className="text-text-muted">Total nights</dt>
          <dd className="font-medium">{nights}</dd>
        </div>
        <div className="flex-between gap-4">
          <dt className="text-text-muted">Makkah / Madinah</dt>
          <dd className="font-medium">
            {pkg.nights.makkah} / {pkg.nights.madinah}
          </dd>
        </div>
        {distance !== null && (
          <div className="flex-between gap-4">
            <dt className="text-text-muted">Nearest hotel</dt>
            <dd className="font-medium">{formatDistance(distance)}</dd>
          </div>
        )}
        <div className="flex-between gap-4">
          <dt className="text-text-muted">Departures</dt>
          <dd className="text-right font-medium">
            {pkg.departureMonths.map(formatMonthKey).join(', ')}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <Button href={`/quote/?package=${pkg.slug}`} full size="lg">
          Request a quote
        </Button>
        <Button
          href={whatsappUrl({
            packageName: pkg.name,
            packageUrl: `${site.url}/packages/${pkg.slug}/`,
          })}
          variant="secondary"
          full
        >
          Ask on WhatsApp
        </Button>
      </div>

      <p className="text-body-sm text-text-muted">
        Requesting a quote does not commit you to booking. A consultant confirms
        availability first.
      </p>
    </div>
  );
}
