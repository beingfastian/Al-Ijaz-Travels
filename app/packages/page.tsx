import { Suspense } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Metadata } from 'next';
import { PackageListing } from '@/components/package/PackageListing';
import { PackageCard } from '@/components/package/PackageCard';
import { packages } from '@/data/packages';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS } from '@/lib/types';
import { tiers } from '@/data/tiers';
import { tierHref } from '@/lib/routes';

export const metadata: Metadata = {
  /**
   * Self-canonical, and this one is load-bearing rather than housekeeping.
   *
   * Filters live in the query string — tier, nights, price, distance, month,
   * airport — which is what makes a filtered listing a shareable link. It also
   * means the number of distinct URLs serving this page is the product of every
   * filter combination, all with near-identical content. Without a canonical,
   * a crawler treats each one as its own document and the listing competes with
   * itself. This collapses the lot back to /packages/.
   */
  alternates: { canonical: '/packages/' },
  title: 'Umrah Packages',
  description:
    'Compare Umrah packages by hotel rating, price per person, and real walking distance to the Haram. Filter by nights and departure month.',
};

export default function PackagesPage() {
  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Packages</p>
          <h1 className="text-display">Every package, compared honestly</h1>
          <p className="text-body-lg text-text-muted prose-column">
            Prices are per person with the sharing basis stated. Distances are real
            walking distances to the Haram, not marketing estimates.
          </p>

          {/*
            Tier hubs, linked from the page a crawler reaches first from the nav.
            They were built before anything pointed at them, which the dead-link
            check would not have caught — an orphan page is not a broken link, it
            is simply unreachable, and the two failures look nothing alike.
          */}
          <nav aria-label="Browse by star rating" className="flex flex-wrap gap-3 pt-2">
            {tiers.map((t) => (
              <Link
                key={t.slug}
                href={tierHref(t.tier)}
                className="rule-gold inline-flex items-center gap-2 rounded-full border bg-surface px-5 py-2 text-body-sm font-medium text-green-900 transition-colors hover:border-green-700 hover:bg-green-50"
              >
                <Star size={14} className="fill-gold-500 text-gold-500" aria-hidden />
                {t.tier}-star packages
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* useSearchParams requires a Suspense boundary in the App Router. Without it
          the whole route opts out of static generation — which would break the
          export. Tripix gets this right; it is worth keeping.

          What Tripix does NOT get right, and what this fallback fixes: under
          output:'export' the *fallback* is what gets prerendered, because the
          client component cannot read the query string at build time. A skeleton
          here meant out/packages/index.html shipped with zero links to any
          package — the listing page, which is the natural landing surface for
          every "compare Umrah packages" query, was an empty grey grid to anything
          that does not run JavaScript, and three of six packages had no static
          inbound link anywhere on the site.

          So the fallback is the real catalogue instead, sorted exactly as the
          hydrated default view sorts it. Crawlers and no-JS visitors get all six
          packages; everyone else sees this for one paint before PackageListing
          takes over with filters applied. */}
      <Suspense fallback={<ListingFallback />}>
        <PackageListing />
      </Suspense>
    </>
  );
}

/**
 * The prerendered listing: every package, in the default order.
 *
 * Deliberately not a skeleton. It shares PackageListing's grid so the handover at
 * hydration is a swap of equivalent markup rather than a reflow, and it reuses the
 * same `applyFilters` the client uses, so "unfiltered" means the same thing on
 * both sides of that swap.
 *
 * The filter column is the one part left as a placeholder — FilterPanel is a client
 * component and a filter UI that cannot filter is worse than no filter UI, so it
 * holds the space and announces nothing.
 */
function ListingFallback() {
  const all = applyFilters(packages, DEFAULT_FILTERS);

  return (
    <div className="max-container padding-container grid gap-10 py-12 lg:grid-cols-[280px_1fr] lg:py-16">
      <div className="hidden h-96 rounded-panel bg-surface-sunk lg:block" aria-hidden="true" />

      <div className="flex flex-col gap-6">
        <p className="text-body text-text-muted">
          {all.length} package{all.length === 1 ? '' : 's'}
        </p>

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {all.map((pkg) => (
            <li key={pkg.slug} className="flex">
              <PackageCard pkg={pkg} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
