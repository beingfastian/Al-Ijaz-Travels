import type { Package, Tier } from './types.ts';

/* ============================================================================
 * ROUTES
 *
 * Every internal URL is built here rather than interpolated at the call site.
 *
 * The reason is this chunk: package detail pages moved from /packages/[slug]/ to
 * /packages/[tier]/[slug]/ to match the URL shape the audience already reaches
 * for. With the path written inline in cards, the price rail, the sitemap and
 * three hub pages, that move means finding every one of them and hoping. With it
 * written once, it is a single edit — and a link that still points at the old
 * shape becomes a typecheck error rather than a 404 discovered by a visitor.
 *
 * Trailing slashes are not optional. `trailingSlash: true` means /packages/x is
 * a redirect and /packages/x/ is the page; on a static host the redirect may not
 * exist at all, so the slash goes in here where it cannot be forgotten.
 * ========================================================================== */

/** `/packages/5-star/` */
export function tierHref(tier: Tier): string {
  return `/packages/${tier}-star/`;
}

/** `/packages/5-star/10-nights-5-star-umrah-package/` */
export function packageHref(pkg: Package): string {
  return `${tierHref(pkg.tier)}${pkg.slug}/`;
}

/** The listing, optionally pre-filtered. */
export function listingHref(query?: Record<string, string | number | undefined>): string {
  if (!query) return '/packages/';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `/packages/?${qs}` : '/packages/';
}

/* ------------------------------------------------------------------- hubs */

/**
 * Hub slugs carry the `-umrah-packages` suffix because that is the URL shape the
 * audience already searches for — "january umrah packages", "manchester umrah
 * packages" — and it is what the competitor ranks on. The route segment is the
 * whole slug, so these two helpers are the only place the suffix is written.
 */
export function monthHref(month: string): string {
  return `/monthly-packages/${month}-umrah-packages/`;
}

export function cityHref(citySlug: string): string {
  return `/city-packages/${citySlug}-umrah-packages/`;
}

/** Recover the key from a route segment, or null if the shape is wrong. */
export function monthFromSegment(segment: string): string | null {
  const match = /^([a-z]+)-umrah-packages$/.exec(segment);
  return match?.[1] ?? null;
}

export function cityFromSegment(segment: string): string | null {
  const match = /^([a-z-]+?)-umrah-packages$/.exec(segment);
  return match?.[1] ?? null;
}

/** The quote flow, optionally carrying the package the visitor came from. */
export function quoteHref(pkg?: Package): string {
  return pkg ? `/quote/?package=${pkg.slug}` : '/quote/';
}
