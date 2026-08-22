'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle, Loader2 } from 'lucide-react';
import { getPackage, allDepartureMonths, basePackages } from '@/data/packages';
import { airports } from '@/data/airports';
import { formatMonthKey, formatGbp } from '@/lib/format';
import { whatsappUrl, type QuoteMessage } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useQuoteDraft } from './draft';
import { enquirySchema, enquiryDefaults, SHARING, type EnquiryValues } from './schema';

/**
 * One form, everything visible.
 *
 * Replaces a four-step wizard. The wizard was better engineered and worse for the
 * job: every step is somewhere to abandon, and a visitor comparing three
 * operators on a phone will not walk four panels to ask a question. Nine fields
 * shown at once is less intimidating than four panels hiding nine fields.
 *
 * Renders in two sizes from the same component — full width on /quote/, and
 * `compact` inline on a package page, where the package is already known and the
 * form is a sidebar rather than the page. One component means the validation,
 * the draft persistence and the WhatsApp handoff cannot drift between them.
 */

interface EnquiryFormProps {
  /** Preselect a package and hide the picker — used on package detail pages. */
  packageSlug?: string;
  /** Tighter spacing and a single column, for a sidebar. */
  compact?: boolean;
}

export function EnquiryForm({ packageSlug, compact = false }: EnquiryFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const months = useMemo(() => allDepartureMonths(), []);
  const tierGroups = useMemo(
    () =>
      [5, 4, 3].map((tier) => ({
        tier,
        list: basePackages()
          .filter((p) => p.tier === tier)
          .sort((a, b) => a.price.gbp - b.price.gbp),
      })),
    []
  );

  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const handedOffRef = useRef(false);

  // A slug passed as a prop wins over the query string: the prop means we are on
  // that package's own page, which is a stronger signal than a stale link.
  const fromQuery = searchParams.get('package') ?? '';
  const locked = packageSlug !== undefined && getPackage(packageSlug) !== undefined;
  const preselected = locked ? packageSlug! : getPackage(fromQuery) ? fromQuery : '';

  const initialValues = useMemo<EnquiryValues>(
    () => ({ ...enquiryDefaults, packageSlug: preselected }),
    [preselected]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    mode: 'onTouched',
    defaultValues: initialValues,
  });

  // Restore. The store does not read storage during render, so the prerendered
  // HTML and the first client render always agree.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(useQuoteDraft.persist.rehydrate()).then(() => {
      if (cancelled) return;
      const draft = useQuoteDraft.getState();
      if (draft.savedAt !== null) {
        reset({ ...draft.values, packageSlug: preselected || draft.values.packageSlug });
        setRestored(true);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [reset, preselected]);

  const values = watch();

  useEffect(() => {
    if (!ready || handedOffRef.current) return;
    if (!isDirty && !restored) return;
    useQuoteDraft.getState().save(values, 0);
  }, [ready, restored, isDirty, values]);

  const chosen = getPackage(values.packageSlug);

  /*
    The outgoing WhatsApp message is the actual business artefact here — it is
    what a consultant reads and replies to — so it is worth getting right.
    Three faults this replaces, all visible in a real submission:

    - The departure airport and the email address were concatenated into the
      free-text `notes`, so a message read "Notes: Departing from: MAN / Email:
      ... / <what the visitor actually typed>" — three unrelated things under one
      label. Each has its own line now: the airport beside the travellers, the
      email beside the phone.
    - The airport arrived as a bare IATA code. "MAN" is unambiguous to us and not
      to everyone reading a phone at 11pm.
    - The month and sharing basis arrived as raw form values, "april" and "quad",
      because formatMonthKey only capitalises keys shaped like "april-2027" while
      this <select> uses bare month names.
  */
  const chosenAirport = airports.find((a) => a.code === values.airport);
  const monthLabel = values.departureMonth
    ? formatMonthKey(values.departureMonth).replace(/^./, (c) => c.toUpperCase())
    : undefined;

  const message: QuoteMessage = {
    packageName: chosen?.name ?? 'Not sure yet — please advise',
    travellers: { adults: Number(values.travellers) || 0, children: 0, infants: 0 },
    airport: chosenAirport ? `${chosenAirport.city} (${chosenAirport.code})` : undefined,
    departureMonth: monthLabel,
    // Capitalised, not formatSharing() — that returns "quad sharing", which under
    // a "Room sharing:" label reads "Room sharing: quad sharing".
    sharing: values.sharing ? values.sharing.replace(/^./, (c) => c.toUpperCase()) : undefined,
    name: values.name,
    phone: values.phone,
    email: values.email || undefined,
    // Free text only. Everything structured now has its own line.
    notes: values.notes?.trim() || undefined,
  };

  function onSubmit() {
    handedOffRef.current = true;
    useQuoteDraft.getState().clear();
    // Open WhatsApp in a new tab and move this one to the confirmation page, so
    // the visitor is not left staring at the form they just completed.
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    router.push('/quote/sent/');
  }

  const field =
    'w-full rounded-card border border-border bg-surface px-4 py-2 text-body transition-colors focus:border-green-700 [@media(min-height:1150px)]:py-2.5';
  const label = 'text-body-sm font-medium text-text';
  const errorText = 'text-body-sm text-danger';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'flex flex-col',
        compact ? 'gap-4' : 'gap-4 [@media(min-height:1150px)]:gap-6'
      )}
      noValidate
    >
      {restored && (
        <p className="rounded-card border border-border bg-green-50 px-4 py-2.5 text-body-sm text-text-muted">
          We kept what you started earlier.
        </p>
      )}

      <div
        className={cn(
          'grid gap-3 [@media(min-height:1150px)]:gap-4',
          compact
            ? 'grid-cols-1'
            : // Two columns is the shape when there is vertical room. When there is
              // not, trade width for height — three columns on a laptop, four on a
              // wide monitor. These are eight short fields; the only one that
              // suffers at 240px is a <select> whose longest option truncates.
              'sm:grid-cols-2 [@media(max-height:1149px)]:lg:grid-cols-3 [@media(max-height:1149px)]:2xl:grid-cols-4'
        )}
      >
        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input id="name" {...register('name')} className={field} autoComplete="name" />
          {errors.name && <p className={errorText}>{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="phone" className={label}>
            Phone or WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={field}
            autoComplete="tel"
            placeholder="+44"
          />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="email" className={label}>
            Email <span className="font-normal text-text-muted">(optional)</span>
          </label>
          <input id="email" type="email" {...register('email')} className={field} autoComplete="email" />
          {errors.email && <p className={errorText}>{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="travellers" className={label}>
            How many travelling
          </label>
          <input
            id="travellers"
            type="number"
            min={1}
            max={60}
            {...register('travellers', { valueAsNumber: true })}
            className={field}
          />
          {errors.travellers && <p className={errorText}>{errors.travellers.message}</p>}
        </div>

        {!locked && (
          <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
            <label htmlFor="packageSlug" className={label}>
              Package <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <select id="packageSlug" {...register('packageSlug')} className={field}>
              {/* Short enough to survive a narrow column. The message sent to
                  WhatsApp still says "Not sure yet — please advise", which is
                  read by a consultant, not squeezed into a select. */}
              <option value="">Not sure yet</option>
              {/* Evergreen only. Offering all 195 in a <select> would be unusable;
                  a consultant sorts the exact month from the enquiry. */}
              {tierGroups.map(({ tier, list }) => (
                <optgroup key={tier} label={`${tier}-star`}>
                  {list.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {formatGbp(p.price.gbp)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="airport" className={label}>
            Departing from
          </label>
          <select id="airport" {...register('airport')} className={field}>
            <option value="">Any UK airport</option>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="departureMonth" className={label}>
            Preferred month
          </label>
          <select id="departureMonth" {...register('departureMonth')} className={field}>
            <option value="">Flexible</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {formatMonthKey(m)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="sharing" className={label}>
            Room sharing
          </label>
          <select id="sharing" {...register('sharing')} className={field}>
            <option value="">No preference</option>
            {SHARING.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
        <label htmlFor="notes" className={label}>
          Anything we should know? <span className="font-normal text-text-muted">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={compact ? 2 : 2}
          {...register('notes')}
          className={field}
          placeholder="Mobility needs, travelling with children or elderly parents, fixed dates…"
        />
        {errors.notes && <p className={errorText}>{errors.notes.message}</p>}
      </div>

      <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
        <label htmlFor="consent" className="flex items-start gap-3 text-body-sm text-text-muted">
          <input
            id="consent"
            type="checkbox"
            {...register('consent')}
            className="mt-1 size-4 shrink-0 accent-green-700"
          />
          <span>
            I am happy for Al Ijaz Travel to contact me about this enquiry. We do not sell
            your details or add you to a mailing list.
          </span>
        </label>
        {errors.consent && <p className={errorText}>{errors.consent.message}</p>}
      </div>

      <Button
        type="submit"
        size={compact ? 'md' : 'lg'}
        full
        iconLeft={
          isSubmitting ? (
            <Loader2 size={18} className="animate-spin" aria-hidden />
          ) : (
            <MessageCircle size={18} aria-hidden />
          )
        }
      >
        Send enquiry on WhatsApp
      </Button>

      <p className="hidden text-body-sm text-text-muted [@media(min-height:840px)]:block">
        Sending this does not commit you to booking. A consultant confirms availability
        first, then sends written confirmation.
      </p>
    </form>
  );
}
