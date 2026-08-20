import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sanitiseValues, sanitiseStep, useQuoteDraft } from './draft.ts';
import { enquiryDefaults } from './schema.ts';

/**
 * The draft is restored from whatever is sitting in localStorage, which is to say
 * from input this code does not control: a payload written by an older build, a
 * value hand-edited in devtools, a truncated write from a tab that was killed
 * mid-save. It has to degrade to a blank form rather than throw, because a throw
 * here takes the whole enquiry form down on load — the one screen that has to work.
 *
 * These run under node with no `window`, which also exercises the private-mode
 * Safari path where localStorage is unavailable and the store falls back to memory.
 */

test('a half-filled draft is restored as-is — empty strings are legitimate', () => {
  const half = { ...enquiryDefaults, travellers: 3, name: '' };
  assert.deepEqual(sanitiseValues(half), { ...half, consent: false });
});

test('a field stored under the wrong type falls back to its default', () => {
  const restored = sanitiseValues({ ...enquiryDefaults, travellers: 'two', name: 42 });

  assert.equal(restored.travellers, enquiryDefaults.travellers);
  assert.equal(restored.name, enquiryDefaults.name);
});

test('NaN and Infinity do not reach the form as a traveller count', () => {
  assert.equal(sanitiseValues({ travellers: NaN }).travellers, enquiryDefaults.travellers);
  assert.equal(sanitiseValues({ travellers: Infinity }).travellers, enquiryDefaults.travellers);
});

test('an unknown sharing basis falls back instead of reaching the select', () => {
  assert.equal(sanitiseValues({ sharing: 'penthouse' }).sharing, '');
  assert.equal(sanitiseValues({ sharing: 'double' }).sharing, 'double');
});

test('consent is never restored from a draft', () => {
  // It has to be a fresh, deliberate act every time — that is what makes it
  // consent under UK GDPR rather than a pre-ticked box.
  const restored = sanitiseValues({ ...enquiryDefaults, consent: true });
  assert.equal(restored.consent, false);
});

test('garbage payloads degrade to defaults rather than throwing', () => {
  for (const junk of [null, undefined, 'a string', 42, [], true]) {
    const restored = sanitiseValues(junk);
    assert.equal(restored.name, '', `failed on ${JSON.stringify(junk)}`);
    assert.equal(restored.travellers, enquiryDefaults.travellers);
  }
});

test('unknown keys in storage are dropped, not carried into the form', () => {
  const restored = sanitiseValues({ ...enquiryDefaults, passportNumber: 'AB1234567' });

  assert.deepEqual(Object.keys(restored).sort(), Object.keys(enquiryDefaults).sort());
});

test('a draft written by the old four-step wizard still merges cleanly', () => {
  // The old shape had adults/children/infants and a step index. It must not throw.
  const legacy = { adults: 2, children: 1, infants: 0, name: 'Yusuf', step: 3 };
  const restored = sanitiseValues(legacy);

  assert.equal(restored.name, 'Yusuf', 'fields that still exist are kept');
  assert.equal(restored.travellers, enquiryDefaults.travellers, 'removed fields fall back');
  assert.equal(sanitiseStep(3), 0, 'the step index collapses to a single-page form');
});

test('the store saves, reports a draft, and clears without a browser present', () => {
  const draft = { ...enquiryDefaults, travellers: 4, name: 'Fatima' };

  assert.equal(useQuoteDraft.getState().savedAt, null, 'starts with nothing to restore');

  useQuoteDraft.getState().save(draft, 0);
  const saved = useQuoteDraft.getState();
  assert.deepEqual(saved.values, draft);
  assert.notEqual(saved.savedAt, null);

  useQuoteDraft.getState().clear();
  const cleared = useQuoteDraft.getState();
  assert.deepEqual(cleared.values, enquiryDefaults);
  assert.equal(cleared.savedAt, null, 'a cleared draft must not be offered back');
});

test('saving an unchanged draft does not restamp it', () => {
  const draft = { ...enquiryDefaults, travellers: 4 };

  useQuoteDraft.getState().save(draft, 0);
  const first = useQuoteDraft.getState().savedAt;

  useQuoteDraft.getState().save({ ...draft }, 0);
  assert.equal(useQuoteDraft.getState().savedAt, first, 'identical save should be a no-op');

  useQuoteDraft.getState().clear();
});
