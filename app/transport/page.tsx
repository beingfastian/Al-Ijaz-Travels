import type { Metadata } from 'next';
import { Bus, TrainFront, Car, Route, Accessibility } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CalloutCta } from '@/components/ui/CalloutCta';
import { Photo } from '@/components/ui/Photo';

export const metadata: Metadata = {
  title: 'Transport and Transfers',
  description:
    'Every transfer included in an Umrah package — Jeddah airport to Makkah, Makkah to Madinah by road or Haramain train, and back. Vehicles, journey times and what is arranged for you.',
  alternates: { canonical: '/transport/' },
};

/**
 * The transport page.
 *
 * Transfers are the least glamorous part of a package and the part most likely to
 * go wrong: a coach that leaves on a schedule rather than when your flight lands,
 * a driver who is not there, or a Makkah–Madinah leg nobody explained is five
 * hours by road.
 *
 * TODO(client): the client is supplying detailed transport content — vehicle
 * classes, the exact operator arrangements and any group-size rules. The
 * structure here is built to receive it; the journey legs and times below are
 * accurate as written and can stay.
 */
export default function TransportPage() {
  const legs = [
    {
      icon: Route,
      title: 'Jeddah airport to Makkah',
      time: 'About 1 hour 30 minutes',
      detail:
        'Your driver meets you after customs, not at a fixed departure time. Immigration at Jeddah can be slow in peak season, and a transfer that leaves without you is not a transfer — so the vehicle waits for the flight, however late it runs.',
    },
    {
      icon: TrainFront,
      title: 'Makkah to Madinah',
      time: 'Around 5 hours by road, under 3 by rail',
      detail:
        'By road on most packages. The Haramain high-speed train is available as an upgrade and is markedly easier on elderly travellers — the stations are outside both city centres, so a short transfer sits at each end, which we include.',
    },
    {
      icon: Car,
      title: 'Madinah back to the airport',
      time: 'Timed to your departure',
      detail:
        'Either Madinah airport for a direct return, or back to Jeddah where the routing requires it. We build in the margin the airline asks for rather than the minimum that technically works.',
    },
  ];

  const details = [
    {
      icon: Bus,
      title: 'Air-conditioned throughout',
      detail:
        'Makkah reaches 43°C in summer. Every vehicle we use is air-conditioned, and on the longer legs there is a comfort stop — which sounds obvious until you have done five hours without one.',
    },
    {
      icon: Accessibility,
      title: 'Wheelchair and mobility needs',
      detail:
        'Tell us at quote stage, not on arrival. Accessible vehicles need arranging in advance, and the difference between planning for it and improvising is the whole trip for the person concerned.',
    },
  ];

  return (
    <>
      <section className="premium-surface relative isolate overflow-hidden">
        <Photo
          image="nabawi-twilight"
          alt="Masjid an-Nabawi in Madinah at twilight, at the end of the road journey from Makkah"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/35"
        />

        <div className="max-container padding-container relative flex flex-col gap-5 py-20 lg:py-24">
          <p className="eyebrow-premium">Transport</p>
          <h1 className="max-w-3xl text-display text-on-premium">
            Every transfer,
            <span className="block text-on-premium-accent">including the one at 3 a.m.</span>
          </h1>
          <p className="prose-column text-body-lg text-on-premium-muted">
            Four legs are included in every package: airport to Makkah, Makkah to
            Madinah, Madinah to the airport, and the Ziyarat coaches in both cities.
            None of them is charged separately and none of them is left to you.
          </p>
        </div>
      </section>

      <div className="max-container padding-container flex flex-col gap-16 py-12 lg:py-16">
        <section aria-labelledby="legs" className="flex flex-col gap-8">
          <div className="section-header-centered">
            <h2 id="legs" className="text-heading">
              The journey, leg by leg
            </h2>
            <p className="text-body-lg text-text-muted">
              Times are realistic rather than optimistic. The Makkah–Madinah road leg is
              the one people underestimate.
            </p>
          </div>

          <ol className="flex flex-col gap-4">
            {legs.map(({ icon: Icon, title, time, detail }, i) => (
              <Reveal
                key={title}
                as="li"
                index={i}
                className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6 shadow-card sm:flex-row sm:gap-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-900 text-sand-50">
                  <Icon size={22} aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-serif text-subheading text-green-900">{title}</h3>
                    <span className="text-body-sm font-medium text-green-700">{time}</span>
                  </div>
                  <p className="prose-column text-body text-text-muted">{detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="transport-detail" className="flex flex-col gap-8">
          <h2 id="transport-detail" className="text-heading text-center">
            The things worth asking about
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, title, detail }, i) => (
              <Reveal
                key={title}
                as="li"
                index={i}
                className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
              >
                <Icon size={20} className="text-gold-text" aria-hidden />
                <h3 className="font-serif text-subheading text-green-900">{title}</h3>
                <p className="text-body-sm text-text-muted">{detail}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <CalloutCta
          title="Ziyarat is included in both cities"
          actions={<Button href="/quote/">Ask about transfers</Button>}
        >
            Makkah covers Mina, Arafat, Jabal al-Nour and the Cave of Hira. Madinah
            covers Quba Mosque, Masjid al-Qiblatayn and Uhud. Both travel as a group with
            a guide; a private car and guide is available as an add-on if you would
            rather set your own pace.
        </CalloutCta>
      </div>
    </>
  );
}
