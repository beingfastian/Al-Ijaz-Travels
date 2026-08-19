import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, CalendarDays } from 'lucide-react';
import { articles, getArticle, relatedArticles, readingMinutes } from '@/data/blog';
import { site } from '@/data/site';
import { Blocks } from '@/components/blog/Blocks';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}/` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
    },
  };
}

/**
 * An article.
 *
 * A contents list is rendered from the section headings rather than authored, so
 * it cannot fall out of step with the article — the failure mode of every
 * hand-written table of contents.
 */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const minutes = readingMinutes(article);
  const related = relatedArticles(article);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: `${site.url}/blog/${article.slug}/`,
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
          <p className="eyebrow">
            <Link href="/blog/" className="hover:underline">
              Guides
            </Link>
          </p>
          <h1 className="prose-column text-display">{article.title}</h1>
          <p className="prose-column text-body-lg text-text-muted">{article.standfirst}</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-body-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} aria-hidden />
              <time dateTime={article.published}>
                {new Date(article.published).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={15} aria-hidden />
              {minutes} minute read
            </span>
          </div>
        </div>
      </section>

      <div className="max-container padding-container grid gap-12 py-12 lg:grid-cols-[1fr_260px] lg:py-16">
        <article className="flex flex-col gap-12">
          {article.sections.map((section) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="prose-column flex flex-col gap-4"
            >
              <h2 className="text-heading">{section.heading}</h2>
              <Blocks blocks={section.body} />
            </section>
          ))}

          <div className="flex flex-col items-start gap-4 rounded-panel border border-border bg-surface-sunk p-8">
            <h2 className="text-subheading">Planning your Umrah?</h2>
            <p className="prose-column text-body text-text-muted">
              Every package on this site lists its hotels with real walking distances to
              the Haram, per-person pricing, and what is genuinely not included.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/packages/">See packages</Button>
              <Button href="/quote/" variant="secondary">
                Request a quote
              </Button>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          {/* Built from the headings, so it cannot drift from the article. */}
          <nav aria-label="On this page" className="flex flex-col gap-3">
            <h2 className="eyebrow">On this page</h2>
            <ol className="flex flex-col gap-2">
              {article.sections.map((section) => (
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

          {related.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border pt-6">
              <h2 className="eyebrow">Related</h2>
              <ul className="flex flex-col gap-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}/`}
                      className="text-body-sm font-medium text-green-900 hover:text-link hover:underline"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <section className="border-t border-border bg-surface-sunk">
        <div className="max-container padding-container py-12">
          <h2 className="text-heading">More guides</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((a) => a.slug !== article.slug)
              .slice(0, 3)
              .map((a, i) => (
                <Reveal key={a.slug} as="li" variant="scale" index={i} className="flex">
                  <Link
                    href={`/blog/${a.slug}/`}
                    className="hover-lift flex flex-1 flex-col gap-2 rounded-panel border border-border bg-surface p-5 shadow-card"
                  >
                    <span className="font-serif text-subheading text-green-900">{a.title}</span>
                    <span className="text-body-sm text-text-muted">{a.description}</span>
                  </Link>
                </Reveal>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
