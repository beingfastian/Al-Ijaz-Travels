import { z } from 'zod';
import type { AirportCode } from '@/lib/types';

/* ============================================================================
 * ENQUIRY SCHEMA — one form, one step.
 *
 * This was a four-step wizard: travellers, trip, contact, review. It validated
 * cleanly, the draft persisted, and it was the wrong shape for the job.
 *
 * Someone comparing three Umrah operators on a phone will fill in one form. They
 * will not complete four panels to find out whether a package is available — and
 * every step is a place to stop, which is why the competitor's single form
 * converts better than our better-engineered wizard did. Steps are justified when
 * a form is long enough that showing it all is intimidating; nine fields is not
 * that form.
 *
 * So: everything visible at once, the shortest honest field list, and no field
 * that does not change the answer we give.
 *
 * Deliberately NOT collected — a quote is not a booking:
 *   passport numbers, dates of birth, addresses, payment details.
 * Asking for identity documents before anyone has committed costs conversions and
 * creates a data-protection liability for no operational benefit. The consultant
 * collects those once availability is confirmed.
 * ========================================================================== */

export const SHARING = ['quad', 'triple', 'double'] as const;

const AIRPORTS = ['LHR', 'MAN', 'BHX', 'NCL', 'GLA', 'EDI'] as const;

export const enquirySchema = z.object({
  /* --- who you are. Name and phone are the only truly required fields. --- */
  name: z.string().min(2, 'Enter your name so we know who we are speaking to'),
  phone: z
    .string()
    .min(10, 'Enter a number we can reach you on, including the country code')
    .regex(/^[+0-9\s()-]+$/, 'Use digits, spaces, and + ( ) - only'),
  email: z.union([z.literal(''), z.email('Enter a valid email address, or leave it blank')]),

  /* --- the trip --- */
  travellers: z
    .number({ error: 'How many people are travelling?' })
    .int('Enter a whole number')
    .min(1, 'At least one traveller')
    .max(60, 'For groups over 60, call us and we will quote it directly'),
  packageSlug: z.string(),
  departureMonth: z.string(),
  airport: z.union([z.literal(''), z.enum(AIRPORTS)]),
  sharing: z.union([z.literal(''), z.enum(SHARING)]),
  notes: z.string().max(600, 'Please keep notes under 600 characters').optional(),

  /**
   * Explicit consent, unticked by default.
   *
   * UK GDPR requires a freely given, unambiguous act — a pre-ticked box is not
   * consent, and the competitor's form gets this right too. It gates submission
   * rather than being decoration.
   */
  consent: z.literal(true, {
    error: 'Please confirm we can contact you about this enquiry',
  }),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const enquiryDefaults: EnquiryValues = {
  name: '',
  phone: '',
  email: '',
  travellers: 2,
  packageSlug: '',
  departureMonth: '',
  airport: '',
  sharing: '',
  notes: '',
  // Typed as `true` by the schema, so the default is a deliberate cast: the form
  // starts invalid, which is the point of a consent gate.
  consent: false as unknown as true,
};

/** Field order for the draft sanitiser, and the tab order a keyboard user gets. */
export const ENQUIRY_FIELDS = [
  'name',
  'phone',
  'email',
  'travellers',
  'packageSlug',
  'departureMonth',
  'airport',
  'sharing',
  'notes',
  'consent',
] as const satisfies ReadonlyArray<keyof EnquiryValues>;

export type { AirportCode };
