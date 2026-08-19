'use client';

import type { ReactNode } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { packages } from '@/data/packages';
import { formatMonthKey } from '@/lib/format';
import type { QuoteValues } from './schema';

/**
 * The individual step panels of the quote flow, plus the shared field chrome.
 *
 * These are deliberately dumb: they receive `register` and `errors` from the one
 * useForm instance that QuoteFlow owns, and hold no state themselves. That is
 * what makes the single-form approach work — each step is a view onto shared
 * form state rather than a form of its own with its own lifecycle to coordinate.
 */

export const inputClass =
  'w-full rounded-card border border-border bg-surface px-4 py-2.5 text-body outline-none transition-colors focus:border-green-700';

interface StepProps {
  register: UseFormRegister<QuoteValues>;
  errors: FieldErrors<QuoteValues>;
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-panel border border-border bg-surface p-6 lg:p-8">
      <h2 className="text-heading">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-body font-medium text-green-900">
        {label}
      </label>
      {hint && <span className="text-body-sm text-text-muted">{hint}</span>}
      {children}
      {error && (
        <span role="alert" className="text-body-sm text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

/** Step 0 — who is travelling. */
export function TravellersStep({ register, errors }: StepProps) {
  return (
    <Panel title="Who is travelling?">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Adults" htmlFor="adults" error={errors.adults?.message}>
          <input
            id="adults"
            type="number"
            min={1}
            className={inputClass}
            {...register('adults', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Children (2–11)" htmlFor="children" error={errors.children?.message}>
          <input
            id="children"
            type="number"
            min={0}
            className={inputClass}
            {...register('children', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Infants (under 2)" htmlFor="infants" error={errors.infants?.message}>
          <input
            id="infants"
            type="number"
            min={0}
            className={inputClass}
            {...register('infants', { valueAsNumber: true })}
          />
        </Field>
      </div>
      <Field label="Room sharing" htmlFor="sharing" error={errors.sharing?.message}>
        <select id="sharing" className={inputClass} {...register('sharing')}>
          <option value="quad">Quad — four to a room</option>
          <option value="triple">Triple — three to a room</option>
          <option value="double">Double — two to a room</option>
        </select>
      </Field>
    </Panel>
  );
}

/** Step 1 — the trip. */
export function TripStep({
  register,
  errors,
  months,
}: StepProps & { months: string[] }) {
  return (
    <Panel title="Your trip">
      <Field label="Package" htmlFor="packageSlug" error={errors.packageSlug?.message}>
        <select id="packageSlug" className={inputClass} {...register('packageSlug')}>
          <option value="">Choose a package…</option>
          <option value="unsure">Not sure yet — please advise</option>
          {packages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Preferred departure"
        htmlFor="departureMonth"
        error={errors.departureMonth?.message}
      >
        <select id="departureMonth" className={inputClass} {...register('departureMonth')}>
          <option value="">Choose a month…</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthKey(m)}
            </option>
          ))}
          <option value="flexible">My dates are flexible</option>
        </select>
      </Field>

      <Field
        label="Anything we should know?"
        htmlFor="notes"
        hint="Wheelchair assistance, travelling with elderly parents, a preferred hotel — anything that changes what we quote."
        error={errors.notes?.message}
      >
        <textarea id="notes" rows={4} className={inputClass} {...register('notes')} />
      </Field>
    </Panel>
  );
}

/** Step 2 — how to reach you. */
export function ContactStep({ register, errors }: StepProps) {
  return (
    <Panel title="How should we reach you?">
      <Field label="Your name" htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputClass} autoComplete="name" {...register('name')} />
      </Field>
      <Field label="Phone (with country code)" htmlFor="phone" error={errors.phone?.message}>
        <input
          id="phone"
          className={inputClass}
          inputMode="tel"
          autoComplete="tel"
          placeholder="+92 300 0000000"
          {...register('phone')}
        />
      </Field>
      <Field label="Email (optional)" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          className={inputClass}
          type="email"
          autoComplete="email"
          {...register('email')}
        />
      </Field>
    </Panel>
  );
}

/** Step 3 — review the exact message before it is sent. */
export function ReviewStep({ preview }: { preview: string }) {
  return (
    <Panel title="Review and send">
      <p className="text-body-sm text-text-muted">
        This is exactly the message that will reach our consultant. Check it over —
        you can go back and change anything.
      </p>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-card border border-border bg-surface-sunk p-5 font-sans text-body-sm text-text">
        {preview}
      </pre>
    </Panel>
  );
}
