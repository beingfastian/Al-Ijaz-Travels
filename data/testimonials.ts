/* ============================================================================
 * TESTIMONIALS
 *
 * ⚠ INTENTIONALLY EMPTY. This is the second file on the site that will not be
 *   populated with invented content, and for a harder reason than the first.
 *
 * Accreditation numbers are left blank because claiming one you do not hold is
 * unlawful. Reviews are left blank because they are somebody else's words about
 * a real business, and writing them yourself is fabricating evidence.
 *
 * In the UK this is explicit rather than a matter of taste: the Digital Markets,
 * Competition and Consumers Act 2024 made fake reviews and concealed incentivised
 * reviews directly unlawful, enforceable by the CMA, with penalties reaching a
 * share of global turnover. The Consumer Protection from Unfair Trading
 * Regulations cover it too.
 *
 * The reference site leads with a 4.6 Tripadvisor rating, and matching that is
 * the right instinct — a rating a visitor can go and check is worth more than any
 * copy we could write. Populate this from a platform that verifies reviews and
 * keep `url` pointing at the source.
 *
 * TODO(client): real reviews, with permission to quote, plus the platform link.
 * <Testimonials> renders nothing while this is empty.
 * ========================================================================== */

export interface Testimonial {
  quote: string;
  /** As the reviewer wants to be credited. A first name and initial is fine. */
  name: string;
  /** Which package they actually travelled on — specificity is the trust signal. */
  package: string;
  /** Departure airport, where known. */
  departedFrom?: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export const testimonials: Testimonial[] = [];

export interface ReviewSummary {
  /** Where the reviews live, so a visitor can verify them. */
  platform: string;
  url: string;
  average: number;
  count: number;
}

/**
 * The aggregate shown above the quotes. Must match what the platform actually
 * reports on the day it is published — a stale or rounded-up average is the same
 * offence as an invented review, just less obvious.
 */
export const reviewSummary: ReviewSummary | null = null;
