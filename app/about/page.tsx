import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = {
  alternates: { canonical: '/about/' },
  title: 'About',
  description: `${site.name} arranges Umrah from the UK, with hotels rated by real walking distance to the Haram.`,
};

export default function AboutPage() {
  return (
    <section className="max-container padding-container flex flex-col gap-6 py-16">
      <p className="eyebrow">About</p>
      <h1 className="text-display">{site.name}</h1>
      <div className="prose-column flex flex-col gap-5 text-body-lg text-text-muted">
        <p>
          {/* TODO(client): replace with the real company story, founding year, and
              the names of the people travellers will actually speak to. */}
          Company profile to be supplied by Al Ijaz Travel.
        </p>
      </div>
    </section>
  );
}
