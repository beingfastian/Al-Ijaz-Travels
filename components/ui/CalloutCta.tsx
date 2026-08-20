import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The closing block that ends most pages.
 *
 * Centred, and this is the one place on the site where centring the body text is
 * right rather than wrong. The rule against centred copy is about reading —
 * across a long paragraph every line starts in a different place and the eye has
 * to hunt for each one. That cost does not apply to two lines above a button,
 * and the gain does: a centred closing block reads as a deliberate full stop,
 * where a left-flush one in a full-width panel leaves a void to its right and
 * reads as unfinished.
 *
 * One component rather than eight hand-aligned panels, so the treatment cannot
 * drift page to page — which is exactly how it ended up inconsistent before.
 */
export function CalloutCta({
  title,
  children,
  actions,
  tone = 'sunk',
  className,
}: {
  title: string;
  children: ReactNode;
  /** One or two buttons. They centre and wrap together on narrow screens. */
  actions?: ReactNode;
  tone?: 'sunk' | 'surface';
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-5 rounded-panel border border-border p-8 text-center lg:p-10',
        tone === 'sunk' ? 'bg-surface-sunk' : 'bg-surface shadow-card',
        className
      )}
    >
      <h2 className="text-subheading">{title}</h2>

      {/* Capped narrower than a reading column: a centred line much beyond this
          is hard to track back from, and a CTA is short by nature. */}
      <div className="max-w-[54ch] text-body text-text-muted">{children}</div>

      {actions && <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>}
    </section>
  );
}
