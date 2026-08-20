'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
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
          'inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5',
          'font-medium text-[#0b1f14] shadow-float sm:px-5'
        )}
      >
        <MessageCircle size={22} aria-hidden />
        <span className="hidden text-body sm:inline">Chat on WhatsApp</span>
        <span className="sr-only sm:hidden">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
