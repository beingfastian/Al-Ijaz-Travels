import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Vertical timeline. The one component from the Tripix reference that maps onto
 * this project almost unchanged — its journey timeline (origin, stops,
 * destination) is structurally the same thing as a day-by-day itinerary.
 *
 * Rendered as an <ol> so the sequence survives without CSS, and the marker is
 * aria-hidden because the visible heading already carries the day number.
 */

export interface TimelineItem {
  /** Shown inside the marker — a day number, or a short label. */
  marker: ReactNode;
  title: string;
  detail?: string;
  /** Screen-reader prefix for the title, e.g. "Day 3: ". */
  srPrefix?: string;
}

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn('relative flex flex-col gap-8 border-l border-border pl-8', className)}>
      {items.map((item, i) => (
        <li key={i} className="relative flex flex-col gap-2">
          <span
            className="absolute -left-[2.3rem] top-1 flex-center size-6 rounded-full border border-gold-500 bg-ground text-body-sm text-gold-text"
            aria-hidden="true"
          >
            {item.marker}
          </span>
          <h3 className="font-serif text-subheading text-green-900">
            {item.srPrefix && <span className="sr-only">{item.srPrefix}</span>}
            {item.title}
          </h3>
          {item.detail && <p className="text-body text-text-muted">{item.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
