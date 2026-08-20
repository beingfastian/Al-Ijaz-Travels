import { site } from './site';

/* ============================================================================
 * TRUST SIGNALS
 *
 * Everything on this page exists to answer one unspoken question: why should a
 * family hand this agency several thousand pounds? Credentials, and a plain
 * comparison of what we do differently.
 * ========================================================================== */

export interface Accreditation {
  name: string;
  /** Registration or licence number — shown so it can be checked, not just seen. */
  reference: string;
  /** Optional badge artwork under public/brand/. */
  logo?: string;
}

/**
 * ⚠ INTENTIONALLY EMPTY.
 *
 * Accreditation badges are the one piece of content that will not be invented:
 * displaying a registration you do not hold is a legal liability, not a design
 * detail. Populate only from credentials Al Ijaz actually holds — Ministry of
 * Religious Affairs Hajj/Umrah registration, IATA agent number, DTS licence —
 * with matching artwork. <TrustRow> renders nothing while this is empty.
 */
/**
 * Derived from `site.accreditation`, so the moment real numbers land in one place
 * the badges appear everywhere — footer, home page, package pages — with no
 * component edits and no chance of one surface claiming cover another does not.
 *
 * An entry only exists if its number is non-empty. That is the whole safety
 * mechanism: there is no code path that renders an ATOL badge without an ATOL
 * number, because the badge *is* the number.
 *
 * ⚠ Why this is stricter than it looks. Selling flight-inclusive packages without
 * an ATOL is a criminal offence under the Civil Aviation (ATOL) Regulations, and
 * displaying a number you do not hold is separately actionable by the CAA. The
 * client has confirmed both are held; until the numbers arrive, nothing renders.
 */
function buildAccreditations(): Accreditation[] {
  const out: Accreditation[] = [];

  // String() widens past the literal types `as const` gives the empty defaults,
  // so this compiles now and keeps compiling once real numbers replace them.
  const atol = String(site.accreditation.atolNumber).trim();
  const iata = String(site.accreditation.iataNumber).trim();

  if (atol !== '') {
    out.push({
      name: 'ATOL Protected',
      reference: `ATOL ${atol}`,
      // No `logo` until the real artwork arrives. TrustRow falls back to an icon
      // when it is absent; pointing at a file that does not exist ships a broken
      // image, which the export check caught immediately.
      // TODO(client): official ATOL badge artwork -> public/brand/atol.svg

    });
  }

  if (iata !== '') {
    out.push({
      name: 'IATA Accredited Agent',
      reference: `IATA ${iata}`,
      // TODO(client): official IATA logo -> public/brand/iata.svg

    });
  }

  return out;
}

export const accreditations: Accreditation[] = buildAccreditations();

/**
 * The "why choose us" comparison.
 *
 * Framed against how the category actually behaves, not against a named
 * competitor — naming one invites a dispute and dates the page. Each row is a
 * claim the rest of the site has to keep: every one of these is verifiable
 * against a package page, which is what makes the table worth having.
 */
export interface ComparisonRow {
  point: string;
  typical: string;
  ours: string;
}

export const comparison: ComparisonRow[] = [
  {
    point: 'Hotel distance',
    typical: '“Close to Haram”, “walking distance”, or a shuttle you discover on arrival',
    ours: 'Exact walking distance in metres, on every package and every hotel card',
  },
  {
    point: 'Pricing',
    typical: 'A headline figure, with the sharing basis found later',
    ours: 'Per person, with quad, triple or double stated up front',
  },
  {
    point: 'Exclusions',
    typical: 'Buried in terms, or raised once you have paid',
    ours: 'Listed beside the inclusions, in the same size type',
  },
  {
    point: 'Itinerary',
    typical: 'A duration and a star rating',
    ours: 'Day by day, so you know what each morning holds',
  },
  {
    point: 'Before you commit',
    typical: 'A deposit to hold a quote',
    ours: 'A consultant confirms availability first — the quote costs nothing',
  },
];

/**
 * Seasonal banner. `active: false` keeps it out of the DOM entirely rather than
 * hiding it with CSS, so nothing stale ships when the season passes.
 */
export const seasonalBanner = {
  active: true,
  // TODO(client): switch on/off and update as each season opens.
  label: 'Ramadan 1448 / 2027',
  message: 'Last ten nights allocation is open. Haram-precinct hotels sell out first.',
  href: '/packages/?month=ramadan-2027',
  cta: 'See Ramadan packages',
} as const;
