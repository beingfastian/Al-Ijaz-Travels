import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PackageListing } from '@/components/package/PackageListing';
import { PackageCard } from '@/components/package/PackageCard';
import { packages } from '@/data/packages';
import { applyFilters } from '@/lib/filter';
import { DEFAULT_FILTERS } from '@/lib/types';

export const metadata: Metadata = {
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
