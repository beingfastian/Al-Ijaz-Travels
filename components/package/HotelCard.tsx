import { Footprints, Star } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import { formatDistance } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Photo } from '@/components/ui/Photo';

/**
 * Leads on walking distance, in metres, at body-text weight — not tucked into a
 * caption. It is the number pilgrims actually compare between agencies, and
 * showing it plainly is the whole competitive argument.
 *
 * The photograph is optional and the card is designed around its absence rather
 * than despite it: no photo means no empty frame, no grey placeholder, just the
 * card as it was. Most of the 42 properties have no licensed image yet, and a
 * generic stock hotel room under a named property would be a lie by implication
 * — see assets/photos/HOTEL-PHOTOS.md.
 */
export function HotelCard({ hotel }: { hotel: Hotel }) {
  const isMakkah = hotel.city === 'makkah';

  return (
    <Card as="li" padded={false} className="overflow-hidden">
      {hotel.photo && (
        // 16:10 to match the package card slot, so a page mixing the two does not
        // step between aspect ratios. Cropping is centred, which is right for a
        // building elevation and wrong for a portrait — hence landscape sources only.
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunk">
          <Photo
            image={hotel.photo.key}
            alt={hotel.photo.alt}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-6">
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
        {hotel.photo?.credit && (
          <p className="text-body-sm text-text-muted">Photo: {hotel.photo.credit}</p>
        )}
      </div>
    </Card>
  );
}
