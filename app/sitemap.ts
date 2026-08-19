import type { MetadataRoute } from 'next';
import { packages } from '@/data/packages';
import { site } from '@/data/site';

/**
 * `dynamic = 'force-static'` is required for metadata routes under output:'export'.
 * Next treats robots/sitemap as route handlers, and a route handler is dynamic by
 * default — so without this the export fails outright rather than emitting a file.
 */
export const dynamic = 'force-static';
/** Works under output:'export' — Next writes sitemap.xml into out/ at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/packages', '/about', '/faq', '/contact', '/quote'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}/`,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...packages.map((pkg) => ({
      url: `${site.url}/packages/${pkg.slug}/`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
