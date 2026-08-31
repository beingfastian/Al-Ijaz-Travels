import { z } from 'zod';

/* ============================================================================
 * ENQUIRY SCHEMA — one form, one step, six fields.
 *
 * The field list now matches the competitor's enquiry form exactly:
 *
 *   Lead passenger name · Phone · Email · Total passengers · Message · Consent
 *
 * That is a deliberate narrowing, on client instruction, and it is worth being
 * honest in writing about what it costs. The four fields removed — departure
 * airport, preferred month, room sharing, and which package — were the four that
 * made an enquiry answerable on arrival. A UK Umrah price is mostly determined by
 * exactly those: which airport you fly from, whether you are travelling in
 * Ramadan, and how many share a room. Without them a consultant has to reply
 * asking before they can quote, which is the round trip the competitor's form
 * also forces.
 *
 * Two things soften it, both below:
 *   - "Total passengers" is free text rather than a number, matching theirs, so
 *     "2 adults & 2 kids" is now expressible. Our old numeric field could not
 *     capture children at all, which was a genuine gap the comparison found.
 *   - On a package page the package is still named in the outgoing message,
 *     taken from the URL. It is not a field, so the form still matches; the
 *     consultant simply is not left guessing which package was being read.
 *
 * Deliberately NOT collected — a quote is not a booking:
 *   passport numbers, dates of birth, addresses, payment details.
 * Asking for identity documents before anyone has committed costs conversions
 * and creates a data-protection liability for no operational benefit.
 * ========================================================================== */

export const enquirySchema = z.object({
  /**
   * "Lead passenger", not "your name" — the competitor's wording, and the more
   * precise one: a booking is made in the name of the person leading the party.
   */
  name: z.string().min(2, 'Enter the lead passenger’s name'),

  phone: z
    .string()
    .min(10, 'Enter a number we can reach you on, including the country code')
    .regex(/^[+0-9\s()-]+$/, 'Use digits, spaces, and + ( ) - only'),

  /**
   * Required now, where it used to be optional.
   *
   * The competitor requires it, and a WhatsApp-first handoff still benefits from
   * a written address: itineraries, invoices and ATOL certificates are emailed,
   * not sent as chat messages.
   */
  email: z.email('Enter a valid email address'),

  /**
   * Free text, not a number.
   *
   * A single integer could not say "2 adults and 2 kids", so children were
   * invisible — the outgoing message hard-coded zero of them. Child pricing
   * differs and families are a large share of this market, so the softer field
   * captures more than the stricter one did.
   */
  passengers: z
    .string()
    .min(1, 'Tell us how many people are travelling')
    .max(80, 'Please keep this short — details can go in the message'),

  message: z.string().max(600, 'Please keep the message under 600 characters').optional(),

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

  /**
   * Not a form field, and not rendered.
   *
   * Carried so a package page can name the package in the outgoing message. The
   * visitor never sees or fills this, so the visible field list still matches the
   * competitor's six.
   */
  packageSlug: z.string(),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const enquiryDefaults: EnquiryValues = {
  name: '',
  phone: '',
  email: '',
  passengers: '',
  message: '',
  // Typed as `true` by the schema, so the default is a deliberate cast: the form
  // starts invalid, which is the point of a consent gate.
  consent: false as unknown as true,
  packageSlug: '',
};

/** Field order for the draft sanitiser, and the tab order a keyboard user gets. */
export const ENQUIRY_FIELDS = [
  'name',
  'phone',
  'email',
  'passengers',
  'message',
  'consent',
  'packageSlug',
] as const satisfies ReadonlyArray<keyof EnquiryValues>;
