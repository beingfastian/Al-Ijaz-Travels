import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footprints, BedDouble } from 'lucide-react';
import { tiers, getTierBySlug, leadPairing } from '@/data/tiers';
import { hotel, distanceRange } from '@/data/hotels';
import { basePackages, packagesByTier } from '@/data/packages';
import { formatDistance, formatDistanceRange, formatGbp, formatSharing } from '@/lib/format';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS } from '@/lib/types';
import { PackageCard } from '@/components/package/PackageCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Photo } from '@/components/ui/Photo';
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

  const makkah = hotel(leadPairing(def).makkah);
  const cheapest = Math.min(...packagesByTier(def.tier).map((p) => p.price.gbp));

  return {
    title: def.name,
    description: `${def.summary} ${def.pairings.length} named hotel pairings, from ${makkah.name} at ${makkah.distanceToHaramM} m from the Haram. From ${formatGbp(cheapest)} per person, ${formatSharing(def.sharing)}.`,
    alternates: { canonical: tierHref(def.tier) },
  };
}

export default async function TierHubPage({ params }: Props) {
  const { tier } = await params;
  const def = getTierBySlug(tier);
  if (!def) notFound();

  // The lead pairing is what the packages name and what a booking gets by
  // default; the other six are the same-tier alternatives, published rather than
  // held back so a substitution is never the first time you hear the name.
  const lead = leadPairing(def);
  const makkah = hotel(lead.makkah);
  const madinah = hotel(lead.madinah);
  const alternates = def.pairings.slice(1);
  const makkahSpread = distanceRange(def.pairings.map((p) => hotel(p.makkah)));

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

          <section aria-labelledby="tier-hotels" className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h2 id="tier-hotels" className="text-heading">
                The hotels at this tier
              </h2>
              <p className="prose-column text-body text-text-muted">
                Named, not implied. {def.pairings.length} Makkah properties paired with{' '}
                {def.pairings.length} in Madinah, and your booking is confirmed on one
                specific pairing before you pay. Every distance below is a walking
                distance.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="eyebrow">Lead pairing — what these packages quote</p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[makkah, madinah].map((h) => (
                  <li
                    key={h.name}
                    className="flex flex-col overflow-hidden rounded-panel border border-border bg-surface"
                  >
                    {/* Rendered only where a licensed photograph of this exact
                        property exists. No photo leaves the card as it was, rather
                        than leaving a frame for one. */}
                    {h.photo && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunk">
                        <Photo
                          image={h.photo.key}
                          alt={h.photo.alt}
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-3 p-6">
                      <span className="eyebrow">{h.city === 'makkah' ? 'Makkah' : 'Madinah'}</span>
                      <span className="font-serif text-subheading text-green-900">{h.name}</span>
                      <span className="inline-flex items-center gap-2 text-body-sm text-green-700">
                        <Footprints size={16} aria-hidden />
                        {formatDistance(h.distanceToHaramM)} from{' '}
                        {h.city === 'makkah' ? 'the Haram' : 'Masjid an-Nabawi'}
                      </span>
                      {h.photo?.credit && (
                        <span className="text-body-sm text-text-muted">
                          Photo: {h.photo.credit}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Six alternates, so the two-column grid fills exactly three rows and
                nothing is left orphaned on the last one. */}
            <div className="flex flex-col gap-4">
              <p className="eyebrow">Same-tier alternatives</p>
              <p className="prose-column text-body-sm text-text-muted">
                Where the lead pairing is full, you are moved onto one of these — same
                star band, named here in advance, with its own distance stated rather
                than assumed.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {alternates.map((pair, i) => (
                  <li
                    key={pair.makkah}
                    className="flex flex-col gap-3 rounded-panel border border-border bg-surface-sunk p-5"
                  >
                    <span className="text-label uppercase tracking-[0.14em] text-text-muted">
                      Pairing {i + 2}
                    </span>
                    <div className="flex flex-col gap-2">
                      {[hotel(pair.makkah), hotel(pair.madinah)].map((h) => (
                        <div key={h.name} className="flex flex-col gap-0.5">
                          <span className="text-body-sm font-medium text-text">{h.name}</span>
                          <span className="text-body-sm text-text-muted">
                            {h.city === 'makkah' ? 'Makkah' : 'Madinah'} ·{' '}
                            <span className="text-green-700">
                              {formatDistance(h.distanceToHaramM)}
                            </span>{' '}
                            from {h.city === 'makkah' ? 'the Haram' : 'the Nabawi'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
            {/* The spread across all seven pairings, not the lead pairing's figure.
                One number here would read as a guarantee that six of the seven
                hotels cannot keep. */}
            {makkahSpread && (
              <p className="inline-flex items-center gap-2 text-body-sm text-text-muted">
                <Footprints size={16} aria-hidden />
                {formatDistanceRange(makkahSpread)} from the Haram
              </p>
            )}

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
