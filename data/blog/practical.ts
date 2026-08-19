import type { Article } from './types';

/* ============================================================================
 * PRACTICAL ARTICLES — cost, packages, logistics.
 *
 * Figures here are checked against the catalogue rather than estimated. The
 * numbers quoted below were verified on 20 August 2026 against
 * lib/catalogue.ts; the article pages also render live prices from the same
 * source, so a reader sees both the explanation and the current figure.
 * ========================================================================== */

export const practicalArticles: Article[] = [
  {
    slug: 'umrah-cost-from-uk',
    title: 'How Much Does Umrah Cost From the UK?',
    description:
      'Real 2027 prices from a UK operator: what a 3, 4 and 5-star Umrah package costs per person, what moves the price most, and what is genuinely not included.',
    published: '2026-08-20',
    standfirst:
      'The honest answer is between £630 and roughly £4,500 per person — and the thing that moves it most is not the star rating.',
    sections: [
      {
        heading: 'The short answer',
        body: [
          {
            type: 'p',
            text: 'A 7-night Umrah package from the UK starts at around £715 per person on quad sharing at 3-star, £885 at 4-star and £1,185 at 5-star. Those are flight, visa, hotels and transfers included, departing outside peak season.',
          },
          {
            type: 'p',
            text: 'At the other end, a 5-star package over the last ten nights of Ramadan can reach £4,500 per person. That is the same company, the same hotels and the same flights — the difference is entirely when you go.',
          },
        ],
      },
      {
        heading: 'What actually moves the price',
        body: [
          {
            type: 'p',
            text: 'Most people assume the star rating is the main lever. It is not. In order of impact:',
          },
          {
            type: 'ol',
            items: [
              'When you travel. Ramadan runs roughly 70% above a quiet month for an identical package. September and October are the cheapest, and the weather in October is better than in July.',
              'How long you stay. Not proportionally — a 14-night trip is not double a 7-night one, because the flight costs the same either way. Roughly £40 to £105 per extra night depending on tier.',
              'Star rating and distance. The gap between 3-star and 5-star on the same dates is about £470 on a 7-night trip. Real, but smaller than the seasonal swing.',
              'Room sharing. Quad is the cheapest basis and double the most expensive. Prices advertised anywhere are almost always per person on the most crowded basis.',
            ],
          },
          {
            type: 'note',
            text: 'If your dates are flexible by even three weeks, moving them will usually save you more than dropping a star rating — and you keep the hotel near the Haram.',
          },
        ],
      },
      {
        heading: 'What a package should include',
        body: [
          {
            type: 'p',
            text: 'A complete UK Umrah package includes return flights from your chosen airport, visa processing, hotels in both Makkah and Madinah, and all ground transfers — Jeddah to Makkah, Makkah to Madinah, and back to the airport. Guided Umrah on arrival and Ziyarat tours in both cities are standard with most reputable operators.',
          },
          {
            type: 'p',
            text: 'What is normally excluded, and should be stated plainly rather than discovered: travel insurance, meals beyond hotel breakfast, vaccinations, and personal expenses. If an operator does not publish its exclusions, ask for them in writing before paying a deposit.',
          },
        ],
      },
      {
        heading: 'The number to compare on',
        body: [
          {
            type: 'p',
            text: 'Two packages at the same price and the same star rating can be very different trips, and the difference is walking distance to the Haram. A 5-star hotel 120 metres from the gates and a 4-star at 1.4 kilometres are not competing on comfort — they are competing on whether you can return to your room between prayers.',
          },
          {
            type: 'p',
            text: 'For pilgrims travelling with elderly parents or young children, that distance is usually worth more than the star rating. Ask for it in metres. "Close to the Haram" and "walking distance" are not answers.',
          },
        ],
      },
      {
        heading: 'Paying, and what protects you',
        body: [
          {
            type: 'p',
            text: 'A flight-inclusive package sold in the UK must be ATOL protected. That is a legal requirement, not a badge of quality, and it means your money is protected if the operator fails. Ask for the ATOL number and check it on the Civil Aviation Authority website — it takes a minute and it is the single most useful check you can make.',
          },
          {
            type: 'note',
            text: 'Prices on this page were checked against our own catalogue on 20 August 2026 and are per person. Seasonal pricing moves; the live figures on our packages page are always current.',
          },
        ],
      },
      {
        heading: 'What the same package costs month by month',
        body: [
          {
            type: 'p',
            text: 'Take one package — 10 nights, 5-star, quad sharing — and hold everything constant except the departure month. The price moves from roughly £1,380 in January to about £2,550 in March. That is an 85% swing on an identical trip: same hotels, same flights, same inclusions.',
          },
          {
            type: 'ul',
            items: [
              'Cheapest — September and October, running around 10% below the annual baseline. October also has the best weather of the two, at around 38°C rather than 41°C.',
              'Baseline — April and November. Comfortable, moderate crowds, no school-holiday premium.',
              'Elevated — July, August and late December, roughly 15 to 25% above baseline, driven almost entirely by UK school holidays rather than by anything happening in Makkah.',
              'Peak — February and March, when Ramadan falls, at 45 to 70% above baseline.',
            ],
          },
          {
            type: 'p',
            text: 'This is the single most useful thing to understand about Umrah pricing, and it is why any comparison between operators has to hold the dates constant. A quote for October and a quote for Ramadan are not comparable numbers however similar the packages look.',
          },
        ],
      },
      {
        heading: 'Why regional departures cost the same but offer less',
        body: [
          {
            type: 'p',
            text: 'A common assumption is that flying from Newcastle or Glasgow costs more than flying from Heathrow. In our catalogue it does not — the cheapest package is the same price from all six airports we operate from.',
          },
          {
            type: 'p',
            text: 'What differs is choice. London, Manchester and Birmingham have direct flights to Jeddah, and the longest packages — 20 and 21 nights — only run from those three. From Newcastle, Glasgow or Edinburgh there are around 39 fewer packages available, because a three-week trip involving two connections is not something worth selling.',
          },
          {
            type: 'note',
            text: 'If an operator quotes you noticeably more from a regional airport for an otherwise identical package, ask what the routing is. You may be paying for a domestic connection to London that you could avoid.',
          },
        ],
      },
      {
        heading: 'What a deposit should look like',
        body: [
          {
            type: 'p',
            text: 'Most UK operators take a deposit at booking with the balance due some weeks before departure. What matters is not the amount but what it secures and what happens if plans change.',
          },
          {
            type: 'ol',
            items: [
              'Ask what the deposit actually holds — a named hotel and a specific flight, or simply a place on a list.',
              'Ask when the balance falls due, and get it in writing.',
              'Ask what is refundable and at which points. Reputable operators publish a schedule rather than deciding case by case.',
              'Confirm the ATOL certificate is issued with your invoice, not promised for later.',
            ],
          },
          {
            type: 'p',
            text: 'A deposit taken before availability is confirmed is the most common complaint in this sector. Availability should be checked first and the deposit taken second — which is why every quote on this site is confirmed before anyone is asked for money.',
          },
        ],
      },
      {
        heading: 'Budgeting beyond the package price',
        body: [
          {
            type: 'p',
            text: 'The package covers flights, visa, hotels and transfers. A realistic total for a 10-night trip should also allow for:',
          },
          {
            type: 'ul',
            items: [
              'Travel insurance — £25 to £60 for a standard policy, more with pre-existing conditions',
              'Meals beyond breakfast — £15 to £30 per person per day depending on whether you eat at the hotel',
              'MenACWY vaccination if not available free on the NHS — typically £40 to £60',
              'Zamzam and gifts, and the excess baggage that often comes with them',
              'Local transport in Madinah if your hotel is further from the Nabawi than you expected',
            ],
          },
          {
            type: 'p',
            text: 'For most families that adds £250 to £400 per person over ten nights. An operator who tells you the package price is the total cost is not doing you a favour.',
          },
        ],
      },
    ],
    related: ['what-is-umrah-package', 'umrah-visa-cost-from-uk', 'how-many-days-are-in-umrah-packages'],
  },

  {
    slug: 'umrah-visa-cost-from-uk',
    title: 'Umrah Visa From the UK: What You Need and What It Costs',
    description:
      'Which Saudi visa UK pilgrims actually need for Umrah, how the tourist eVisa and ETA differ, and why a separate Umrah visa may no longer be necessary.',
    published: '2026-08-20',
    standfirst:
      'Most UK pilgrims no longer need a dedicated Umrah visa at all — and that is the part almost nobody knows.',
    sections: [
      {
        heading: 'You may not need an Umrah visa',
        body: [
          {
            type: 'p',
            text: 'Umrah can now be performed on a Saudi tourist eVisa or on an Electronic Travel Authorisation. This changed relatively recently and a great deal of advice online has not caught up, including advice published by travel agents.',
          },
          {
            type: 'p',
            text: 'A dedicated Umrah visa still exists and is still arranged by agents as part of a package. Which route suits you depends mostly on whether you expect to return within a year or two.',
          },
        ],
      },
      {
        heading: 'The three routes compared',
        body: [
          {
            type: 'ul',
            items: [
              'Tourist eVisa — valid 365 days from issue, allowing 90 days in the Kingdom in total across that year. Multiple entries. Includes health insurance cover up to SAR 100,000. Applied for online or on arrival.',
              'Electronic Travel Authorisation (ETA) — valid 730 days, allowing 180 days in total. Multiple entries. The longest-running of the three, and worth it if you intend to return.',
              'Umrah visa — issued for the pilgrimage, now also available in a multiple-entry form. Arranged by your agent as part of the package.',
            ],
          },
          {
            type: 'note',
            text: 'The stay limits are cumulative across all your visits, not per visit. Two trips in one year draw on the same 90 or 180 days.',
          },
        ],
      },
      {
        heading: 'What none of them cover',
        body: [
          {
            type: 'p',
            text: 'None of the three permits Hajj. Hajj requires its own visa under a separate quota system and cannot be arranged at short notice. If Hajj is your intention, start the conversation a year ahead.',
          },
          {
            type: 'p',
            text: 'You will also need a Nusuk permit to enter Masjid al-Haram. That is separate from the visa, tied to a booked service, and issued through the Saudi Nusuk platform. Any competent operator issues it for you before departure.',
          },
        ],
      },
      {
        heading: 'What it costs',
        body: [
          {
            type: 'p',
            text: 'We do not publish a visa fee, and you should treat any site that does with some care. Saudi visa fees have changed several times and a figure written a year ago is probably wrong now.',
          },
          {
            type: 'p',
            text: 'Visa processing is included in the price of every package we sell, and the current fee is confirmed in writing with your quote. If you are applying independently, the official Saudi portal shows the fee at the point of application.',
          },
        ],
      },
      {
        heading: 'The two things that catch people out',
        body: [
          {
            type: 'ol',
            items: [
              'Passport validity is measured from your arrival date, not your booking date. You need at least six months remaining on the day you land. This is the most common reason a pilgrim is turned away at check-in.',
              'The MenACWY meningitis vaccination is mandatory for every Umrah pilgrim aged one and over, and must be given at least ten days before you arrive for the certificate to be accepted. Book it early — a vaccination the week before departure is too late.',
            ],
          },
          {
            type: 'note',
            text: 'Checked against UK Foreign, Commonwealth & Development Office travel advice on 20 August 2026. Entry rules change; confirm nearer your travel date.',
          },
        ],
      },
      {
        heading: 'Which route should you actually choose?',
        body: [
          {
            type: 'p',
            text: 'For most first-time UK pilgrims travelling once, the tourist eVisa is the simplest route. It is applied for online, it is quick, it includes health insurance cover, and it permits tourism elsewhere in the Kingdom — so you can add a few days in Jeddah or AlUla without a second application.',
          },
          {
            type: 'p',
            text: 'If you expect to return within two years, the ETA is better value in time rather than money: 730 days of validity and 180 cumulative days in the Kingdom, against 365 and 90. Pilgrims who go most years, or who have family in Saudi Arabia, generally find it the less troublesome option.',
          },
          {
            type: 'p',
            text: 'The dedicated Umrah visa remains worth taking when it comes as part of a package, simply because somebody else deals with it. If you are booking a package anyway, the visa question largely answers itself.',
          },
        ],
      },
      {
        heading: 'What the Nusuk permit is, and why it is separate',
        body: [
          {
            type: 'p',
            text: 'This is the part that surprises people who last performed Umrah some years ago. Entry to Masjid al-Haram now requires a digital permit — a tasreeh — issued through the Saudi Nusuk platform and tied to a booked service. It is not the same thing as your visa, and having a valid visa does not by itself admit you to the Haram.',
          },
          {
            type: 'p',
            text: 'The same platform handles Rawdah slots in Madinah, which are allocated by time and go quickly. Book that as soon as your dates are fixed rather than on arrival.',
          },
          {
            type: 'note',
            text: 'Any competent operator issues both for you before departure. If you are travelling independently, set up your Nusuk account well before you fly — doing it at the airport is not a plan.',
          },
        ],
      },
      {
        heading: 'Applying independently: what you will need',
        body: [
          {
            type: 'ol',
            items: [
              'A passport with at least six months validity from your arrival date',
              'A recent passport-style photograph meeting the portal specification',
              'Proof of MenACWY vaccination, administered at least ten days before arrival',
              'A confirmed return flight and accommodation booking',
              'A payment card for the fee, which is shown at the point of application',
            ],
          },
          {
            type: 'p',
            text: 'Applications are generally processed quickly, but leave a fortnight rather than a weekend. If you have previously been refused entry to Saudi Arabia, or your passport shows an unusual travel history, allow considerably longer and take advice first.',
          },
        ],
      },
      {
        heading: 'Common mistakes',
        body: [
          {
            type: 'ul',
            items: [
              'Assuming the stay limit is per visit. It is cumulative — two trips in a year draw on the same 90 or 180 days.',
              'Measuring passport validity from the booking date rather than the arrival date.',
              'Booking the MenACWY vaccination inside ten days of departure, which invalidates the certificate.',
              'Assuming a tourist visa covers Hajj. It does not, and neither does the ETA or the Umrah visa.',
              'Relying on advice written before the rules changed — including advice on travel agents’ own websites.',
            ],
          },
        ],
      },
    ],
    related: ['umrah-cost-from-uk', 'step-by-step-guide-to-performing-umrah-for-uk-pilgrims', 'what-is-umrah-package'],
  },

  {
    slug: 'what-is-umrah-package',
    title: 'What Is an Umrah Package, and What Should Be In One?',
    description:
      'What a UK Umrah package actually includes, what is usually excluded, and the questions worth asking an operator before you pay a deposit.',
    published: '2026-08-20',
    standfirst:
      'A package is flights, visa, hotels and transfers bought as one. The useful question is not what it includes but what it quietly does not.',
    sections: [
      {
        heading: 'What is normally included',
        body: [
          {
            type: 'ul',
            items: [
              'Return flights from a UK airport',
              'Visa processing and the Nusuk permit for the Haram',
              'Hotel accommodation in both Makkah and Madinah',
              'All ground transfers — airport to Makkah, Makkah to Madinah, and back',
              'Guided Umrah on arrival, and Ziyarat tours in both cities',
            ],
          },
        ],
      },
      {
        heading: 'What is normally excluded',
        body: [
          {
            type: 'p',
            text: 'This list is shorter and matters more, because it is where the unexpected costs sit:',
          },
          {
            type: 'ul',
            items: [
              'Travel insurance — required, and worth buying properly rather than cheaply',
              'Meals beyond hotel breakfast',
              'Vaccinations, including the mandatory MenACWY',
              'Personal expenses, laundry, room service',
              'Excess baggage, which catches people carrying Zamzam home',
            ],
          },
          {
            type: 'note',
            text: 'If an operator will not put its exclusions in writing before you pay, that is the answer to your question.',
          },
        ],
      },
      {
        heading: 'Questions worth asking',
        body: [
          {
            type: 'ol',
            items: [
              'How far is the Makkah hotel from the Haram, in metres? Not minutes, not "close" — metres.',
              'Is that distance to the gates or to the mataf? The difference can be several hundred metres in a crowd.',
              'What is the room sharing basis for the price quoted? Quad, triple or double changes the figure substantially.',
              'Is the package ATOL protected, and what is the number?',
              'Does a group leader travel with us, and are they contactable in Saudi Arabia?',
              'What happens if the hotel changes? Reputable operators name a same-tier alternative rather than "or similar".',
            ],
          },
        ],
      },
      {
        heading: 'Package or independent?',
        body: [
          {
            type: 'p',
            text: 'You can perform Umrah independently — book your own flights, hotel and visa. It sometimes works out cheaper, particularly for experienced travellers going alone in a quiet month.',
          },
          {
            type: 'p',
            text: 'What a package buys is the coordination: transfers that meet the flight, a hotel that is where it says it is, a permit already issued, and somebody to call when a flight is delayed at 2 a.m. For a first Umrah, or one with elderly parents or children, that is usually worth the difference.',
          },
        ],
      },
    ],
    related: ['umrah-cost-from-uk', 'can-we-go-to-umrah-without-package', 'how-many-days-are-in-umrah-packages'],
  },

  {
    slug: 'how-many-days-are-in-umrah-packages',
    title: 'How Many Days Do You Need for Umrah?',
    description:
      'How long UK Umrah packages run, how the nights split between Makkah and Madinah, and how to choose a length that fits the trip you actually want.',
    published: '2026-08-20',
    standfirst:
      'The rites themselves take a few hours. Everything else is a decision about how much time you want in each city.',
    sections: [
      {
        heading: 'Typical package lengths',
        body: [
          {
            type: 'p',
            text: 'UK operators generally sell 7, 8, 10, 12, 14, 20 and 21-night packages. The most commonly booked is 10 nights, which gives roughly six nights in Makkah and four in Madinah — enough to perform Umrah without rushing and to complete the Ziyarat in Madinah properly.',
          },
          {
            type: 'ul',
            items: [
              '7 nights — 4 Makkah, 3 Madinah. Workable, but tight. Suits a second or third Umrah.',
              '10 nights — 6 Makkah, 4 Madinah. The balanced default and the most popular.',
              '14 nights — 8 Makkah, 6 Madinah. Comfortable, with room to repeat Umrah.',
              '20 or 21 nights — 12 to 13 Makkah. Usually Ramadan, or a first pilgrimage somebody has waited a long time for.',
            ],
          },
        ],
      },
      {
        heading: 'Why Makkah always gets more nights',
        body: [
          {
            type: 'p',
            text: 'The rites of Umrah are performed in Makkah, and many pilgrims repeat Umrah during their stay. Madinah has no equivalent obligation — the Ziyarat sites are done comfortably in three to four days, and the value of extra nights there falls away faster.',
          },
          {
            type: 'p',
            text: 'Any operator weighting the split toward Madinah is usually doing so because Madinah hotels are cheaper, not because it serves the pilgrim.',
          },
        ],
      },
      {
        heading: 'How length affects price',
        body: [
          {
            type: 'p',
            text: 'Not proportionally. The flight and visa cost the same whether you stay 7 nights or 21, so only the accommodation portion scales. In practice each additional night adds roughly £40 at 3-star and £105 at 5-star.',
          },
          {
            type: 'p',
            text: 'That means longer trips offer better value per night — a 14-night package is typically around 35% more than a 7-night one, not double.',
          },
          {
            type: 'note',
            text: 'The 20 and 21-night packages generally depart from London, Manchester and Birmingham only. Longer stays from a connecting regional airport make for a journey most operators will not sell.',
          },
        ],
      },
    ],
    related: ['umrah-cost-from-uk', 'how-long-umrah-take', 'what-is-umrah-package'],
  },

  {
    slug: 'can-we-go-to-umrah-without-package',
    title: 'Can You Perform Umrah Without a Package?',
    description:
      'Yes — and here is honestly when it works, when it does not, and what you take on yourself by booking independently from the UK.',
    published: '2026-08-20',
    standfirst:
      'You can, it is legitimate, and for some pilgrims it is the better choice. Here is the honest comparison from an operator who sells packages.',
    sections: [
      {
        heading: 'The short answer',
        body: [
          {
            type: 'p',
            text: 'Yes. You can apply for a tourist eVisa yourself, book your own flights and hotel, arrange your own transfers, and issue your own Nusuk permit. Nothing about Umrah requires an agent.',
          },
        ],
      },
      {
        heading: 'When independent works well',
        body: [
          {
            type: 'ul',
            items: [
              'You have performed Umrah before and know the ground',
              'You are travelling alone or as a couple, without elderly parents or young children',
              'Your dates are outside Ramadan and outside school holidays',
              'You are comfortable arranging transfers on arrival, in a country where you may not speak the language',
              'You can absorb a disruption yourself — a cancelled flight, a hotel that is not where the listing implied',
            ],
          },
        ],
      },
      {
        heading: 'When it usually does not',
        body: [
          {
            type: 'p',
            text: 'Ramadan is the clearest case. Haram-precinct hotels are allocated to operators months ahead, and independent booking at that time means paying more for something further out, if anything is available at all.',
          },
          {
            type: 'p',
            text: 'The other case is anyone travelling with dependants. The distance from the hotel to the Haram, the reliability of the transfer, and having a group leader who can be called are worth considerably more when you are responsible for someone else.',
          },
          {
            type: 'note',
            text: 'A UK package that includes flights is ATOL protected, so your money is protected if the operator fails. Book the components separately and that protection generally does not apply.',
          },
        ],
      },
      {
        heading: 'The honest cost comparison',
        body: [
          {
            type: 'p',
            text: 'Independent booking is sometimes cheaper in a quiet month, particularly if you are flexible on hotel and willing to stay further from the Haram. In peak season it is usually more expensive, because operators hold allocation that individuals cannot access.',
          },
          {
            type: 'p',
            text: 'If you are comparing, compare properly: flight, visa, both hotels, four transfers, and insurance. A package price looks high next to a flight price and reasonable next to the full list.',
          },
        ],
      },
    ],
    related: ['what-is-umrah-package', 'umrah-cost-from-uk', 'umrah-visa-cost-from-uk'],
  },

  {
    slug: 'hajj-packages-from-uk',
    title: 'Hajj Packages From the UK: What to Know Before You Plan',
    description:
      'How Hajj differs from Umrah for UK pilgrims — the quota system, why it must be booked far ahead, and what a legitimate Hajj operator looks like.',
    published: '2026-08-20',
    standfirst:
      'Hajj is not a longer Umrah. It runs on a quota, on fixed dates, and it cannot be arranged at short notice.',
    sections: [
      {
        heading: 'Hajj runs on a quota',
        body: [
          {
            type: 'p',
            text: 'Every country receives a fixed allocation of Hajj places, distributed through approved operators. That is the single most important practical difference from Umrah: you cannot simply book, because the number of UK pilgrims who may perform Hajj in a given year is capped.',
          },
          {
            type: 'p',
            text: 'It also means a Hajj visa is a separate document. No tourist visa, ETA or Umrah visa permits Hajj.',
          },
        ],
      },
      {
        heading: 'Fixed dates, no flexibility',
        body: [
          {
            type: 'p',
            text: 'Hajj falls on specific days of Dhul Hijjah and cannot be moved. Umrah can be performed at almost any time of year; Hajj cannot. Book leave accordingly, and expect to be away roughly two to three weeks.',
          },
          {
            type: 'note',
            text: 'Umrah visas are typically suspended in the weeks around Hajj so that Makkah can be prepared. If you are planning Umrah for late spring, check operability before booking anything.',
          },
        ],
      },
      {
        heading: 'How to check an operator is legitimate',
        body: [
          {
            type: 'ol',
            items: [
              'They hold an ATOL, and will give you the number without being pressed',
              'They are an approved Hajj organiser — the allocation system means not every travel agent can sell Hajj, whatever their website says',
              'They give you written confirmation of Mina and Arafat tent category, not just hotel star ratings',
              'They are clear about what happens if the quota does not come through, and what is refunded',
            ],
          },
        ],
      },
      {
        heading: 'Start early',
        body: [
          {
            type: 'p',
            text: 'A year ahead is not too early, and for a specific tent category it may already be late. If Hajj is your intention, speak to an operator now rather than in the spring — the answer in March is usually that nothing is left.',
          },
        ],
      },
    ],
    related: ['difference-between-hajj-and-umrah', 'umrah-visa-cost-from-uk', 'umrah-cost-from-uk'],
  },
];
