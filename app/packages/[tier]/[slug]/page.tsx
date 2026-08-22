import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Check, Minus, AlertTriangle, Plane, Bus, Car } from 'lucide-react';
import { packages, getPackage } from '@/data/packages';
import { formatNights, formatGbp, formatSharing } from '@/lib/format';
import { faqs } from '@/data/faqs';
import { EnquiryForm } from '@/components/quote/EnquiryForm';
import { HotelCard } from '@/components/package/HotelCard';
import { Itinerary } from '@/components/package/Itinerary';
import { PriceRail } from '@/components/package/PriceRail';
import { site } from '@/data/site';
import { getMonth } from '@/data/months';
import { getAirport } from '@/data/airports';
import { packageHref } from '@/lib/routes';
import { Photo } from '@/components/ui/Photo';

/**
 * Real routes, not `?id=`.
 *
 * Every package prerenders to its own indexable HTML file with its own metadata.
 * The Tripix reference identifies a detail page by query param, which is
 * invisible to search engines — fine for an app behind a login, wrong for a
 * catalogue that needs to rank.
 */
export function generateStaticParams() {
  return packages.map((pkg) => ({ tier: `${pkg.tier}-star`, slug: pkg.slug }));
}

type Props = { params: Promise<{ tier: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};

  return {
    title: pkg.name,
    description: pkg.summary,
    alternates: { canonical: packageHref(pkg) },
    openGraph: { title: pkg.name, description: pkg.summary, type: 'article' },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const month = pkg.month ? getMonth(pkg.month) : undefined;
  const hero = pkg.images[0];

  /**
   * JSON-LD so package pages can earn rich results. Competitors in this space
   * generally do not bother, which makes it cheap advantage.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.summary,
    touristType: 'Pilgrimage',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: d.title,
        description: d.detail,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price.gbp,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
    },
    provider: { '@type': 'TravelAgency', name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Authored in this repo, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="premium-surface relative isolate overflow-hidden border-b border-border">
        {hero && (
          <Photo
            image={hero.key}
            alt={hero.alt}
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/40"
        />

        <div className="max-container padding-container relative flex flex-col gap-4 py-16 lg:py-20">
          <p className="eyebrow-premium">
            {pkg.tier}-star · {formatNights(pkg)}
          </p>
          <h1 className="text-display text-on-premium">{pkg.name}</h1>
          <p className="prose-column text-body-lg text-on-premium-muted">{pkg.summary}</p>

          <p className="text-body-lg text-on-premium">
            From{' '}
            <strong className="font-serif text-heading text-on-premium-accent">
              {formatGbp(pkg.price.gbp)}
            </strong>{' '}
            per person, {formatSharing(pkg.price.sharing)}
          </p>

          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-on-premium-muted">
            <li>
              Departs from{' '}
              <strong className="font-medium text-on-premium">
                {pkg.departures.map((c) => getAirport(c)?.city ?? c).join(', ')}
              </strong>
            </li>
            {month && (
              <li>
                Makkah in {month.name}:{' '}
                <strong className="font-medium text-on-premium">{month.makkahHighC}°C</strong>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/*
        Availability is stated before the price, not after it. Umrah visas are
        typically suspended around Hajj, so a May or June departure may simply not
        be operable — and a visitor who finds that out after choosing a package
        has been wasted, not served. The reference site sells these months with no
        mention of it.
      */}
      {month && month.availability === 'restricted' && (
        <div className="border-b border-gold-300 bg-gold-50">
          <div className="max-container padding-container flex items-start gap-3 py-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-text" aria-hidden />
            <p className="text-body-sm text-text">
              <strong className="font-semibold">{month.name} departures may be restricted.</strong>{' '}
              {month.note} Speak to us before planning around this month.
            </p>
          </div>
        </div>
      )}

      {/*
        min-w-0 on both children, and on the lg track too.

        A single-column grid track is `auto`, which means min-content, and a
        native <select> computes white-space: pre — so its min-content is the
        width of its LONGEST OPTION. The enquiry form's "Departing from" and
        "Preferred month" menus dragged this track out to 381px inside a 342px
        container and the whole page scrolled sideways by 16px at 390px wide.
        Nothing visibly wrapped, so it read as a stray margin rather than as a
        control forcing the layout.

        Verified min-width:0 collapses the track to 342px and clips nothing but
        the sr-only spans, which are 1px by design.
      */}
      <div className="max-container padding-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-16">
        <div className="flex min-w-0 flex-col gap-14">
          <section aria-labelledby="hotels-heading" className="flex flex-col gap-6">
            <h2 id="hotels-heading" className="text-heading">
              Where you stay
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {pkg.hotels.map((hotel) => (
                <HotelCard key={`${hotel.city}-${hotel.name}`} hotel={hotel} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="itinerary-heading" className="flex flex-col gap-6">
            <h2 id="itinerary-heading" className="text-heading">
              Day by day
            </h2>
            <Itinerary days={pkg.itinerary} />
          </section>

          {/* Inclusions and exclusions get equal visual weight on purpose. */}
          <section aria-labelledby="whats-included" className="flex flex-col gap-6">
            <h2 id="whats-included" className="text-heading">
              What is and is not included
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-panel border border-green-200 bg-green-50 p-6">
                <h3 className="font-serif text-subheading text-green-900">Included</h3>
                <ul className="flex flex-col gap-3">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-sm">
                      <Check size={16} className="mt-1 shrink-0 text-green-700" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface-sunk p-6">
                <h3 className="font-serif text-subheading text-green-900">Not included</h3>
                <ul className="flex flex-col gap-3">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-sm">
                      <Minus size={16} className="mt-1 shrink-0 text-sand-600" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          {/* Transfers, named. The competitor states the vehicle class and route,
              and they are right to — "transfers included" tells a family with
              elderly parents nothing about what actually turns up. */}
          <section aria-labelledby="transfers-heading" className="flex flex-col gap-6">
            <h2 id="transfers-heading" className="text-heading">
              Transfers included
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Plane, label: 'Jeddah airport to Makkah', detail: 'Private vehicle, meets your flight' },
                { icon: Bus, label: 'Makkah to Madinah', detail: 'By road, around 5 hours' },
                { icon: Car, label: 'Madinah to the airport', detail: 'Timed to your departure' },
              ].map(({ icon: Icon, label, detail }) => (
                <li
                  key={label}
                  className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-5"
                >
                  <Icon size={20} className="text-gold-text" aria-hidden />
                  <span className="text-body font-medium text-text">{label}</span>
                  <span className="text-body-sm text-text-muted">{detail}</span>
                </li>
              ))}
            </ul>
            <p className="prose-column text-body-sm text-text-muted">
              Ziyarat coaches in both cities are included too.{' '}
              <Link href="/transport/" className="text-link underline">
                Full transfer detail
              </Link>
              .
            </p>
          </section>

          {/* The enquiry form on the page itself, not a link to it. Sending a
              visitor to another route to ask a question about the package they
              are already reading is friction we were adding for no reason. */}
          <section
            id="enquire"
            aria-labelledby="enquire-heading"
            className="flex flex-col gap-6 rounded-panel border border-border bg-surface-sunk p-6 lg:p-8"
          >
            <div className="flex flex-col gap-2">
              <h2 id="enquire-heading" className="text-heading">
                Ask about this package
              </h2>
              <p className="prose-column text-body text-text-muted">
                One form, about a minute. We confirm availability on your dates before
                anyone is asked for a deposit.
              </p>
            </div>
            <Suspense fallback={<p className="text-body-sm text-text-muted">Loading…</p>}>
              <EnquiryForm packageSlug={pkg.slug} />
            </Suspense>
          </section>

          <section aria-labelledby="package-faq" className="flex flex-col gap-6">
            <h2 id="package-faq" className="text-heading">
              Common questions
            </h2>
            <dl className="prose-column flex flex-col divide-y divide-border">
              {faqs.slice(0, 5).map((faq) => (
                <div key={faq.question} className="flex flex-col gap-2 py-5">
                  <dt className="text-subheading">{faq.question}</dt>
                  <dd className="text-body text-text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <PriceRail pkg={pkg} />
        </aside>
      </div>
    </>
  );
}
