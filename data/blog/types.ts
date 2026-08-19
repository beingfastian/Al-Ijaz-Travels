/* ============================================================================
 * BLOG CONTENT MODEL
 *
 * Structured blocks rather than MDX. MDX would mean another build dependency and
 * another way for content to break the export; blocks stay typed, render through
 * one component, and cannot produce invalid markup.
 *
 * The editorial standard for this directory, which matters more than the schema:
 *
 * 1. Be specific where the competition is vague. Our cost article quotes real
 *    figures from the catalogue rather than "prices vary" — those numbers are
 *    computed, so they cannot drift out of step with the packages on sale.
 *
 * 2. Describe practice, do not issue rulings. The rites of Umrah are settled and
 *    can be described accurately. Anything a pilgrim's own circumstances bear on
 *    — a missed rite, an illness, a menstruating woman's timing — is referred to
 *    a scholar, because that is a question of fiqh and not of travel logistics.
 *
 * 3. Date anything that can go stale, and say where it came from.
 * ========================================================================== */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  /** A pulled-out caution. Used sparingly — three per article and it is noise. */
  | { type: 'note'; text: string };

export interface Section {
  /** Rendered as an h2 and used to build the on-page contents list. */
  heading: string;
  body: Block[];
}

export interface Article {
  slug: string;
  title: string;
  /** Meta description and the card summary. One sentence, specific. */
  description: string;
  /** ISO date. Rendered, and emitted in Article JSON-LD. */
  published: string;
  updated?: string;
  /** What the reader is here to find out, in one line, above the contents. */
  standfirst: string;
  sections: Section[];
  /** Slugs of two or three genuinely related pieces. */
  related: string[];
}

/**
 * Reading time from the actual block content.
 *
 * 220 words per minute, which is the low end of adult silent reading — rounding
 * against ourselves is the honest direction for an estimate a reader uses to
 * decide whether they have time right now.
 */
export function readingMinutes(article: Article): number {
  const words = article.sections
    .flatMap((s) => [s.heading, ...s.body.flatMap(blockText)])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function blockText(block: Block): string[] {
  switch (block.type) {
    case 'p':
    case 'note':
      return [block.text];
    case 'ul':
    case 'ol':
      return block.items;
  }
}
