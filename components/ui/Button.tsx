import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The base repo's Button is a bare <button> with no onClick and no href, so it
 * cannot navigate — fine for a one-page site, a blocker for a multi-page one.
 * This renders whatever the job needs: next/link for internal routes, a plain
 * anchor for external/WhatsApp/tel links, a real <button> otherwise.
 *
 * Colour note: `primary` is cream on green-900 (13.8:1), not the obvious gold.
 * Gold as a button ground gives 3.56:1 against a white label and fails WCAG AA,
 * so the `gold` variant below is intentionally dark text on gold and is capped
 * at the larger sizes. See scripts/palette.mjs for the measured pairings.
 */

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'on-dark';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-green-900 text-sand-50 border-green-900 hover:bg-green-800 hover:border-green-800 active:bg-green-950',
  secondary:
    'bg-transparent text-green-900 border-green-300 hover:border-green-900 hover:bg-green-50',
  // Dark text on gold: the only accessible way to use gold as a filled ground.
  gold: 'bg-gold-500 text-green-950 border-gold-500 hover:bg-gold-400 hover:border-gold-400 font-semibold',
  ghost: 'bg-transparent text-green-900 border-transparent hover:bg-green-50',
  'on-dark':
    'bg-sand-50 text-green-900 border-sand-50 hover:bg-gold-100 hover:border-gold-100',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-body-sm gap-2',
  md: 'px-6 py-3 text-body gap-2.5',
  lg: 'px-8 py-4 text-body-lg gap-3',
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** Stretch to the container width — useful in stacked mobile CTA groups. */
  full?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps> & { href?: undefined };

type AsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps> & { href: string };

export type ButtonProps = AsButton | AsLink;

/** Anything that leaves the site — including the wa.me handoff — is a plain anchor. */
function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:|wa\.me)/.test(href);
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    full = false,
    iconLeft,
    iconRight,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center rounded-full border font-medium',
    'transition-colors duration-200 ease-out',
    'disabled:opacity-50 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    full && 'w-full',
    className
  );

  const content = (
    <>
      {iconLeft}
      <span className="whitespace-nowrap">{children}</span>
      {iconRight}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AsLink, keyof BaseProps>;

    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type = 'button', ...buttonRest } = rest as Omit<AsButton, keyof BaseProps>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
