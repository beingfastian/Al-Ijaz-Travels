/* ============================================================================
 * SITE CONFIGURATION
 *
 * ⚠ Placeholders marked TODO must be replaced before launch. They are written to
 * be conspicuous rather than plausible, so none of them can ship unnoticed.
 * ========================================================================== */

/** Accreditation badges live in data/trust.ts — they are a trust signal, not config. */
export const site = {
  name: 'Al Ijaz Travel',
  /** Arabic wordmark from the logo. Rendered with lang="ar" so it gets the
   *  Naskh face and RTL direction — see the [lang='ar'] rule in globals.css. */
  nameArabic: 'الإعجاز',
  tagline: 'Umrah from the UK, arranged with care',

  /**
   * Canonical origin. Read at build time, because a static export bakes absolute
   * URLs into canonical tags, sitemap.xml, robots.txt and JSON-LD — there is no
   * server later to correct them.
   *
   * Resolution order:
   *   NEXT_PUBLIC_SITE_URL              the real domain, once it exists — set this
   *   VERCEL_PROJECT_PRODUCTION_URL     supplied by Vercel, so previews self-describe
   *   the placeholder                   local builds, and a loud one on purpose
   *
   * TODO(client): set NEXT_PUBLIC_SITE_URL to the real domain before launch. Until
   * then a deployed build describes itself by its deployment URL, which is wrong but
   * at least reachable — unlike example.invalid, which is not.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://example.invalid'),

  /** UK market. Drives currency, date formatting and hreflang. */
  locale: 'en-GB',
  currency: 'GBP',

  contact: {
    // TODO(client): real WhatsApp business number in E.164 without the +.
    // Client is supplying this separately — see PLAN-UK.md D8.
    whatsapp: '000000000000',
    // TODO(client): real UK numbers and inbox.
    phone: '+44 000 000 0000',
    email: 'info@example.invalid',
    // TODO(client): real UK registered office address, including postcode.
    address: 'Office address, City, United Kingdom',
  },

  /**
   * UK company identity. Legally required on a trading website under the
   * Companies Act and the E-Commerce Regulations — a UK travel site without a
   * company number and registered address is non-compliant, not merely sparse.
   *
   * TODO(client): company number, VAT number, registered office. Blocks Chunk 9.
   */
  company: {
    legalName: '',
    companyNumber: '',
    vatNumber: '',
  },

  /**
   * ⚠ ACCREDITATION — LEGAL, NOT DECORATIVE.
   *
   * Selling flight-inclusive packages without an ATOL is a criminal offence under
   * the Civil Aviation (ATOL) Regulations, and displaying an ATOL number you do
   * not hold is separately actionable by the CAA. The client has confirmed these
   * are held; nothing renders until the real numbers and artwork arrive.
   *
   * TODO(client): ATOL number, IATA number, and the official badge artwork.
   * `TrustRow` and the footer render nothing while these are empty.
   */
  accreditation: {
    atolNumber: '',
    iataNumber: '',
  },

  /**
   * The opening line of the WhatsApp handoff. Al Habib does this well and it is
   * worth keeping: the greeting signals who the site is for before a word of
   * marketing copy does.
   */
  whatsappGreeting: 'Assalamu Alaikum',


  social: {
    // TODO(client): real handles. Omit any the business does not maintain —
    // a dead social link costs more trust than a missing one.
    facebook: '',
    instagram: '',
    youtube: '',
  },
} as const;

/**
 * Primary navigation, matching the competitor's information architecture.
 *
 * Al Habib leads with the three package axes — tier, month, city — because that
 * is genuinely how this audience searches: "5 star umrah", "ramadan umrah 2027",
 * "umrah packages from manchester". Visa is ours, and it is the one page in this
 * list a competitor does not have.
 */
/**
 * `ready: false` means the route is part of the target information architecture
 * but has not been built yet, so it is filtered out of every rendered menu.
 *
 * The alternative — adding links as pages land — loses the record of what the
 * navigation is meant to become. The alternative to *that* is what actually
 * happened here: the full list shipped, four routes did not exist, and every
 * page quietly 404'd on prefetch while the export check reported success,
 * because it only verifies asset URLs and not `<a href>` targets. Both holes are
 * now closed — see `assertInternalLinks` in scripts/verify-export.mjs.
 *
 * Flip these to `true` as Chunks 6, 7 and 8 land.
 */
export const allNavLinks = [
  { href: '/packages/', label: 'Umrah Packages', ready: true },
  { href: '/monthly-packages/', label: 'Monthly Packages', ready: true },
  { href: '/city-packages/', label: 'City Packages', ready: true },
  { href: '/ramadan-umrah-packages/', label: 'Ramadan Packages', ready: true },
  { href: '/visa/', label: 'Visas', ready: false },
] as const;

export const navLinks = allNavLinks.filter((l) => l.ready);

/** Secondary nav — present in the footer and the mobile drawer, not the top bar. */
export const allSecondaryNavLinks = [
  { href: '/about/', label: 'About Us', ready: true },
  { href: '/blog/', label: 'Blog', ready: false },
  { href: '/faq/', label: 'FAQ', ready: true },
  { href: '/contact/', label: 'Contact Us', ready: true },
] as const;

export const secondaryNavLinks = allSecondaryNavLinks.filter((l) => l.ready);

/**
 * Legal and assurance pages. UK travel selling carries real disclosure duties,
 * so these are not optional — but none are built yet (Chunk 9), and a link to a
 * missing Terms page is worse than no link at all.
 */
export const allLegalNavLinks = [
  { href: '/terms-and-conditions/', label: 'Terms and Conditions', ready: false },
  { href: '/privacy-policy/', label: 'Privacy Policy', ready: false },
  { href: '/travel-insurance/', label: 'Travel Insurance', ready: false },
  { href: '/payment-security/', label: 'Payment Security', ready: false },
  { href: '/our-responsibility/', label: 'Our Responsibility', ready: false },
] as const;

export const legalNavLinks = allLegalNavLinks.filter((l) => l.ready);

/** Steps shown in the "how booking works" section on the home page. */
export const bookingSteps = [
  {
    title: 'Choose a package',
    detail:
      'Compare tiers, nights, and how far each hotel actually is from the Haram. Every price on the site is per person, with the sharing basis stated.',
  },
  {
    title: 'Request a quote',
    detail:
      'Tell us who is travelling and when. It takes about two minutes and does not commit you to anything.',
  },
  {
    title: 'Speak to a consultant',
    detail:
      'We confirm availability, answer questions, and adjust the package where you need it — hotel, sharing basis, or dates.',
  },
  {
    title: 'Confirm and travel',
    detail:
      'Visa processing and documents are handled for you. Your group leader meets you before departure.',
  },
] as const;
