import { faqs } from '@/data/faqs';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/**
 * FAQ preview — the first few questions, with the full set on /faq/.
 *
 * Built on <details>/<summary> rather than a JS accordion: it is keyboard
 * accessible and expandable with zero client JavaScript, which keeps this a
 * server component. The answers are in the HTML either way, so nothing is
 * hidden from crawlers.
 *
 * FAQPage JSON-LD lives on /faq/ only. Emitting the same structured data twice
 * across two URLs invites a duplicate-content flag rather than helping.
 */
const PREVIEW_COUNT = 4;

export function Faq() {
  const shown = faqs.slice(0, PREVIEW_COUNT);

  return (
    <Section
      id="faq"
      eyebrow="Questions"
      title="Answered plainly"
      action={
        <Button href="/faq/" variant="secondary">
          All questions
        </Button>
      }
    >
      <div className="prose-column flex flex-col divide-y divide-border border-y border-border">
        {shown.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-serif text-subheading text-green-900 marker:hidden">
              {f.question}
              <span
                className="mt-1 shrink-0 text-gold-500 transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-body text-text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
