import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { months } from '@/data/months';
import { packagesByMonth } from '@/data/packages';
import { formatGbp } from '@/lib/format';
import { type MonthKey } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';
import { monthHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Umrah Packages by Month',
  description:
    'Umrah prices move more by month than by tier. Compare all twelve — Ramadan, Hajj-season restrictions, UK school holidays and Makkah temperatures, with the cheapest package for each.',
  alternates: { canonical: '/monthly-packages/' },
};

/**
 * The month hub.
 *
 * Its job is to make the single most useful point on the site: when you go
 * changes the price more than what you buy. A 5-star package in March costs more
 * than the same package in September by a wider margin than 3-star to 5-star in
 * the same week — so a visitor fixed on a tier but flexible on dates is
 * optimising the wrong variable, and this page is where they find that out.
 */
export default function MonthlyPackagesPage() {
  const rows = months.map((m) => {
    const available = packagesByMonth(m.key as MonthKey);
    const cheapest = available.length > 0 ? Math.min(...available.map((p) => p.price.gbp)) : null;
    return { month: m, cheapest, count: available.length };
  });

  const prices = rows.map((r) => r.cheapest).filter((p): p is number => p !== null);
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">By month</p>
          <h1 className="text-display">When you go changes the price</h1>
          <p className="prose-column text-body-lg text-text-muted">
            The same package costs {formatGbp(low)} in the quietest month and{' '}
            {formatGbp(high)} at the peak — a swing of{' '}
            {Math.round(((high - low) / low) * 100)}%. That is a bigger difference than
            moving between star ratings, which is why this page exists before the
            tier pages do.
          </p>
        </div>
      </section>

      <div className="max-container padding-container py-12 lg:py-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ month, cheapest, count }, i) => (
            <Reveal key={month.key} as="li" variant="scale" index={i} className="flex">
              <Link
                href={monthHref(month.key)}
                className="hover-lift group flex flex-1 flex-col gap-3 rounded-panel border border-border bg-surface p-6 shadow-card transition-colors hover:border-green-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-serif text-subheading text-green-900">{month.name}</span>
                  {month.availability === 'restricted' && (
                    <AlertTriangle
                      size={16}
                      className="mt-1 shrink-0 text-gold-text"
                      aria-label="Departures may be restricted"
                    />
                  )}
                </div>

                <p className="flex-1 text-body-sm text-text-muted">{month.crowds}</p>

                <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                  <span className="text-body-sm text-text-muted">
                    {cheapest !== null ? (
                      <>
                        from{' '}
                        <strong className="font-serif text-body-lg text-green-900">
                          {formatGbp(cheapest)}
                        </strong>
                      </>
                    ) : (
                      'Ask us'
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 text-body-sm text-link">
                    {count} packages
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-body-sm text-text-muted">
          Months marked with a warning fall in or around the Hajj season, when Umrah
          visas are typically suspended. Those pages say so before they show a price.
        </p>
      </div>
    </>
  );
}
