import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Noto_Naskh_Arabic } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/data/site';
import './globals.css';

/**
 * Fonts via next/font, which self-hosts them at build time. The base repo pulls
 * them with an @import inside globals.css — render-blocking, and a third-party
 * request on every page load.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/** Arabic accent phrases only — not body text. */
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-naskh',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Umrah Packages from Pakistan`,
    template: `%s · ${site.name}`,
  },
  description:
    'Umrah packages with hotels rated by their actual walking distance to the Haram. Per-person pricing, stated inclusions and exclusions, and a consultant before you commit.',
  metadataBase: new URL(site.url),
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_PK',
  },
};

/**
 * No maximumScale or userScalable here — locking zoom fails WCAG 1.4.4, and this
 * audience skews older. The Tripix reference gets this wrong; do not copy it.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#162D23',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${playfair.variable} ${inter.variable} ${naskh.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-green-900 focus:px-5 focus:py-2 focus:text-sand-50"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
