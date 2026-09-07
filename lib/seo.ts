import { site } from '@/data/site';
import { accreditations } from '@/data/trust';
import { IMAGES, type GeneratedImage } from '@/data/images.generated';

/* ============================================================================
 * STRUCTURED DATA
 *
 * One entity graph for the whole site, assembled here rather than per page.
 *
 * The reason is `@id`. Google resolves a JSON-LD graph by identifier, so if the
 * business is described once at a stable `@id` and every other node points at
 * that id, the whole site describes one organisation. Re-declaring the business
 * inline on each page — which is what a page-by-page approach produces — gives a
 * crawler a dozen similar-but-not-identical organisations and no way to tell
 * whether they are the same one. That is the difference between an entity search
 * engines can attach a knowledge panel to and a pile of unrelated markup.
 *
 * ⚠ Everything here is a public claim about a real business, so this file is
 * subject to the same rule as data/trust.ts: nothing is invented, and a field
 * whose value is still a placeholder is omitted rather than published. See
 * `isPlaceholder` below for why that guard is stricter than it looks.
 * ========================================================================== */

/**
 * Stable node identifiers. Fragment-suffixed rather than bare URLs so a node id
 * can never collide with the URL of an actual page.
 */
export const ORGANISATION_ID = `${site.url}/#organisation`;
export const WEBSITE_ID = `${site.url}/#website`;

/** A site-relative path as the absolute URL structured data requires. */
export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${site.url}${path}`;
}

/**
 * Whether a configured value is still one of the launch placeholders.
 *
 * Empty strings and the `.invalid` addresses are the obvious cases. The `+92`
 * check is the one that matters: `site.contact.phone` is currently a Pakistani
 * test handset (see the warning in data/site.ts), and this site sells to the UK.
 * A rendered placeholder is a visible mistake someone catches; the same
 * placeholder in structured data is one Google may publish beside the business
 * name in a search result, where nobody on this project would ever see it.
 *
 * Written as a positive test for a UK number rather than a blocklist of known
 * bad ones, so the guard passes only once a real +44 line lands.
 */
function isPlaceholder(value: string): boolean {
  const v = value.trim();
  return v === '' || v.includes('example.invalid') || v.startsWith('+92');
}

function include(value: string): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}

/**
 * The business.
 *
 * `TravelAgency` rather than plain `Organization` or `LocalBusiness`: it is the
 * narrowest type schema.org offers that is true, it inherits everything
 * LocalBusiness provides, and the specificity is what lets a crawler classify
 * the site as a travel seller rather than a generic company with pages about
 * travel.
 *
 * No `aggregateRating` and no `review`, deliberately. The site has testimonials,
 * but self-serving review markup on your own organisation is against Google's
 * structured data policy and is the single most common reason a rich result gets
 * a manual action. The testimonials stay as page content, where they belong.
 */
export function organisationNode() {
  const { contact, company } = site;
  const social = Object.values(site.social).filter((handle) => handle !== '');

  return {
    '@type': 'TravelAgency',
    '@id': ORGANISATION_ID,
    name: site.name,
    legalName: include(company.legalName),
    description: site.tagline,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon.png'),
    },
    image: absoluteUrl(SHARE_IMAGE),
    telephone: include(contact.phone),
    email: include(contact.email),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressCountry: 'GB',
    },
    vatID: include(company.vatNumber),
    /**
     * Where the customers are, not where the destination is. A UK agency selling
     * Umrah serves the UK; saying "Saudi Arabia" here — which reads plausibly —
     * would tell search engines to surface this business to pilgrims already in
     * Makkah, who cannot buy from it.
     */
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    currenciesAccepted: site.currency,
    /**
     * The credentials, from the same guarded source the badges render from — so
     * structured data can never claim cover that the visible page does not.
     */
    hasCredential: accreditations.length
      ? accreditations.map((a) => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Accreditation',
          name: a.name,
        }))
      : undefined,
    /**
     * Omitted entirely while the handles are unset — see data/site.ts. An empty
     * array is not the same as absence here: it asserts that the business has no
     * profiles anywhere, which is a claim, and a wrong one once the accounts exist.
     */
    sameAs: social.length > 0 ? social : undefined,
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: site.name,
    description: site.tagline,
    publisher: { '@id': ORGANISATION_ID },
    inLanguage: site.locale,
  };
}

/* ------------------------------------------------------------- breadcrumbs */

export interface Crumb {
  name: string;
  /** Site-relative, with the trailing slash routes/ produces. */
  path: string;
}

/**
 * A breadcrumb trail for a page nested below the top level.
 *
 * Worth having on this site specifically because the package URLs are three
 * segments deep — /packages/5-star/10-nights-5-star-umrah-package/ — and without
 * this Google renders that raw path in the result, which is both ugly and
 * uninformative. With it, the result reads "Umrah Packages › 5-Star › 10 Nights".
 *
 * The home crumb is prepended here rather than passed by every caller, since
 * forgetting it on one page is the failure mode and it is never absent.
 */
export function breadcrumbNode(trail: Crumb[]) {
  const full: Crumb[] = [{ name: 'Home', path: '/' }, ...trail];

  return {
    '@type': 'BreadcrumbList',
    itemListElement: full.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/* ------------------------------------------------------------------- share */

/**
 * The Open Graph card image, generated by scripts/og.mjs into public/.
 *
 * One image for the whole site rather than per page. Per-page cards would be
 * better, but they need either a running server or 200+ generated files for the
 * package catalogue alone; a single well-made card beats the blank grey box a
 * missing og:image produces in WhatsApp, which is where this audience shares
 * links.
 */
export const SHARE_IMAGE = '/og.jpg';

export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

/**
 * The `openGraph.images` value, for any page that declares its own `openGraph`.
 *
 * ⚠ Not optional, and not redundant with the root layout. Next merges metadata
 * shallowly: a page that sets `openGraph: { title, description, type }` replaces
 * the parent's whole `openGraph` object rather than extending it, so the layout's
 * image is dropped. That silently cost the share card on all 195 package pages
 * and all 12 articles — every page that had bothered to write a better og:title
 * was exactly the page that lost its image.
 *
 * Spread this into any page-level `openGraph`. scripts/verify-export.mjs fails
 * the build if an indexable page ends up with no og:image, which is what caught
 * this in the first place.
 */
export function shareImages() {
  return [
    {
      url: SHARE_IMAGE,
      width: SHARE_IMAGE_WIDTH,
      height: SHARE_IMAGE_HEIGHT,
      alt: `${site.name} — ${site.tagline}`,
    },
  ];
}

/**
 * The absolute URL of a photo from the build-time manifest, for the `image`
 * field of a structured-data node.
 *
 * Reads the manifest's own `fallback` rather than composing `/img/<key>-1200.webp`
 * by hand. Two reasons, and the second is the one that bites: the widths a photo
 * actually has depend on how large its source was, so an interpolated 1200 can
 * 404 for a smaller original — and social scrapers and Google's image crawler
 * are far more conservative than a browser, so the JPEG the manifest already
 * nominates is the format most certain to be read.
 */
export function imageUrl(key: string): string | undefined {
  const asset: GeneratedImage | undefined = (IMAGES as Record<string, GeneratedImage>)[key];
  return asset ? absoluteUrl(asset.fallback) : undefined;
}
/**
 * `og:locale` wants an underscored POSIX-style locale (`en_GB`); everything else
 * on the site — `lang`, hreflang, `Intl` formatting — wants the hyphenated BCP 47
 * form (`en-GB`). Derived rather than written out, because the two were allowed
 * to drift once already: the layout shipped `en_PK` against an `en-GB` site.
 */
export const OG_LOCALE = site.locale.replace('-', '_');
