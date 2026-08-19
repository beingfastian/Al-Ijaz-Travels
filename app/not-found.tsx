import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="max-container padding-container flex flex-col items-start gap-6 py-32">
      <p className="eyebrow">404</p>
      <h1 className="text-display">We could not find that page</h1>
      <p className="text-body-lg text-text-muted prose-column">
        The link may be out of date. All current Umrah packages are listed below.
      </p>
      <Button href="/packages/">View packages</Button>
    </section>
  );
}
