import { bookingSteps } from '@/data/site';
import { Section } from '@/components/ui/Section';

/**
 * How booking works.
 *
 * Numbered because these genuinely are a sequence — you cannot request a quote
 * before choosing a package. Decorative numbering on a non-sequence is noise;
 * here the order carries the information, so it is an <ol>.
 */
export function Process() {
  return (
    <Section
      id="process"
      eyebrow="How booking works"
      title="Four steps, no surprises"
      tone="dark"
      pattern
    >
      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {bookingSteps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3">
            <span
              className="flex-center size-10 rounded-full border border-gold-500 font-serif text-body-lg text-gold-300"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="font-serif text-subheading text-sand-50">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="text-body-sm text-gold-100">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
