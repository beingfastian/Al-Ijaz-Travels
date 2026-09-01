import { Suspense } from 'react';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';
import { EnquiryForm } from '@/components/quote/EnquiryForm';

/**
 * The full-bleed photographic band.
 *
 * The site's argument is that we are specific where competitors are vague, and
 * photography is where that argument stops being words. This is the one place on
 * the home page given over entirely to an image — placed after the hero, so it
 * lands once a visitor has read what the site is for, and before the packages,
 * so they arrive at the prices already persuaded there is something worth buying.
 *
 * Text sits on a noir gradient rather than directly on the photograph. A caption
 * laid over an image is at the mercy of whatever is behind that particular pixel,
 * and no contrast assertion can defend it — the gradient makes the pairing
 * cream-on-near-black regardless of which image is behind it. The gradient is
 * opaque where the words are and clears to nothing over the right two-thirds, so
 * the photograph is still doing the work.
 *
 * The enquiry form sits on the right of this band, over the photograph.
 *
 * This is where the competitor puts theirs — a white card overlapping a photo
 * panel partway down the home page, not in the hero — and on reflection it is the
 * better position. The hero has one job, which is to say what this is and let
 * someone leave if it is not for them. A form there asks for a phone number
 * before the visitor has been told anything. Here it lands after the argument
 * that this site states real distances in metres, which is the reason to trust
 * the quote enough to ask for one.
 */
export function PhotoBand() {
  return (
    <section className="premium-surface relative isolate overflow-hidden">
      <Reveal variant="settle" className="absolute inset-0">
        <Photo
          image="haram-night"
          alt="Masjid al-Haram at night, the Kaaba lit and encircled by worshippers, seen from the arcade"
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </Reveal>

      {/* Opaque behind the text, clearing to nothing across the image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/85 to-noir-950/25"
      />
      {/* Settles the top and bottom edges into the sections either side. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-noir-950"
      />

      <div className="max-container padding-container relative grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_27rem] lg:py-24">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Reveal>
            <p className="eyebrow-premium">Where you are actually going</p>
          </Reveal>

          <Reveal index={1}>
            <h2 className="font-serif text-display text-on-premium">
              A hundred and twenty metres
              <span className="block text-on-premium-accent">from the gates</span>
            </h2>
          </Reveal>

          <Reveal index={2}>
            <p className="text-body-lg text-on-premium-muted">
              Every hotel on this site is listed with its real walking distance to the
              Haram, in metres. Not “close to the Haram”, not “walking distance” — the
              number, on every package, so you can judge it before you pay rather than
              on the first night.
            </p>
          </Reveal>

          <Reveal index={3}>
            <hr className="gold-divider w-40" />
          </Reveal>
        </div>

        {/*
          A light card on the photograph, not a dark form. Every input style on
          this site is built for a light surface; inverting them for one
          placement would mean a second set of form styles to keep in step with
          the first.

          Deliberately NOT wrapped in Reveal. Everything else in this band fades
          up on scroll, but the one element a visitor might be arriving to use
          should not be waiting on an IntersectionObserver.
        */}
        <div className="rounded-panel border border-border bg-ground p-5 shadow-float sm:p-6">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="font-serif text-subheading text-green-900">Get an Umrah quote</h2>
            <p className="text-body-sm text-text-muted">
              A consultant replies on WhatsApp with real availability. No deposit, no
              obligation.
            </p>
          </div>

          {/*
            EnquiryForm reads useSearchParams, which needs a Suspense boundary
            under `output: export` or the build fails outright. The fallback is
            sized so the band does not jump when the form arrives.
          */}
          <Suspense fallback={<div className="h-[18rem]" aria-hidden />}>
            <EnquiryForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
