import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, Minus } from 'lucide-react';
import { packages, getPackage } from '@/data/packages';
import { formatNights } from '@/lib/format';
import { HotelCard } from '@/components/package/HotelCard';
import { Itinerary } from '@/components/package/Itinerary';
import { PriceRail } from '@/components/package/PriceRail';
import { site } from '@/data/site';

/**
 * Real routes, not `?id=`.
 *
 * Every package prerenders to its own indexable HTML file with its own metadata.
 * The Tripix reference identifies a detail page by query param, which is
 * invisible to search engines — fine for an app behind a login, wrong for a
 * catalogue that needs to rank.
 */
export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};

  return {
    title: pkg.name,
    description: pkg.summary,
    alternates: { canonical: `/packages/${pkg.slug}/` },
    openGraph: { title: pkg.name, description: pkg.summary, type: 'article' },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

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

      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">
            {pkg.tier}-star · {formatNights(pkg)}
          </p>
          <h1 className="text-display">{pkg.name}</h1>
          <p className="prose-column text-body-lg text-text-muted">{pkg.summary}</p>
        </div>
      </section>

      <div className="max-container padding-container grid gap-12 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        <div className="flex flex-col gap-14">
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
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <PriceRail pkg={pkg} />
        </aside>
      </div>
    </>
  );
}
