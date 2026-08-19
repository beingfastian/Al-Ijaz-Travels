/**
 * The Nabawi-to-Kaaba flight path from the logo, drawn on load.
 *
 * This is the hero's whole argument, and it is the one idea carried over from the
 * base repo's design language — Hilink animates a route line with a location pin;
 * the Al Ijaz logo already contains exactly that motif, between the Prophet's
 * Mosque and the Kaaba. So it is reused rather than reinvented.
 *
 * Pure CSS on inline SVG: stroke-dashoffset draws the path, offset-path flies the
 * plane along it. No animation library — see the keyframes in globals.css. Under
 * prefers-reduced-motion the finished illustration is simply presented.
 *
 * ROUTE_LENGTH is the measured path length. It must match the `d` attribute below;
 * if the curve is edited, re-measure with getTotalLength() in the browser or the
 * dash animation will start from the wrong offset.
 */

const ROUTE_D = 'M 78 214 C 150 96, 330 70, 430 128';
const ROUTE_LENGTH = 372;

export function RouteIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 280"
      className={className}
      role="img"
      aria-label="A flight path curving from the Prophet's Mosque in Madinah to the Kaaba in Makkah"
      style={
        {
          '--route-length': ROUTE_LENGTH,
          '--route-shape': `path('${ROUTE_D}')`,
        } as React.CSSProperties
      }
    >
      {/* Madinah — green dome and minaret */}
      <g className="route-pin route-pin-origin">
        <path
          d="M62 214v-30a16 16 0 0 1 32 0v30Z"
          fill="var(--color-green-700)"
        />
        <path d="M78 154a12 12 0 0 1 12 14H66a12 12 0 0 1 12-14Z" fill="var(--color-green-600)" />
        <rect x="98" y="168" width="6" height="46" fill="var(--color-green-700)" />
        <circle cx="101" cy="164" r="4" fill="var(--color-gold-500)" />
        <rect x="52" y="214" width="52" height="5" fill="var(--color-green-800)" />
        <text
          x="78"
          y="238"
          textAnchor="middle"
          className="fill-green-900 font-sans"
          fontSize="15"
          fontWeight="500"
        >
          Madinah
        </text>
      </g>

      {/* The route */}
      <path
        className="route-path"
        d={ROUTE_D}
        fill="none"
        stroke="var(--color-gold-500)"
        strokeWidth="2"
        strokeDasharray="6 7"
        strokeLinecap="round"
      />

      {/* Makkah — the Kaaba */}
      <g className="route-pin route-pin-dest">
        <rect x="404" y="128" width="52" height="56" rx="2" fill="var(--color-green-950)" />
        <rect x="404" y="142" width="52" height="7" fill="var(--color-gold-500)" />
        <rect x="398" y="184" width="64" height="5" fill="var(--color-green-800)" />
        <text
          x="430"
          y="210"
          textAnchor="middle"
          className="fill-green-900 font-sans"
          fontSize="15"
          fontWeight="500"
        >
          Makkah
        </text>
      </g>

      {/* Plane, flown along the same path the line draws */}
      <g className="route-plane">
        <path
          d="M-9-5 9 0-9 5-5 0Z"
          fill="var(--color-green-900)"
        />
      </g>
    </svg>
  );
}
