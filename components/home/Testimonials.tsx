import { Star, Quote } from 'lucide-react';
import { testimonials, reviewSummary } from '@/data/testimonials';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

/**
 * What previous pilgrims said.
 *
 * Renders nothing until `data/testimonials.ts` holds real reviews. The reference
 * site leads with a Tripadvisor rating, and matching that is the right instinct —
 * but a testimonial is the one piece of content on this site that is somebody
 * else's words, and inventing them is fabricating evidence about a real business.
 * It is also, in the UK, a straightforward breach of the Consumer Protection from
 * Unfair Trading Regulations and the Digital Markets, Competition and Consumers
 * Act 2024, which made fake reviews explicitly unlawful.
 *
 * So the component is built and empty. Populate it from a platform that verifies
 * reviews — Trustpilot, Google, Tripadvisor — and keep the link, so a visitor can
 * check the source rather than take the quote on trust.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section
      id="reviews"
      eyebrow="Reviews"
      title="What pilgrims said afterwards"
      description={
        reviewSummary
          ? `${reviewSummary.average.toFixed(1)} out of 5 from ${reviewSummary.count} reviews on ${reviewSummary.platform}.`
          : undefined
      }
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={`${t.name}-${i}`}
            as="li"
            variant="scale"
            index={i}
            className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6 shadow-card"
          >
            <Quote size={22} className="text-gold-line" aria-hidden />

            <blockquote className="flex-1 text-body text-text">{t.quote}</blockquote>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex flex-col">
                <span className="text-body-sm font-medium text-green-900">{t.name}</span>
                <span className="text-body-sm text-text-muted">
                  {t.package}
                  {t.departedFrom ? ` · from ${t.departedFrom}` : ''}
                </span>
              </div>
              <span className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: t.rating }, (_, s) => (
                  <Star key={s} size={13} className="fill-gold-500 text-gold-500" aria-hidden />
                ))}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>

      {reviewSummary?.url && (
        <p className="mt-6 text-body-sm text-text-muted">
          Every review above is published on{' '}
          <a href={reviewSummary.url} className="text-link underline" rel="noopener noreferrer">
            {reviewSummary.platform}
          </a>
          , where it can be checked independently.
        </p>
      )}
    </Section>
  );
}
