import type { LucideIcon } from 'lucide-react';
import { Plane, BedDouble, FileCheck, Bus } from 'lucide-react';

/* ============================================================================
 * THE FOUR THINGS A PACKAGE IS
 *
 * Flight, hotel, visa, transport. Every Umrah package sold in the UK is those
 * four things bought together, and the competitor leads its home page with them
 * for good reason: it is the clearest possible answer to "what am I actually
 * buying".
 *
 * Each one gets its own page rather than a paragraph, because each is where a
 * package quietly differs from the one next to it — the airline and whether it
 * connects, the hotel and how far it really is, the visa route, and whether the
 * transfer is a shared coach at 2 a.m. or a car that waits for your flight.
 * ========================================================================== */

export interface Service {
  id: 'flights' | 'hotels' | 'visa' | 'transport';
  label: string;
  href: string;
  icon: LucideIcon;
  /** One line for the home-page card. */
  summary: string;
  /** The specific, checkable claim — what we do that is worth clicking. */
  detail: string;
}

export const services: Service[] = [
  {
    id: 'flights',
    label: 'Flights',
    href: '/flights/',
    icon: Plane,
    summary: 'Return flights from six UK airports, direct where the route exists.',
    detail: 'London, Manchester and Birmingham fly direct to Jeddah. Newcastle, Glasgow and Edinburgh connect, and we say so before you book rather than after.',
  },
  {
    id: 'hotels',
    label: 'Hotels',
    href: '/hotels/',
    icon: BedDouble,
    summary: 'Named hotels with their real walking distance to the Haram, in metres.',
    detail: 'Every property we use is listed with its actual distance — 120 m, 300 m, 1.4 km. Not “close to the Haram”, which means nothing until you are carrying a suitcase at midnight.',
  },
  {
    id: 'visa',
    label: 'Visas',
    href: '/visa/',
    icon: FileCheck,
    summary: 'Umrah visa, ETA or tourist eVisa — and which one you actually need.',
    detail: 'Most UK pilgrims no longer need a dedicated Umrah visa at all. We process whichever route suits you, and issue the Nusuk permit before you fly.',
  },
  {
    id: 'transport',
    label: 'Transport',
    href: '/transport/',
    icon: Bus,
    summary: 'Every transfer: airport, Makkah to Madinah, and back.',
    detail: 'Air-conditioned vehicles that meet your flight rather than a schedule. The Makkah–Madinah leg by road or by the Haramain high-speed train, depending on the package.',
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

/**
 * What is genuinely optional, and priced separately.
 *
 * Published because the alternative is a pilgrim assuming it is included and
 * finding out at the desk. Al Habib lists these too, and they are right to.
 */
export const addOns = [
  { name: 'Travel insurance', note: 'Required. We can arrange it or you can bring your own.' },
  { name: 'Private Ziyarat', note: 'A car and guide to yourself rather than the group coach.' },
  { name: 'Room upgrade', note: 'Double or twin instead of the quad or triple a package quotes.' },
  { name: 'Haramain train', note: 'The Makkah–Madinah leg by high-speed rail instead of road.' },
  { name: 'Wheelchair assistance', note: 'At the airports and at the Haram. Arrange it in advance.' },
  { name: 'Zamzam and extra baggage', note: 'Allowances differ by airline; we confirm yours.' },
  { name: 'UK SIM or roaming', note: 'Useful if you are coordinating a group on the ground.' },
  { name: 'Laundry', note: 'Most hotels charge per item; some packages include a service wash.' },
];
