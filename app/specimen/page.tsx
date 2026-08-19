import type { Metadata } from 'next';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Design specimen',
  description: 'Every colour, type step, elevation and motion variant in one place.',
  // An internal reference sheet. Indexing it would put a page of swatches into
  // search results for a travel agency, which helps nobody.
  robots: { index: false, follow: false },
};

/**
 * The design system, rendered.
 *
 * This page is the acceptance test for the design work: if a token exists it
 * appears here, and if it looks wrong here it is wrong everywhere. Contrast is
 * already enforced by scripts/palette.mjs at build time, so what this adds is
 * the thing a script cannot check — whether the system looks like one system.
 *
 * Keep it up to date. A specimen page that has drifted from the tokens is worse
 * than not having one, because it is consulted and believed.
 */

const BASE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * Steps per ramp, mirroring scripts/palette.mjs. Only green and noir carry a 950
 * — green because the brief pins a second dark anchor, noir because a premium
 * ground needs somewhere to go below 900. Rendering a uniform 50–950 grid across
 * every ramp, which is what this page did first, draws two empty swatches and
 * reads as a broken token rather than a ramp that simply ends at 900.
 */
const RAMPS = [
  { name: 'green', steps: [...BASE_STEPS, 950] },
  { name: 'gold', steps: [...BASE_STEPS] },
  { name: 'noir', steps: [...BASE_STEPS, 950] },
  { name: 'sand', steps: [...BASE_STEPS] },
] as const;

const TYPE_STEPS = [
  { name: 'display-xl', cls: 'text-display-xl font-serif', sample: 'Umrah, done properly' },
  { name: 'display', cls: 'text-display font-serif', sample: 'Every package, compared honestly' },
  { name: 'heading', cls: 'text-heading font-serif', sample: 'Where you actually stay' },
  { name: 'subheading', cls: 'text-subheading font-serif', sample: '10 Nights 5-Star Umrah' },
  { name: 'body-lg', cls: 'text-body-lg', sample: 'Distances are real walking distances to the Haram, not marketing estimates.' },
  { name: 'body', cls: 'text-body', sample: 'Flights, visa, transfers and accommodation included in every package.' },
  { name: 'body-sm', cls: 'text-body-sm', sample: 'Per person, based on quad sharing.' },
  { name: 'label', cls: 'eyebrow', sample: 'Departing March' },
];

const ELEVATION = [
  { name: 'shadow-card', cls: 'shadow-card', use: 'Resting cards' },
  { name: 'shadow-lift', cls: 'shadow-lift', use: 'Hover and focus' },
  { name: 'shadow-float', cls: 'shadow-float', use: 'Menus, dialogs, sticky rails' },
];

const MOTION_VARIANTS = [
  { variant: 'rise' as const, use: 'Default. Sections, cards, most content.' },
  { variant: 'fade' as const, use: 'Dense text, and anything that would reflow.' },
  { variant: 'scale' as const, use: 'Cards, badges, elements with a visible edge.' },
  { variant: 'settle' as const, use: 'Hero imagery only — reads as depth.' },
];

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-border py-14">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">{title}</h2>
        {note && <p className="prose-column text-body text-text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function SpecimenPage() {
  return (
    <div className="max-container padding-container py-16">
      <header className="flex flex-col gap-4 pb-10">
        <p className="eyebrow">Internal reference</p>
        <h1 className="text-display">Design specimen</h1>
        <p className="prose-column text-body-lg text-text-muted">
          Every token the system defines. Contrast is asserted at build time by{' '}
          <code className="rounded bg-surface-sunk px-1.5 py-0.5 text-body-sm">npm run palette</code>,
          which fails the build on a regression — so what this page adds is whether it all
          looks like one system.
        </p>
      </header>

      <Section
        title="The mark"
        note="A flight path from Madinah to Makkah, with the khatam star at its apex. The arc doubles as a dome in silhouette. Inline SVG inheriting currentColor, so there is no separate light and dark asset."
      >
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex flex-col items-center gap-3 rounded-panel border border-border bg-surface p-8">
            <Logo />
            <span className="text-body-sm text-text-muted">full · dark</span>
          </div>
          <div className="premium-surface flex flex-col items-center gap-3 rounded-panel p-8">
            <Logo tone="light" />
            <span className="text-body-sm text-on-premium-muted">full · light</span>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-panel border border-border bg-surface p-8">
            <div className="flex items-end gap-4 text-gold-600">
              <LogoMark className="h-14 w-14" />
              <LogoMark className="h-9 w-9" />
              <LogoMark className="h-6 w-6" />
            </div>
            <span className="text-body-sm text-text-muted">mark, at size</span>
          </div>
        </div>
      </Section>

      <Section
        title="Colour"
        note="Generated in OKLCH with chroma raised through the midtones. Blending the brand green toward white — the obvious approach — gives grey, because #162D23 carries almost no chroma to begin with."
      >
        <div className="flex flex-col gap-6">
          {RAMPS.map((ramp) => (
            <div key={ramp.name} className="flex flex-col gap-2">
              <h3 className="text-body font-medium">{ramp.name}</h3>
              <div className="flex flex-wrap gap-1">
                {ramp.steps.map((step) => (
                  <div key={step} className="flex flex-col items-center gap-1">
                    <div
                      className="h-14 w-14 rounded-card border border-border"
                      style={{ background: `var(--color-${ramp.name}-${step})` }}
                    />
                    <span className="text-body-sm text-text-muted">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Semantic tokens"
        note="Components use these, never the raw ramp — so a contrast rule cannot be lost to a judgement call at the call site. Gold as body text on cream measures 3.36:1 and fails AA, which is why --color-gold-text resolves to a darkened value."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-panel border border-border bg-surface p-6">
            <p className="text-heading">Heading</p>
            <p className="text-body text-text">Body text on surface.</p>
            <p className="text-body text-text-muted">Muted body text.</p>
            <p className="text-body text-gold-text">Gold text, AA-safe.</p>
            <p className="text-body text-link underline">A link.</p>
            <p className="text-body text-danger">A validation error.</p>
          </div>

          <div className="rounded-panel bg-green-900 p-6 text-on-dark">
            <p className="font-serif text-subheading">On brand green</p>
            <p className="text-body">Cream on green-900 — 13.82:1.</p>
            <p className="text-body text-on-dark-muted">Muted, gold-100.</p>
          </div>

          <div className="premium-surface rounded-panel p-6">
            <p className="eyebrow-premium">Premium</p>
            <p className="font-serif text-subheading">On noir</p>
            <p className="text-body">Cream on noir-950 — 19.17:1.</p>
            <p className="text-body text-on-premium-muted">Muted, noir-300 — 8.22:1.</p>
            <p className="text-body text-on-premium-accent">Accent, gold-300 — 11.59:1.</p>
            <hr className="gold-divider my-4" />
            <p className="text-body-sm text-on-premium-muted">Gold divider above.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Type"
        note="Playfair Display for headings, Inter for body, Noto Naskh for Arabic. Display steps use clamp() so they scale with the viewport rather than stepping at breakpoints."
      >
        <div className="flex flex-col gap-8">
          {TYPE_STEPS.map((step) => (
            <div key={step.name} className="flex flex-col gap-1 border-b border-border pb-6">
              <span className="text-body-sm text-text-muted">{step.name}</span>
              <p className={step.cls}>{step.sample}</p>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-body-sm text-text-muted">arabic · lang=&quot;ar&quot;</span>
            <p lang="ar" className="font-arabic text-heading">
              الإعجاز للسفر والسياحة
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Elevation and edges"
        note="Shadows are layered, low-opacity and warm-tinted. A neutral black blur on a cream ground is most of what makes a page look cheap."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {ELEVATION.map((e) => (
            <div key={e.name} className={`rounded-panel bg-surface p-6 ${e.cls}`}>
              <p className="text-body font-medium">{e.name}</p>
              <p className="text-body-sm text-text-muted">{e.use}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="rule-gold rounded-panel border bg-surface p-6">
            <p className="text-body font-medium">rule-gold</p>
            <p className="text-body-sm text-text-muted">
              A hairline at 30% gold. A solid gold border reads as a warning label.
            </p>
          </div>
          <div className="premium-raised rounded-panel p-6">
            <p className="text-body font-medium">premium-raised</p>
            <p className="text-body-sm text-on-premium-muted">
              Inset gold highlight along the top edge, deep shadow beneath.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Buttons"
        note="Primary is cream on green-900 at 13.82:1, not the obvious gold — gold as a filled ground gives 3.56:1 against a white label and fails AA."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="gold" size="lg">
            Gold, large only
          </Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="premium-surface flex flex-wrap items-center gap-4 rounded-panel p-6">
          <Button variant="on-dark">On dark</Button>
          <Button variant="gold">Gold on noir</Button>
        </div>
      </Section>

      <Section
        title="Motion"
        note="Scroll down and each card reveals with its named variant. Turn on “reduce motion” in your OS and reload — the page should present itself finished and calm, not as a degraded version of this one."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {MOTION_VARIANTS.map((m, i) => (
            <Reveal
              key={m.variant}
              variant={m.variant}
              index={i}
              className="rounded-panel border border-border bg-surface p-6 shadow-card"
            >
              <p className="text-body font-medium">{m.variant}</p>
              <p className="text-body-sm text-text-muted">{m.use}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <p className="text-body font-medium">Stagger, 70 ms step, capped at 420 ms</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Reveal
                key={i}
                variant="scale"
                index={i}
                className="hover-lift flex h-20 items-center justify-center rounded-card border border-border bg-surface text-body-sm text-text-muted"
              >
                {i + 1}
              </Reveal>
            ))}
          </div>
          <p className="text-body-sm text-text-muted">
            These also carry <code>hover-lift</code> — hover one.
          </p>
        </div>
      </Section>

      <Section title="Texture" note="The khatam motif, tiled at low opacity. Texture, not pattern.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="khatam-field flex h-40 items-center justify-center rounded-panel border border-border">
            <span className="text-body text-text-muted">khatam-field</span>
          </div>
          <div className="khatam-field-gold flex h-40 items-center justify-center rounded-panel bg-green-900">
            <span className="text-body text-on-dark">khatam-field-gold</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
