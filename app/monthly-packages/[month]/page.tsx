import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Thermometer, Users, GraduationCap, AlertTriangle } from 'lucide-react';
import { months, getMonth } from '@/data/months';
import { packagesByMonth } from '@/data/packages';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS, type MonthKey } from '@/lib/types';
import { formatGbp } from '@/lib/format';
import { PackageCard } from '@/components/package/PackageCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { monthHref, monthFromSegment, listingHref } from '@/lib/routes';

/**
 * A month landing page — /monthly-packages/january-umrah-packages/.
 *
 * These only deserve to exist if they say something a filtered listing cannot,
 * and that test is the whole design of this page. Everything below the packages
 * comes from data/months.ts: what the weather actually does, how crowded the
 * Haram actually gets, whether UK school holidays overlap, and — the one most
 * competitors omit — whether Umrah is even operable that month.
 *
 * The reference site publishes twelve of these with interchangeable copy. That
 * is the shape search engines classify as scaled content, and it is also simply
 * unhelpful: a reader choosing between March and October needs to be told they
 * are different, not told the same paragraph twice.
 */

export function generateStaticParams() {
  return months.map((m) => ({ month: `${m.key}-umrah-packages` }));
}

type Props = { params: Promise<{ month: string }> };

function resolve(segment: string) {
  const key = monthFromSegment(segment);
  return key ? getMonth(key) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const def = resolve(month);
  if (!def) return {};

  const available = packagesByMonth(def.key as MonthKey);
  const cheapest = available.length > 0 ? Math.min(...available.map((p) => p.price.gbp)) : null;

  return {
    title: `${def.name} Umrah Packages`,
    description:
      `Umrah in ${def.name} from the UK` +
      (cheapest !== null ? `, from ${formatGbp(cheapest)} per person` : '') +
      `. Makkah averages ${def.makkahHighC}°C. ${def.crowds}`,
    alternates: { canonical: monthHref(def.key) },
  };
}

export default async function MonthPage({ params }: Props) {
  const { month } = await params;
  const def = resolve(month);
  if (!def) notFound();

  const available = applyFilters(packagesByMonth(def.key as MonthKey), DEFAULT_FILTERS);
  const cheapest = available.length > 0 ? Math.min(...available.map((p) => p.price.gbp)) : null;

  const facts = [
    { icon: Thermometer, label: 'Makkah daytime high', value: `${def.makkahHighC}°C` },
    { icon: Users, label: 'At the Haram', value: def.crowds },
    {
      icon: GraduationCap,
      label: 'UK school holidays',
      value: def.schoolHolidays ?? 'None — term time throughout',
    },
  ];

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Departing {def.name}</p>
          <h1 className="text-display">{def.name} Umrah Packages</h1>
          <p className="prose-column text-body-lg text-text-muted">{def.note}</p>
          {cheapest !== null && (
            <p className="text-body-lg text-green-900">
              From <strong className="font-serif text-heading">{formatGbp(cheapest)}</strong> per
              person
            </p>
          )}
        </div>
      </section>

      {def.availability === 'restricted' && (
        <div className="border-b border-gold-300 bg-gold-50">
          <div className="max-container padding-container flex items-start gap-3 py-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-text" aria-hidden />
            <p className="text-body-sm text-text">
              <strong className="font-semibold">
                {def.name} departures may not be operable.
              </strong>{' '}
              Umrah visas are typically suspended in the run-up to and during Hajj. Speak to us
              before committing to plans around this month — we would rather tell you now than
              after you have booked leave.
            </p>
          </div>
        </div>
      )}

      <div className="max-container padding-container flex flex-col gap-12 py-12 lg:py-16">
        <section aria-labelledby="month-facts" className="flex flex-col gap-6">
          <h2 id="month-facts" className="text-heading">
            What {def.name} is actually like
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }, i) => (
              <Reveal
                key={label}
                as="li"
                index={i}
                className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
              >
                <Icon size={20} className="text-gold-text" aria-hidden />
                <span className="eyebrow">{label}</span>
                <span className="text-body text-text">{value}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="month-packages" className="flex flex-col gap-6">
          <h2 id="month-packages" className="text-heading">
            {available.length} packages departing in {def.name}
          </h2>
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {available.map((pkg, i) => (
              <Reveal key={pkg.slug} as="li" variant="scale" index={i} className="flex">
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
          <h2 className="text-subheading">Dates not fixed yet?</h2>
          <p className="prose-column text-body text-text-muted">
            Moving by a few weeks changes the price more than changing tier does.{' '}
            <a href={listingHref()} className="text-link underline">
              Compare every month
            </a>{' '}
            before you settle on one.
          </p>
          <Button href="/quote/">Ask about {def.name}</Button>
        </section>
      </div>
    </>
  );
}
