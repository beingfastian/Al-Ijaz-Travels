import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Small status/label chip.
 *
 * Note `gold` uses --color-gold-text, not the raw brand gold: at this size the
 * text is small, and brand gold on cream measures 3.36:1 — below AA. The token
 * resolves to the derived, compliant value. See scripts/palette.mjs.
 */
type Variant = 'neutral' | 'green' | 'gold' | 'on-dark';

const VARIANTS: Record<Variant, string> = {
  neutral: 'bg-surface-sunk text-text-muted border-border',
  green: 'bg-green-50 text-green-800 border-green-200',
  gold: 'bg-gold-50 text-gold-text border-gold-200',
  'on-dark': 'bg-green-800 text-gold-100 border-green-700',
};

export function Pill({
  variant = 'neutral',
  icon,
  children,
  className,
}: {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-body-sm font-medium whitespace-nowrap',
        VARIANTS[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
