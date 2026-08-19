import { Info } from 'lucide-react';
import type { Block } from '@/data/blog';

/**
 * Renders the typed content blocks.
 *
 * One component for the whole blog means an article cannot produce invalid
 * markup or drift from the type scale — which is the reason for structured
 * blocks over MDX. The cost is that adding a block type is a code change; on
 * twelve articles that is a good trade.
 */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="text-body-lg text-text">
                {block.text}
              </p>
            );

          case 'ul':
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-5 marker:text-gold-500">
                {block.items.map((item) => (
                  <li key={item} className="text-body-lg text-text">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={i} className="flex list-decimal flex-col gap-2 pl-5 marker:text-gold-text">
                {block.items.map((item) => (
                  <li key={item} className="text-body-lg text-text">
                    {item}
                  </li>
                ))}
              </ol>
            );

          case 'note':
            return (
              <aside
                key={i}
                className="flex items-start gap-3 rounded-panel border border-gold-300 bg-gold-50 p-5"
              >
                <Info size={18} className="mt-0.5 shrink-0 text-gold-text" aria-hidden />
                <p className="text-body text-text">{block.text}</p>
              </aside>
            );
        }
      })}
    </>
  );
}
