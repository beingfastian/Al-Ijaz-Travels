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
  tagline: 'Umrah, arranged with care',

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

  contact: {
    // TODO(client): real WhatsApp business number in E.164 without the +.
    whatsapp: '000000000000',
    // TODO(client): real numbers and inbox.
    phone: '+92 000 0000000',
    email: 'info@example.invalid',
    // TODO(client): real office address.
    address: 'Office address, City, Pakistan',
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

export const navLinks = [
  { href: '/packages/', label: 'Packages' },
  { href: '/about/', label: 'About' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
] as const;

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
