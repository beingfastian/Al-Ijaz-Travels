import Link from 'next/link';
import { ShieldCheck, Phone } from 'lucide-react';
import { accreditations } from '@/data/trust';
import { site } from '@/data/site';

/**
 * The strip above the navigation.
 *
 * The competitor runs one — "ATOL Protected | Get Instant Quote | 3000+ UK
 * Pilgrims Monthly" with a Get Quote button — and it earns its 48 pixels: the
 * first thing on the page answers "are these people legitimate" before a visitor
 * has read a headline.
 *
 * Ours carries the same signal with one difference: every claim on it is
 * checkable. The ATOL number is on the CAA register. We do not print a monthly
 * pilgrim count, because we do not have one and inventing it is the one thing on
 * this site that would undo everything else on it.
 */
export function UtilityBar() {
  const phone = site.contact.phone.replace(/\s/g, '');

  return (
    <div className="border-b border-green-800 bg-green-950">
      <div className="max-container padding-container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {accreditations.map((a) => (
            <li
              key={a.name}
              className="inline-flex items-center gap-1.5 text-body-sm font-medium text-gold-200"
            >
              <ShieldCheck size={14} className="text-gold-400" aria-hidden />
              {a.reference}
            </li>
          ))}
          <li className="hidden text-body-sm text-gold-100 sm:inline">
            Visa, flights and transfers included
          </li>
        </ul>

        <div className="flex items-center gap-4">
          {/* py-1 is not decoration: at 14px this link measured 149x22, which is
              under the 24px minimum target size, and it is the phone number for
              an audience that skews older. The padding costs nothing here and
              takes the target to 24px without moving the bar. */}
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 py-1 text-body-sm font-medium text-sand-50 hover:text-gold-200"
          >
            <Phone size={14} aria-hidden />
            {site.contact.phone}
          </a>
          <Link
            href="/quote/"
            className="rounded-full bg-gold-500 px-4 py-1.5 text-body-sm font-semibold text-noir-950 transition-colors hover:bg-gold-400"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
