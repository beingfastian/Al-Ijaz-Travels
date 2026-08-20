import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Plane, MapPin } from 'lucide-react';
import { airports, getAirportBySlug, routeDescription } from '@/data/airports';
import { basePackages } from '@/data/packages';
import { packages } from '@/data/packages';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS } from '@/lib/types';
import { formatGbp } from '@/lib/format';
import { PackageCard } from '@/components/package/PackageCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CalloutCta } from '@/components/ui/CalloutCta';
import { cityHref, cityFromSegment, listingHref } from '@/lib/routes';

/**
 * A city landing page — /city-packages/manchester-umrah-packages/.
 *
 * There are six of these because there are six airports we actually fly from.
 * The reference site runs fourteen, including cities with no airport, whose
 * copy is the same paragraph with the place name swapped. A Leeds page that
 * quietly routes you to Manchester cannot answer its own question, so it is not
 * a page worth having.
 *
 * Each one names its airport, says whether the flight is direct, and shows only
 * packages that genuinely depart from there — which for the regional airports is
 * fewer, because the twenty-night stays do not run from them.
 */

export function generateStaticParams() {
  return airports.map((a) => ({ city: `${a.slug}-umrah-packages` }));
}

type Props = { params: Promise<{ city: string }> };

function resolve(segment: string) {
  const slug = cityFromSegment(segment);
  return slug ? getAirportBySlug(slug) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const airport = resolve(city);
  if (!airport) return {};

  const available = packages.filter((p) => p.departures.includes(airport.code));
  const cheapest = Math.min(...available.map((p) => p.price.gbp));

  return {
    title: `Umrah Packages from ${airport.city}`,
    description: `${available.length} Umrah packages departing ${airport.name}, from ${formatGbp(cheapest)} per person. ${routeDescription(airport)}.`,
    alternates: { canonical: cityHref(airport.slug) },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const airport = resolve(city);
  if (!airport) notFound();

  const all = packages.filter((p) => p.departures.includes(airport.code));
  const cheapest = Math.min(...all.map((p) => p.price.gbp));

  const evergreen = applyFilters(
    basePackages().filter((p) => p.departures.includes(airport.code)),
    DEFAULT_FILTERS
  );

  const missing = basePackages().length - evergreen.length;

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">{airport.region}</p>
          <h1 className="text-display">Umrah Packages from {airport.city}</h1>
          <p className="prose-column text-body-lg text-text-muted">{airport.intro}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-body-sm">
            <span className="inline-flex items-center gap-2 text-green-700">
              <Plane size={16} aria-hidden />
              {routeDescription(airport)}
            </span>
            <span className="inline-flex items-center gap-2 text-text-muted">
              <MapPin size={16} aria-hidden />
              Serving {airport.serves.slice(0, 4).join(', ')}
            </span>
          </div>

          <p className="text-body-lg text-green-900">
            From <strong className="font-serif text-heading">{formatGbp(cheapest)}</strong> per
            person · {all.length} packages
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-12 py-12 lg:py-16">
        <Reveal className="flex flex-col gap-3 rounded-panel border border-border bg-surface-sunk p-6">
          <h2 className="text-subheading">The journey from {airport.city}</h2>
          <p className="prose-column text-body text-text-muted">{airport.journey}</p>
          {missing > 0 && (
            <p className="prose-column text-body text-text-muted">
              <strong className="font-semibold text-text">
                {missing} of our packages do not run from {airport.city}.
              </strong>{' '}
              The twenty- and twenty-one-night stays operate from London, Manchester and
              Birmingham only, because anything longer from a connecting airport makes
              for a journey we would not want to sell you. Everything else below departs
              from {airport.name}.
            </p>
          )}
        </Reveal>

        <section aria-labelledby="city-packages" className="flex flex-col gap-6">
          <h2 id="city-packages" className="text-heading">
            Departing {airport.name}
          </h2>
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {evergreen.map((pkg, i) => (
              <Reveal key={pkg.slug} as="li" variant="scale" index={i} className="flex">
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </ul>
          <p className="text-body-sm text-text-muted">
            Looking for specific dates?{' '}
            <a href={listingHref({ airport: airport.code })} className="text-link underline">
              Filter all {all.length} packages from {airport.city}
            </a>
            .
          </p>
        </section>

        <CalloutCta
          title={`Travelling as a group from ${airport.city}?`}
          tone="surface"
          actions={<Button href="/quote/">Request a quote from {airport.city}</Button>}
        >
          {/* City-specific rather than templated — see Airport.groupNote. */}
          <p>{airport.groupNote}</p>
          <p className="mt-3 text-body-sm">
            We commonly collect from {airport.serves.join(', ')}.
          </p>
        </CalloutCta>
      </div>
    </>
  );
}
