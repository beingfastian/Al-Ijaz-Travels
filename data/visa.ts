/* ============================================================================
 * VISA ROUTES
 *
 * ⚠ EVERY CLAIM ON THIS PAGE IS DATED, AND THAT IS NOT DECORATION.
 *
 * Saudi entry rules have changed repeatedly and materially — the Nusuk permit
 * requirement, the multiple-entry Umrah visa, and the fact that Umrah can now be
 * performed on a tourist visa at all are all recent. Stale visa advice is worse
 * than no visa advice: a pilgrim who arrives on the wrong route does not have a
 * mild inconvenience, they have a cancelled pilgrimage.
 *
 * So every route below carries `checkedOn` and `source`, both rendered on the
 * page. If a figure could not be verified against an official source it is not
 * stated — there are no fees quoted here, because fees change and a wrong number
 * is worse than an honest "we will confirm this at quote".
 *
 * PRIMARY SOURCE: UK Foreign, Commonwealth & Development Office travel advice
 * for Saudi Arabia. Checked 20 August 2026.
 *
 * TODO(client): have a consultant re-verify every line each quarter, and update
 * `checkedOn`. A page that says "checked August 2026" in 2027 is doing damage.
 * ========================================================================== */

export interface VisaRoute {
  id: 'umrah' | 'eta' | 'tourist';
  name: string;
  shortName: string;
  /** One line: who this is actually for. */
  bestFor: string;
  /** How long the authorisation itself lasts. */
  validity: string;
  /** How long you may actually remain in the Kingdom. */
  stayLimit: string;
  entries: string;
  /** What it permits, in plain terms. */
  permits: string[];
  /** What it does not, stated as plainly as what it does. */
  limitations: string[];
  /** Steps in order. */
  howToApply: string[];
  checkedOn: string;
  source: { label: string; url: string };
}

const FCDO = {
  label: 'UK Foreign, Commonwealth & Development Office travel advice',
  url: 'https://www.gov.uk/foreign-travel-advice/saudi-arabia/entry-requirements',
};

const CHECKED = '20 August 2026';

export const visaRoutes: VisaRoute[] = [
  {
    id: 'umrah',
    name: 'Umrah Visa',
    shortName: 'Umrah',
    bestFor:
      'Pilgrims who want the dedicated pilgrimage route, usually arranged through an approved agent alongside the package.',
    validity: 'Issued for the pilgrimage; a one-year multiple-entry form is now available',
    stayLimit: 'Set at issue — confirm before you book leave',
    entries: 'Single or multiple, depending on the form issued',
    permits: [
      'Umrah outside the Hajj season',
      'Travel to Makkah and Madinah',
      'Arrangement through your travel agent as part of the package',
    ],
    limitations: [
      'Does not cover Hajj — that requires a separate Hajj visa',
      'A Nusuk permit (tasreeh) is required for entry to Masjid al-Haram, and is separate from the visa itself',
    ],
    howToApply: [
      'We apply on your behalf as part of your package — you do not deal with the portal',
      'Send us your passport details, a passport photograph and your MenACWY vaccination record',
      'We issue your Nusuk permit before departure and send it to you',
    ],
    checkedOn: CHECKED,
    source: FCDO,
  },
  {
    id: 'eta',
    name: 'Electronic Travel Authorisation (ETA)',
    shortName: 'ETA',
    bestFor:
      'Pilgrims who expect to return more than once — it is the longest-running authorisation of the three.',
    validity: '730 days from the date of issue',
    stayLimit: '180 days in total across the 730-day period',
    entries: 'Multiple',
    permits: [
      'Umrah outside the Hajj season',
      'Return visits across two years without reapplying',
      'General travel within the Kingdom',
    ],
    limitations: [
      'Not valid for Hajj',
      'The 180 days are cumulative across all visits, not per visit',
      'Still requires a Nusuk permit for the Haram',
    ],
    howToApply: [
      'Applied for online before travel',
      'Passport valid for at least six months beyond your arrival date',
      'MenACWY vaccination at least ten days before you arrive',
    ],
    checkedOn: CHECKED,
    source: FCDO,
  },
  {
    id: 'tourist',
    name: 'Tourist eVisa',
    shortName: 'Tourist',
    bestFor:
      'Most first-time UK pilgrims — and the route many people do not realise now permits Umrah at all.',
    validity: '365 days from the date of issue',
    stayLimit: '90 days in total across the 365-day period',
    entries: 'Multiple',
    permits: [
      'Umrah — a separate pilgrimage visa is no longer required for this',
      'Tourism elsewhere in Saudi Arabia, so you can add Jeddah, AlUla or Riyadh',
      'Includes health insurance cover up to SAR 100,000',
    ],
    limitations: [
      'Not valid for Hajj',
      'Shorter cumulative stay than the ETA — 90 days against 180',
      'Still requires a Nusuk permit for the Haram',
    ],
    howToApply: [
      'Applied for online, or on arrival at a Saudi international airport',
      'Passport valid for at least six months beyond your arrival date',
      'MenACWY vaccination at least ten days before you arrive',
    ],
    checkedOn: CHECKED,
    source: FCDO,
  },
];

export function getVisaRoute(id: string): VisaRoute | undefined {
  return visaRoutes.find((r) => r.id === id);
}

/**
 * Requirements that apply whichever route you take. Separated out because they
 * are the ones people actually get caught by — a passport with five months left,
 * or a vaccination given a week before departure instead of ten days.
 */
export const universalRequirements = [
  {
    title: 'Passport valid six months beyond arrival',
    detail:
      'Not six months from booking — six months from the day you land. This is the single most common reason a pilgrim is turned away at check-in, and it is entirely avoidable.',
  },
  {
    title: 'MenACWY vaccination, at least ten days before arrival',
    detail:
      'The quadrivalent meningococcal vaccine is mandatory for every Umrah pilgrim aged one and over. Ten days is a minimum for the certificate to be accepted, so book it well before departure — your GP or a travel clinic can administer it.',
  },
  {
    title: 'A Nusuk permit for the Haram',
    detail:
      'Separate from the visa. Entry to Masjid al-Haram requires a digital permit issued through the Nusuk platform, tied to a booked service. We issue this for you before you travel.',
  },
  {
    title: 'Hajj is a different visa entirely',
    detail:
      'None of the three routes below permits Hajj. If you intend to perform Hajj you need a Hajj visa, allocated through a separate quota system — tell us early, because it is not something that can be arranged at short notice.',
  },
];

/**
 * FAQ shown on the visa page and emitted as FAQPage structured data.
 * Kept short and answerable; anything requiring a caveat belongs in prose.
 */
export const visaFaqs = [
  {
    question: 'Do I still need a separate Umrah visa?',
    answer:
      'Not necessarily. Umrah can now be performed on a tourist eVisa or an Electronic Travel Authorisation, which is a change many pilgrims are unaware of. A dedicated Umrah visa remains available and we arrange it as part of your package — which route suits you depends mainly on whether you expect to return.',
  },
  {
    question: 'Can I perform Umrah on a tourist visa?',
    answer:
      'Yes. The Saudi tourist eVisa permits Umrah outside the Hajj season. You will still need a Nusuk permit to enter Masjid al-Haram, which is separate from the visa and which we issue for you.',
  },
  {
    question: 'How long can I stay?',
    answer:
      'The tourist eVisa allows 90 days in total across a 365-day validity. The ETA allows 180 days across 730 days. Both are cumulative across all your visits, not per visit — a point that catches people who plan two trips in a year.',
  },
  {
    question: 'Do I need the meningitis vaccination?',
    answer:
      'Yes. The quadrivalent MenACWY vaccine is mandatory for all Umrah pilgrims aged one and over, and must be given at least ten days before you arrive for the certificate to be accepted.',
  },
  {
    question: 'Does any of this cover Hajj?',
    answer:
      'No. Hajj requires its own visa under a separate quota system. If Hajj is your intention, speak to us well in advance — it cannot be arranged on the timescales that work for Umrah.',
  },
  {
    question: 'What does the visa cost?',
    answer:
      'Fees change, and quoting a figure that later turns out to be wrong helps nobody. Visa processing is included in every package on this site; we confirm the current cost in writing with your quote.',
  },
];
