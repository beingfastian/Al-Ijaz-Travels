import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Progress indicator for the quote flow. Reskinned from the Tripix reference,
 * which had the right shape.
 *
 * Marked up as an <ol> because the steps genuinely are ordered, with
 * aria-current="step" on the active one — the reference renders bare <div>s, so
 * a screen reader gets a row of loose numbers with no sense of position.
 */
export function Stepper({
  steps,
  current,
  className,
}: {
  steps: readonly string[];
  current: number;
  className?: string;
}) {
  return (
    <nav aria-label="Progress">
      <ol className={cn('flex flex-wrap items-center gap-x-3 gap-y-2', className)}>
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex-center size-7 shrink-0 rounded-full border text-body-sm transition-colors',
                  done && 'border-green-700 bg-green-700 text-sand-50',
                  active && 'border-green-900 bg-green-900 text-sand-50',
                  !done && !active && 'border-border text-text-muted'
                )}
                aria-hidden="true"
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'text-body-sm',
                  active ? 'font-medium text-green-900' : 'text-text-muted'
                )}
              >
                <span className="sr-only">
                  Step {i + 1} of {steps.length}
                  {done ? ', completed' : ''}:{' '}
                </span>
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className="text-border" aria-hidden="true">
                  —
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
