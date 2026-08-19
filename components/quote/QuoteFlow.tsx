'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle } from 'lucide-react';
import { getPackage, allDepartureMonths } from '@/data/packages';
import { formatMonthKey } from '@/lib/format';
import { whatsappMessagePreview, whatsappUrl, type QuoteMessage } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { useQuoteDraft } from './draft';
import {
  quoteSchema,
  quoteDefaults,
  QUOTE_STEPS,
  QUOTE_STEP_TITLES,
  type QuoteValues,
} from './schema';
import { TravellersStep, TripStep, ContactStep, ReviewStep } from './steps';

/**
 * Multi-step quote request.
 *
 * One useForm over the whole quote; each step gates on `trigger()` against its
 * own field list. No imperative DOM submission, no timers — see ./schema.ts for
 * why that matters and what the reference implementation got wrong.
 *
 * The form is also the one screen worth persisting, so answers survive a refresh
 * or a trip back to a package page mid-flow. See ./draft.ts for why the store
 * rehydrates from an effect rather than during render.
 */
export function QuoteFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const months = useMemo(() => allDepartureMonths(), []);

  const [step, setStep] = useState(0);
  /** A saved draft was found and applied — drives the "start over" notice. */
  const [restored, setRestored] = useState(false);
  /** Rehydration has been attempted; until then, nothing may be written back. */
  const [ready, setReady] = useState(false);
  const handedOffRef = useRef(false);

  // Only honour the query param if it names a package that exists — otherwise a
  // stale link would preselect a slug the <select> has no option for.
  const requested = searchParams.get('package') ?? '';
  const preselectedSlug = getPackage(requested) ? requested : '';

  const initialValues = useMemo<QuoteValues>(
    () => ({ ...quoteDefaults, packageSlug: preselectedSlug }),
    [preselectedSlug]
  );

  const {
    register,
    trigger,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: 'onTouched',
    defaultValues: initialValues,
  });

  // Restore. The store does not read storage during render, so the prerendered
  // HTML and the first client render always agree; the draft arrives after.
  useEffect(() => {
    let cancelled = false;

    Promise.resolve(useQuoteDraft.persist.rehydrate()).then(() => {
      if (cancelled) return;
      const draft = useQuoteDraft.getState();

      if (draft.savedAt !== null) {
        reset({
          ...draft.values,
          // An explicit ?package= is a fresh intent, so it outranks the draft.
          packageSlug: preselectedSlug || draft.values.packageSlug,
        });
        setStep(draft.step);
        setRestored(true);
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [reset, preselectedSlug]);

  const values = watch();

  // Persist. `isDirty` gates the first write so an untouched form never becomes a
  // draft — otherwise merely opening /quote/?package=x would leave one behind and
  // the next visit would claim to have restored answers nobody typed.
  useEffect(() => {
    if (!ready || handedOffRef.current) return;
    if (!isDirty && !restored) return;
    useQuoteDraft.getState().save(values, step);
  }, [ready, restored, isDirty, values, step]);

  const chosen = getPackage(values.packageSlug);

  async function next() {
    const fields = QUOTE_STEPS[step]?.fields ?? [];
    // Spread the readonly tuple: trigger() wants a mutable array of paths.
    const ok = fields.length === 0 || (await trigger([...fields]));
    if (ok) setStep((s) => Math.min(s + 1, QUOTE_STEPS.length - 1));
  }

  function startOver() {
    useQuoteDraft.getState().clear();
    reset(initialValues);
    setStep(0);
    setRestored(false);
  }

  function handOff() {
    handedOffRef.current = true;
    useQuoteDraft.getState().clear();
    // The wa.me link is external, so Button renders it target="_blank" and it
    // opens in its own tab. That leaves this tab free to move to the
    // confirmation page instead of stranding the user on the review step.
    router.push('/quote/sent/');
  }

  const message: QuoteMessage = {
    packageName: chosen?.name ?? 'Not sure yet — please advise',
    travellers: {
      adults: Number(values.adults) || 0,
      children: Number(values.children) || 0,
      infants: Number(values.infants) || 0,
    },
    departureMonth: values.departureMonth ? formatMonthKey(values.departureMonth) : undefined,
    sharing: values.sharing,
    name: values.name,
    phone: values.phone,
    notes: values.notes || undefined,
  };

  const isLast = step === QUOTE_STEPS.length - 1;

  return (
    <div className="max-container padding-container grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
      <div className="flex flex-col gap-8">
        {restored && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-green-50 px-4 py-3">
            <p className="text-body-sm text-text-muted">
              We kept the answers you started earlier.
            </p>
            <button
              type="button"
              onClick={startOver}
              className="text-body-sm font-medium text-link underline"
            >
              Start over
            </button>
          </div>
        )}

        <Stepper steps={QUOTE_STEP_TITLES} current={step} />

        {/* One form element for the whole flow. The final action is a link to
            WhatsApp, so there is no submit handler to fire early. */}
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          {step === 0 && <TravellersStep register={register} errors={errors} />}
          {step === 1 && <TripStep register={register} errors={errors} months={months} />}
          {step === 2 && <ContactStep register={register} errors={errors} />}
          {step === 3 && <ReviewStep preview={whatsappMessagePreview(message)} />}

          <div className="flex flex-wrap gap-3">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {isLast ? (
              <Button
                href={whatsappUrl(message)}
                size="lg"
                iconLeft={<MessageCircle size={18} aria-hidden />}
                onClick={handOff}
              >
                Send on WhatsApp
              </Button>
            ) : (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6">
          <h2 className="font-serif text-subheading text-green-900">
            {chosen ? chosen.name : 'No package selected yet'}
          </h2>
          {chosen && <p className="text-body-sm text-text-muted">{chosen.summary}</p>}
          <p className="text-body-sm text-text-muted">
            Requesting a quote does not commit you to booking. We confirm availability
            first, then send written confirmation.
          </p>
        </div>
      </aside>
    </div>
  );
}
