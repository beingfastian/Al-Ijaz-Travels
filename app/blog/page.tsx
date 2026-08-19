import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { articles, readingMinutes } from '@/data/blog';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Umrah Guides',
  description:
    'Practical guides for UK pilgrims — what Umrah costs, which visa you need, the rites step by step, and what Ramadan in Makkah is genuinely like.',
  alternates: { canonical: '/blog/' },
};

/**
 * The guides index.
 *
 * Twelve articles on the topics this audience actually searches. Matching a
 * competitor's topic map is the easy half; the articles have to be better, and
 * the way these are better is specificity — real prices from our own catalogue,
 * walking distances in metres, and the things nobody warns first-time pilgrims
 * about, like Umrah visas being suspended around Hajj.
 */
export default function BlogIndexPage() {
  const [lead, ...rest] = articles;

  return (
    <>
      <section className="border-b border-border khatam-field">
        <div className="max-container padding-container flex flex-col gap-4 py-14">
          <p className="eyebrow">Guides</p>
          <h1 className="text-display">Umrah, explained properly</h1>
          <p className="prose-column text-body-lg text-text-muted">
            Written by people who arrange these journeys, not by a copywriter working
            from other people’s articles. Where something is a matter of religious
            ruling rather than travel, we say so and point you to a scholar.
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-10 py-12 lg:py-16">
        {lead && (
          <Reveal>
            <Link
              href={`/blog/${lead.slug}/`}
              className="hover-lift group flex flex-col gap-4 rounded-panel border border-border bg-surface p-8 shadow-card"
            >
              <span className="eyebrow">Start here</span>
              <h2 className="font-serif text-heading text-green-900">{lead.title}</h2>
              <p className="prose-column text-body-lg text-text-muted">{lead.standfirst}</p>
              <span className="inline-flex items-center gap-2 text-body-sm text-link">
                Read it
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        )}

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((article, i) => (
            <Reveal key={article.slug} as="li" variant="scale" index={i} className="flex">
              <Link
                href={`/blog/${article.slug}/`}
                className="hover-lift group flex flex-1 flex-col gap-3 rounded-panel border border-border bg-surface p-6 shadow-card"
              >
                <h2 className="font-serif text-subheading text-green-900">{article.title}</h2>
                <p className="flex-1 text-body-sm text-text-muted">{article.description}</p>
                <span className="inline-flex items-center gap-2 border-t border-border pt-3 text-body-sm text-text-muted">
                  <Clock size={14} aria-hidden />
                  {readingMinutes(article)} minute read
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
