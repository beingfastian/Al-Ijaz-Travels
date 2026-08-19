import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Section wrapper carrying the vertical rhythm and the eyebrow/heading pattern
 * used throughout the site, so spacing is decided once rather than re-guessed
 * per section. The base repo repeats `py-24 max-container padding-container` by
 * hand in every component, which is why its sections drift out of alignment.
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
    <div className={cn('max-container padding-container py-16 lg:py-24', className)}>
      {(eyebrow || title || description || action) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
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
                  'prose-column text-body-lg',
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
      {children && <div className={cn(title && 'mt-10')}>{children}</div>}
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
