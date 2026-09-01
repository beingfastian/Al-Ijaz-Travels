import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/* ============================================================================
 * THE LOGO
 *
 * A wordmark: the name in the serif, with the Arabic beneath it in gold.
 *
 * ⚠ THE GLYPH NO LONGER APPEARS BESIDE THE NAME, ON CLIENT INSTRUCTION.
 *
 * `LogoMark` below used to sit in front of the wordmark in the navbar and the
 * footer — an arc from Madinah to Makkah with the khatam star at its apex, which
 * read as a dome in silhouette. It was removed from the lockup because the
 * client asked for the dome gone. The component is still exported and still
 * drawn, because it is the only compact form of the brand there is and a
 * wordmark cannot be a favicon; do not delete it without replacing it there.
 * ========================================================================== */

interface LogoProps {
  /**
   * `full` is the wordmark lockup — the name and the Arabic.
   *
   * `mark` is the glyph alone. Note that `full` no longer contains the glyph, so
   * the two variants are now alternatives rather than a superset and a subset.
   */
  variant?: 'full' | 'mark';
  /** `dark` for cream grounds, `light` for premium/green grounds. */
  tone?: 'dark' | 'light';
  className?: string;
}

export function Logo({ variant = 'full', tone = 'dark', className }: LogoProps) {
  const ink = tone === 'dark' ? 'text-green-900' : 'text-sand-50';
  const accent = tone === 'dark' ? 'text-gold-600' : 'text-gold-300';

  if (variant === 'mark') {
    return <LogoMark className={cn('h-9 w-9 shrink-0', accent, className)} />;
  }

  return (
    <span className={cn('inline-flex items-center', ink, className)}>
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
    </span>
  );
}

/**
 * The glyph on its own — the favicon, app icons, and tight spaces.
 *
 * Kept out of the header lockup (see above) but still the mark: an arc from
 * Madinah to Makkah with the eight-point khatam at its apex. Inline SVG rather
 * than a file so it inherits `currentColor` and needs no separate light and dark
 * asset.
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
