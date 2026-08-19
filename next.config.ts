import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * True static export. Three settings, and all three matter from the first commit —
   * the base repo (adrianhajdin/travel_ui_ux) sets only the first, which is why its
   * export ships 33 broken image URLs: `next build` succeeds, then every <Image>
   * emits /_next/image?url=... and nothing serves that path on a static host.
   */
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
