// Relative, not the '@/' alias, so this module can be unit tested with
// `node --test` — the alias is a bundler concern and node cannot resolve it.
// The message this builds is the one artefact the business actually acts on,
// so it is worth being able to assert its shape.
import { site } from '../data/site.ts';

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
  /**
   * Free text as the visitor wrote it, e.g. "2 adults & 2 kids".
   *
   * Was a structured {adults, children, infants} count. The form now asks a
   * single free-text question, matching the competitor's, because a lone integer
   * could not express children at all — the old code hard-coded zero of them.
   */
  passengers?: string;
  name?: string;
  phone?: string;
  email?: string;
  /** Free text from the visitor ONLY. Structured fields have their own lines. */
  notes?: string;
}

function lines(msg: QuoteMessage): string[] {
  const out: string[] = [`${site.whatsappGreeting}, I would like a quote for Umrah.`];

  if (msg.packageName) out.push('', `Package: ${msg.packageName}`);
  if (msg.packageUrl) out.push(`Link: ${msg.packageUrl}`);

  if (msg.passengers) out.push('', `Passengers: ${msg.passengers}`);

  if (msg.name) out.push('', `Name: ${msg.name}`);
  if (msg.phone) out.push(`Phone: ${msg.phone}`);
  // Beside the phone number, not buried in the notes. It is a way to reach the
  // enquirer, and a consultant scanning for contact details should find both in
  // the same place.
  if (msg.email) out.push(`Email: ${msg.email}`);

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
