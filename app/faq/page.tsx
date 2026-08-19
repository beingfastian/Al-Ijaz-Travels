import type { Metadata } from 'next';
import { faqs } from '@/data/faqs';

export const metadata: Metadata = {
  title: 'Umrah FAQ',
  description:
    'Common questions about Umrah visas, hotel distance to the Haram, what packages include, and how booking works.',
};

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-container padding-container flex flex-col gap-8 py-16">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Questions</p>
          <h1 className="text-display">Umrah, answered plainly</h1>
        </div>
        <dl className="prose-column flex flex-col divide-y divide-border">
          {faqs.map((f) => (
            <div key={f.question} className="flex flex-col gap-2 py-6">
              <dt className="font-serif text-subheading text-green-900">{f.question}</dt>
              <dd className="text-body text-text-muted">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
