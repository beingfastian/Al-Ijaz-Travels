import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PackageListing } from '@/components/package/PackageListing';

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
          export. Tripix gets this right; it is worth keeping. */}
      <Suspense fallback={<ListingSkeleton />}>
        <PackageListing />
      </Suspense>
    </>
  );
}

function ListingSkeleton() {
  return (
    <div className="max-container padding-container grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
      <div className="h-96 rounded-panel bg-surface-sunk" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-96 rounded-panel bg-surface-sunk" />
        ))}
      </div>
    </div>
  );
}
