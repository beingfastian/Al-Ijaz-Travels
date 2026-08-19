import type { Article } from './types';

/* ============================================================================
 * GUIDANCE ARTICLES — the rites, the meaning, the practice.
 *
 * ⚠ The standing rule for this file: describe practice, do not issue rulings.
 *
 * The rites of Umrah are settled and can be set out accurately — that is
 * reporting, not jurisprudence. But the moment a question turns on a pilgrim's
 * own circumstances (a rite performed incorrectly, illness, menstruation, an
 * expiation) it is fiqh, and the honest answer is to ask a scholar. A travel
 * operator writing rulings to improve its search rankings is doing something
 * worse than writing badly.
 *
 * Every article here therefore describes the widely-agreed practice, notes where
 * schools differ rather than picking one silently, and refers edge cases onward.
 * ========================================================================== */

export const guidanceArticles: Article[] = [
  {
    slug: 'what-is-umrah-meaning-definition-and-importance-in-islam',
    title: 'What Is Umrah? Meaning, Definition and Importance',
    description:
      'What Umrah is, how it differs from Hajj, what the rites consist of, and its place in Islamic practice — explained plainly for first-time pilgrims.',
    published: '2026-08-20',
    standfirst:
      'Umrah is the lesser pilgrimage to Makkah: four rites, performable at almost any time of year, and for most pilgrims the first journey they make.',
    sections: [
      {
        heading: 'The meaning',
        body: [
          {
            type: 'p',
            text: 'Umrah (عُمْرَة) is often translated as "the lesser pilgrimage", in contrast to Hajj, the greater pilgrimage. The word carries a sense of visiting a populated or sacred place. It is a visit to the Kaaba in Masjid al-Haram, Makkah, performed according to a defined set of rites.',
          },
          {
            type: 'p',
            text: 'Unlike Hajj, Umrah is not one of the five pillars of Islam and is not obligatory in the same way. It is highly encouraged, and may be performed at any time of year other than the days of Hajj.',
          },
        ],
      },
      {
        heading: 'What the rites consist of',
        body: [
          {
            type: 'p',
            text: 'Umrah has four components, performed in order:',
          },
          {
            type: 'ol',
            items: [
              'Ihram — entering the sacred state at a designated miqat, with the intention (niyyah) and the talbiyah. Men wear two unstitched white cloths; women wear ordinary modest dress.',
              'Tawaf — circling the Kaaba seven times, anticlockwise, beginning and ending at the Black Stone.',
              "Sa'i — walking seven times between the hills of Safa and Marwah, commemorating Hajar's search for water for her son Isma'il.",
              'Halq or taqsir — shaving the head, or trimming the hair, which releases the pilgrim from ihram.',
            ],
          },
          {
            type: 'p',
            text: 'Performed without crowds, this takes a few hours. In Ramadan, when the Haram is at its fullest, the same rites can take most of a day.',
          },
        ],
      },
      {
        heading: 'Its place in practice',
        body: [
          {
            type: 'p',
            text: 'Umrah is widely understood as a means of spiritual renewal, and there is well-known guidance on the merit of performing it, particularly during Ramadan. Many pilgrims perform Umrah more than once in a lifetime, and repeat it during a single visit.',
          },
          {
            type: 'note',
            text: 'Scholars differ on some details of the rites — whether particular acts are obligatory or recommended, and what is required if one is missed. Where your circumstances raise a question, ask a scholar you trust rather than relying on a travel website, this one included.',
          },
        ],
      },
      {
        heading: 'Madinah is not part of Umrah',
        body: [
          {
            type: 'p',
            text: 'Almost every UK Umrah package includes several nights in Madinah, visiting Masjid an-Nabawi and the Ziyarat sites. This is a visit of great significance, but it is not a rite of Umrah and is not required for the pilgrimage to be complete.',
          },
          {
            type: 'p',
            text: 'It is included because pilgrims travelling from the UK are unlikely to make the journey twice, and few would choose to be that close and not go.',
          },
        ],
      },
    ],
    related: [
      'rules-of-umrah-complete-step-by-step-guide',
      'difference-between-hajj-and-umrah',
      'step-by-step-guide-to-performing-umrah-for-uk-pilgrims',
    ],
  },

  {
    slug: 'rules-of-umrah-complete-step-by-step-guide',
    title: 'The Rules of Umrah: A Step-by-Step Guide',
    description:
      'The rites of Umrah in order — ihram, tawaf, sa‘i and halq — with the conditions of each and the restrictions that apply while in ihram.',
    published: '2026-08-20',
    standfirst:
      'The rites in sequence, what each requires, and the restrictions in force from the moment you enter ihram.',
    sections: [
      {
        heading: '1. Ihram',
        body: [
          {
            type: 'p',
            text: 'Ihram is the sacred state, entered before crossing the miqat — the boundary points around Makkah. For UK pilgrims flying to Jeddah, this is generally done before boarding or in the air, since the aircraft crosses the miqat.',
          },
          {
            type: 'ul',
            items: [
              'Perform ghusl (a full ritual wash) where possible, before dressing',
              'Men wear two unstitched white cloths; women wear ordinary modest clothing with hands and face uncovered in the usual practice',
              'Make the intention (niyyah) for Umrah',
              'Begin the talbiyah: Labbayk Allahumma labbayk',
            ],
          },
        ],
      },
      {
        heading: 'Restrictions while in ihram',
        body: [
          {
            type: 'p',
            text: 'From entering ihram until leaving it, a pilgrim refrains from:',
          },
          {
            type: 'ul',
            items: [
              'Cutting hair or nails',
              'Using scented products, including perfumed soap',
              'Marital relations, and proposing marriage',
              'Hunting or killing game',
              'For men, wearing stitched clothing or covering the head',
              'Arguing, quarrelling and obscenity',
            ],
          },
          {
            type: 'note',
            text: 'Breaking a restriction may require an expiation, and the ruling depends on what was done and whether it was deliberate. This is a question for a scholar, not a travel operator.',
          },
        ],
      },
      {
        heading: '2. Tawaf',
        body: [
          {
            type: 'p',
            text: 'On arriving at Masjid al-Haram, perform tawaf: seven circuits of the Kaaba, anticlockwise, starting and finishing at the Black Stone. Men traditionally perform idtiba (leaving the right shoulder uncovered) and ramal (walking briskly in the first three circuits) — practices that are recommended rather than required, and often impractical in a heavy crowd.',
          },
          {
            type: 'p',
            text: 'After tawaf, pray two rak‘ah, ideally near the Maqam Ibrahim, and drink Zamzam.',
          },
        ],
      },
      {
        heading: '3. Sa‘i',
        body: [
          {
            type: 'p',
            text: 'Proceed to Safa and walk seven times between Safa and Marwah. Safa to Marwah counts as one, Marwah back to Safa as the second, finishing at Marwah on the seventh. The distance is roughly 450 metres each way, so this is around three kilometres in total — worth knowing if you are travelling with someone elderly.',
          },
        ],
      },
      {
        heading: '4. Halq or taqsir',
        body: [
          {
            type: 'p',
            text: 'Men either shave the head completely (halq) or trim the hair (taqsir); shaving is considered the more meritorious. Women trim a fingertip’s length from their hair. This completes Umrah and releases the pilgrim from ihram, and the restrictions lift.',
          },
        ],
      },
      {
        heading: 'Practical notes for UK pilgrims',
        body: [
          {
            type: 'ul',
            items: [
              'Wear your ihram from the UK, or change on the aircraft before the miqat — most groups do the former',
              'Unscented soap and unscented deodorant are worth packing; ordinary toiletries are usually perfumed',
              'The mataf is marble and warm. Simple sandals that can be carried are more practical than they sound',
              'A refillable bottle for Zamzam saves a great deal of queuing',
            ],
          },
        ],
      },
    ],
    related: [
      'step-by-step-guide-to-performing-umrah-for-uk-pilgrims',
      'what-is-umrah-meaning-definition-and-importance-in-islam',
      'how-long-umrah-take',
    ],
  },

  {
    slug: 'step-by-step-guide-to-performing-umrah-for-uk-pilgrims',
    title: 'A Step-by-Step Umrah Guide for UK Pilgrims',
    description:
      'The whole journey from a UK airport to returning home — what happens at each stage, what to prepare, and where first-time pilgrims commonly come unstuck.',
    published: '2026-08-20',
    standfirst:
      'Not the rites in isolation, but the whole trip: what actually happens between leaving Manchester and coming home.',
    sections: [
      {
        heading: 'Before you fly',
        body: [
          {
            type: 'ol',
            items: [
              'Check your passport has at least six months left from your arrival date, not your booking date',
              'Get the MenACWY vaccination at least ten days before departure — GP or travel clinic',
              'Confirm your visa route and that your Nusuk permit has been issued',
              'Pack unscented toiletries, an ihram (men), comfortable sandals, and any medication in its original packaging',
              'Take a printed copy of your hotel address in Arabic — useful when a taxi driver does not read English',
            ],
          },
        ],
      },
      {
        heading: 'At the UK airport',
        body: [
          {
            type: 'p',
            text: 'Most groups meet before check-in rather than at the gate. Many pilgrims change into ihram at home or at the airport prayer room, since changing on the aircraft is possible but cramped.',
          },
        ],
      },
      {
        heading: 'Crossing the miqat',
        body: [
          {
            type: 'p',
            text: 'The aircraft crosses the miqat before landing at Jeddah, and the captain usually announces it. Make your intention and begin the talbiyah before that point. If you are unsure of the timing, ask your group leader — they will have done this many times.',
          },
        ],
      },
      {
        heading: 'Arrival and Makkah',
        body: [
          {
            type: 'p',
            text: 'Immigration at Jeddah can be slow, particularly in peak season. Your transfer meets you after customs; the road journey to Makkah is roughly an hour and a half.',
          },
          {
            type: 'p',
            text: 'Most groups perform Umrah after checking in and resting briefly. Going straight from a night flight into tawaf and sa‘i is possible, but three kilometres of walking on no sleep defeats a fair number of people.',
          },
        ],
      },
      {
        heading: 'Madinah',
        body: [
          {
            type: 'p',
            text: 'The transfer to Madinah takes around five hours by road, or under three by high-speed rail where included. Ziyarat covers Quba Mosque, Masjid al-Qiblatayn and Uhud, and is generally arranged over a morning.',
          },
          {
            type: 'p',
            text: 'The Rawdah requires its own permit through the Nusuk app, with allocated time slots. Book it as soon as your dates are fixed — slots go quickly.',
          },
        ],
      },
      {
        heading: 'Where people come unstuck',
        body: [
          {
            type: 'ul',
            items: [
              'Underestimating the walking. Sa‘i alone is around three kilometres, on top of everything else',
              'Perfumed toiletries bought at duty free, in ihram',
              'Not booking the Rawdah slot early',
              'Excess baggage on the way home, from Zamzam and gifts',
              'Assuming the hotel is as close as the listing implied — check the distance in metres before you book',
            ],
          },
        ],
      },
    ],
    related: ['rules-of-umrah-complete-step-by-step-guide', 'how-long-umrah-take', 'umrah-visa-cost-from-uk'],
  },

  {
    slug: 'difference-between-hajj-and-umrah',
    title: 'The Difference Between Hajj and Umrah',
    description:
      'Hajj and Umrah compared — obligation, timing, rites, duration and cost — and why one can be booked next month and the other cannot.',
    published: '2026-08-20',
    standfirst:
      'They are not longer and shorter versions of the same journey. They differ in obligation, timing, rites and how they are booked.',
    sections: [
      {
        heading: 'Obligation',
        body: [
          {
            type: 'p',
            text: 'Hajj is the fifth pillar of Islam and is obligatory once in a lifetime for every Muslim who is physically and financially able. Umrah is highly encouraged but is not one of the pillars, and scholars differ on whether it is obligatory at all.',
          },
        ],
      },
      {
        heading: 'Timing',
        body: [
          {
            type: 'p',
            text: 'Hajj is performed on specific days of Dhul Hijjah and cannot be moved. Umrah may be performed at almost any time of year, other than during the days of Hajj.',
          },
          {
            type: 'note',
            text: 'This is why Umrah visas are typically suspended around Hajj season, and why a late-spring Umrah departure may not be operable in a given year.',
          },
        ],
      },
      {
        heading: 'The rites',
        body: [
          {
            type: 'p',
            text: 'Umrah consists of ihram, tawaf, sa‘i and halq or taqsir. Hajj includes all of those and adds several days of rites outside Makkah:',
          },
          {
            type: 'ul',
            items: [
              'Standing at Arafat (wuquf) — the essential rite of Hajj, without which it is not valid',
              'Staying at Muzdalifah',
              'Stoning the Jamarat at Mina',
              'The sacrifice (qurbani)',
              'Tawaf al-Ifadah',
            ],
          },
        ],
      },
      {
        heading: 'Duration and cost',
        body: [
          {
            type: 'p',
            text: 'Umrah rites take a few hours; a UK package runs 7 to 21 nights depending on how long you wish to stay. Hajj rites take about five to six days, and a UK Hajj package typically runs two to three weeks because the dates are fixed and the crowds are enormous.',
          },
          {
            type: 'p',
            text: 'Hajj costs considerably more — accommodation in Mina and Arafat, transport between the sites, and quota-limited allocation all push the figure well above any Umrah package.',
          },
        ],
      },
      {
        heading: 'Booking',
        body: [
          {
            type: 'p',
            text: 'The practical difference that surprises people most: Umrah can be booked for next month, and Hajj cannot. Hajj runs on a national quota administered through approved operators, so places are limited and allocated far in advance.',
          },
        ],
      },
    ],
    related: ['hajj-packages-from-uk', 'what-is-umrah-meaning-definition-and-importance-in-islam', 'rules-of-umrah-complete-step-by-step-guide'],
  },

  {
    slug: 'how-long-umrah-take',
    title: 'How Long Does Umrah Take?',
    description:
      'How long the rites of Umrah actually take, how much longer in Ramadan, and how that fits into a UK package of 7 to 21 nights.',
    published: '2026-08-20',
    standfirst:
      'The rites take three to four hours in a quiet week. In the last ten nights of Ramadan, allow most of a day.',
    sections: [
      {
        heading: 'The rites themselves',
        body: [
          {
            type: 'p',
            text: 'Performed without heavy crowds, Umrah takes roughly three to four hours from entering the Haram to completing halq or taqsir:',
          },
          {
            type: 'ul',
            items: [
              'Tawaf — around 45 minutes to an hour for seven circuits',
              'Two rak‘ah and Zamzam — 15 to 20 minutes',
              'Sa‘i — around an hour for seven lengths, roughly three kilometres',
              'Halq or taqsir — 15 minutes, longer if the barbers are busy',
            ],
          },
        ],
      },
      {
        heading: 'How much longer in Ramadan',
        body: [
          {
            type: 'p',
            text: 'Considerably. In the last ten nights, a single tawaf can take two hours or more, and the mataf may be closed to new entrants entirely, with tawaf performed from the upper levels — which is a longer circuit.',
          },
          {
            type: 'p',
            text: 'Plan on most of a day, go outside the hours immediately after Taraweeh, and do not attempt it with an elderly relative in the densest period without a plan.',
          },
          {
            type: 'note',
            text: 'This is one reason walking distance to the Haram matters more in Ramadan than at any other time. A hotel 120 metres away lets you return and rest; one at 1.4 kilometres does not, and you will make that walk several times a day.',
          },
        ],
      },
      {
        heading: 'And the trip overall',
        body: [
          {
            type: 'p',
            text: 'Because the rites take hours rather than days, package length is a question of how much time you want in each city, not how long Umrah requires. Ten nights — six in Makkah, four in Madinah — is the most commonly booked, and gives room to perform Umrah more than once.',
          },
        ],
      },
    ],
    related: ['how-many-days-are-in-umrah-packages', 'rules-of-umrah-complete-step-by-step-guide', 'what-is-ramadan-meaning-fasting-rules-and-dates'],
  },

  {
    slug: 'what-is-ramadan-meaning-fasting-rules-and-dates',
    title: 'Ramadan: Meaning, Fasting and What Umrah Is Like',
    description:
      'What Ramadan is, the basics of fasting, and what performing Umrah during it is genuinely like — including the crowds nobody warns you about.',
    published: '2026-08-20',
    standfirst:
      'Ramadan Umrah is the most rewarding time to be in Makkah and by a distance the hardest. Both are true.',
    sections: [
      {
        heading: 'What Ramadan is',
        body: [
          {
            type: 'p',
            text: 'Ramadan is the ninth month of the Islamic lunar calendar, during which Muslims fast from dawn (fajr) to sunset (maghrib). It commemorates the revelation of the Qur’an, and includes Laylat al-Qadr, sought within the last ten nights.',
          },
          {
            type: 'p',
            text: 'Because the Islamic calendar is lunar, Ramadan moves roughly eleven days earlier each Gregorian year. Dates are confirmed by moon sighting, so they are announced rather than fixed far in advance.',
          },
        ],
      },
      {
        heading: 'The fast',
        body: [
          {
            type: 'p',
            text: 'Fasting means abstaining from food, drink, smoking and marital relations between fajr and maghrib. Suhoor is taken before dawn; the fast is broken at maghrib with iftar, traditionally with dates and water.',
          },
          {
            type: 'p',
            text: 'Exemptions exist — for illness, travel, pregnancy, nursing, menstruation and age — with rules on making up missed days or paying fidyah.',
          },
          {
            type: 'note',
            text: 'Whether and how a missed fast is made up depends on circumstances and school of thought. Ask a scholar rather than a travel operator.',
          },
        ],
      },
      {
        heading: 'What Umrah in Ramadan is actually like',
        body: [
          {
            type: 'p',
            text: 'The atmosphere is unlike anything else — Taraweeh at the Haram, iftar served in the courtyards to hundreds of thousands, and the last ten nights.',
          },
          {
            type: 'p',
            text: 'It is also the most crowded and most expensive period of the year. Prices run around 70% above a quiet month for an identical package. The mataf is frequently closed to new entrants. You will often pray in the courtyards rather than inside, and a tawaf that takes an hour in October can take three.',
          },
          {
            type: 'p',
            text: 'None of that is a reason not to go. It is a reason to book early, to stay as close to the Haram as you can afford, and to arrive knowing what to expect rather than discovering it.',
          },
        ],
      },
      {
        heading: 'Practical advice',
        body: [
          {
            type: 'ul',
            items: [
              'Book six to nine months ahead for Haram-precinct hotels — they go first',
              'Prioritise distance over star rating. You will walk it several times a day while fasting',
              'Plan tawaf for the quieter hours, generally after Taraweeh has dispersed or before fajr',
              'Take rehydration salts. Fasting in 34°C heat with heavy walking is genuinely demanding',
            ],
          },
        ],
      },
    ],
    related: ['how-long-umrah-take', 'umrah-cost-from-uk', 'what-is-umrah-meaning-definition-and-importance-in-islam'],
  },
];
