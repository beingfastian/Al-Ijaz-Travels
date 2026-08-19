import type { ItineraryDay } from '@/lib/types';
import { Timeline, type TimelineItem } from '@/components/ui/Timeline';

/**
 * Day-by-day itinerary, rendered through the shared Timeline. The day number
 * lives in the marker and is repeated for screen readers via srPrefix, since the
 * marker itself is aria-hidden.
 */
export function Itinerary({ days }: { days: ItineraryDay[] }) {
  const items: TimelineItem[] = days.map((d) => ({
    marker: d.day,
    title: d.title,
    detail: d.detail,
    srPrefix: `Day ${d.day}: `,
  }));

  return <Timeline items={items} />;
}
