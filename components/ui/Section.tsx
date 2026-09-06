import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Section wrapper carrying the vertical rhythm and the eyebrow/heading pattern
 * used throughout the site, so spacing is decided once rather than re-guessed
 * per section. The base repo repeats `py-24 max-container padding-container` by
 * hand in every component, which is why its sections drift out of alignment.
 *
 * THE RHYTHM IS py-12 lg:py-16, NOT py-16 lg:py-24
 *
 * Padding here is symmetric, so it doubles wherever two sections meet: at the
 * old value that was 96px of bottom padding against 96px of top, and where both
 * sections shared a background — the comparison table into the accreditation
 * row, for instance — the result was 192px of blank page with no edge to
 * explain it. It read as a rendering fault rather than as breathing room, and
 * the home page carries six of these.
 *
 * Anything raising this back up should check the same pair, because the cost is
 * paid at every seam and not just the one being looked at.
 */

type Tone = 'ground' | 'surface' | 'dark';

const TONES: Record<Tone, string> = {
  ground: '',
  surface: 'bg-surface-sunk',
  dark: 'bg-green-900 text-sand-50',
};

export function Section({
  eyebrow,
  title,
  description,
  action,
  centered = false,
  flushTop = false,
  tone = 'ground',
  pattern = false,
  children,
  className,
  id,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Right-aligned control beside the heading — usually a "see all" link. */
  action?: ReactNode;
  /**
   * Centre the header block.
   *
   * For sections whose children are a symmetric grid. A left-flush heading over
   * a three-column grid reads as an alignment mistake; over a left-weighted
   * layout it reads as deliberate. Cannot be combined with `action`, which is
   * inherently a left/right split — so `action` wins and centring is ignored.
   */
  centered?: boolean;
  /**
   * Drop the top padding, for a section sitting directly beneath another of the
   * same tone.
   *
   * Padding is symmetric, so a seam between two same-toned sections stacks both
   * — and with no change of background there is no edge to explain the space, so
   * it reads as a rendering fault rather than as separation. The section above
   * has already paid for the gap; this stops it being paid twice.
   *
   * Only for genuinely same-tone neighbours. Using it where the background does
   * change makes the two look welded together.
   */
  flushTop?: boolean;
  tone?: Tone;
  /** Tile the khatam motif behind the section. */
  pattern?: boolean;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  const dark = tone === 'dark';
  const headingId = id ? `${id}-heading` : undefined;

  const body = (
    <div
      className={cn(
        'max-container padding-container py-12 lg:py-16',
        flushTop && 'pt-0 lg:pt-0',
        className
      )}
    >
      {(eyebrow || title || description || action) && (
        <div
          className={cn(
            'flex flex-col gap-4',
            centered && !action
              ? 'items-center'
              : 'md:flex-row md:items-end md:justify-between'
          )}
        >
          <div
            className={cn(
              'flex flex-col gap-3',
              centered && !action && 'section-header-centered'
            )}
          >
            {eyebrow && (
              <p
                className={cn(
                  dark
                    ? 'text-label uppercase tracking-[0.14em] font-semibold text-gold-300'
                    : 'eyebrow'
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 id={headingId} className={cn('text-heading', dark && 'text-sand-50')}>
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  'text-body-lg',
                  centered ? '' : 'prose-column',
                  dark ? 'text-gold-100' : 'text-text-muted'
                )}
              >
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children && <div className={cn(title && 'mt-8')}>{children}</div>}
    </div>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={TONES[tone]}>
      {pattern ? (
        <div className={dark ? 'khatam-field-gold' : 'khatam-field'}>{body}</div>
      ) : (
        body
      )}
    </section>
  );
}
