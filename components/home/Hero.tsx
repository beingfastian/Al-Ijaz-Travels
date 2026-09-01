import Link from 'next/link';
import { Suspense } from 'react';
import { Plane, FileCheck, BedDouble, Bus, ArrowRight } from 'lucide-react';
import { EnquiryForm } from '@/components/quote/EnquiryForm';
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

      <div className="max-container padding-container relative grid items-center gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:py-8 [@media(min-height:900px)]:lg:py-14"
        /*
          Height is derived, not guessed. The chrome above this section is the
          utility bar, the navbar and the seasonal banner — about 10.5rem in
          total — so the hero claims exactly the rest of the viewport and no more.
          A fixed min-height was the reason it fitted a maximised window and
          overflowed a smaller one.

          svh rather than vh: on mobile browsers vh is the tallest the viewport
          ever gets, which leaves the section overflowing behind the address bar.
        */
        style={{ minHeight: 'calc(100svh - 11.5rem)' }}>
        <div className="flex flex-col items-start gap-4">
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

          {/*
            The four things a package includes. These used to occupy the whole
            right column as large pills; the form has that space now, so they are
            a compact row here instead. They are still the clearest answer to
            "what do I get", and still links to the four pages.
          */}
          {/*
            Desktop only. Below lg the hero stacks into one column and these four
            links are repeated verbatim by the ServicesGrid section immediately
            beneath the hero — so on a phone they are 120px of duplication in
            front of the form, which is the thing the visitor came to use.
          */}
          <ul className="hidden flex-wrap gap-2 lg:flex">
            {INCLUDES.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule-premium)] bg-noir-950/70 px-3.5 py-2 text-body-sm text-on-premium backdrop-blur transition-colors hover:border-gold-400"
                >
                  <Icon size={15} className="shrink-0 text-gold-400" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappUrl()} variant="gold" size="lg">
              WhatsApp us now
            </Button>
            <Button href="/packages/" variant="on-dark" size="lg">
              View packages
            </Button>
          </div>

          {/*
            Shown only when the window is tall enough for them.
            On a 720px laptop the hero content itself is the constraint, not the
            min-height, and something has to give. These go first: the four
            service pills already answer "what do I get", and every tier is one
            tap away on the packages page.
          */}
          <nav
            aria-label="Browse by star rating"
            className="hidden flex-wrap gap-2 [@media(min-height:800px)]:flex"
          >
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
          The enquiry form, over the photograph.

          The competitor puts a white "Get Umrah Quote" card on their home page,
          overlapping a photo panel — and it is the right instinct: the visitor
          who is ready to ask should not have to find a page to ask on. Ours sits
          in the hero itself, which is what the client asked for.

          A light card on a dark photograph, rather than a dark form: form fields
          need to look like fields, and every input style on this site is built
          for a light surface. Inverting them for one placement would be a second
          set of form styles to keep in step with the first.
        */}
        <div className="rounded-panel border border-border bg-ground p-5 shadow-float [@media(min-height:900px)]:p-6">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="font-serif text-subheading text-green-900">Get an Umrah quote</h2>
            {/* Reassurance, not information — first thing to go when the hero has
                to fit a 720px-tall window. */}
            <p className="hidden text-body-sm text-text-muted [@media(min-height:780px)]:block">
              A consultant replies on WhatsApp with real availability. No deposit, no
              obligation.
            </p>
          </div>

          {/*
            EnquiryForm reads useSearchParams, which needs a Suspense boundary
            under `output: export` or the build fails outright. The fallback is
            sized so the hero does not jump when the form arrives.
          */}
          {/*
            NOT `compact`. Compact is single-column, which stacks the four short
            fields into four rows and pushed the hero 96px past the fold. The
            two-column layout puts them in two rows inside a 432px card, which is
            the difference between the hero fitting a laptop screen and not.
          */}
          <Suspense fallback={<div className="h-[18rem]" aria-hidden />}>
            <EnquiryForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
