import Link from 'next/link';
import { ShieldCheck, Footprints, Receipt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { whatsappUrl } from '@/lib/whatsapp';
import { packages, basePackages } from '@/data/packages';
import { airports } from '@/data/airports';
import { accreditations } from '@/data/trust';
import { formatGbp } from '@/lib/format';
import { tiers } from '@/data/tiers';
import { tierHref } from '@/lib/routes';

/**
 * Full-bleed hero.
 *
 * The previous two attempts were a headline on a tiled pattern, then a headline
 * beside a framed photograph. Both read as a page about Umrah rather than as the
 * Haram at night, and the client's verdict on the second was that it looked
 * unchanged — which was fair. A photograph in a box beside text is decoration;
 * a photograph the type sits inside is the subject.
 *
 * The contrast problem that framing was avoiding is solved properly instead: a
 * near-opaque noir gradient over the left two-thirds, so cream on near-black
 * holds whatever the image is doing behind it. That pairing measures 19:1 and it
 * does not depend on which pixel is under which word.
 *
 * Three tier entry points sit under the headline. Al Habib buries tier choice
 * three sections down; it is the first decision anyone actually makes, so it
 * belongs above the fold.
 */

const PROMISES = [
  {
    icon: Footprints,
    title: 'Distance, in metres',
    detail: 'Every hotel listed with its real walking distance to the Haram.',
  },
  {
    icon: Receipt,
    title: 'Per-person pricing',
    detail: 'Sharing basis stated. Exclusions listed as plainly as inclusions.',
  },
  {
    icon: ShieldCheck,
    title: 'ATOL protected',
    detail: 'Your money is covered, and the number is on the page to check.',
  },
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
        sizes="100vw"
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Opaque where the words are, clearing across the image. Cream on
          near-black regardless of what the photograph is doing underneath. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/92 to-noir-950/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-noir-950"
      />

      <div className="max-container padding-container relative flex flex-col gap-8 py-20 lg:py-28">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <p className="eyebrow-premium inline-flex items-center gap-2">
            <span lang="ar" className="text-body-sm">
              الإعجاز
            </span>
            <span className="text-gold-500" aria-hidden>
              ·
            </span>
            Umrah from the UK
          </p>

          <h1 className="text-display-xl text-on-premium">
            The journey between
            <span className="block text-on-premium-accent">two sacred cities</span>
          </h1>

          <p className="prose-column text-body-lg text-on-premium-muted">
            Umrah packages chosen the way pilgrims actually choose them — by how far the
            hotel really is from the Haram, and what the price genuinely covers.
          </p>

          {/* Computed from the catalogue, so they cannot drift from what is on sale. */}
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-[color:var(--color-rule-premium)] py-5">
            {[
              { label: 'Packages from', value: formatGbp(cheapest) },
              { label: 'Closest hotel', value: `${closest} m` },
              { label: 'UK airports', value: String(airports.length) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-body-sm text-on-premium-muted">{stat.label}</dt>
                <dd className="font-serif text-heading text-on-premium-accent">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/packages/" size="lg">
              View packages
            </Button>
            <Button href={whatsappUrl()} variant="on-dark" size="lg">
              Ask on WhatsApp
            </Button>
          </div>

          {accreditations.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-on-premium-muted">
              {accreditations.map((a) => (
                <span key={a.name} className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold-400" aria-hidden />
                  {a.reference}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Tier choice above the fold — the first decision anyone makes. */}
        <nav aria-label="Browse by star rating" className="flex flex-wrap gap-3">
          {tiers.map((tier) => {
            const from = Math.min(
              ...packages.filter((p) => p.tier === tier.tier).map((p) => p.price.gbp)
            );
            return (
              <Link
                key={tier.slug}
                href={tierHref(tier.tier)}
                className="group inline-flex items-center gap-3 rounded-full border border-[color:var(--color-rule-premium)] bg-noir-900/70 px-5 py-3 text-body-sm text-on-premium backdrop-blur transition-colors hover:border-gold-400"
              >
                <span className="font-medium">{tier.tier}-star</span>
                <span className="text-on-premium-muted">from {formatGbp(from)}</span>
                <ArrowRight
                  size={14}
                  className="text-gold-400 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Promises on the ground below the photograph, where they read as fact
          rather than as marketing over an image. */}
      <div className="relative border-t border-[color:var(--color-rule-premium)] bg-noir-950">
        <div className="max-container padding-container">
          <ul className="grid gap-6 py-10 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-noir-900 text-gold-400">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-serif text-subheading text-on-premium">{title}</span>
                  <span className="text-body-sm text-on-premium-muted">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
