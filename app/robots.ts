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
    /**
     * Everything crawlable, deliberately — including the two pages that must not
     * be indexed.
     *
     * /specimen/ and /quote/sent/ are both `noindex` in their page metadata, and
     * that is the whole mechanism. Adding a robots.txt `disallow` for them would
     * be actively worse: a disallowed page is never fetched, so the noindex is
     * never read, and a URL that is blocked but discovered from a link elsewhere
     * can still be indexed — as a bare URL with no snippet. Google's own guidance
     * is explicit that the two directives should not be combined for this reason.
     *
     * Crawl budget is not an argument here either. There are two such pages
     * against ~250 real ones, and neither is linked from anywhere on the site.
     */
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
