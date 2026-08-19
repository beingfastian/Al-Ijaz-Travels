import { practicalArticles } from './practical';
import { guidanceArticles } from './guidance';
import type { Article } from './types';

export type { Article, Block, Section } from './types';
export { readingMinutes } from './types';

/**
 * The twelve articles, newest first.
 *
 * The topic map matches the competitor's, because those are the queries this
 * audience actually types. Matching the topics is the easy half; the articles
 * have to be better, and the way they are better is specificity — real prices
 * from our own catalogue, the walking distances, the fact that Umrah visas are
 * suspended around Hajj, and the things that catch first-time pilgrims out.
 */
export const articles: Article[] = [...practicalArticles, ...guidanceArticles].sort((a, b) =>
  b.published.localeCompare(a.published)
);

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** Resolve the `related` slugs, dropping any that no longer exist. */
export function relatedArticles(article: Article): Article[] {
  return article.related.map(getArticle).filter((a): a is Article => a !== undefined);
}
