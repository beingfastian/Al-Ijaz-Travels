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
 */
export function ServicesGrid() {
  return (
    <section
      aria-labelledby="whats-included"
      className="border-y border-border bg-surface-sunk"
    >
      <div className="max-container padding-container flex flex-col gap-10 py-16 lg:py-20">
        <Reveal className="section-header-centered">
          <p className="eyebrow">What is included</p>
          <h2 id="whats-included" className="text-heading">
            Four things, bought together
          </h2>
          <p className="text-body-lg text-text-muted">
            Every package is a flight, a hotel in each city, a visa and every transfer
            in between. Each one has its own page, because each is where packages at
            the same price quietly differ.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ id, label, href, icon: Icon, summary, detail }, i) => (
            <Reveal key={id} as="li" variant="scale" index={i} className="flex">
              <Link
                href={href}
                className="hover-lift group flex flex-1 flex-col gap-4 rounded-panel border border-border bg-surface p-6 shadow-card transition-colors hover:border-green-300"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900 text-sand-50">
                  <Icon size={22} aria-hidden />
                </span>

                <span className="font-serif text-subheading text-green-900">{label}</span>
                <span className="text-body-sm font-medium text-text">{summary}</span>
                <span className="flex-1 text-body-sm text-text-muted">{detail}</span>

                <span className="inline-flex items-center gap-1.5 border-t border-border pt-4 text-body-sm text-link">
                  {label === 'Visas' ? 'Which visa you need' : `More on ${label.toLowerCase()}`}
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
