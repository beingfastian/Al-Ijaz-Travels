import type { Metadata } from 'next';
import Link from 'next/link';
import { Footprints, Star, MapPin } from 'lucide-react';
import type { Tier } from '@/lib/types';
import {
  hotels,
  hotelsInCity,
  hotelsInCityAtTier,
  distanceRange,
  hotel,
  hotelsWithPhotos,
} from '@/data/hotels';
import { tiers } from '@/data/tiers';
import { formatDistance, formatDistanceRange, formatGbp, formatSharing } from '@/lib/format';
import { packagesByTier } from '@/data/packages';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CalloutCta } from '@/components/ui/CalloutCta';
import { Photo } from '@/components/ui/Photo';
import { tierHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Our Hotels in Makkah and Madinah',
  description:
    'Every hotel we use in Makkah and Madinah, named, with its real walking distance to the Haram and Masjid an-Nabawi in metres. Grouped by star band, sorted by distance.',
  alternates: { canonical: '/hotels/' },
};

/**
 * The hotels page.
 *
 * The strongest page on this site, and the one a competitor cannot easily copy —
 * not because the design is clever but because it requires committing to a
 * number. "Close to the Haram" is free to write and impossible to check. "100 m"
 * is checkable on a map before anyone pays, and it is what the whole site is
 * positioned on.
 *
 * WHY ROWS AND NOT A CARD GRID
 *
 * There are 42 properties now, seven per city per star band. A card grid put
 * them in reading order that zigzags across columns, which made the sort
 * invisible — and the sort is the argument. Ranked rows inside a per-band panel
 * read top to bottom, so "closest first" is something you can see rather than
 * something the intro claims. It also stops the page being three screens of
 * near-identical cards with the same link repeated 42 times.
 *
 * Sorted by distance rather than by star rating within each band, deliberately.
 * Star ratings describe the lobby; distance describes the walk back at midnight
 * in Ramadan with elderly parents, which is what the decision actually turns on.
 */

/**
 * Ascending, to match data/tiers.ts and the tier order everywhere else on the
 * site. Leading with 5-star reads better commercially, but the pairings section
 * further down this same page iterates `tiers` directly — so descending here put
 * the two halves of one page in opposite orders, which is worse than either
 * order is good.
 */
const BANDS: Tier[] = [3, 4, 5];

export default function HotelsPage() {
  const makkahDistances = hotels
    .filter((h) => h.city === 'makkah')
    .map((h) => h.distanceToHaramM);
  const closest = Math.min(...makkahDistances);
  const furthest = Math.max(...makkahDistances);

  /**
   * A photograph of the city, captioned as the city — never as a property.
   *
   * The 42 hotels have no licensed photography yet, and the honest options were a
   * bare page or a stock room under a named hotel. This is the third: an image of
   * the place, labelled as the place, above the list of hotels in it. It says
   * nothing about any individual property, which is exactly why it is safe to
   * show while per-hotel photography is still being licensed.
   */
  const cities = [
    {
      key: 'makkah' as const,
      city: 'Makkah',
      landmark: 'the Haram',
      image: 'makkah-skyline-night' as const,
      imageAlt: 'Makkah at night, the Haram and the clock tower above the surrounding city',
    },
    {
      key: 'madinah' as const,
      city: 'Madinah',
      landmark: 'Masjid an-Nabawi',
      image: 'nabawi-twilight' as const,
      imageAlt: 'Masjid an-Nabawi in Madinah at twilight, its minarets lit against a pink sky',
    },
  ];

  return (
    <>
      <section className="premium-surface relative isolate overflow-hidden">
        <Photo
          image="haram-courtyard"
          alt="The Masjid al-Haram courtyard seen from an upper level, hotels rising behind it"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/35"
        />

        <div className="max-container padding-container relative flex flex-col gap-5 py-20 lg:py-24">
          <p className="eyebrow-premium">Hotels</p>
          <h1 className="max-w-3xl text-display text-on-premium">
            {hotels.length} named hotels,
            <span className="block text-on-premium-accent">measured distances</span>
          </h1>
          <p className="prose-column text-body-lg text-on-premium-muted">
            Every property below is one we actually place pilgrims in — seven in each
            city at each star band — listed with its real walking distance. In Makkah
            they run from {formatDistance(closest)} to {formatDistance(furthest)} from
            the Haram. We publish both ends because the near one is a walk, the far one
            is a shuttle, and it is the one thing you can check before you pay.
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-16 py-12 lg:py-16">
        {cities.map(({ key, city, landmark, image, imageAlt }) => (
          <section key={city} aria-labelledby={`hotels-${key}`} className="flex flex-col gap-8">
            {/*
              Wide and short — a band, not a hero. It orients the reader at the top
              of a long list without competing with the distances, which are what
              the page is actually for.
            */}
            <figure className="relative isolate overflow-hidden rounded-panel">
              <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
                <Photo
                  image={image}
                  alt={imageAlt}
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-noir-950/85 via-noir-950/30 to-transparent"
                />
              </div>
              {/*
                The city name lives here rather than in a heading below, so the
                photograph is captioned as the city and not left to read as an
                image of whichever hotel happens to be listed first beneath it.
                That distinction is the whole reason this image is safe to show
                while per-property photography is still unlicensed.
              */}
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 p-5 sm:p-6">
                <h2 id={`hotels-${key}`} className="font-serif text-heading text-on-premium">
                  {city}
                </h2>
                <span className="text-body-sm text-on-premium-muted">
                  {hotelsInCity(key).length} hotels we use, by distance to {landmark}
                </span>
              </figcaption>
            </figure>

            <p className="prose-column text-body-lg text-text-muted">
              Grouped by star band, and within each band sorted by walking distance to{' '}
              {landmark} — closest first, because that is the order the decision is
              actually made in.
            </p>

            <div className="grid gap-6 lg:grid-cols-3">
              {BANDS.map((band, i) => {
                const list = hotelsInCityAtTier(key, band).sort(
                  (a, b) => a.distanceToHaramM - b.distanceToHaramM
                );
                const spread = distanceRange(list);

                // All-or-nothing per band. A thumbnail column where only two of
                // seven rows have an image reads as broken rather than as partial,
                // so the column appears once the whole band is photographed and the
                // panel stays exactly as it is until then.
                const showThumbs = hotelsWithPhotos(list) === list.length;

                return (
                  <Reveal
                    key={band}
                    index={i}
                    className="flex flex-col rounded-panel border border-border bg-surface shadow-card"
                  >
                    <div className="flex flex-col gap-1 border-b border-border p-5">
                      <span className="inline-flex items-center gap-1.5 eyebrow">
                        <Star size={12} className="fill-gold-500 text-gold-500" aria-hidden />
                        {band}-star
                      </span>
                      {spread && (
                        <span className="text-body-sm text-green-700">
                          {formatDistanceRange(spread)} from {landmark}
                        </span>
                      )}
                    </div>

                    <ol className="flex flex-col">
                      {list.map((h) => (
                        <li
                          key={h.id}
                          className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3 last:border-b-0"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            {showThumbs && h.photo && (
                              <span className="relative size-11 shrink-0 overflow-hidden rounded-[0.5rem] bg-surface-sunk">
                                <Photo
                                  image={h.photo.key}
                                  alt={h.photo.alt}
                                  sizes="44px"
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </span>
                            )}
                            <span className="text-body-sm font-medium text-text">{h.name}</span>
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-body-sm font-semibold text-green-700">
                            <Footprints size={14} aria-hidden />
                            {formatDistance(h.distanceToHaramM)}
                          </span>
                        </li>
                      ))}
                    </ol>

                    <p className="mt-auto p-5 text-body-sm text-text-muted">
                      Used on our {band}-star packages.{' '}
                      <Link href={tierHref(band)} className="text-link underline">
                        See {band}-star
                      </Link>
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}

        <section aria-labelledby="by-tier" className="flex flex-col gap-8">
          <div className="section-header-centered">
            <h2 id="by-tier" className="text-heading">
              Which hotels come with which tier
            </h2>
            <p className="text-body-lg text-text-muted">
              A star rating on this site is a promise about a named set of pairings, not
              a vague band. Each Makkah hotel is sold with one specific Madinah hotel,
              and the first pairing is the one your quote is built on.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => {
              const cheapest = Math.min(...packagesByTier(tier.tier).map((p) => p.price.gbp));
              return (
                <Reveal
                  key={tier.slug}
                  index={i}
                  className="flex flex-col rounded-panel border border-border bg-surface"
                >
                  <div className="flex flex-col gap-1 border-b border-border p-5">
                    <span className="eyebrow">{tier.tier}-star</span>
                    <span className="text-body-sm text-text-muted">
                      {tier.pairings.length} pairings
                    </span>
                  </div>

                  <ol className="flex flex-col">
                    {tier.pairings.map((pair, index) => {
                      const makkah = hotel(pair.makkah);
                      const madinah = hotel(pair.madinah);
                      const isLead = index === 0;

                      return (
                        <li
                          key={pair.makkah}
                          className={`flex flex-col gap-2 border-b border-border/60 px-5 py-4 last:border-b-0 ${
                            isLead ? 'bg-surface-sunk' : ''
                          }`}
                        >
                          <span className="text-label uppercase tracking-[0.14em] text-text-muted">
                            {isLead ? 'Pairing 1 · quoted' : `Pairing ${index + 1}`}
                          </span>
                          {[makkah, madinah].map((h) => (
                            <div key={h.name} className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-body-sm text-text-muted">
                                <MapPin size={12} aria-hidden />
                                {h.city === 'makkah' ? 'Makkah' : 'Madinah'}
                              </span>
                              <span className="text-body-sm font-medium text-text">{h.name}</span>
                              <span className="text-body-sm text-green-700">
                                {formatDistance(h.distanceToHaramM)} away
                              </span>
                            </div>
                          ))}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-auto flex flex-col gap-4 border-t border-border p-5">
                    <p className="text-body-sm text-text-muted">
                      From{' '}
                      <strong className="font-serif text-body-lg text-green-900">
                        {formatGbp(cheapest)}
                      </strong>{' '}
                      per person, {formatSharing(tier.sharing)}
                    </p>
                    <Button href={tierHref(tier.tier)} variant="secondary" full>
                      See {tier.tier}-star packages
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <CalloutCta
          title="Distances are approximate walking routes"
          actions={<Button href="/quote/">Ask which hotel suits you</Button>}
        >
          Measured from the hotel entrance to the nearest gate, not to the mataf, and
          rounded honestly. In Ramadan the practical walk is longer than any map
          suggests, because the approaches are managed and the crowds are dense — which
          is exactly when the difference between {formatDistance(closest)} and{' '}
          {formatDistance(furthest)} stops being a detail. Which pairing you are on is
          confirmed in writing with every booking, and a substitution is always within
          the same star band.
        </CalloutCta>
      </div>
    </>
  );
}
