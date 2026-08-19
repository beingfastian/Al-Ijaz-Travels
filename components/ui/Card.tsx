import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Surface primitive. `as` keeps the semantics honest — a card in a list should
 * still be an <li>/<article>, not a <div> wearing a border.
 */
export function Card({
  as: Tag = 'div',
  padded = true,
  interactive = false,
  className,
  children,
}: {
  as?: ElementType;
  padded?: boolean;
  /** Adds hover lift. Only for cards that are genuinely a link target. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        'flex flex-col rounded-panel border border-border bg-surface shadow-card',
        padded && 'gap-4 p-6',
        interactive && 'relative transition-shadow hover:shadow-lift',
        className
      )}
    >
      {children}
    </Tag>
  );
}
