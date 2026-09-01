'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle, Loader2 } from 'lucide-react';
import { getPackage } from '@/data/packages';
import { whatsappUrl, type QuoteMessage } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useQuoteDraft } from './draft';
import { enquirySchema, enquiryDefaults, type EnquiryValues } from './schema';

/**
 * One form, everything visible, six fields.
 *
 * The field list matches the competitor's enquiry form exactly, on client
 * instruction: lead passenger name, phone, email, total passengers, message,
 * consent. See schema.ts for what that trade costs — in short, the four fields
 * removed (airport, month, room sharing, package) were the ones that made an
 * enquiry answerable without a reply first.
 *
 * Renders in two sizes from the same component — full width on /quote/, and
 * `compact` inline on a package page. One component means the validation, the
 * draft persistence and the WhatsApp handoff cannot drift between them.
 *
 * Accessibility wiring worth naming, because comparing the two forms is what
 * exposed it. Ours previously set no `required` and no `aria-required` at all —
 * validation was Zod behind `noValidate`, so a screen reader announced every
 * field as optional while the competitor's announced five as required. And error
 * messages were loose <p> elements with no `id`, so a screen reader user landing
 * on an invalid field heard nothing wrong with it. axe passes both of those,
 * because axe cannot know a paragraph is an error message. Fixed here:
 * `aria-required`, `aria-invalid` and `aria-describedby` on every field.
 */

interface EnquiryFormProps {
  /** Preselect a package — used on package detail pages. Never rendered. */
  packageSlug?: string;
  /** Tighter spacing and a single column, for a sidebar. */
  compact?: boolean;
}

export function EnquiryForm({ packageSlug, compact = false }: EnquiryFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    what a consultant reads and replies to.

    The package is still named even though there is no longer a package field,
    because on a package page we know it from the URL. It costs the visitor
    nothing and saves the consultant from guessing which of 195 pages prompted
    the enquiry.
  */
  const message: QuoteMessage = {
    packageName: chosen?.name,
    passengers: values.passengers?.trim() || undefined,
    name: values.name,
    phone: values.phone,
    email: values.email || undefined,
    notes: values.message?.trim() || undefined,
  };

  function onSubmit() {
    handedOffRef.current = true;
    useQuoteDraft.getState().clear();
    // Open WhatsApp in a new tab and move this one to the confirmation page, so
    // the visitor is not left staring at the form they just completed.
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    router.push('/quote/sent/');
  }

  /*
    `text-text` and an explicit placeholder colour are load-bearing, not tidiness.

    The hero carries `premium-surface`, which sets `color: var(--color-on-premium)`
    — cream — on the whole section. An input with no colour of its own inherits
    that, so on the home page the visitor's own typing came out cream on a white
    field: legible only by accident. axe caught it as a contrast failure on
    #name; the real symptom is a form you cannot read what you typed into.

    Stating the colour here fixes it wherever the form is placed, rather than
    patching the one surface that exposed it.
  */
  const field =
    'w-full rounded-card border border-border bg-surface px-4 py-2 text-body text-text placeholder:text-text-muted transition-colors focus:border-green-700 [@media(min-height:1150px)]:py-2.5';
  const label = 'text-body-sm font-medium text-text';
  const errorText = 'text-body-sm text-danger';

  /** Ties an input to its error message, so it is announced and not just seen. */
  const aria = (name: keyof EnquiryValues, required: boolean) => ({
    'aria-required': required || undefined,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

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
          // Four short fields. Two columns everywhere above mobile keeps them in
          // two tidy rows; there is no longer a field list long enough to need
          // the three- and four-column short-screen treatment.
          compact ? 'grid-cols-1' : 'sm:grid-cols-2'
        )}
      >
        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="name" className={label}>
            Lead passenger name
          </label>
          <input
            id="name"
            {...register('name')}
            {...aria('name', true)}
            className={field}
            autoComplete="name"
            placeholder="Muhammad Ali"
          />
          {errors.name && (
            <p id="name-error" className={errorText}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="phone" className={label}>
            Phone or WhatsApp
          </label>
          {/* type="tel", not text. The competitor uses text, which opens a full
              QWERTY keyboard on a phone instead of a number pad. */}
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            {...aria('phone', true)}
            className={field}
            autoComplete="tel"
            placeholder="+44"
          />
          {errors.phone && (
            <p id="phone-error" className={errorText}>
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            {...aria('email', true)}
            className={field}
            autoComplete="email"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className={errorText}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
          <label htmlFor="passengers" className={label}>
            Total passengers
          </label>
          {/* Free text, so "2 adults & 2 kids" is expressible. The old numeric
              field could not represent children at all. */}
          <input
            id="passengers"
            {...register('passengers')}
            {...aria('passengers', true)}
            className={field}
            placeholder="e.g. 2 adults & 2 children"
          />
          {errors.passengers && (
            <p id="passengers-error" className={errorText}>
              {errors.passengers.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
        <label htmlFor="message" className={label}>
          Message <span className="font-normal text-text-muted">(optional)</span>
        </label>
        {/* A textarea, where the competitor uses a single-line <input>. Anything
            longer than the box scrolls sideways in a one-line field, and this is
            the box where someone explains a wheelchair or fixed dates. */}
        <textarea
          id="message"
          rows={2}
          {...register('message')}
          {...aria('message', false)}
          className={field}
          placeholder="I'm looking for an Umrah package in…"
        />
        {errors.message && (
          <p id="message-error" className={errorText}>
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 [@media(min-height:1150px)]:gap-1.5">
        <label htmlFor="consent" className="flex items-start gap-3 text-body-sm text-text-muted">
          <input
            id="consent"
            type="checkbox"
            {...register('consent')}
            {...aria('consent', true)}
            className="mt-1 size-4 shrink-0 accent-green-700"
          />
          <span>
            I am happy for Al Ijaz Travel to contact me about this enquiry. We do not sell
            your details or add you to a mailing list.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className={errorText}>
            {errors.consent.message}
          </p>
        )}
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
