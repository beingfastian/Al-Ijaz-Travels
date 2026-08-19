import { Check, Minus } from 'lucide-react';
import { comparison } from '@/data/trust';
import { Section } from '@/components/ui/Section';

/**
 * The "why choose us" comparison.
 *
 * Two deliberate choices. First, it compares against how the category typically
 * behaves rather than a named competitor — naming one invites a dispute and
 * dates the page. Second, it is a real <table> with proper headers, because it
 * is genuinely tabular data; the base repo builds its equivalent from nested
 * divs, which reads as a meaningless run-on to a screen reader.
 *
 * On narrow screens it becomes a stack of labelled pairs rather than a
 * horizontally scrolling table — comparisons are unreadable when you cannot see
 * both columns at once.
 */
export function ComparisonTable() {
  return (
    <Section
      id="why-us"
      eyebrow="Why us"
      title="The difference is what we tell you before you pay"
      description="Every claim below is checkable against any package page on this site."
      tone="surface"
    >
      {/* Desktop: true table */}
      <div className="hidden overflow-x-auto rounded-panel border border-border bg-surface md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            How Al Ijaz Travel compares to typical Umrah agency practice
          </caption>
          <thead>
            <tr className="border-b border-border bg-surface-sunk">
              <th scope="col" className="p-5 text-label uppercase tracking-[0.14em] text-text-muted">
                What matters
              </th>
              <th scope="col" className="p-5 text-label uppercase tracking-[0.14em] text-text-muted">
                Typically
              </th>
              <th scope="col" className="p-5 text-label uppercase tracking-[0.14em] text-gold-text">
                With Al Ijaz
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.point} className="border-b border-border last:border-b-0">
                <th scope="row" className="p-5 align-top font-serif text-subheading text-green-900">
                  {row.point}
                </th>
                <td className="p-5 align-top text-body-sm text-text-muted">
                  <span className="flex gap-2.5">
                    <Minus size={16} className="mt-1 shrink-0 text-sand-400" aria-hidden />
                    {row.typical}
                  </span>
                </td>
                <td className="p-5 align-top text-body-sm">
                  <span className="flex gap-2.5">
                    <Check size={16} className="mt-1 shrink-0 text-green-700" aria-hidden />
                    {row.ours}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked pairs, so both sides stay visible together */}
      <ul className="flex flex-col gap-4 md:hidden">
        {comparison.map((row) => (
          <li
            key={row.point}
            className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5"
          >
            <h3 className="font-serif text-subheading text-green-900">{row.point}</h3>
            <p className="flex gap-2.5 text-body-sm text-text-muted">
              <Minus size={16} className="mt-1 shrink-0 text-sand-400" aria-hidden />
              <span>
                <span className="mb-0.5 block text-label uppercase tracking-[0.14em]">
                  Typically
                </span>
                {row.typical}
              </span>
            </p>
            <p className="flex gap-2.5 text-body-sm">
              <Check size={16} className="mt-1 shrink-0 text-green-700" aria-hidden />
              <span>
                <span className="mb-0.5 block text-label uppercase tracking-[0.14em] text-gold-text">
                  With Al Ijaz
                </span>
                {row.ours}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
