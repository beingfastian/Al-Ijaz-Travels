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
  /**
   * The opening paragraph of this city's landing page.
   *
   * Written per city rather than templated with the name swapped in. Al Habib
   * runs fourteen city pages whose body copy is identical apart from the
   * place name, which is the shape search engines classify as doorway content —
   * and, more to the point, it tells a reader in Glasgow nothing a reader in
   * London was not already told. If a city page cannot say something true and
   * specific about departing from that city, it should not exist.
   */
  intro: string;
  /** What the journey actually looks like from here. */
  journey: string;
  /**
   * Who actually travels from this airport, and how.
   *
   * A third distinct paragraph, added because measuring the built pages showed
   * London and Manchester sharing 77% of their sentences — two unique paragraphs
   * were not enough to outweigh the shared page furniture, which is precisely the
   * near-duplicate shape this project set out not to produce.
   */
  groupNote: string;
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
    intro:
      'London has more Umrah traffic than the rest of the UK combined, and it shows in the schedule: Saudia and flynas run direct to Jeddah from Heathrow daily, so a London departure is usually the shortest total journey and the widest choice of dates. It is also the most competitive market in the country, which is why we lead with the walking distance to the Haram rather than the headline price — on a London search everyone looks cheap until you read what is included.',
    journey:
      'Direct to Jeddah from Heathrow, typically six and a half hours. Gatwick departures usually connect. We meet groups at the terminal before check-in rather than at the gate.',
    groupNote:
      'London groups are the most mixed we run — first-time pilgrims travelling alone, extended families taking three generations, and students going in the university holidays. Because departures are daily, a London booking is also the easiest to move if your dates slip.',
  },
  {
    code: 'MAN',
    name: 'Manchester',
    city: 'Manchester',
    slug: 'manchester',
    region: 'England',
    serves: ['Greater Manchester', 'Bolton', 'Rochdale', 'Preston', 'Blackburn'],
    directToSaudi: true,
    intro:
      'Manchester serves the largest Muslim population outside London, and it is the airport most of the North West actually uses — Bolton, Rochdale, Preston and Blackburn are all closer to Terminal 2 than to any alternative. Direct flights to Jeddah mean a Manchester group is not routed through London first, which is the single most common complaint we hear about packages sold elsewhere.',
    journey:
      'Direct to Jeddah, no London leg. Groups from Blackburn and Preston commonly travel together on the same departure.',
    groupNote:
      'Manchester departures are the most family-heavy on our books. It is common for two or three households from the same street in Bolton or Blackburn to travel together, and we will seat a group together and assign one leader across all of them rather than treating each booking separately.',
  },
  {
    code: 'BHX',
    name: 'Birmingham',
    city: 'Birmingham',
    slug: 'birmingham',
    region: 'England',
    serves: ['West Midlands', 'Coventry', 'Wolverhampton', 'Walsall', 'Leicester'],
    directToSaudi: true,
    intro:
      'Birmingham is the natural departure for the West Midlands, and for much of Leicester and Coventry too. It is the third UK airport with direct Jeddah service, which matters more than it sounds: the long stays — twenty and twenty-one nights — only run from the three direct airports, so a Birmingham pilgrim has the full catalogue available where a regional departure does not.',
    journey:
      'Direct to Jeddah. Parking and drop-off are markedly easier than Heathrow, which matters when a family is seeing a group off.',
    groupNote:
      'Birmingham runs closest to a community model: sizeable groups from the same mosque, often with their own imam travelling. If that is you, tell us at the quote — we can arrange the Ziyarat schedule around your own programme rather than fitting you into ours.',
  },
  {
    code: 'NCL',
    name: 'Newcastle',
    city: 'Newcastle',
    slug: 'newcastle',
    region: 'England',
    serves: ['Tyne and Wear', 'Sunderland', 'Durham', 'Middlesbrough'],
    directToSaudi: false,
    intro:
      'Newcastle has no direct service to Saudi Arabia, so every package from here connects — usually through Doha, Dubai or Istanbul. We say that plainly because the alternative is a pilgrim discovering a five-hour layover at the point of booking. What a Newcastle departure buys in exchange is not having to reach Manchester at 4 a.m. with luggage and elderly parents.',
    journey:
      'One connection, typically via Doha, Dubai or Istanbul. Total journey is longer than a direct departure — usually eleven to fourteen hours including the layover.',
    groupNote:
      'Newcastle groups are smaller, and the connection means we build in a longer margin at the UK end. We will not put an elderly traveller on a routing with under two hours to connect, even where the airline permits it, because a missed connection in Doha with no Arabic is not a problem we want a pilgrim solving alone.',
  },
  {
    code: 'GLA',
    name: 'Glasgow',
    city: 'Glasgow',
    slug: 'glasgow',
    region: 'Scotland',
    serves: ['Greater Glasgow', 'Paisley', 'Motherwell', 'Ayrshire'],
    directToSaudi: false,
    intro:
      'Glasgow serves the largest Muslim community in Scotland, and it is where most Scottish Umrah groups depart from. Flights connect rather than fly direct, which lengthens the journey but avoids a domestic hop to Manchester or Heathrow first. For most Glasgow families that trade is worth making, and we would rather set the expectation here than at the airport.',
    journey:
      'One connection to Jeddah, commonly via Dubai or Doha. No domestic leg, which is the point.',
    groupNote:
      'Glasgow departures often combine with Edinburgh on the same connecting flight, so a Scottish group may travel as one from the transfer point onward. Where numbers allow we send a group leader from Scotland rather than meeting you in Jeddah.',
  },
  {
    code: 'EDI',
    name: 'Edinburgh',
    city: 'Edinburgh',
    slug: 'edinburgh',
    region: 'Scotland',
    serves: ['Edinburgh', 'Fife', 'Livingston', 'Falkirk'],
    directToSaudi: false,
    intro:
      'Edinburgh works for the east of Scotland — Fife, Livingston, Falkirk — where reaching Glasgow adds an hour before the journey has begun. Like Glasgow it connects rather than flies direct, and like Glasgow the long twenty-night stays are not available from here. Everything shorter is, at the same price as a London departure.',
    journey:
      'One connection, usually via Doha or Istanbul. The twenty- and twenty-one-night packages do not operate from Edinburgh.',
    groupNote:
      'Edinburgh numbers are the smallest of the six, which means departures are less frequent and fill earlier. If your dates are fixed, book further ahead than you would from Glasgow — there is simply less availability to move around.',
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
