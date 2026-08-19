/* ============================================================================
 * UK DEPARTURE AIRPORTS
 *
 * The six points we actually fly from. This is the spine of the UK rebuild: it
 * drives the departure picker, the city landing pages, and the "from £X from
 * your airport" figure that decides whether a visitor keeps reading.
 *
 * Every city page must be able to name its own airport honestly. A Leeds page
 * that quietly routes you to Manchester is a page that cannot answer its own
 * question — which is why the city list follows this file rather than the other
 * way round.
 * ========================================================================== */

export type AirportCode = 'LHR' | 'MAN' | 'BHX' | 'NCL' | 'GLA' | 'EDI';

export interface Airport {
  code: AirportCode;
  /** Airport name as a traveller would say it, not the IATA long form. */
  name: string;
  /** The city the page is built around. Becomes the /city-packages/ slug. */
  city: string;
  slug: string;
  region: 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
  /**
   * Towns this airport realistically serves. Used for local copy and internal
   * linking — never to imply a departure we do not operate.
   */
  serves: string[];
  /** Direct flights to Jeddah or Madinah, versus a one-stop connection. */
  directToSaudi: boolean;
}

export const airports: Airport[] = [
  {
    code: 'LHR',
    name: 'London Heathrow',
    city: 'London',
    slug: 'london',
    region: 'England',
    serves: ['Greater London', 'Slough', 'Luton', 'Reading', 'Croydon'],
    directToSaudi: true,
  },
  {
    code: 'MAN',
    name: 'Manchester',
    city: 'Manchester',
    slug: 'manchester',
    region: 'England',
    serves: ['Greater Manchester', 'Bolton', 'Rochdale', 'Preston', 'Blackburn'],
    directToSaudi: true,
  },
  {
    code: 'BHX',
    name: 'Birmingham',
    city: 'Birmingham',
    slug: 'birmingham',
    region: 'England',
    serves: ['West Midlands', 'Coventry', 'Wolverhampton', 'Walsall', 'Leicester'],
    directToSaudi: true,
  },
  {
    code: 'NCL',
    name: 'Newcastle',
    city: 'Newcastle',
    slug: 'newcastle',
    region: 'England',
    serves: ['Tyne and Wear', 'Sunderland', 'Durham', 'Middlesbrough'],
    directToSaudi: false,
  },
  {
    code: 'GLA',
    name: 'Glasgow',
    city: 'Glasgow',
    slug: 'glasgow',
    region: 'Scotland',
    serves: ['Greater Glasgow', 'Paisley', 'Motherwell', 'Ayrshire'],
    directToSaudi: false,
  },
  {
    code: 'EDI',
    name: 'Edinburgh',
    city: 'Edinburgh',
    slug: 'edinburgh',
    region: 'Scotland',
    serves: ['Edinburgh', 'Fife', 'Livingston', 'Falkirk'],
    directToSaudi: false,
  },
];

export const airportCodes = airports.map((a) => a.code);

export function getAirport(code: string): Airport | undefined {
  return airports.find((a) => a.code === code);
}

export function getAirportBySlug(slug: string): Airport | undefined {
  return airports.find((a) => a.slug === slug);
}

/**
 * Connections are a selling point when stated plainly and a complaint when
 * discovered at the gate, so the distinction is modelled rather than glossed.
 */
export function routeDescription(airport: Airport): string {
  return airport.directToSaudi
    ? `Direct flights from ${airport.name} to Jeddah`
    : `One connection from ${airport.name}, usually via Doha, Dubai or Istanbul`;
}
