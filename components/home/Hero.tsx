import { ShieldCheck, Footprints, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { whatsappUrl } from '@/lib/whatsapp';
import { packages, basePackages } from '@/data/packages';
import { airports } from '@/data/airports';
import { formatGbp } from '@/lib/format';

/**
 * Hero composition follows the base repo's asymmetric split — copy on one side,
 * illustration bleeding out of the other — which is the part of that design worth
 * keeping. The khatam field replaces its topographic PNG.
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
    title: 'A consultant first',
    detail: 'Speak to someone before you commit to anything.',
  },
];

export function Hero() {
  /*
    Computed, not written. Every figure in the hero comes from the catalogue, so
    it cannot drift from what the site actually sells — which is the whole reason
    to put numbers in a hero at all. The competitor states pilgrim counts we
    cannot verify and would not invent; these are checkable on the next page.
  */
  const cheapest = Math.min(...packages.map((p) => p.price.gbp));
  const closest = Math.min(
    ...basePackages().flatMap((p) =>
      p.hotels.filter((h) => h.city === 'makkah').map((h) => h.distanceToHaramM)
    )
  );

  const STATS = [
    { label: 'From', value: formatGbp(cheapest) },
    { label: 'Closest hotel', value: `${closest} m` },
    { label: 'UK airports', value: String(airports.length) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 khatam-field" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ground" aria-hidden="true" />

      <div className="max-container padding-container relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">
            <span lang="ar" className="text-body">
              الإعجاز
            </span>
            <span className="mx-2 text-gold-400" aria-hidden="true">
              ·
            </span>
            Umrah from the UK
          </p>

          <h1 className="text-display-xl">
            The journey between
            <span className="block text-gold-text">two sacred cities</span>
          </h1>

          <p className="text-body-lg text-text-muted prose-column">
            Umrah packages chosen the way pilgrims actually choose them — by how far
            the hotel really is from the Haram, and what the price genuinely covers.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/packages/" size="lg">
              View packages
            </Button>
            <Button href={whatsappUrl()} variant="secondary" size="lg">
              Ask on WhatsApp
            </Button>
          </div>
        </div>

        {/*
          The right column was the route illustration on bare pattern, which read
          as a diagram rather than as a destination. The photograph goes behind it
          in a framed panel: the illustration still carries the Madinah-to-Makkah
          idea, and the image supplies the reason anyone is on this page.

          Framed rather than full-bleed on purpose — a full-bleed photo here would
          put the headline over an image and cost the contrast the hero depends on.
        */}
        <div className="relative">
          <div className="premium-surface relative isolate overflow-hidden rounded-panel shadow-float">
            <Photo
              image="kaaba-day"
              alt="Pilgrims performing tawaf around the Kaaba at Masjid al-Haram"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/45 to-transparent"
            />

            {/*
              The route illustration used to sit here and was effectively
              invisible: it is drawn in green-700 through green-950, which on a
              noir-950 ground is dark on dark. It has moved to /flights/, where
              the background is light and a Madinah-to-Makkah diagram is actually
              the subject of the page.
            */}
            <div className="relative flex min-h-[420px] flex-col justify-end gap-4 p-6 lg:min-h-[540px] lg:p-8">
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-[color:var(--color-rule-premium)] pt-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="text-body-sm text-on-premium-muted">{stat.label}</dt>
                    <dd className="font-serif text-subheading text-on-premium-accent">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="max-container padding-container relative pb-16">
        <ul className="grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex gap-4">
              <span className="flex-center size-11 shrink-0 rounded-full bg-green-50 text-green-700">
                <Icon size={20} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-serif text-subheading text-green-900">{title}</span>
                <span className="text-body-sm text-text-muted">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
