import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { accreditations } from '@/data/trust';
import { Section } from '@/components/ui/Section';

/**
 * Accreditation row.
 *
 * Renders nothing at all until `accreditations` in data/trust.ts is populated
 * with credentials Al Ijaz genuinely holds. An empty strip is better than a
 * placeholder badge — and a fabricated one is a legal problem, not a design one.
 *
 * The registration numbers used to print under each name. They were removed on
 * client instruction, so the cards now carry the credential alone. The entries
 * are still gated on holding the numbers — see data/trust.ts.
 */
export function TrustRow() {
  if (accreditations.length === 0) return null;

  return (
    <Section
      id="accreditation"
      eyebrow="Accreditation"
      title="Registered and accountable"
      description="Both credentials are held with the issuing authority and can be confirmed on request."
      tone="surface"
      centered
    >
      {/* Wrapping flex rather than a fixed column grid. The list is data-driven,
          and a four-column grid holding two entries left-flushes them under a
          centred heading, which reads as an alignment mistake. justify-center
          centres whatever the count happens to be; the fixed card width keeps
          two cards from stretching to half the viewport each. */}
      <ul className="flex flex-wrap justify-center gap-4">
        {accreditations.map((a) => (
          <li
            key={a.name}
            className="flex w-full flex-col items-center gap-3 rounded-panel border border-border bg-surface p-6 text-center sm:w-64"
          >
            {a.logo ? (
              <Image
                src={a.logo}
                alt=""
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <ShieldCheck size={28} className="text-gold-text" aria-hidden />
            )}
            <span className="font-serif text-subheading text-green-900">{a.name}</span>
            {a.reference && <span className="text-body-sm text-text-muted">{a.reference}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
