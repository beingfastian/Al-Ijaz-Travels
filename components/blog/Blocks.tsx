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
            /*
              list-outside (the default) with padding is what gives a hanging
              indent: the marker sits in the gutter and every wrapped line aligns
              with the first word, not under the bullet. list-inside would tuck
              the marker into the text flow and leave wrapped lines hanging back
              under it, which is the usual way list indentation goes wrong.
            */
            return (
              <ul
                key={i}
                className="flex list-outside list-disc flex-col gap-2 pl-6 marker:text-gold-500"
              >
                {block.items.map((item) => (
                  <li key={item} className="text-body-lg text-text">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol
                key={i}
                className="flex list-outside list-decimal flex-col gap-2 pl-7 marker:font-medium marker:text-gold-text"
              >
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
