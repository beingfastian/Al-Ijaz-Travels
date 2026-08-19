/* ============================================================================
 * MOTION VOCABULARY
 *
 * The names components reference, so animation across ~200 pages stays one
 * system rather than 200 improvisations. The CSS that implements these lives in
 * app/globals.css; the durations and easings are tokens emitted by
 * scripts/palette.mjs, so motion is versioned alongside colour rather than
 * scattered through component files.
 *
 * There is no animation library here on purpose. Framer Motion would add ~40 kB
 * to every page of a static export to do what four keyframes and an
 * IntersectionObserver already do — and on a site whose LCP budget is 2 s on
 * throttled 4G, that is a bad trade.
 * ========================================================================== */

/** How an element arrives. */
export type RevealVariant = 'rise' | 'fade' | 'scale' | 'settle';

export const REVEAL: Record<RevealVariant, string> = {
  /** Default. Fades up 1.5rem — enough to read as intent, not as a journey. */
  rise: 'rise',
  /** Opacity only. For text that would otherwise reflow, and for dense groups. */
  fade: 'fade',
  /** Slight scale-up. Cards, badges, and anything with a visible edge. */
  scale: 'scale',
  /** Slow settle from 1.06. Hero imagery only — it reads as depth, not movement. */
  settle: 'settle',
};

/**
 * Stagger step, in milliseconds.
 *
 * 70 ms is the useful band: below ~40 ms a group reads as arriving at once, and
 * above ~120 ms the last card in a six-card row feels late enough to look broken.
 */
export const STAGGER_STEP_MS = 70;

/**
 * Cap the cumulative delay. A twelve-item grid at 70 ms would leave the last
 * item waiting 770 ms after the first — long enough that a visitor scrolling at
 * speed sees an empty cell. Clamping keeps the whole group inside ~400 ms.
 */
export const STAGGER_MAX_MS = 420;

export function staggerDelay(index: number): number {
  return Math.min(index * STAGGER_STEP_MS, STAGGER_MAX_MS);
}

/**
 * Inline style for a staggered child. Returned as a CSS custom property rather
 * than an inline `animation-delay`, so the reduced-motion media query in the
 * stylesheet still wins — an inline animation-delay would apply even when the
 * animation itself is switched off, which is how stagger bugs usually start.
 */
export function staggerStyle(index: number): React.CSSProperties {
  return { '--reveal-delay': `${staggerDelay(index)}ms` } as React.CSSProperties;
}

/**
 * How much of an element must be on screen before it reveals.
 *
 * 0.15 rather than 0 because triggering on the first pixel means tall sections
 * animate while still mostly below the fold, which the visitor never sees.
 */
export const REVEAL_THRESHOLD = 0.15;

/**
 * Start slightly before the element enters the viewport, so content is already
 * settled by the time it is properly in view rather than animating under the
 * reader's eye.
 */
export const REVEAL_ROOT_MARGIN = '0px 0px -8% 0px';
