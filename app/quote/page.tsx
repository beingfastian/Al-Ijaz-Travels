import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, Phone, ShieldCheck } from 'lucide-react';
import { EnquiryForm } from '@/components/quote/EnquiryForm';
import { site } from '@/data/site';

export const metadata: Metadata = {
  alternates: { canonical: '/quote/' },
  title: 'Request a Quote',
  description:
    'Tell us who is travelling and when. Takes about two minutes and does not commit you to booking.',
};

/**
 * The enquiry form is a bare <form> with no container of its own — deliberately,
 * because on a package page it drops into a card that already has one. On this
 * page nothing wrapped it, so every field ran edge to edge against the viewport:
 * labels touching x=0, inputs 940px wide, and the submit button as a full-bleed
 * green band across the window. Wrapping it here rather than inside the
 * component keeps the package-page usage untouched.
 *
 * The form sits in a card at a sane measure with a reassurance column beside it,
 * which is also what stops a single narrow card leaving half the page empty on a
 * wide screen.
 */
const REASSURANCE = [
  {
    icon: Clock,
    title: 'About a minute',
    detail:
      'Six fields, most of them optional. Nothing here is a commitment and no deposit is taken.',
  },
  {
    icon: Phone,
    title: 'A person, not an autoresponder',
    detail:
      'A consultant checks live availability for your dates and comes back with real options and real prices.',
  },
  {
    icon: ShieldCheck,
    title: 'Your details stay here',
    detail: 'Used to answer this enquiry only. No mailing list, and nothing sold on.',
  },
];

export default function QuotePage() {
  const tel = site.contact.phone.replace(/\s/g, '');

  return (
    <>
      <section className="border-b border-border bg-green-50">
        <div className="max-container padding-container flex flex-col gap-3 py-4 [@media(min-height:840px)]:py-7 [@media(min-height:1150px)]:gap-4 [@media(min-height:1150px)]:py-14">
          <p className="hidden eyebrow [@media(min-height:840px)]:block">Quote request</p>
          <h1 className="text-heading [@media(min-height:1150px)]:text-display">Tell us about your journey</h1>
          <p className="hidden prose-column text-body-lg text-text-muted [@media(min-height:1150px)]:block">
            One form, about a minute. A consultant confirms availability and comes back
            to you — sending this does not commit you to anything.
          </p>
        </div>
      </section>

      <section className="max-container padding-container py-5 [@media(min-height:840px)]:py-7 [@media(min-height:1150px)]:py-14">
        {/* min-w-0 on both children, not decoration: a single-column grid track is
            `auto`, so the card was sized by its widest min-content — a <select>
            with a long option label — and overflowed the viewport by 16px at
            390px. The lg tracks already say minmax(0,1fr); the mobile one needs
            saying too. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start [@media(min-height:1150px)]:gap-10">
          <div className="min-w-0 rounded-card border border-border bg-ground p-4 shadow-card sm:p-5 [@media(min-height:840px)]:sm:p-6 [@media(min-height:1150px)]:sm:p-8">
            <Suspense
              fallback={<p className="text-body text-text-muted">Loading the form…</p>}
            >
              <EnquiryForm />
            </Suspense>
          </div>

          <aside className="flex min-w-0 flex-col gap-5 rounded-card border border-border bg-green-50 p-5 lg:sticky lg:top-24 [@media(min-height:1150px)]:gap-6 [@media(min-height:1150px)]:p-6">
            <h2 className="font-serif text-subheading text-green-900">What happens next</h2>

            <ul className="flex flex-col gap-4 [@media(min-height:1150px)]:gap-5">
              {REASSURANCE.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-green-700" aria-hidden />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-medium text-green-900">{title}</span>
                    <span className="text-body-sm text-text-muted">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-1.5 border-t border-border pt-4 [@media(min-height:1150px)]:pt-5">
              <p className="text-body-sm text-text-muted">Prefer to talk it through?</p>
              <a
                href={`tel:${tel}`}
                className="inline-flex items-center gap-2 text-body-lg font-semibold text-green-900 hover:text-green-700"
              >
                <Phone size={17} className="shrink-0 text-green-700" aria-hidden />
                {site.contact.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
