import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, ArrowRight } from 'lucide-react';
import { airports, routeDescription } from '@/data/airports';
import { packages } from '@/data/packages';
import { formatGbp } from '@/lib/format';
import { Reveal } from '@/components/ui/Reveal';
import { cityHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Umrah Packages by UK City',
  description:
    'Umrah packages departing London, Manchester, Birmingham, Newcastle, Glasgow and Edinburgh. Each page names its airport, says whether the flight is direct, and shows only what genuinely departs from there.',
  alternates: { canonical: '/city-packages/' },
};

/**
 * The city hub.
 *
 * Six entries, one per airport we operate from. The honesty in the table below —
 * "direct" against "one connection", and the package count differing between
 * them — is the point of the page. A visitor in Newcastle can see, before
 * clicking anything, that their journey has a layover and that thirty-nine of
 * our packages are not available to them.
 *
 * That is information most operators withhold until the quote. Publishing it
 * costs a few bookings and buys the ones where somebody was going to find out
 * anyway and would rather have known.
 */
export default function CityPackagesPage() {
  const rows = airports.map((airport) => {
    const available = packages.filter((p) => p.departures.includes(airport.code));
    return {
      airport,
      count: available.length,
      cheapest: Math.min(...available.map((p) => p.price.gbp)),
    };
  });

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">By departure city</p>
          <h1 className="text-display">Flying from where?</h1>
          <p className="prose-column text-body-lg text-text-muted">
            Six UK airports, and a page for each that names the airport rather than
            implying one. Three fly direct to Jeddah; three connect. Where a package
            does not run from your airport, we say so on the page rather than at the
            quote.
          </p>
        </div>
      </section>

      <div className="max-container padding-container py-12 lg:py-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ airport, count, cheapest }, i) => (
            <Reveal key={airport.code} as="li" variant="scale" index={i} className="flex">
              <Link
                href={cityHref(airport.slug)}
                className="hover-lift group flex flex-1 flex-col gap-3 rounded-panel border border-border bg-surface p-6 shadow-card transition-colors hover:border-green-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-serif text-subheading text-green-900">
                      {airport.city}
                    </span>
                    <span className="text-body-sm text-text-muted">{airport.name}</span>
                  </div>
                  <Plane
                    size={18}
                    className={
                      airport.directToSaudi ? 'shrink-0 text-gold-600' : 'shrink-0 text-sand-400'
                    }
                    aria-hidden
                  />
                </div>

                <p className="flex-1 text-body-sm text-text-muted">
                  {routeDescription(airport)}
                </p>

                <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                  <span className="text-body-sm text-text-muted">
                    from{' '}
                    <strong className="font-serif text-body-lg text-green-900">
                      {formatGbp(cheapest)}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-body-sm text-link">
                    {count} packages
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-body-sm text-text-muted">
          Not listed? We can usually arrange a connecting departure from other UK
          airports — ask, and we will tell you honestly whether it is worth it or
          whether you would be better travelling to one of the six above.
        </p>
      </div>
    </>
  );
}
