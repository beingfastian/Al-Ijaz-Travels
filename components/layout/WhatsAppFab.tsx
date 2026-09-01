'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { whatsappUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

/**
 * The floating WhatsApp button.
 *
 * WhatsApp is how UK Umrah enquiries actually happen, so this is on every page
 * and a visitor two thirds down a package page should not have to scroll to start
 * one. A plain link rather than a chat widget: no third-party script, nothing to
 * slow the page, and it still works with JavaScript disabled.
 *
 * On scroll it slides into place from the left and then stays. Two decisions in
 * that sentence worth stating:
 *
 * - It slides in rather than appearing, because a control that materialises
 *   under a moving thumb is easy to hit by accident.
 * - It arrives after a short scroll rather than on load, so it does not compete
 *   with the hero's own WhatsApp button — two identical calls to action on the
 *   first screen read as insistence rather than convenience.
 *
 * With JavaScript off the class never toggles, so it renders in its final
 * position immediately. The animation is an enhancement, not a gate.
 *
 * It reads as a circle with the WhatsApp glyph and no label. The label was
 * "Chat on WhatsApp" beside a lucide chat bubble, which said in words what the
 * brand mark says on sight — and the mark is the thing people actually scan for
 * bottom-right. The name is still on the link for anyone not looking at it.
 */
export function WhatsAppFab() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 160);
    onScroll();
    // Passive: this must never delay a scroll on a mid-range phone.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside aria-label="Quick contact">
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        data-fab={shown ? 'in' : 'out'}
        className={cn(
          'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40',
          'inline-flex size-14 items-center justify-center rounded-full',
          'bg-[#25D366] text-white shadow-float'
        )}
      >
        <WhatsAppIcon size={30} />
        {/* The accessible name. Icon-only controls still need one, and it stays
            the words a screen reader user would expect to hear. */}
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
