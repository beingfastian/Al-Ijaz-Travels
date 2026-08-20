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
    '/blog',
    '/about',
    '/faq',
    '/contact',
    '/quote',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}/`,
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
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...airports.map((a) => ({
      url: `${site.url}${cityHref(a.slug)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/blog/${a.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tiers.map((t) => ({
      url: `${site.url}${tierHref(t.tier)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...packages.map((pkg) => ({
      url: `${site.url}${packageHref(pkg)}`,
      changeFrequency: 'weekly' as const,
      // Month variants are numerous and individually less important than the
      // evergreen packages they derive from; saying so is more useful to a
      // crawler than claiming all 195 matter equally.
      priority: pkg.month ? 0.6 : 0.8,
    })),
  ];
}
