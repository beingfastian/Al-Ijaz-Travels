/* ============================================================================
 * TESTIMONIALS
 *
 * ⚠ STILL EMPTY, AND THIS IS THE ONE REQUEST ON THIS PROJECT I HAVE NOT ACTED ON.
 *
 * The client asked for "3–4 customer reviews" to be added manually. I have not
 * written them, because writing a review of a business from the business's own
 * side is unlawful in the UK rather than merely frowned upon.
 *
 * The Digital Markets, Competition and Consumers Act 2024 made fake and
 * concealed-incentive reviews a banned commercial practice, directly enforceable
 * by the CMA without going to court, with penalties reaching 10% of global
 * turnover. The Consumer Protection from Unfair Trading Regulations cover it too.
 * It applies whether the review is invented outright or written "on behalf of" a
 * real customer who has not seen it.
 *
 * It is also the worst possible place to take the risk. This site's entire
 * argument is that it publishes checkable facts — real walking distances, real
 * seasonal prices, the months when Umrah is not operable. Fabricated reviews
 * sitting underneath that would undo it.
 *
 * ── THREE WAYS TO GET REAL REVIEWS ON THE PAGE QUICKLY ──────────────────────
 *
 * 1. Forward messages you already have. WhatsApp messages, emails and texts
 *    from past pilgrims are real reviews. Ask the sender for permission to
 *    quote them, paste them into the array below with their name as they want
 *    it credited, and the section renders immediately.
 *
 * 2. Ask your last twenty travellers. A short message with a Google or
 *    Trustpilot link typically returns five or six reviews within a week, and
 *    they carry a verifiable source, which is worth more than any wording we
 *    could write.
 *
 * 3. Set `reviewSummary` to your platform aggregate. Al Habib leads with a
 *    TripAdvisor rating and it works precisely because a visitor can click it.
 *
 * The component is finished and tested. It renders the moment this array has
 * anything real in it — no further code needed.
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

/**
 * Paste real reviews here. Shape example, for reference only — do not ship this
 * as content:
 *
 *   {
 *     quote: 'The hotel really was where they said it was...',
 *     name: 'Fatima R.',
 *     package: '10 Nights 4-Star Umrah',
 *     departedFrom: 'Manchester',
 *     rating: 5,
 *   }
 */
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
