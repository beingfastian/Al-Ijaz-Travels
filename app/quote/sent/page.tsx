import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Quote Request Sent',
  description: 'Your Umrah quote request has been sent. A consultant will be in touch.',
  // Nothing to gain from indexing a confirmation page, and it would be a poor
  // search result for anyone who landed on it cold.
  robots: { index: false, follow: true },
};

export default function QuoteSentPage() {
  return (
    <section className="max-container padding-container flex flex-col items-start gap-6 py-24">
      <CheckCircle2 size={44} className="text-green-700" aria-hidden />
      <p className="eyebrow">Request sent</p>
      <h1 className="text-display">We have your details</h1>

      <div className="prose-column flex flex-col gap-4 text-body-lg text-text-muted">
        <p>
          A consultant will confirm availability and come back to you, usually the
          same day. If WhatsApp did not open, message or call us directly and quote
          the package name.
        </p>
        <p className="text-body">
          <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="text-link underline">
            {site.contact.phone}
          </a>
          {' · '}
          <a href={`mailto:${site.contact.email}`} className="text-link underline">
            {site.contact.email}
          </a>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/packages/">Browse more packages</Button>
        <Button href="/faq/" variant="secondary">
          Read the FAQ
        </Button>
      </div>
    </section>
  );
}
