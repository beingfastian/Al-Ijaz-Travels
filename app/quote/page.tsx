import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteFlow } from '@/components/quote/QuoteFlow';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Tell us who is travelling and when. Takes about two minutes and does not commit you to booking.',
};

export default function QuotePage() {
  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Quote request</p>
          <h1 className="text-display">Tell us about your journey</h1>
          <p className="prose-column text-body-lg text-text-muted">
            About two minutes. A consultant confirms availability and comes back to
            you — requesting a quote does not commit you to anything.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="max-container padding-container py-16">Loading…</div>}>
        <QuoteFlow />
      </Suspense>
    </>
  );
}
