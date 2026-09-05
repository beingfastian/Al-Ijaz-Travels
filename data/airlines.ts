/* ============================================================================
 * AIRLINES
 *
 * Who you actually fly with, derived from the routes already described in
 * data/airports.ts — Saudia and flynas run direct to Jeddah, and the regional
 * airports connect "via Doha, Dubai or Istanbul", which is Qatar Airways,
 * Emirates and Turkish Airlines.
 *
 * ⚠ FRAMING. This list says these carriers operate the routes we book, which is
 * a fact about schedules. It deliberately does NOT say we are a partner of, or
 * endorsed by, any of them — Al Noor's equivalent strip is headed "We proudly
 * cooperate with", and that is a claim about a commercial relationship that
 * would need to be true and evidenced for each carrier named. Airlines enforce
 * this: implying a partnership you do not hold is the kind of thing that gets a
 * takedown letter, and it sits badly on a site whose whole argument is that its
 * claims are checkable.
 *
 * ⚠ LOGOS. Airline logos are registered trademarks and the artwork is
 * copyrighted. Naming a carrier factually is fine; reproducing its mark needs
 * permission, which for an IATA-accredited agent is normally available through
 * the carrier's brand or trade portal. Until those files are licensed, this
 * renders the names in our own type — see `logo` below.
 * ========================================================================== */

export interface Airline {
  /** IATA designator — also the filename for the logo, when one is licensed. */
  code: string;
  name: string;
  /** Where the routing goes through, or null for a direct Jeddah service. */
  hub: string | null;
  /** One line on what this carrier means for the journey, not marketing. */
  note: string;
}

export const airlines: Airline[] = [
  {
    code: 'SV',
    name: 'Saudia',
    hub: null,
    note: 'Direct to Jeddah from Heathrow daily. The shortest total journey of any routing.',
  },
  {
    code: 'XY',
    name: 'flynas',
    hub: null,
    note: 'Direct to Jeddah from Heathrow. Lower fares, and a narrower bag allowance worth reading.',
  },
  {
    code: 'QR',
    name: 'Qatar Airways',
    hub: 'Doha',
    note: 'One connection through Doha. The most frequent option from the regional airports.',
  },
  {
    code: 'EK',
    name: 'Emirates',
    hub: 'Dubai',
    note: 'One connection through Dubai, and the routing with the widest choice of departure times.',
  },
  {
    code: 'TK',
    name: 'Turkish Airlines',
    hub: 'Istanbul',
    note: 'One connection through Istanbul, generally the cheapest of the connecting routings.',
  },
];

/** Direct services first — it is the difference travellers actually feel. */
export const airlinesByDirectness: Airline[] = [
  ...airlines.filter((a) => a.hub === null),
  ...airlines.filter((a) => a.hub !== null),
];
