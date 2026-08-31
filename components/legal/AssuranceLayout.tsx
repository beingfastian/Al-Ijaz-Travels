import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShieldCheck, Check } from 'lucide-react';
import { getAssurancePage } from '@/data/assurance';
import { site } from '@/data/site';
import { accreditations } from '@/data/trust';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CalloutCta } from '@/components/ui/CalloutCta';

/**
 * One layout for the three assurance pages.
 *
 * They share a shape — standfirst, numbered sections, some with bullet lists —
 * so they share a component. Writing three near-identical page files would mean
 * three places for the treatment to drift, which is the mistake the closing CTA
 * blocks already made once.
 */

export function buildAssuranceMetadata(slug: string): Metadata {
  const page = getAssurancePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}/` },
  };
}

export function AssuranceLayout({ slug }: { slug: string }) {
  const page = getAssurancePage(slug);
  if (!page) notFound();

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Assurance</p>
          <h1 className="prose-column text-display">{page.title}</h1>
          <p className="prose-column text-body-lg text-text-muted">{page.standfirst}</p>

          {accreditations.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-2">
              {accreditations.map((a) => (
                <li
                  key={a.name}
                  className="rule-gold inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-body-sm font-medium text-green-900"
                >
                  <ShieldCheck size={15} className="text-gold-600" aria-hidden />
                  {/* The credential name. This pill used to show the number
                      alone, which is now unset — see data/trust.ts. */}
                  {a.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="max-container padding-container grid gap-12 py-12 lg:grid-cols-[1fr_260px] lg:py-16">
        <article className="flex flex-col gap-12">
          {page.sections.map((section) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="prose-column flex flex-col gap-4"
            >
              <h2 className="text-heading">{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <p key={text.slice(0, 40)} className="text-body-lg text-text">
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="flex flex-col gap-3 pt-1">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-lg text-text">
                      <Check size={17} className="mt-1.5 shrink-0 text-green-700" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <CalloutCta
            title="Ask us anything on this page"
            actions={
              <>
                <Button href="/quote/">Request a quote</Button>
                <Button href="/contact/" variant="secondary">
                  Contact us
                </Button>
              </>
            }
          >
            If anything here is unclear, ask before you book rather than after. We would
            rather answer a difficult question now than manage a misunderstanding later.
          </CalloutCta>
        </article>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="On this page" className="flex flex-col gap-3">
            <h2 className="eyebrow">On this page</h2>
            <ol className="flex flex-col gap-2">
              {page.sections.map((section) => (
                <li key={section.heading}>
                  <a
                    href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="text-body-sm text-text-muted hover:text-link hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-6">
            <h2 className="eyebrow">Registered office</h2>
            <p className="text-body-sm text-text-muted">{site.contact.address}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
