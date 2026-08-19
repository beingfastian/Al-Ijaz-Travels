import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/* ============================================================================
 * THE MARK
 *
 * A flight path from Madinah to Makkah, drawn as an arc between two points, with
 * the eight-point khatam star at its apex.
 *
 * The idea is doing three jobs at once, which is what a mark has to do to earn
 * its place: it is literally the journey being sold; the arc reads as a dome in
 * silhouette; and the khatam ties it to the geometric motif used as texture
 * throughout the site. No aeroplane, no Kaaba illustration, no mosque clipart —
 * every Umrah operator in the UK has one of those, and they all look the same
 * because they are all describing rather than suggesting.
 *
 * Built as inline SVG rather than a file so it inherits `currentColor` and needs
 * no separate light and dark asset. `gold` picks out the arc and star only,
 * which is what keeps it from looking like a gold sticker.
 * ========================================================================== */

interface LogoProps {
  /** `full` is the lockup with the wordmark; `mark` is the glyph alone. */
  variant?: 'full' | 'mark';
  /** `dark` for cream grounds, `light` for premium/green grounds. */
  tone?: 'dark' | 'light';
  className?: string;
}

export function Logo({ variant = 'full', tone = 'dark', className }: LogoProps) {
  const ink = tone === 'dark' ? 'text-green-900' : 'text-sand-50';
  const accent = tone === 'dark' ? 'text-gold-600' : 'text-gold-300';

  return (
    <span className={cn('inline-flex items-center gap-3', ink, className)}>
      <LogoMark className={cn('h-9 w-9 shrink-0', accent)} />

      {variant === 'full' && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
            {site.name}
          </span>
          <span
            lang="ar"
            className={cn('mt-0.5 font-arabic text-[0.95rem] leading-none', accent)}
          >
            {site.nameArabic}
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * The glyph on its own — favicons, app icons, tight spaces, and the loading
 * placeholder that stands in for photography we do not have yet.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={`${site.name} logo`}
    >
      {/* The arc: Madinah on the left, Makkah on the right. Also reads as a dome. */}
      <path
        d="M6 37 C 6 16, 42 16, 42 37"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Endpoint pins — the two cities, weighted so Makkah reads as destination. */}
      <circle cx="6" cy="37" r="2.75" fill="currentColor" />
      <circle cx="42" cy="37" r="3.75" fill="currentColor" />

      {/* Eight-point khatam at the apex: two squares, one rotated 45°. */}
      <g transform="translate(24 18)">
        <rect
          x="-5.5"
          y="-5.5"
          width="11"
          height="11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <rect
          x="-5.5"
          y="-5.5"
          width="11"
          height="11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          transform="rotate(45)"
        />
      </g>

      {/* Ground line, clipped short of the pins so it reads as horizon, not a box. */}
      <path
        d="M12 42 H36"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
