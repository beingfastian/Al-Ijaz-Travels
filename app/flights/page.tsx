import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, Clock, Luggage, Users } from 'lucide-react';
import { airports, routeDescription } from '@/data/airports';
import { packages } from '@/data/packages';
import { formatGbp } from '@/lib/format';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { RouteIllustration } from '@/components/home/RouteIllustration';
import { cityHref, listingHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Flights to Jeddah from the UK',
  description:
    'Return flights from six UK airports. Which fly direct to Jeddah and which connect, how long the journey really takes, and what the baggage allowance covers.',
  alternates: { canonical: '/flights/' },
};

/**
 * The flights page.
 *
 * Its whole job is to be straight about connections. Three of our six airports
 * fly direct; three do not, and a pilgrim departing Newcastle will spend four to
 * six hours longer in transit than one departing Heathrow. Operators routinely
 * leave that to the itinerary email.
 *
 * Saying it here costs a few bookings from people who then choose Manchester,
 * and it is the right trade — the alternative is the same person discovering it
 * at the airport, which costs the relationship.
 */
export default function FlightsPage() {
  const direct = airports.filter((a) => a.directToSaudi);
  const connecting = airports.filter((a) => !a.directToSaudi);

  const facts = [
    {
      icon: Clock,
      title: 'Direct is about six and a half hours',
      detail:
        'London, Manchester or Birmingham to Jeddah, gate to gate. A connecting departure is typically eleven to fourteen hours door to door once the layover is counted.',
    },
    {
      icon: Luggage,
      title: 'Usually 2 × 23 kg checked',
      detail:
        'Standard on the carriers we use, but it varies by airline and fare. We confirm your exact allowance in writing, because Zamzam and gifts on the return leg are where people get caught.',
    },
    {
      icon: Users,
      title: 'Groups seated together',
      detail:
        'Where a package carries several families on one departure we request seating together and a group leader travels with them. Ask at quote stage rather than at check-in.',
    },
    {
      icon: Plane,
      title: 'Jeddah, not Madinah, on most routes',
      detail:
        'Nearly all our packages fly into Jeddah and transfer to Makkah by road. Some Madinah-first itineraries exist; tell us if you would prefer to begin there.',
    },
  ];

  return (
    <>
      <section className="premium-surface relative isolate overflow-hidden">
        <Photo
          image="makkah-skyline-night"
          alt="Makkah at night, the Haram and the clock tower above the surrounding city"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/35"
        />

        <div className="max-container padding-container relative flex flex-col gap-5 py-20 lg:py-24">
          <p className="eyebrow-premium">Flights</p>
          <h1 className="max-w-3xl text-display text-on-premium">
            Three airports fly direct.
            <span className="block text-on-premium-accent">Three do not.</span>
          </h1>
          <p className="prose-column text-body-lg text-on-premium-muted">
            Return flights are included in every package. Which airport you leave from
            changes the journey more than anything else on this page, so it is stated
            here rather than left to the itinerary email.
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-16 py-12 lg:py-16">
        <Reveal className="flex flex-col items-center gap-4 rounded-panel border border-border bg-surface p-8">
          {/* On a light ground, where its green pins and gold flight path read
              properly — and on the page whose subject is the route itself. */}
          <RouteIllustration className="w-full max-w-[560px]" />
          <p className="text-body-sm text-text-muted">
            Every package covers both cities: Makkah for the rites, Madinah for the
            Ziyarat, with the transfer between them included.
          </p>
        </Reveal>

        <section aria-labelledby="routes" className="flex flex-col gap-8">
          <div className="section-header-centered">
            <h2 id="routes" className="text-heading">
              Departures from your airport
            </h2>
            <p className="text-body-lg text-text-muted">
              Package counts are computed from the catalogue. The regional airports show
              fewer because the twenty- and twenty-one-night stays only run from the
              three with direct flights.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              { title: 'Direct to Jeddah', list: direct, note: 'No connection, no domestic leg.' },
              {
                title: 'One connection',
                list: connecting,
                note: 'Usually via Doha, Dubai or Istanbul.',
              },
            ].map(({ title, list, note }) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-subheading text-green-900">{title}</h3>
                  <p className="text-body-sm text-text-muted">{note}</p>
                </div>

                <ul className="flex flex-col gap-3">
                  {list.map((airport, i) => {
                    const available = packages.filter((p) => p.departures.includes(airport.code));
                    const cheapest = Math.min(...available.map((p) => p.price.gbp));
                    return (
                      <Reveal
                        key={airport.code}
                        as="li"
                        index={i}
                        className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-5"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-serif text-subheading text-green-900">
                            {airport.city}
                          </span>
                          <span className="text-body-sm text-text-muted">{airport.code}</span>
                        </div>
                        <p className="text-body-sm text-text-muted">
                          {routeDescription(airport)}
                        </p>
                        <p className="text-body-sm text-text-muted">{airport.journey}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                          <span className="text-body-sm text-text-muted">
                            from{' '}
                            <strong className="font-serif text-body-lg text-green-900">
                              {formatGbp(cheapest)}
                            </strong>{' '}
                            · {available.length} packages
                          </span>
                          <Link
                            href={cityHref(airport.slug)}
                            className="text-body-sm text-link underline"
                          >
                            {airport.city} packages
                          </Link>
                        </div>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="flight-facts" className="flex flex-col gap-8">
          <h2 id="flight-facts" className="text-heading text-center">
            What to expect on the flight
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {facts.map(({ icon: Icon, title, detail }, i) => (
              <Reveal
                key={title}
                as="li"
                index={i}
                className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
              >
                <Icon size={20} className="text-gold-text" aria-hidden />
                <h3 className="font-serif text-subheading text-green-900">{title}</h3>
                <p className="text-body-sm text-text-muted">{detail}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
          <h2 className="text-subheading">Flying from somewhere else?</h2>
          <p className="prose-column text-body text-text-muted">
            We can usually arrange a connecting departure from other UK airports. We will
            also tell you honestly when it is not worth it and you would be better
            travelling to one of the six above — which is more often than you might
            expect.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/quote/">Ask about your airport</Button>
            <Button href={listingHref()} variant="secondary">
              Browse packages
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
