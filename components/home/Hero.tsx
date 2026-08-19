import { ShieldCheck, Footprints, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RouteIllustration } from './RouteIllustration';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * Hero composition follows the base repo's asymmetric split — copy on one side,
 * illustration bleeding out of the other — which is the part of that design worth
 * keeping. The khatam field replaces its topographic PNG.
 */

const PROMISES = [
  {
    icon: Footprints,
    title: 'Distance, in metres',
    detail: 'Every hotel listed with its real walking distance to the Haram.',
  },
  {
    icon: Receipt,
    title: 'Per-person pricing',
    detail: 'Sharing basis stated. Exclusions listed as plainly as inclusions.',
  },
  {
    icon: ShieldCheck,
    title: 'A consultant first',
    detail: 'Speak to someone before you commit to anything.',
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 khatam-field" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ground" aria-hidden="true" />

      <div className="max-container padding-container relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">
            <span lang="ar" className="text-body">
              الإعجاز
            </span>
            <span className="mx-2 text-gold-400" aria-hidden="true">
              ·
            </span>
            Umrah from Pakistan
          </p>

          <h1 className="text-display-xl">
            The journey between
            <span className="block text-gold-text">two sacred cities</span>
          </h1>

          <p className="text-body-lg text-text-muted prose-column">
            Umrah packages chosen the way pilgrims actually choose them — by how far
            the hotel really is from the Haram, and what the price genuinely covers.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/packages/" size="lg">
              View packages
            </Button>
            <Button href={whatsappUrl()} variant="secondary" size="lg">
              Ask on WhatsApp
            </Button>
          </div>
        </div>

        <div className="relative">
          <RouteIllustration className="w-full max-w-[560px] lg:-mr-12 lg:max-w-none" />
        </div>
      </div>

      <div className="max-container padding-container relative pb-16">
        <ul className="grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex gap-4">
              <span className="flex-center size-11 shrink-0 rounded-full bg-green-50 text-green-700">
                <Icon size={20} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-serif text-subheading text-green-900">{title}</span>
                <span className="text-body-sm text-text-muted">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
