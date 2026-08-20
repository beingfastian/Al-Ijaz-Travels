import Link from 'next/link';
import { Plane, FileCheck, BedDouble, Bus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { whatsappUrl } from '@/lib/whatsapp';
import { packages, basePackages } from '@/data/packages';
import { airports } from '@/data/airports';
import { formatGbp } from '@/lib/format';
import { tiers } from '@/data/tiers';
import { tierHref } from '@/lib/routes';

/**
 * Hero, fourth attempt — and the first one aimed at the right brief.
 *
 * The previous three optimised for editorial restraint: sparse, dark, serif, a
 * lot of whitespace. That is a magazine aesthetic, and next to the competitor it
 * read as empty rather than as considered. Two measurable failures, both from the
 * client's own screenshot: it did not fit on one screen, and the photograph was
 * so heavily gradiented that the Haram was invisible — the image was protecting
 * the text instead of selling the trip.
 *
 * What changed:
 *   - Fits a laptop viewport. Capped height, tighter rhythm, smaller display step.
 *   - The photograph is actually visible. The gradient now covers the copy column
 *     and clears entirely across the right, so the image does its job.
 *   - The four things a package includes float over the image as labelled pills,
 *     the way theirs does. It is the clearest possible answer to "what do I get",
 *     and it was buried three sections down the page.
 *   - Price, distance and airports stay, because they are checkable and their
 *     "3000+ pilgrims monthly" is not.
 */

const INCLUDES = [
  { icon: Plane, label: 'Direct flights', href: '/flights/' },
  { icon: FileCheck, label: 'Visa processing', href: '/visa/' },
  { icon: BedDouble, label: 'Hotels near the Haram', href: '/hotels/' },
  { icon: Bus, label: 'Full ground transport', href: '/transport/' },
];

export function Hero() {
  const cheapest = Math.min(...packages.map((p) => p.price.gbp));
  const closest = Math.min(
    ...basePackages().flatMap((p) =>
      p.hotels.filter((h) => h.city === 'makkah').map((h) => h.distanceToHaramM)
    )
  );

  return (
    <section className="premium-surface relative isolate overflow-hidden">
      <Photo
        image="haram-night"
        alt="Masjid al-Haram at night, the Kaaba lit and encircled by worshippers"
        /*
          Not 100vw. The left 45% of this image sits under a near-opaque gradient,
          so full-width sharpness buys nothing visible and costs LCP — it pushed
          the hero to 3.4s on a throttled phone. Declaring 60vw lets the browser
          pick a materially smaller variant for the part anyone can actually see.

          A fixed pixel descriptor was tried here and made it worse: 640px at a
          device pixel ratio of 3 asks for 1920px, so the browser chose the
          LARGEST variant. Viewport-relative hints only.
        */
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Opaque only under the copy column, then gone. Cream on near-black holds
          at 19:1 where the words are, and the photograph is left alone elsewhere. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/80 via-45% to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-noir-950"
      />

      <div className="max-container padding-container relative grid items-center gap-10 py-12 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:py-16">
        <div className="flex flex-col items-start gap-5">
          <p className="eyebrow-premium inline-flex items-center gap-2">
            <span lang="ar" className="text-body-sm">
              الإعجاز
            </span>
            <span className="text-gold-500" aria-hidden>
              ·
            </span>
            Umrah from the UK · 2027
          </p>

          <h1 className="text-display text-on-premium">
            All-inclusive Umrah
            <span className="block text-on-premium-accent">with a guided journey</span>
          </h1>

          <p className="max-w-xl text-body-lg text-on-premium-muted">
            Flights, visa, hotels near the Haram and every transfer — in one price, per
            person, with the walking distance stated in metres before you pay.
          </p>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[color:var(--color-rule-premium)] py-4">
            {[
              { label: 'Packages from', value: formatGbp(cheapest) },
              { label: 'Closest hotel', value: `${closest} m` },
              { label: 'UK airports', value: String(airports.length) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-body-sm text-on-premium-muted">{stat.label}</dt>
                <dd className="font-serif text-subheading text-on-premium-accent">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappUrl()} variant="gold" size="lg">
              WhatsApp us now
            </Button>
            <Button href="/packages/" variant="on-dark" size="lg">
              View packages
            </Button>
          </div>

          <nav aria-label="Browse by star rating" className="flex flex-wrap gap-2">
            {tiers.map((tier) => {
              const from = Math.min(
                ...packages.filter((p) => p.tier === tier.tier).map((p) => p.price.gbp)
              );
              return (
                <Link
                  key={tier.slug}
                  href={tierHref(tier.tier)}
                  className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule-premium)] bg-noir-950/60 px-4 py-2 text-body-sm text-on-premium backdrop-blur transition-colors hover:border-gold-400"
                >
                  <span className="font-medium">{tier.tier}-star</span>
                  <span className="text-on-premium-muted">{formatGbp(from)}</span>
                  <ArrowRight
                    size={13}
                    className="text-gold-400 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/*
          What is in the package, over the image. The competitor puts these four
          labels on the hero and it is the single clearest thing on their page —
          a visitor knows what they are buying before scrolling. Ours link to the
          four pages, so they are navigation as well as reassurance.
        */}
        <ul className="flex flex-col gap-3 lg:items-end">
          {INCLUDES.map(({ icon: Icon, label, href }) => (
            <li key={label} className="w-full lg:w-auto">
              <Link
                href={href}
                className="group flex items-center gap-3 rounded-full border border-[color:var(--color-rule-premium)] bg-noir-950/75 px-5 py-3 backdrop-blur transition-colors hover:border-gold-400"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-noir-950">
                  <Icon size={18} aria-hidden />
                </span>
                <span className="text-body font-medium text-on-premium">{label}</span>
                <ArrowRight
                  size={14}
                  className="ml-auto text-gold-400 transition-transform group-hover:translate-x-0.5 lg:ml-2"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
