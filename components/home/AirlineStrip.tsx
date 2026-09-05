import Link from 'next/link';
import { Plane, ArrowRight } from 'lucide-react';
import { airlinesByDirectness } from '@/data/airlines';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Who you actually fly with.
 *
 * Al Noor runs a carousel of airline logos headed "We proudly cooperate with".
 * This is the same idea — answer "whose plane am I on" before anyone has to ask
 * — with two deliberate differences.
 *
 * It is not a carousel. Five carriers fit on one row, and a carousel that hides
 * three of five behind arrows makes a visitor work for information we could
 * simply show. Auto-advancing strips also move content under the cursor and are
 * a well-known accessibility problem; there is nothing here worth that cost.
 *
 * And the heading is factual rather than promotional. "We proudly cooperate
 * with" asserts a commercial relationship with each carrier named, which is a
 * claim an airline can test and would need evidencing one by one. What is true,
 * and what data/airports.ts already says, is that these carriers fly these
 * routes — so that is what this says. Each card carries the routing, which is
 * the part a pilgrim comparing two packages actually needs.
 */
export function AirlineStrip() {
  return (
    <section aria-labelledby="airlines" className="border-y border-border bg-surface-sunk">
      <div className="max-container padding-container flex flex-col gap-10 py-14 lg:py-16">
        <Reveal className="section-header-centered">
          <p className="eyebrow">Who you fly with</p>
          <h2 id="airlines" className="text-heading">
            Airlines on <span className="text-gold-text">these routes</span>
          </h2>
          <p className="text-body-lg text-text-muted">
            Two carriers fly direct to Jeddah from Heathrow; the rest connect once,
            through Doha, Dubai or Istanbul. Your ticket names the airline before you
            pay — we do not sell "a flight" and tell you whose later.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {airlinesByDirectness.map(({ code, name, hub, note }, i) => (
            <Reveal
              key={code}
              as="li"
              variant="scale"
              index={i}
              className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5 shadow-card"
            >
              {/*
                The carrier set in our own type, not its logo. Airline marks are
                registered trademarks and the artwork is copyrighted — naming a
                carrier factually is fine, reproducing its mark needs permission.
                When those files are licensed they drop in here by IATA code.
              */}
              <span className="flex items-center justify-between gap-2">
                <span className="font-serif text-subheading text-green-900">{name}</span>
                <span
                  className="rounded bg-surface-sunk px-1.5 py-0.5 text-body-sm font-medium tracking-wide text-text-muted"
                  aria-hidden
                >
                  {code}
                </span>
              </span>

              <span
                className={
                  hub === null
                    ? 'inline-flex w-fit items-center gap-1.5 rounded-full bg-green-900 px-2.5 py-1 text-body-sm font-medium text-on-premium'
                    : 'inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-body-sm text-text-muted'
                }
              >
                <Plane size={13} aria-hidden />
                {hub === null ? 'Direct to Jeddah' : `via ${hub}`}
              </span>

              <span className="text-body-sm text-text-muted">{note}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal className="flex justify-center">
          <Link
            href="/flights/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-surface px-5 py-2.5 text-body-sm font-medium text-green-900 transition-colors hover:border-gold-500 hover:bg-gold-200/40"
          >
            How the routes and baggage work
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
