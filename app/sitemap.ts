import type { MetadataRoute } from 'next';
import { packages } from '@/data/packages';
import { site } from '@/data/site';
import { tiers } from '@/data/tiers';
import { months } from '@/data/months';
import { airports } from '@/data/airports';
import { articles } from '@/data/blog';
import { cityHref, monthHref, packageHref, tierHref } from '@/lib/routes';

/**
 * `dynamic = 'force-static'` is required for metadata routes under output:'export'.
 * Next treats robots/sitemap as route handlers, and a route handler is dynamic by
 * default — so without this the export fails outright rather than emitting a file.
 */
export const dynamic = 'force-static';
/** Works under output:'export' — Next writes sitemap.xml into out/ at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Build date as the last-modified stamp for everything that is not an article.
   *
   * Not as precise as a real per-page edit date, and deliberately not faked to
   * look more precise: a catalogue whose prices and availability are rebuilt
   * together genuinely does change as a unit. Articles are the exception — they
   * carry their own dates, so they use them.
   *
   * The reason it is worth emitting at all: Google uses lastmod to decide
   * recrawl order, and a sitemap with none leaves 200-odd package pages competing
   * for attention with no signal about which changed.
   */
  const built = new Date();

  const staticRoutes = [
    '',
    '/packages',
    '/monthly-packages',
    '/city-packages',
    '/ramadan-umrah-packages',
    '/visa',
    '/flights',
    '/hotels',
    '/transport',
    '/travel-insurance',
    '/payment-security',
    '/our-responsibility',
    '/blog',
    '/about',
    '/faq',
    '/contact',
    '/quote',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}/`,
      lastModified: built,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    // Tier hubs sit above the detail pages in priority: they are the pages that
    // rank for "5 star umrah packages", which is the query with volume behind it.
    // Seasonal and departure hubs. Ramadan and the month pages carry the queries
    // with the sharpest intent behind them, so they rank alongside the tier hubs
    // rather than below the detail pages.
    ...months.map((m) => ({
      url: `${site.url}${monthHref(m.key)}`,
      lastModified: built,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...airports.map((a) => ({
      url: `${site.url}${cityHref(a.slug)}`,
      lastModified: built,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/blog/${a.slug}/`,
      // The article's own dates, which are real — unlike the build stamp above.
      lastModified: new Date(a.updated ?? a.published),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tiers.map((t) => ({
      url: `${site.url}${tierHref(t.tier)}`,
      lastModified: built,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...packages.map((pkg) => ({
      url: `${site.url}${packageHref(pkg)}`,
      lastModified: built,
      changeFrequency: 'weekly' as const,
      // Month variants are numerous and individually less important than the
      // evergreen packages they derive from; saying so is more useful to a
      // crawler than claiming all 195 matter equally.
      priority: pkg.month ? 0.6 : 0.8,
    })),
  ];
}
