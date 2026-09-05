'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { airlines } from '@/data/airlines';
import { Photo, hasImage } from '@/components/ui/Photo';

/**
 * "We proudly cooperate with" — the airline strip, matching Al Noor's layout.
 *
 * Photograph behind, heading over it, and a row of white cards holding the
 * carrier marks, with a chevron either side to page through them.
 *
 * Scroll-snap rather than a JS slideshow. The arrows nudge the rail by one card
 * and the row is a native horizontal scroller, so a trackpad swipe, a touch
 * drag, and the buttons all do the same thing, and it degrades to a plain
 * scrollable row with no JavaScript. Nothing auto-advances: content that moves
 * on its own under a reader is the one carousel behaviour that reliably fails an
 * accessibility audit, and this row has nothing to gain from it.
 *
 * ⚠ THE LOGO FILES. Each card shows `airline-<iata code>` from the image
 * pipeline — `airline-sv`, `airline-qr` — and falls back to the carrier's name
 * set in our own type until that file exists. Airline marks are registered
 * trademarks: naming a carrier is fine, reproducing its mark needs permission,
 * which for an IATA-accredited agent normally comes through the carrier's trade
 * or brand portal. Drop the licensed files into assets/photos/ with those names,
 * run `npm run images`, and the marks appear with no code change.
 */
export function AirlineStrip() {
  const rail = useRef<HTMLUListElement>(null);

  const page = (direction: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    // One card plus its gap, so a press lands cleanly on the next snap point
    // rather than drifting out of alignment over several presses.
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="airlines" className="max-container padding-container py-12 lg:py-16">
      <div className="premium-surface relative isolate overflow-hidden rounded-panel">
        <Photo
          image="flight-approach"
          alt=""
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-noir-950/85 via-noir-950/70 to-noir-950/90"
        />

        <div className="relative flex flex-col gap-8 px-4 py-12 sm:px-8 lg:py-14">
          <h2
            id="airlines"
            className="text-center font-serif text-display text-on-premium"
          >
            We proudly cooperate with
          </h2>

          <div className="relative">
            {/*
              tabIndex and a label because the row scrolls. A horizontally
              scrollable region that cannot be focused is unreachable by keyboard
              — the arrows are pointer-only, so without this the last carriers in
              the rail exist for mouse users and nobody else. axe catches it as
              scrollable-region-focusable, and it is right to.
            */}
            <ul
              ref={rail}
              tabIndex={0}
              aria-label="Airlines we book, scrollable"
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {airlines.map(({ code, name }) => {
                const logo = `airline-${code.toLowerCase()}`;
                return (
                <li
                  key={code}
                  className="flex min-w-[13rem] flex-1 snap-start items-center justify-center rounded-panel bg-ground px-6 py-10 shadow-float sm:min-w-[15rem]"
                >
                  {/*
                    The licensed mark where one exists, the carrier's name where
                    it does not. Both carry the same information to a reader; only
                    one of them needs permission to display.
                  */}
                  {hasImage(logo) ? (
                    <Photo
                      image={logo}
                      alt={name}
                      sizes="200px"
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-serif text-subheading text-green-900">{name}</span>
                  )}
                </li>
                );
              })}
            </ul>

            {/* Positioned over the rail ends, as theirs are. Hidden from assistive
                tech: the list is already reachable by keyboard and scroll, so
                these are a pointer convenience, not a second way in. */}
            <button
              type="button"
              onClick={() => page(-1)}
              aria-hidden="true"
              tabIndex={-1}
              className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-md bg-noir-950/70 p-2 text-on-premium backdrop-blur transition-colors hover:bg-noir-950 sm:block"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              aria-hidden="true"
              tabIndex={-1}
              className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 rounded-md bg-noir-950/70 p-2 text-on-premium backdrop-blur transition-colors hover:bg-noir-950 sm:block"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
