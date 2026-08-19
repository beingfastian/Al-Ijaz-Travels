import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';

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

      <div className="max-container padding-container relative py-24 lg:py-32">
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
      </div>
    </section>
  );
}
