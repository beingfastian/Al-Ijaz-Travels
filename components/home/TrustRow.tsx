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
 * Each entry shows its registration number rather than just a logo, because a
 * number can be checked and a logo cannot.
 */
export function TrustRow() {
  if (accreditations.length === 0) return null;

  return (
    <Section
      id="accreditation"
      eyebrow="Accreditation"
      title="Registered and accountable"
      description="Every registration number below can be verified with the issuing authority."
      tone="surface"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {accreditations.map((a) => (
          <li
            key={a.name}
            className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-6"
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
            <span className="text-body-sm text-text-muted">{a.reference}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
