'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// Explicit .ts extension: this module is imported by a node --test file, and node's
// ESM resolver does not add extensions. Do not "tidy" it away.
import { enquiryDefaults, type EnquiryValues } from './schema.ts';

/* ============================================================================
 * THE QUOTE DRAFT — the only global store on the site.
 *
 * The Tripix reference keeps *filters* in Zustand. Those belong in the URL, and
 * that is where PackageListing puts them: a filtered listing has to be a link a
 * consultant can send. Once filters move out, exactly one piece of state is left
 * that is genuinely ephemeral, cross-route, and has no business in a URL — a
 * half-filled quote form.
 *
 * It is worth persisting because of how this form is actually used. Someone in
 * the middle of it taps back to a package page to re-check a walking distance,
 * or the browser drops the tab on an older phone, and every answer is gone. That
 * is a lost enquiry, not an inconvenience — and it is the one screen on the site
 * where losing state costs money.
 *
 * `skipHydration` is the detail that makes this safe under output:'export'. The
 * page is prerendered at build time with an empty form; if the store read
 * localStorage during the first client render, that render would disagree with
 * the prerendered HTML and React would throw a hydration mismatch. So the store
 * starts empty on both sides and QuoteFlow rehydrates from an effect, after
 * hydration is finished.
 * ========================================================================== */

const DRAFT_VERSION = 1;
const STORAGE_KEY = 'al-ijaz-quote-draft';

interface DraftState {
  values: EnquiryValues;
  step: number;
  /** null means there is nothing to restore. */
  savedAt: number | null;
  save: (values: EnquiryValues, step: number) => void;
  clear: () => void;
}

function emptyDraft(): Pick<DraftState, 'values' | 'step' | 'savedAt'> {
  return { values: { ...enquiryDefaults }, step: 0, savedAt: null };
}

const str = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value : fallback;

/**
 * A draft is deliberately incomplete, so the Zod schema cannot be used to
 * validate it — `name: ''` is a legitimate half-filled state that would fail
 * `min(2)`. This is a shape check instead: any field stored under the wrong type
 * falls back to its default, so a corrupt, hand-edited, or outdated payload
 * degrades to a blank form rather than crashing the flow on load.
 */
export function sanitiseValues(raw: unknown): EnquiryValues {
  const src: Record<string, unknown> =
    typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};

  return {
    name: str(src.name, enquiryDefaults.name),
    phone: str(src.phone, enquiryDefaults.phone),
    email: str(src.email, enquiryDefaults.email),
    // A draft written before the form was narrowed to six fields stored
    // `travellers` as a number. Carry it across rather than dropping it: someone
    // mid-enquiry when the site deployed should not lose what they typed.
    passengers: str(
      src.passengers,
      // Number.isFinite, not typeof: NaN and Infinity are numbers, and
      // String(NaN) would put the literal text "NaN" in the passengers box.
      Number.isFinite(src.travellers) ? String(src.travellers) : enquiryDefaults.passengers
    ),
    message: str(src.message, str(src.notes, enquiryDefaults.message ?? '')),
    // Consent is never restored from a draft. It has to be a fresh act each
    // time, which is the whole point of it under UK GDPR.
    consent: false as unknown as true,
    packageSlug: str(src.packageSlug, enquiryDefaults.packageSlug),
  };
}

/**
 * Step is retained at 0 now that the form is a single page.
 *
 * Kept rather than removed so a draft written by the old four-step wizard still
 * merges cleanly instead of throwing on an unexpected field.
 */
export function sanitiseStep(raw: unknown): number {
  if (typeof raw !== 'number' || !Number.isInteger(raw)) return 0;
  return Math.max(raw, 0) === 0 ? 0 : 0;
}

/**
 * Safari in private mode exposes `localStorage` and then throws on write.
 * Falling back to memory keeps the flow working for the life of the tab instead
 * of failing on the first keystroke — the draft is a convenience, and it should
 * never be able to break the form it is protecting.
 */
const memoryStorage: Storage = (() => {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
})();

function resolveStorage(): Storage {
  try {
    const probe = `${STORAGE_KEY}:probe`;
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage;
  }
}

export const useQuoteDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      ...emptyDraft(),

      save: (values, step) => {
        const current = get();
        // `watch()` returns a fresh object on every keystroke, so without this
        // guard every render would write to storage even when nothing moved.
        if (current.step === step && JSON.stringify(current.values) === JSON.stringify(values)) {
          return;
        }
        set({ values, step, savedAt: Date.now() });
      },

      clear: () => {
        set(emptyDraft());
        // The set above has already written an empty payload; remove the key
        // outright so a cleared draft leaves nothing behind.
        void useQuoteDraft.persist.clearStorage();
      },
    }),
    {
      name: STORAGE_KEY,
      version: DRAFT_VERSION,
      skipHydration: true,
      storage: createJSONStorage(resolveStorage),
      partialize: ({ values, step, savedAt }) => ({ values, step, savedAt }),
      // A draft written by an older shape of this form is not worth migrating —
      // discard it rather than restoring fields that no longer mean the same thing.
      migrate: () => emptyDraft(),
      merge: (persisted, current) => {
        const src: Record<string, unknown> =
          typeof persisted === 'object' && persisted !== null
            ? (persisted as Record<string, unknown>)
            : {};

        return {
          ...current,
          values: sanitiseValues(src.values),
          step: sanitiseStep(src.step),
          savedAt: typeof src.savedAt === 'number' ? src.savedAt : null,
        };
      },
    }
  )
);
