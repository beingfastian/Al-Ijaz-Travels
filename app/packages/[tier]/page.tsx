import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footprints, BedDouble } from 'lucide-react';
import { tiers, getTierBySlug } from '@/data/tiers';
import { hotel } from '@/data/hotels';
import { basePackages, packagesByTier } from '@/data/packages';
import { formatDistance, formatGbp, formatSharing } from '@/lib/format';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS } from '@/lib/types';
import { PackageCard } from '@/components/package/PackageCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { listingHref, tierHref } from '@/lib/routes';

/**
 * Tier hubs — /packages/5-star/ and its two siblings.
 *
 * These exist because "5 star umrah packages" is a query and "premium umrah" is
 * not. Matching the competitor's vocabulary is meeting the audience where it
 * already is, not imitation.
 *
 * What makes them worth having rather than a filtered listing with a nicer URL:
 * each one names the actual hotels, the actual walking distance, and the actual
 * room basis for that tier. A tier is a promise about where you sleep and how far
 * you walk at 3 a.m., and that is answerable in specifics.
 */

export function generateStaticParams() {
  return tiers.map((t) => ({ tier: t.slug }));
}

type Props = { params: Promise<{ tier: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier } = await params;
  const def = getTierBySlug(tier);
  if (!def) return {};

  const makkah = hotel(def.hotels.makkah);
  const cheapest = Math.min(...packagesByTier(def.tier).map((p) => p.price.gbp));

  return {
    title: def.name,
    description: `${def.summary} ${makkah.name}, ${makkah.distanceToHaramM} m from the Haram. From ${formatGbp(cheapest)} per person, ${formatSharing(def.sharing)}.`,
    alternates: { canonical: tierHref(def.tier) },
  };
}

export default async function TierHubPage({ params }: Props) {
  const { tier } = await params;
  const def = getTierBySlug(tier);
  if (!def) notFound();

  const makkah = hotel(def.hotels.makkah);
  const madinah = hotel(def.hotels.madinah);

  // Evergreen packages only. The 60 month variants for this tier belong on the
  // month pages; listing them here would bury the five durations that matter.
  const evergreen = applyFilters(
    basePackages().filter((p) => p.tier === def.tier),
    DEFAULT_FILTERS
  );
  const cheapest = Math.min(...packagesByTier(def.tier).map((p) => p.price.gbp));

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">{def.tier}-star</p>
          <h1 className="text-display">{def.name}</h1>
          <p className="prose-column text-body-lg text-text-muted">{def.summary}</p>
        </div>
      </section>

      <div className="max-container padding-container grid gap-12 py-12 lg:grid-cols-[1fr_320px] lg:py-16">
        <div className="flex flex-col gap-12">
          <Reveal className="prose-column">
            <p className="text-body-lg text-text">{def.positioning}</p>
          </Reveal>

          <section aria-labelledby="tier-hotels" className="flex flex-col gap-5">
            <h2 id="tier-hotels" className="text-heading">
              The hotels at this tier
            </h2>
            <p className="prose-column text-body text-text-muted">
              Named, not implied. Every {def.tier}-star package on this site uses these
              two properties unless you ask us to change them, and the distances are
              walking distances.
            </p>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[makkah, madinah].map((h) => (
                <li
                  key={h.name}
                  className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
                >
                  <span className="eyebrow">{h.city === 'makkah' ? 'Makkah' : 'Madinah'}</span>
                  <span className="font-serif text-subheading text-green-900">{h.name}</span>
                  <span className="inline-flex items-center gap-2 text-body-sm text-green-700">
                    <Footprints size={16} aria-hidden />
                    {formatDistance(h.distanceToHaramM)} from{' '}
                    {h.city === 'makkah' ? 'the Haram' : 'Masjid an-Nabawi'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tier-packages" className="flex flex-col gap-6">
            <h2 id="tier-packages" className="text-heading">
              {def.tier}-star packages
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {evergreen.map((pkg, i) => (
                <Reveal key={pkg.slug} as="li" variant="scale" index={i} className="flex">
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </ul>

            <p className="text-body-sm text-text-muted">
              Looking for a specific month?{' '}
              <a href={listingHref({ tier: def.tier })} className="text-link underline">
                Filter the full catalogue
              </a>{' '}
              — every departure month is priced separately.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6 shadow-card">
            <p className="eyebrow">From</p>
            <p className="font-serif text-heading text-green-900">{formatGbp(cheapest)}</p>
            <p className="text-body-sm text-text-muted">
              per person, {formatSharing(def.sharing)}
            </p>

            <hr className="gold-divider" />

            <p className="inline-flex items-center gap-2 text-body-sm text-text-muted">
              <BedDouble size={16} aria-hidden />
              {formatSharing(def.sharing)} as standard
            </p>
            <p className="inline-flex items-center gap-2 text-body-sm text-text-muted">
              <Footprints size={16} aria-hidden />
              {formatDistance(makkah.distanceToHaramM)} from the Haram
            </p>

            <Button href="/quote/" full>
              Request a quote
            </Button>
            <p className="text-body-sm text-text-muted">
              A quote costs nothing and does not commit you to booking.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
