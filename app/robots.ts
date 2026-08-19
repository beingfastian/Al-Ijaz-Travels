import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/**
 * `dynamic = 'force-static'` is required for metadata routes under output:'export'.
 * Next treats robots/sitemap as route handlers, and a route handler is dynamic by
 * default — so without this the export fails outright rather than emitting a file.
 */
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
