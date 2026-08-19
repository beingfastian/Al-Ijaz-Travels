import type { Metadata } from 'next';
import { SeasonalBanner } from '@/components/home/SeasonalBanner';
import { Hero } from '@/components/home/Hero';
import { PhotoBand } from '@/components/home/PhotoBand';
import { AirportPicker } from '@/components/home/AirportPicker';
import { FeaturedPackages } from '@/components/home/FeaturedPackages';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { TrustRow } from '@/components/home/TrustRow';
import { Process } from '@/components/home/Process';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';

/**
 * Home page order follows the questions a visitor actually asks, in sequence:
 * is this for me (hero) → what can I buy (packages) → why you (comparison,
 * accreditation) → how does this work (process) → what am I still unsure about
 * (FAQ).
 */
/**
 * Home inherits its title and description from the root layout — the site
 * default is exactly right here — but it still needs its own canonical. Without
 * one, `/`, `/?utm_source=…` and any other decorated variant are separate
 * indexable documents as far as a crawler is concerned.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <SeasonalBanner />
      <Hero />
      <PhotoBand />
      <AirportPicker />
      <FeaturedPackages />
      <ComparisonTable />
      <TrustRow />
      <Process />
      <Testimonials />
      <Faq />
    </>
  );
}
