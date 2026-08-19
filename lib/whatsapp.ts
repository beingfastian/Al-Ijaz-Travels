import { site } from '@/data/site';

/**
 * A static export has no server and therefore no route handler, so the quote flow
 * cannot email anything itself. The WhatsApp handoff is the primary path instead —
 * which also matches how Umrah agencies actually operate: consultation first,
 * booking second.
 *
 * The message is composed to be actionable on arrival. An agent should be able to
 * reply with availability without asking three follow-up questions first, so every
 * field the consultant needs goes in the text.
 */

export interface QuoteMessage {
  packageName?: string;
  packageUrl?: string;
  travellers?: { adults: number; children: number; infants: number };
  departureMonth?: string;
  sharing?: string;
  name?: string;
  phone?: string;
  notes?: string;
}

function lines(msg: QuoteMessage): string[] {
  const out: string[] = [`${site.whatsappGreeting}, I would like a quote for Umrah.`];

  if (msg.packageName) out.push('', `Package: ${msg.packageName}`);
  if (msg.packageUrl) out.push(`Link: ${msg.packageUrl}`);

  if (msg.travellers) {
    const { adults, children, infants } = msg.travellers;
    const parts = [`${adults} adult${adults === 1 ? '' : 's'}`];
    if (children > 0) parts.push(`${children} child${children === 1 ? '' : 'ren'}`);
    if (infants > 0) parts.push(`${infants} infant${infants === 1 ? '' : 's'}`);
    out.push('', `Travellers: ${parts.join(', ')}`);
  }

  if (msg.departureMonth) out.push(`Preferred departure: ${msg.departureMonth}`);
  if (msg.sharing) out.push(`Room sharing: ${msg.sharing}`);
  if (msg.name) out.push('', `Name: ${msg.name}`);
  if (msg.phone) out.push(`Phone: ${msg.phone}`);
  if (msg.notes) out.push('', `Notes: ${msg.notes}`);

  return out;
}

/** Build the wa.me deep link. With no argument, a bare greeting. */
export function whatsappUrl(msg: QuoteMessage = {}): string {
  const text = lines(msg).join('\n');
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** The same message as plain text — for the review step, and for copy-to-clipboard. */
export function whatsappMessagePreview(msg: QuoteMessage): string {
  return lines(msg).join('\n');
}
