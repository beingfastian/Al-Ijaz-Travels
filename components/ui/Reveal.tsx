'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import {
  REVEAL,
  REVEAL_ROOT_MARGIN,
  REVEAL_THRESHOLD,
  staggerStyle,
  type RevealVariant,
} from '@/lib/motion';

/**
 * Reveals its children once they scroll into view.
 *
 * The important property is what happens when things go wrong. The element is
 * rendered with `data-reveal="out"`, but the CSS that hides it is scoped to
 * `.js` — a class set by a blocking script in the document head. So:
 *
 *   - no JavaScript      -> `.js` never lands, content is visible, always
 *   - no IntersectionObserver -> we reveal immediately on mount
 *   - reduced motion     -> the stylesheet ignores the whole system
 *   - JavaScript errors before hydration -> content is still visible
 *
 * That ordering matters more than the animation does. A scroll-reveal that hides
 * content by default is one failed script away from an empty page, and on a
 * static marketing site the empty page is what the crawler indexes.
 */

interface RevealProps {
  children: ReactNode;
  /** Defaults to `rise`. Use `settle` for hero imagery, `fade` for dense text. */
  variant?: RevealVariant;
  /** Position within a staggered group. Omit for standalone elements. */
  index?: number;
  /** Reveal once and stop observing. True for essentially every use. */
  once?: boolean;
  as?: ElementType;
  className?: string;
}

export function Reveal({
  children,
  variant = 'rise',
  index,
  once = true,
  as: Tag = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Older browsers, and anything that strips the API: show it and move on.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Already in view on load — reveal without waiting for a scroll that may
    // never come, which is the common case for above-the-fold content.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'in' : 'out'}
      data-reveal-variant={REVEAL[variant]}
      style={index === undefined ? undefined : staggerStyle(index)}
      className={className}
    >
      {children}
    </Tag>
  );
}
