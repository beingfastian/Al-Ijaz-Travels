import { Footprints, Star } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import { formatDistance } from '@/lib/format';
import { Card } from '@/components/ui/Card';

/**
 * Leads on walking distance, in metres, at body-text weight — not tucked into a
 * caption. It is the number pilgrims actually compare between agencies, and
 * showing it plainly is the whole competitive argument.
 */
export function HotelCard({ hotel }: { hotel: Hotel }) {
  const isMakkah = hotel.city === 'makkah';

  return (
    <Card as="li" className="gap-3">
      <p className="text-label uppercase tracking-[0.14em] text-gold-text">
        {isMakkah ? 'Makkah' : 'Madinah'}
      </p>
      <p className="font-serif text-subheading text-green-900">{hotel.name}</p>
      <p className="inline-flex items-center gap-1.5 text-body-sm text-text-muted">
        <Star size={14} className="fill-gold-500 text-gold-500" aria-hidden />
        {hotel.stars}-star
      </p>
      <p className="inline-flex items-center gap-2 text-body font-medium text-green-700">
        <Footprints size={16} aria-hidden />
        {formatDistance(hotel.distanceToHaramM)} to the{' '}
        {isMakkah ? 'Haram' : "Prophet's Mosque"}
      </p>
    </Card>
  );
}
