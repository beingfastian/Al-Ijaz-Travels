import { test } from 'node:test';
import assert from 'node:assert/strict';

import { whatsappUrl, whatsappMessagePreview, type QuoteMessage } from './whatsapp.ts';
import { site } from '../data/site.ts';

/**
 * The WhatsApp message is the only thing a completed enquiry actually produces.
 *
 * There is no server, no route handler and no email — a static export cannot send
 * anything itself, so this deep link IS the lead. If its shape breaks, nothing
 * throws, no test goes red and no page looks wrong: a consultant simply receives
 * a message missing the airport, or with three unrelated facts crammed under one
 * label, and has to ask follow-up questions. That is why the format is asserted
 * here rather than left to a screenshot.
 *
 * The faults these lock out were all real:
 *   - the departure airport and the email address concatenated into `notes`
 *   - the airport sent as a bare IATA code
 *   - the month and sharing basis sent as raw form values ("april", "quad")
 */

const FULL: QuoteMessage = {
  packageName: '10 Nights 5-Star Umrah',
  passengers: '2 adults & 2 children',
  name: 'Fatima Bibi',
  phone: '+44 7911 123456',
  email: 'fatima@example.com',
  notes: 'Travelling with my mother, 74, who needs a wheelchair.',
};

test('every field the consultant needs reaches the message, each on its own line', () => {
  const lines = whatsappMessagePreview(FULL).split('\n');

  assert.equal(lines[0], `${site.whatsappGreeting}, I would like a quote for Umrah.`);
  for (const expected of [
    'Package: 10 Nights 5-Star Umrah',
    'Passengers: 2 adults & 2 children',
    'Name: Fatima Bibi',
    'Phone: +44 7911 123456',
    'Email: fatima@example.com',
    'Notes: Travelling with my mother, 74, who needs a wheelchair.',
  ]) {
    assert.ok(lines.includes(expected), `missing line: ${expected}`);
  }
});

test('the airport and email are NOT folded into the notes line', () => {
  // The exact regression: "Notes: Departing from: MAN\nEmail: ...\n<free text>".
  const notesLine = whatsappMessagePreview(FULL)
    .split('\n')
    .find((l) => l.startsWith('Notes:'))!;
  assert.ok(notesLine, 'there should be a notes line');
  assert.ok(!notesLine.includes('Departing from'), 'airport must have its own line');
  assert.ok(!notesLine.includes('Email:'), 'email must have its own line');
  assert.equal(notesLine, `Notes: ${FULL.notes}`, 'notes carries the free text and nothing else');
});

test('email sits beside the phone, not adrift at the end', () => {
  const lines = whatsappMessagePreview(FULL).split('\n');
  assert.equal(lines.indexOf('Email: fatima@example.com'), lines.indexOf('Phone: +44 7911 123456') + 1);
});

test('empty optional fields are omitted rather than sent as blank labels', () => {
  const bare = whatsappMessagePreview({
    passengers: '2 adults',
    name: 'Yusuf Khan',
    phone: '07700 900123',
  });
  for (const absent of ['Package:', 'Email:', 'Notes:']) {
    assert.ok(!bare.includes(absent), `should not appear when unset: ${absent}`);
  }
});

test('the url targets the configured number and survives awkward input', () => {
  const url = whatsappUrl({
    name: 'Mohammed "Mo" Al-Rashid & family',
    phone: '+44 (0)7700 900 123',
    notes: 'Budget ~£3,000/person.\n50% deposit? 100%+ شكرا',
  });

  assert.ok(url.startsWith(`https://wa.me/${site.contact.whatsapp}?text=`));

  // A literal % in the notes must survive as %25, or WhatsApp shows a mangled
  // message — or nothing at all, if the escape happens to be invalid.
  const text = new URL(url).searchParams.get('text')!;
  assert.ok(text.includes('Mohammed "Mo" Al-Rashid & family'));
  assert.ok(text.includes('50% deposit? 100%+'));
  assert.ok(text.includes('£3,000'));
  assert.ok(text.includes('شكرا'), 'arabic must survive');
  assert.ok(text.includes('\n'), 'line breaks must survive');
});

test('the WhatsApp number is digits only — wa.me rejects anything else', () => {
  // A "+", a space or a leading 0 here produces a link that opens WhatsApp and
  // then fails to resolve a contact, which looks like a broken button.
  assert.match(
    site.contact.whatsapp,
    /^[1-9]\d{6,14}$/,
    `whatsapp must be E.164 digits with no +, spaces or leading zero; got "${site.contact.whatsapp}"`
  );
});
