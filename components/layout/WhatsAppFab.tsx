import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * The floating WhatsApp button.
 *
 * The competitor has one on every page and it is the right call for this market:
 * WhatsApp is how UK Umrah enquiries actually happen, and a visitor two thirds
 * down a package page should not have to scroll anywhere to start one.
 *
 * Positioned bottom-right with a safe-area inset so it clears the iOS home bar,
 * and it is a real link rather than a script widget — no third-party JavaScript,
 * nothing to slow the page, and it works with JavaScript disabled.
 */
export function WhatsAppFab() {
  return (
    <aside aria-label="Quick contact">
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 font-medium text-[#0b1f14] shadow-float transition-transform hover:scale-105 sm:px-5"
    >
      <MessageCircle size={22} aria-hidden />
      <span className="hidden text-body sm:inline">Chat on WhatsApp</span>
      <span className="sr-only sm:hidden">Chat on WhatsApp</span>
    </a>
    </aside>
  );
}
