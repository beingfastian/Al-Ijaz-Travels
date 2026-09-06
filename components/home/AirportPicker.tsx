import Link from 'next/link';
import { Plane, ArrowRight } from 'lucide-react';
import { airports, routeDescription } from '@/data/airports';
import { packages } from '@/data/packages';
import { basePackages } from '@/data/packages';
import { formatGbp } from '@/lib/format';
import { Reveal } from '@/components/ui/Reveal';

/**
 * "Where are you flying from" — the first question a UK pilgrim actually has.
 *
 * The reference site answers this with fourteen city landing pages and no way to
 * narrow the catalogue, so a visitor from Newcastle reads the same list as one
 * from Heathrow and finds out at quote stage which departures do not run. Here
 * the six airports are a filter, and the price under each is the genuine cheapest
 * departure from that airport — computed, not copied between cards.
 *
 * That last point is why this is worth building rather than decorating: the
 * regional airports really are more expensive, because the long stays only run
 * from the three with direct flights. Showing that up front is the whole
 * positioning of the site applied to its own home page.
 */
export function AirportPicker() {
  const evergreen = basePackages();

  const options = airports.map((airport) => {
    const available = evergreen.filter((p) => p.departures.includes(airport.code));
    const from = available.length > 0 ? Math.min(...available.map((p) => p.price.gbp)) : null;
    // Count across the whole catalogue, so the figure matches what the listing
    // will actually show once the filter is applied.
    const total = packages.filter((p) => p.departures.includes(airport.code)).length;
    return { airport, from, total };
  });

  return (
    <section className="border-y border-border bg-surface-sunk">
      <div className="max-container padding-container flex flex-col gap-8 py-12 lg:py-16">
        <Reveal className="section-header-centered">
          <p className="eyebrow">Departures</p>
          <h2 className="text-heading">Flying from where?</h2>
          <p className="text-body-lg text-text-muted">
            Six UK airports. Both numbers on each card are computed from the
            catalogue, not written by hand: the price is the cheapest package that
            genuinely departs from there, and the count is how many you can
            actually choose between. Newcastle, Glasgow and Edinburgh show fewer,
            because the twenty- and twenty-one-night stays only run from the three
            airports with direct flights.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map(({ airport, from, total }, i) => (
            <Reveal key={airport.code} as="li" variant="scale" index={i} className="flex">
              <Link
                href={`/packages/?airport=${airport.code}`}
                className="hover-lift group flex flex-1 flex-col gap-3 rounded-panel border border-border bg-surface p-5 shadow-card transition-colors hover:border-green-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-serif text-subheading text-green-900">
                      {airport.city}
                    </span>
                    <span className="text-body-sm text-text-muted">
                      {airport.name} · {airport.code}
                    </span>
                  </div>
                  <Plane
                    size={18}
                    className={
                      airport.directToSaudi ? 'shrink-0 text-gold-600' : 'shrink-0 text-sand-400'
                    }
                    aria-hidden
                  />
                </div>

                <p className="text-body-sm text-text-muted">{routeDescription(airport)}</p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
                  <span className="text-body-sm text-text-muted">
                    {from !== null ? (
                      <>
                        from{' '}
                        <strong className="font-serif text-body-lg text-green-900">
                          {formatGbp(from)}
                        </strong>
                      </>
                    ) : (
                      'Speak to us'
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 text-body-sm text-link">
                    {total} packages
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
      </div>
    </section>
  );
}
