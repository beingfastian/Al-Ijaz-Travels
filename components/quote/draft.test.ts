import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sanitiseValues, sanitiseStep, useQuoteDraft } from './draft.ts';
import { quoteDefaults, QUOTE_STEPS } from './schema.ts';

/**
 * The draft is restored from whatever is sitting in localStorage, which is to say
 * from input this code does not control: a payload written by an older build, a
 * value hand-edited in devtools, a truncated write from a tab that was killed
 * mid-save. It has to degrade to a blank form rather than throw, because a throw
 * here takes the whole quote page down on load — the one screen that has to work.
 *
 * These run under node with no `window`, which also exercises the private-mode
 * Safari path where localStorage is unavailable and the store falls back to memory.
 */

test('a half-filled draft is restored as-is — empty strings are legitimate', () => {
  const half = { ...quoteDefaults, adults: 3, packageSlug: 'premium-umrah-10-nights', name: '' };

  // The Zod schema would reject this (`name` needs 2 characters). That is exactly
  // why restoration is a shape check and not a validation: mid-typing is normal.
  assert.deepEqual(sanitiseValues(half), half);
});

test('a field stored under the wrong type falls back to its default', () => {
  const restored = sanitiseValues({
    ...quoteDefaults,
    adults: 'two',
    children: null,
    name: 42,
  });

  assert.equal(restored.adults, quoteDefaults.adults);
  assert.equal(restored.children, quoteDefaults.children);
  assert.equal(restored.name, quoteDefaults.name);
});

test('NaN and Infinity do not reach the form as traveller counts', () => {
  const restored = sanitiseValues({ adults: NaN, children: Infinity });

  assert.equal(restored.adults, quoteDefaults.adults);
  assert.equal(restored.children, quoteDefaults.children);
});

test('an unknown sharing basis falls back instead of reaching the select', () => {
  assert.equal(sanitiseValues({ sharing: 'penthouse' }).sharing, quoteDefaults.sharing);
  assert.equal(sanitiseValues({ sharing: 'double' }).sharing, 'double');
});

test('garbage payloads degrade to defaults rather than throwing', () => {
  for (const junk of [null, undefined, 'a string', 42, [], true]) {
    assert.deepEqual(sanitiseValues(junk), quoteDefaults, `failed on ${JSON.stringify(junk)}`);
  }
});

test('unknown keys in storage are dropped, not carried into the form', () => {
  const restored = sanitiseValues({ ...quoteDefaults, passportNumber: 'AB1234567' });

  assert.deepEqual(Object.keys(restored).sort(), Object.keys(quoteDefaults).sort());
});

test('step is clamped to the steps the flow actually has', () => {
  assert.equal(sanitiseStep(2), 2);
  assert.equal(sanitiseStep(99), QUOTE_STEPS.length - 1);
  assert.equal(sanitiseStep(-1), 0);
});

test('a non-integer step degrades to the first step', () => {
  for (const junk of [1.5, NaN, '2', null, undefined]) {
    assert.equal(sanitiseStep(junk), 0, `failed on ${JSON.stringify(junk)}`);
  }
});

test('the store saves, reports a draft, and clears without a browser present', () => {
  const draft = { ...quoteDefaults, adults: 4, name: 'Fatima' };

  assert.equal(useQuoteDraft.getState().savedAt, null, 'starts with nothing to restore');

  useQuoteDraft.getState().save(draft, 2);
  const saved = useQuoteDraft.getState();
  assert.deepEqual(saved.values, draft);
  assert.equal(saved.step, 2);
  assert.notEqual(saved.savedAt, null);

  useQuoteDraft.getState().clear();
  const cleared = useQuoteDraft.getState();
  assert.deepEqual(cleared.values, quoteDefaults);
  assert.equal(cleared.step, 0);
  assert.equal(cleared.savedAt, null, 'a cleared draft must not be offered back');
});

test('saving an unchanged draft does not restamp it', () => {
  const draft = { ...quoteDefaults, adults: 4 };

  useQuoteDraft.getState().save(draft, 1);
  const first = useQuoteDraft.getState().savedAt;

  useQuoteDraft.getState().save({ ...draft }, 1);
  assert.equal(useQuoteDraft.getState().savedAt, first, 'identical save should be a no-op');

  useQuoteDraft.getState().clear();
});
