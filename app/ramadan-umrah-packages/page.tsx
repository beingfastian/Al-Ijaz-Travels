import type { Metadata } from 'next';
import { Moon, CalendarClock, TriangleAlert } from 'lucide-react';
import { getMonth } from '@/data/months';
import { packagesByMonth } from '@/data/packages';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS, type MonthKey } from '@/lib/types';
import { formatGbp } from '@/lib/format';
import { PackageCard } from '@/components/package/PackageCard';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { monthHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Ramadan Umrah Packages 2027',
  description:
    'Umrah in Ramadan 1448 / 2027. Last ten nights, Laylat al-Qadr, and what the crowds and prices are honestly like. Haram-precinct hotels sell out first.',
  alternates: { canonical: '/ramadan-umrah-packages/' },
};

/**
 * The Ramadan page.
 *
 * Commercially the most valuable page on any Umrah site, and the one where the
 * temptation to oversell is strongest. The approach here is the opposite: say
 * plainly that it is the most crowded and most expensive time of the year, that
 * the last ten nights mean praying in the courtyards rather than inside, and
 * that hotels near the Haram are gone months ahead.
 *
 * Someone booking Ramadan Umrah already knows why they want to go. What they do
 * not know is what it is like when they arrive, and the operator who tells them
 * is the one they trust with the deposit.
 */
export default function RamadanPage() {
  // Ramadan 1448 spans February and March 2027; the bulk, including the last ten
  // nights, falls in March. Both months are shown because families planning
  // around the whole month need both.
  const february = getMonth('february');
  const march = getMonth('march');

  const marchPackages = applyFilters(packagesByMonth('march' as MonthKey), DEFAULT_FILTERS);
  const febPackages = applyFilters(packagesByMonth('february' as MonthKey), DEFAULT_FILTERS);
  const cheapest = Math.min(...[...marchPackages, ...febPackages].map((p) => p.price.gbp));

  return (
    <>
      <section className="premium-surface relative isolate overflow-hidden">
        <Photo
          image="haram-night"
          alt="Masjid al-Haram at night during Ramadan, the courtyards filled with worshippers"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/35"
        />

        <div className="max-container padding-container relative flex flex-col gap-5 py-20 lg:py-28">
          <p className="eyebrow-premium inline-flex items-center gap-2">
            <Moon size={14} aria-hidden /> Ramadan 1448 · 2027
          </p>
          <h1 className="max-w-3xl text-display text-on-premium">
            The last ten nights,
            <span className="block text-on-premium-accent">and what they are really like</span>
          </h1>
          <p className="prose-column text-body-lg text-on-premium-muted">
            Ramadan is the most rewarding time to be in Makkah and, by a distance, the
            most crowded and most expensive. Both of those are true at once, and you
            should hear them from us rather than discover the second on arrival.
          </p>
          <p className="text-body-lg text-on-premium">
            From{' '}
            <strong className="font-serif text-heading text-on-premium-accent">
              {formatGbp(cheapest)}
            </strong>{' '}
            per person
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-14 py-12 lg:py-16">
        <section aria-labelledby="ramadan-truth" className="flex flex-col gap-8">
          <h2 id="ramadan-truth" className="text-heading text-center">
            What to expect
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6">
              <TriangleAlert size={20} className="text-gold-text" aria-hidden />
              <span className="eyebrow">The crowds</span>
              <p className="text-body text-text">{march?.crowds}</p>
            </Reveal>
            <Reveal
              index={1}
              className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
            >
              <CalendarClock size={20} className="text-gold-text" aria-hidden />
              <span className="eyebrow">Book by</span>
              <p className="text-body text-text">
                Haram-precinct hotels for the last ten nights are typically gone six to
                nine months ahead. If you are reading this inside three months, expect
                to be further out or to pay considerably more.
              </p>
            </Reveal>
            <Reveal
              index={2}
              className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
            >
              <Moon size={20} className="text-gold-text" aria-hidden />
              <span className="eyebrow">The price</span>
              <p className="text-body text-text">
                Ramadan runs roughly {Math.round(((march?.priceIndex ?? 1.7) - 1) * 100)}%
                above a quiet month for the same package. That is the market, not a
                markup — hotel rates near the Haram move the same way for everyone.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="ramadan-march" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="ramadan-march" className="text-heading">
              March 2027 — the last ten nights
            </h2>
            <p className="prose-column text-body text-text-muted">{march?.note}</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {marchPackages.slice(0, 6).map((pkg, i) => (
              <Reveal key={pkg.slug} as="li" variant="scale" index={i} className="flex">
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </ul>
          <a href={monthHref('march')} className="text-body-sm text-link underline">
            All {marchPackages.length} March packages
          </a>
        </section>

        <section aria-labelledby="ramadan-feb" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="ramadan-feb" className="text-heading">
              February 2027 — the first half
            </h2>
            <p className="prose-column text-body text-text-muted">{february?.note}</p>
          </div>
          <a href={monthHref('february')} className="text-body-sm text-link underline">
            All {febPackages.length} February packages
          </a>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
          <h2 className="text-subheading">Ramadan allocation is limited</h2>
          <p className="prose-column text-body text-text-muted">
            We hold a fixed number of rooms in each Haram-precinct hotel. Tell us your
            dates and party size and we will confirm what is genuinely still available
            rather than take a deposit and sort it out later.
          </p>
          <Button href="/quote/">Check Ramadan availability</Button>
        </section>
      </div>
    </>
  );
}
