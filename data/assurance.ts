import { site } from './site';

/* ============================================================================
 * ASSURANCE PAGES
 *
 * Travel insurance, payment security and our responsibility. These are service
 * descriptions rather than legal instruments, which is why they are written here
 * in full while Terms and Privacy are not — those two carry binding obligations
 * and need a solicitor's eyes on the wording.
 *
 * The line matters: describing what we do is our job, and setting out what a
 * customer is contractually entitled to is a lawyer's.
 * ========================================================================== */

export interface AssuranceSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface AssurancePage {
  slug: string;
  title: string;
  description: string;
  standfirst: string;
  sections: AssuranceSection[];
}

export const assurancePages: AssurancePage[] = [
  {
    slug: 'payment-security',
    title: 'Payment Security and Financial Protection',
    description: `How your money is protected when you book with ${site.name}. ATOL ${site.accreditation.atolNumber}, what it covers, and what happens if something goes wrong.`,
    standfirst:
      'Every flight-inclusive package we sell is ATOL protected. That is a legal requirement rather than a badge, and it is checkable in about a minute.',
    sections: [
      {
        heading: 'ATOL protection',
        paragraphs: [
          `We hold ATOL ${site.accreditation.atolNumber}. Every package on this site that includes a flight is covered by it, which means the money you pay is protected if we cease trading — you are either brought home or refunded, and that is administered by the Civil Aviation Authority rather than by us.`,
          'You will receive an ATOL Certificate with your booking confirmation, not later. It names the flights and the accommodation you have paid for. If you are ever sold a flight-inclusive package without one, that is the point to stop and ask why.',
        ],
        bullets: [
          `Verify ATOL ${site.accreditation.atolNumber} on the CAA's own register — it takes a minute and it is worth doing with any operator`,
          'The certificate is issued at booking, alongside your invoice',
          'It covers the flight-inclusive package, not add-ons bought separately elsewhere',
        ],
      },
      {
        heading: 'IATA accreditation',
        paragraphs: [
          `We are an IATA accredited agent, number ${site.accreditation.iataNumber}. In practical terms that means we ticket directly with airlines rather than through a third party, so a schedule change or a rebooking is something we can act on rather than pass along.`,
        ],
      },
      {
        heading: 'How and when you pay',
        paragraphs: [
          'A deposit secures your booking and the balance is due before departure, with the exact dates set out in your confirmation rather than decided later. We do not take a deposit before availability is confirmed — the sequence is that we check, then you decide, then you pay.',
          'That order sounds procedural and it is the single most common complaint in this sector: money taken against a package that turns out not to exist on those dates.',
        ],
      },
      {
        heading: 'What is not covered',
        paragraphs: [
          'ATOL protects the package. It is not travel insurance, and it does not cover cancellation because your circumstances changed, medical costs abroad, or lost baggage. Those need a policy, which is why we treat insurance as required rather than optional.',
        ],
      },
    ],
  },

  {
    slug: 'travel-insurance',
    title: 'Travel Insurance',
    description:
      'Why travel insurance is required for Umrah, what a policy should cover, and the exclusions that catch pilgrims out.',
    standfirst:
      'Required, not recommended. ATOL protects your money if we fail; insurance protects you if something happens to you.',
    sections: [
      {
        heading: 'Why it is required',
        paragraphs: [
          'Saudi Arabia requires visitors to hold health insurance, and the tourist eVisa includes cover up to SAR 100,000 as standard. That is a floor, not a policy — it does not cover cancellation, curtailment, baggage, or repatriation.',
          'We ask every pilgrim to hold a policy before departure. You are welcome to arrange your own; we can also arrange one for you.',
        ],
      },
      {
        heading: 'What a policy should cover',
        paragraphs: [
          'For Umrah specifically, these are the clauses worth reading rather than skimming:',
        ],
        bullets: [
          'Medical treatment and repatriation in Saudi Arabia — check the limit, not just that it exists',
          'Cancellation and curtailment, including for illness in the family',
          'Pre-existing medical conditions, declared. An undeclared condition is the most common reason a claim fails',
          'Baggage and personal items, with a single-item limit that covers what you are actually carrying',
          'Cover for the full duration, including the day you fly out and the day you return',
        ],
      },
      {
        heading: 'The exclusions that catch people',
        paragraphs: [
          'Age limits are the first: many standard policies reduce cover or decline entirely above a certain age, which matters when a third of Umrah travellers are travelling with elderly parents. Declare ages honestly at the quote stage.',
          'The second is the pilgrimage itself. A small number of policies exclude religious travel or mass-gathering events. Read the definitions, and if it is unclear, ask the insurer in writing rather than assuming.',
        ],
      },
      {
        heading: 'If you buy your own',
        paragraphs: [
          'Send us the policy number and the insurer before you travel. Not as paperwork — if something happens on the ground, the group leader needs to know who to call, and finding that out during an emergency is not the moment.',
        ],
      },
    ],
  },

  {
    slug: 'our-responsibility',
    title: 'Our Responsibility',
    description: `What ${site.name} is responsible for, what you are responsible for, and what happens when something changes or goes wrong.`,
    standfirst:
      'Stated plainly, including the parts that are your responsibility rather than ours. Knowing the line before you travel is more useful than discovering it afterwards.',
    sections: [
      {
        heading: 'What we are responsible for',
        paragraphs: [
          'We are the organiser of the package, which under the Package Travel and Linked Travel Arrangements Regulations 2018 means we are responsible for the whole arrangement — not only for the parts we operate ourselves.',
        ],
        bullets: [
          'That the flights, hotels, transfers and visa processing you paid for are delivered as described',
          'That the hotel is the one named, or a same-tier alternative at no less than the stated distance from the Haram if it genuinely cannot be honoured',
          'That you are told about a significant change before you travel, not on arrival',
          'That a group leader is reachable while you are in Saudi Arabia',
          'That your money is ATOL protected',
        ],
      },
      {
        heading: 'What you are responsible for',
        paragraphs: [
          'A short list, and worth reading because each item can stop a trip entirely:',
        ],
        bullets: [
          'A valid passport with at least six months remaining from your arrival date',
          'The MenACWY vaccination, at least ten days before you arrive',
          'Travel insurance, held before departure',
          'Arriving at the airport at the time stated on your itinerary',
          'Telling us about medical, mobility or dietary needs at quote stage rather than on the day',
          'The accuracy of the names and dates you give us — an airline will not correct a misspelled name for free',
        ],
      },
      {
        heading: 'If something changes',
        paragraphs: [
          'Hotels change occasionally and flight schedules change more often. Where a change is significant we tell you what it is and what your options are, in writing. Where a hotel has to be substituted, the replacement is the same tier and no further from the Haram than the one you booked — and if we cannot do that, you are told rather than moved quietly.',
          'Umrah visa availability around the Hajj season is the one thing genuinely outside anyone’s control. We flag restricted months on the site before you book, which is why May and June carry a warning rather than a price alone.',
        ],
      },
      {
        heading: 'If something goes wrong',
        paragraphs: [
          'Speak to your group leader first — most problems are solvable on the ground in minutes and unsolvable a week later by email. If it is not resolved, contact us directly and we will put it in writing.',
          'We would rather hear a complaint during the trip than read a review after it, and that is a practical preference rather than a polite one.',
        ],
      },
    ],
  },
];

export function getAssurancePage(slug: string): AssurancePage | undefined {
  return assurancePages.find((p) => p.slug === slug);
}
