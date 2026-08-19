import { z } from 'zod';

/**
 * Quote schema, split by step.
 *
 * One schema over the whole quote, with each step declaring which fields it
 * owns. Advancement calls `trigger()` on that step's field list — so validation
 * is scoped to the visible panel while the resolver, the values, and the review
 * step all read from a single source of truth.
 *
 * Contrast this with the Tripix reference, which renders one <form> per
 * traveller, submits them imperatively through the DOM, and then races a 100 ms
 * timer against a React state update to find out whether they validated.
 *
 * Note what is NOT collected. A quote is not a booking, so there are no passport
 * numbers or dates of birth — asking for identity documents before anyone has
 * committed costs conversions and creates a data-protection liability for no
 * operational benefit. The consultant collects those once availability is
 * confirmed.
 */

export const SHARING = ['quad', 'triple', 'double'] as const;

/**
 * Counts use z.number() with `valueAsNumber` at the register site rather than
 * z.coerce.number(). Coercion makes the schema's *input* type `unknown`, which
 * stops lining up with the resolver's field types — so the parse happens at the
 * input boundary instead, keeping number in and number out.
 */
const count = (label: string, min: number, max: number) =>
  z
    .number({ error: `Enter how many ${label} are travelling` })
    .int(`Enter a whole number of ${label}`)
    .min(min, min > 0 ? `At least ${min} ${label} must travel` : 'Cannot be negative')
    .max(max, `For groups over ${max}, contact us directly and we will quote it`);

export const quoteSchema = z.object({
  // Step 0 — who is travelling
  adults: count('adults', 1, 40),
  children: count('children', 0, 20),
  infants: count('infants', 0, 20),
  sharing: z.enum(SHARING),

  // Step 1 — the trip
  packageSlug: z.string().min(1, 'Choose a package, or select "Not sure yet"'),
  departureMonth: z.string().min(1, 'Choose a departure month'),
  notes: z.string().max(600, 'Please keep notes under 600 characters').optional(),

  // Step 2 — how to reach you
  name: z.string().min(2, 'Enter your name so we know who we are speaking to'),
  phone: z
    .string()
    .min(10, 'Enter a phone number we can reach you on, including the country code')
    .regex(/^[+0-9\s()-]+$/, 'Use digits, spaces, and + ( ) - only'),
  email: z.union([z.literal(''), z.email('Enter a valid email address, or leave it blank')]),
});

export type QuoteValues = z.infer<typeof quoteSchema>;

/** Step titles and the fields each one gates on. */
export const QUOTE_STEPS = [
  { title: 'Travellers', fields: ['adults', 'children', 'infants', 'sharing'] },
  { title: 'Your trip', fields: ['packageSlug', 'departureMonth', 'notes'] },
  { title: 'Contact', fields: ['name', 'phone', 'email'] },
  { title: 'Review', fields: [] },
] as const satisfies ReadonlyArray<{
  title: string;
  fields: readonly (keyof QuoteValues)[];
}>;

export const QUOTE_STEP_TITLES = QUOTE_STEPS.map((s) => s.title);

export const quoteDefaults: QuoteValues = {
  adults: 2,
  children: 0,
  infants: 0,
  sharing: 'quad',
  packageSlug: '',
  departureMonth: '',
  notes: '',
  name: '',
  phone: '',
  email: '',
};
