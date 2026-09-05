import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Flight · Hotels · Visa · Transport.
 *
 * The clearest answer to "what am I actually buying", and the reason to give each
 * one a page rather than a paragraph: these four are exactly where one package
 * quietly differs from the one beside it at the same price. The airline and
 * whether it connects. The hotel and how far it really is. The visa route. And
 * whether the transfer waits for your flight or leaves on a schedule.
 *
 * Each card carries a specific claim rather than a category name, because
 * "Transport" tells a visitor nothing they had not assumed.
 *
 * WHY THE CARDS ARE LINKS
 *
 * Al Habib runs the same four tiles and they are dead text — the visitor is told
 * transport is included and given nowhere to check what that means. Ours are the
 * entry point to four pages that answer it, so the whole tile is the hit target
 * and each one closes on a named destination rather than a generic "read more".
 *
 * The gold edge is load-bearing rather than decorative. This section sits between
 * two dark bands, so it stays light for rhythm — which cost it the prominence a
 * "what's included" answer deserves. The offset gives the cards weight without a
 * third dark section in a row.
 */
export function ServicesGrid() {
  return (
    <section
      aria-labelledby="whats-included"
      className="border-y border-border bg-surface-sunk"
    >
      <div className="max-container padding-container flex flex-col gap-12 py-16 lg:py-20">
        <Reveal className="section-header-centered">
          <p className="eyebrow">What is included</p>
          <h2 id="whats-included" className="text-heading">
            Four things,{' '}
            <span className="text-gold-text">bought together</span>
          </h2>
          <p className="text-body-lg text-text-muted">
            Every package is a flight, a hotel in each city, a visa and every transfer
            in between. Each one has its own page, because each is where packages at
            the same price quietly differ — so every card below opens the detail.
          </p>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {services.map(({ id, label, href, icon: Icon, summary, detail }, i) => (
            <Reveal key={id} as="li" variant="scale" index={i} className="relative flex">
              {/*
                The gold layer sits behind and below-right, so the card reads as
                lifted off the surface. aria-hidden and pointer-events-none: it is
                a shadow, and it must never intercept the tap meant for the link.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-panel bg-gold-500/70"
              />
              <Link
                href={href}
                className="group relative flex flex-1 flex-col gap-4 rounded-panel border border-border bg-surface p-6 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-900 text-sand-50 ring-1 ring-gold-500/40">
                  <Icon size={26} aria-hidden />
                </span>

                <span className="font-serif text-subheading text-green-900">{label}</span>
                <span className="text-body-sm font-medium text-text">{summary}</span>
                <span className="flex-1 text-body-sm text-text-muted">{detail}</span>

                {/*
                  Reads as a control rather than a sentence. The whole card is the
                  link, but a visitor scanning for something to press needs to see
                  one — which is the difference between this and a tile that merely
                  happens to be clickable.
                */}
                <span className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-green-200 bg-surface-sunk px-4 py-2 text-body-sm font-medium text-green-900 transition-colors group-hover:border-gold-500 group-hover:bg-gold-200/40">
                  {label === 'Visas' ? 'Which visa you need' : `See ${label.toLowerCase()}`}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
