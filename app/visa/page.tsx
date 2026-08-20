import type { Metadata } from 'next';
import { Check, X, ShieldAlert, ExternalLink, CalendarCheck } from 'lucide-react';
import { visaRoutes, universalRequirements, visaFaqs } from '@/data/visa';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Umrah, ETA and Tourist Visas Explained',
  description:
    'Which Saudi visa you actually need for Umrah from the UK. Umrah visa, Electronic Travel Authorisation and tourist eVisa compared — validity, stay limits and what each does not cover. Every claim dated and sourced.',
  alternates: { canonical: '/visa/' },
};

/**
 * The visa page.
 *
 * Not on the competitor's site, and the most useful page here for that reason:
 * the rules changed, most pilgrims have not caught up, and the single most
 * valuable thing we can tell a UK visitor is that a separate Umrah visa may not
 * be needed at all.
 *
 * Two rules govern everything on this page.
 *
 * First, every claim is dated and sourced, and both are rendered rather than
 * kept in a comment. Visa rules move; a page that quietly goes stale sends
 * someone to an airport on the wrong authorisation.
 *
 * Second, no fees are quoted. They change often enough that a wrong number is
 * likelier than a right one, and a pilgrim who budgets from a stale figure is
 * worse served than one who is told plainly that we will confirm it in writing.
 */
export default function VisaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visaFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Authored in this repo, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Visas</p>
          <h1 className="text-display">Which visa do you actually need?</h1>
          <p className="prose-column text-body-lg text-text-muted">
            Probably not the one you think. Umrah can now be performed on a tourist
            eVisa or an Electronic Travel Authorisation — a change most pilgrims have
            not caught up with, and one that makes a dedicated Umrah visa optional
            rather than obligatory for most UK travellers.
          </p>
          <p className="inline-flex items-center gap-2 text-body-sm text-text-muted">
            <CalendarCheck size={16} className="text-gold-text" aria-hidden />
            Checked against{' '}
            <a
              href={visaRoutes[0]!.source.url}
              className="text-link underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              FCDO travel advice
            </a>{' '}
            on {visaRoutes[0]!.checkedOn}
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-16 py-12 lg:py-16">
        {/* The caveat goes above the detail, not buried beneath it. */}
        <Reveal className="flex items-start gap-4 rounded-panel border border-gold-300 bg-gold-50 p-6">
          <ShieldAlert size={22} className="mt-0.5 shrink-0 text-gold-text" aria-hidden />
          <div className="flex flex-col gap-2">
            <h2 className="text-subheading">Check before you travel</h2>
            <p className="prose-column text-body text-text">
              Saudi entry rules have changed several times in recent years and will change
              again. Everything on this page was verified on {visaRoutes[0]!.checkedOn}, and
              we re-check it quarterly — but the authority is the FCDO and the Saudi
              government, not us. If your travel date is months away, confirm again nearer
              the time, or ask us and we will confirm for you.
            </p>
          </div>
        </Reveal>

        <section aria-labelledby="routes" className="flex flex-col gap-8">
          {/* Centred: what follows is a symmetric three-column grid, and a
              left-flush header over it reads as a mistake rather than a choice. */}
          <div className="section-header-centered">
            <h2 id="routes" className="text-heading">
              The three routes
            </h2>
            <p className="text-body-lg text-text-muted">
              All three permit Umrah outside the Hajj season. They differ in how long
              they last, how long you may stay, and whether they are worth the trouble
              if you only intend to travel once.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {visaRoutes.map((route, i) => (
              <Reveal
                key={route.id}
                variant="scale"
                index={i}
                className="flex flex-col gap-5 rounded-panel border border-border bg-surface p-6 shadow-card"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-subheading text-green-900">{route.name}</h3>
                  <p className="text-body-sm text-text-muted">{route.bestFor}</p>
                </div>

                {/*
                  Stacked, not a right-aligned two-column row. These values are
                  sentences — "Issued for the pilgrimage; a one-year multiple-entry
                  form is now available" — and right-aligning a sentence gives it a
                  ragged left edge, so every wrapped line starts somewhere different.
                  Right alignment is for short, scannable values; PriceRail keeps it
                  because its values are "£1,500" and "120 m".
                */}
                <dl className="flex flex-col gap-3 rounded-card bg-surface-sunk p-4 text-body-sm">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-text-muted">Valid for</dt>
                    <dd className="font-medium text-text">{route.validity}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-text-muted">You may stay</dt>
                    <dd className="font-medium text-text">{route.stayLimit}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-text-muted">Entries</dt>
                    <dd className="font-medium text-text">{route.entries}</dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2">
                  <h4 className="eyebrow">What it covers</h4>
                  <ul className="flex flex-col gap-2">
                    {route.permits.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-body-sm text-text">
                        <Check size={15} className="mt-1 shrink-0 text-green-700" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations get the same weight as permissions, deliberately. */}
                <div className="flex flex-col gap-2">
                  <h4 className="eyebrow">What it does not</h4>
                  <ul className="flex flex-col gap-2">
                    {route.limitations.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-body-sm text-text-muted"
                      >
                        <X size={15} className="mt-1 shrink-0 text-sand-500" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                  <h4 className="eyebrow">How to apply</h4>
                  <ol className="flex list-outside list-decimal flex-col gap-2 pl-5 marker:text-gold-text">
                    {route.howToApply.map((step) => (
                      <li key={step} className="text-body-sm text-text-muted">
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="pt-2 text-body-sm text-text-muted">
                    Checked {route.checkedOn} ·{' '}
                    <a
                      href={route.source.url}
                      className="inline-flex items-center gap-1 text-link underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      source
                      <ExternalLink size={12} aria-hidden />
                    </a>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="universal" className="flex flex-col gap-6">
          <div className="section-header-centered">
            <h2 id="universal" className="text-heading">
              True whichever route you take
            </h2>
            <p className="text-body-lg text-text-muted">
              These are the ones that actually catch people out — a passport with five
              months left on it, or a vaccination given a week before departure instead
              of ten days.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {universalRequirements.map((req, i) => (
              <Reveal
                key={req.title}
                as="li"
                index={i}
                className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-6"
              >
                <h3 className="font-serif text-subheading text-green-900">{req.title}</h3>
                <p className="text-body-sm text-text-muted">{req.detail}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="visa-faq" className="flex flex-col gap-8">
          <h2 id="visa-faq" className="text-heading text-center">
            Questions we are asked most
          </h2>
          {/* Centred column, left-aligned text inside it. */}
          <dl className="prose-centered flex w-full flex-col divide-y divide-border">
            {visaFaqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-2 py-5">
                <dt className="text-subheading">{faq.question}</dt>
                <dd className="text-body text-text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
          <h2 className="text-subheading">Visa processing is included</h2>
          <p className="prose-column text-body text-text-muted">
            Every package on this site includes visa processing and the Nusuk permit. You
            do not deal with the portal, and we confirm the current fee in writing with
            your quote rather than publishing a figure that goes out of date.
          </p>
          <Button href="/quote/">Request a quote</Button>
        </section>
      </div>
    </>
  );
}
