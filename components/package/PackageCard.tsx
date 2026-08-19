import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { Star, Footprints } from 'lucide-react';
import type { Package } from '@/lib/types';
import { makkahHaramDistanceM, totalNights } from '@/lib/types';
import { formatDistance, formatNights, formatPriceFrom, formatSharing } from '@/lib/format';

/**
 * Card leads on the two things that actually decide an Umrah booking: price and
 * how far the hotel is from the Haram. Al Habib buries distance in a comparison
 * table further down the page; putting it on the card is the whole advantage.
 */
export function PackageCard({ pkg }: { pkg: Package }) {
  const distance = makkahHaramDistanceM(pkg);
  const nights = totalNights(pkg);

  return (
    // `relative` is load-bearing: the title link stretches an ::after over the
    // whole card to make it one click target, which needs a positioned ancestor.
    <article className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-green-900">
        {pkg.images.length > 0 && pkg.images[0] ? (
          <Photo
            image={pkg.images[0].key}
            alt={pkg.images[0].alt}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Photography pending. A branded placeholder rather than a broken
             <img> — shipping 404ing images is precisely the base repo's bug. */
          <div className="khatam-field-gold absolute inset-0 flex-center">
            <span className="font-serif text-subheading text-gold-200" lang="ar">
              الإعجاز
            </span>
          </div>
        )}

        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-sand-50/95 px-3 py-1 text-body-sm font-medium text-green-900">
          <Star size={14} className="fill-gold-500 text-gold-500" aria-hidden />
          {pkg.tier}-star
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-subheading">
            {/*
              prefetch={false} because the listing renders up to 195 cards, and
              Next prefetches every link that enters the viewport. Scrolling the
              catalogue would fire ~195 speculative payload requests for pages the
              visitor will mostly never open — wasted bandwidth on exactly the
              mobile connections this audience is browsing on. The card is one tap
              from a fully prerendered static page; it does not need the help.
            */}
            <Link
              href={`/packages/${pkg.slug}/`}
              prefetch={false}
              className="after:absolute after:inset-0"
            >
              {pkg.name}
            </Link>
          </h3>
          <p className="text-body-sm text-text-muted">{formatNights(pkg)}</p>
        </div>

        <p className="text-body-sm text-text-muted line-clamp-3">{pkg.summary}</p>

        {distance !== null && (
          <p className="inline-flex items-center gap-2 text-body-sm text-green-700">
            <Footprints size={16} aria-hidden />
            <span>
              Makkah hotel <strong className="font-semibold">{formatDistance(distance)}</strong>{' '}
              from the Haram
            </span>
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="font-serif text-subheading text-green-900">
              {formatPriceFrom(pkg.price.gbp)}
            </span>
            <span className="text-body-sm text-text-muted">
              per person, {formatSharing(pkg.price.sharing)}
            </span>
          </div>
          <span className="text-body-sm text-text-muted">
            {nights} night{nights === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </article>
  );
}
