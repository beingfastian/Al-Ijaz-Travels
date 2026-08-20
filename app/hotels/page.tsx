import type { Metadata } from 'next';
import Link from 'next/link';
import { Footprints, Star, MapPin } from 'lucide-react';
import { hotels } from '@/data/hotels';
import { tiers } from '@/data/tiers';
import { formatDistance, formatGbp, formatSharing } from '@/lib/format';
import { packagesByTier } from '@/data/packages';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { tierHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Our Hotels in Makkah and Madinah',
  description:
    'Every hotel we use, named, with its real walking distance to the Haram and Masjid an-Nabawi in metres. Sorted by distance, not by marketing.',
  alternates: { canonical: '/hotels/' },
};

/**
 * The hotels page.
 *
 * The strongest page on this site, and the one a competitor cannot easily copy —
 * not because the design is clever but because it requires committing to a
 * number. "Close to the Haram" is free to write and impossible to check. "120 m"
 * is checkable on a map before anyone pays, and it is what the whole site is
 * positioned on.
 *
 * Sorted by distance rather than by star rating, deliberately. Star ratings
 * describe the lobby; distance describes the walk back at midnight in Ramadan
 * with elderly parents, which is what the decision actually turns on.
 */
export default function HotelsPage() {
  const makkah = hotels
    .filter((h) => h.city === 'makkah')
    .sort((a, b) => a.distanceToHaramM - b.distanceToHaramM);
  const madinah = hotels
    .filter((h) => h.city === 'madinah')
    .sort((a, b) => a.distanceToHaramM - b.distanceToHaramM);

  const closest = Math.min(...makkah.map((h) => h.distanceToHaramM));

  const groups = [
    { city: 'Makkah', landmark: 'the Haram', list: makkah },
    { city: 'Madinah', landmark: 'Masjid an-Nabawi', list: madinah },
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
            Named hotels,
            <span className="block text-on-premium-accent">measured distances</span>
          </h1>
          <p className="prose-column text-body-lg text-on-premium-muted">
            Every property below is one we actually place pilgrims in, listed with its
            real walking distance. The closest is {formatDistance(closest)} from the
            Haram. We publish the number because it is the one thing you can check
            before you pay.
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-16 py-12 lg:py-16">
        {groups.map(({ city, landmark, list }) => (
          <section key={city} aria-labelledby={`hotels-${city}`} className="flex flex-col gap-8">
            <div className="section-header-centered">
              <h2 id={`hotels-${city}`} className="text-heading">
                {city}
              </h2>
              <p className="text-body-lg text-text-muted">
                Sorted by walking distance to {landmark} — closest first, because that is
                the order the decision is actually made in.
              </p>
            </div>

            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((hotel, i) => (
                <Reveal
                  key={hotel.id}
                  as="li"
                  variant="scale"
                  index={i}
                  className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif text-subheading text-green-900">
                      {hotel.name}
                    </span>
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-sunk px-2.5 py-1 text-body-sm font-medium text-green-900"
                      aria-label={`${hotel.stars} star`}
                    >
                      <Star size={12} className="fill-gold-500 text-gold-500" aria-hidden />
                      {hotel.stars}
                    </span>
                  </div>

                  <p className="inline-flex items-center gap-2 text-body text-green-700">
                    <Footprints size={17} aria-hidden />
                    <strong className="font-semibold">
                      {formatDistance(hotel.distanceToHaramM)}
                    </strong>
                    <span className="text-text-muted">from {landmark}</span>
                  </p>

                  <p className="mt-auto border-t border-border pt-4 text-body-sm text-text-muted">
                    Used on our {hotel.stars}-star packages.{' '}
                    <Link href={tierHref(hotel.stars as 3 | 4 | 5)} className="text-link underline">
                      See {hotel.stars}-star
                    </Link>
                  </p>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="by-tier" className="flex flex-col gap-8">
          <div className="section-header-centered">
            <h2 id="by-tier" className="text-heading">
              Which hotels come with which tier
            </h2>
            <p className="text-body-lg text-text-muted">
              A star rating on this site is a promise about two named properties, not a
              vague band. These are the pairings.
            </p>
          </div>

          <ul className="grid gap-4 md:grid-cols-3">
            {tiers.map((tier, i) => {
              const cheapest = Math.min(...packagesByTier(tier.tier).map((p) => p.price.gbp));
              return (
                <Reveal
                  key={tier.slug}
                  as="li"
                  index={i}
                  className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6"
                >
                  <span className="eyebrow">{tier.tier}-star</span>
                  <ul className="flex flex-col gap-3">
                    {[tier.hotels.makkah, tier.hotels.madinah].map((id) => {
                      const h = hotels.find((x) => x.id === id);
                      if (!h) return null;
                      return (
                        <li key={id} className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 text-body-sm text-text-muted">
                            <MapPin size={13} aria-hidden />
                            {h.city === 'makkah' ? 'Makkah' : 'Madinah'}
                          </span>
                          <span className="text-body font-medium text-text">{h.name}</span>
                          <span className="text-body-sm text-green-700">
                            {formatDistance(h.distanceToHaramM)} away
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-auto border-t border-border pt-4 text-body-sm text-text-muted">
                    From{' '}
                    <strong className="font-serif text-body-lg text-green-900">
                      {formatGbp(cheapest)}
                    </strong>{' '}
                    per person, {formatSharing(tier.sharing)}
                  </p>
                  <Button href={tierHref(tier.tier)} variant="secondary" full>
                    See {tier.tier}-star packages
                  </Button>
                </Reveal>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
          <h2 className="text-subheading">Distances are approximate walking routes</h2>
          <p className="prose-column text-body text-text-muted">
            Measured from the hotel entrance to the nearest gate, not to the mataf, and
            rounded honestly. In Ramadan the practical walk is longer than any map
            suggests, because the approaches are managed and the crowds are dense — which
            is exactly when the difference between 120 m and 1.4 km stops being a
            detail. Hotel allocation is confirmed with every booking.
          </p>
          <Button href="/quote/">Ask which hotel suits you</Button>
        </section>
      </div>
    </>
  );
}
