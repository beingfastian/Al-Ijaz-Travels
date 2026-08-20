import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { legalNavLinks, navLinks, secondaryNavLinks, site } from '@/data/site';
import { accreditations } from '@/data/trust';
import { Logo } from '@/components/brand/Logo';

/**
 * The footer.
 *
 * Rebuilt after it broke. The cause was mundane and worth recording: five grid
 * items were placed in a four-column grid, so the accreditation block wrapped
 * onto a second row and occupied column one alone — leaving three empty columns
 * of tiled khatam pattern and a footer that looked abandoned. Accreditation now
 * sits inside the brand column, and the grid holds exactly four children.
 *
 * Three other things fixed at the same time:
 *
 * - A "let us speak first" strip at the top with the phone number, which is the
 *   competitor's strongest footer idea. Somebody who has scrolled the whole page
 *   without enquiring is the person most worth giving a phone number to.
 * - The statutory ATOL notice. A UK site selling flight-inclusive packages is
 *   expected to carry it, and it was simply missing.
 * - Bottom padding, so the fixed WhatsApp button no longer sits on top of the
 *   legal links. It was covering "Payment Security" entirely.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const tel = site.contact.phone.replace(/\s/g, '');

  const columns = [
    { title: 'Explore', label: 'Footer', links: [...navLinks, { href: '/quote/', label: 'Request a quote' }] },
    { title: 'Services', label: 'Services and company', links: [...secondaryNavLinks] },
  ];

  return (
    <footer className="mt-24 border-t border-green-800 bg-green-950 text-sand-50">
      <div className="khatam-field-gold">
        {/* Last call before they leave. */}
        <div className="max-container padding-container flex flex-col gap-5 border-b border-green-800 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-heading text-sand-50">Let us speak first</h2>
            <p className="max-w-xl text-body text-gold-100">
              A quote costs nothing and does not commit you to booking. We confirm
              availability before anyone is asked for a deposit.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sand-50 px-7 py-3.5 text-body font-semibold text-green-900 transition-colors hover:bg-gold-100"
            >
              <Phone size={17} aria-hidden />
              Call now
            </a>
            <Link
              href="/quote/"
              className="inline-flex items-center justify-center rounded-full border border-gold-500 px-7 py-3.5 text-body font-semibold text-gold-200 transition-colors hover:bg-green-900"
            >
              Request a quote
            </Link>
          </div>
        </div>

        {/* Exactly four children. Five in a four-column grid is what broke it. */}
        <div className="max-container padding-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <Logo tone="light" />
            <p className="text-body-sm text-gold-100">{site.tagline}</p>

            {/* In this column rather than a fifth grid cell. Renders only when
                data/trust.ts holds real numbers. */}
            {accreditations.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-green-800 pt-5">
                <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">
                  Accreditation
                </h2>
                <ul className="flex flex-col gap-2">
                  {accreditations.map((a) => (
                    <li key={a.name} className="flex items-start gap-2 text-body-sm">
                      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                      <span>
                        <span className="block text-sand-50">{a.name}</span>
                        <span className="text-gold-100">{a.reference}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.label} className="flex flex-col gap-4">
              <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-sand-50 transition-colors hover:text-gold-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-4">
            <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">Contact</h2>
            <ul className="flex flex-col gap-3 text-body-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
                <a href={`tel:${tel}`} className="hover:text-gold-200">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
                <a href={`mailto:${site.contact.email}`} className="break-all hover:text-gold-200">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
                <span className="text-gold-100">{site.contact.address}</span>
              </li>
            </ul>

            {legalNavLinks.length > 0 && (
              <nav aria-label="Legal" className="flex flex-col gap-2.5 border-t border-green-800 pt-5">
                <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">Our terms</h2>
                <ul className="flex flex-col gap-2.5">
                  {legalNavLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-sand-50 transition-colors hover:text-gold-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>

        <div className="max-container padding-container border-t border-green-800 py-6">
          <p className="text-center text-body-sm text-gold-100">
            © {year} {site.name}
            {site.company.legalName && ` — ${site.company.legalName}`}
            {site.company.companyNumber && `. Company no. ${site.company.companyNumber}`}
            {site.company.vatNumber && `. VAT no. ${site.company.vatNumber}`}. All rights
            reserved.
          </p>
        </div>
      </div>

      {/*
        The statutory ATOL notice, on a light band so it reads as a legal notice
        rather than as marketing — which is exactly what the competitor does, and
        it is the right call.

        This is the CAA's standard wording, not copy. It is expected on any UK site
        selling flight-inclusive packages and it was missing entirely.

        TODO(client): have a solicitor confirm this is the current prescribed
        wording and that it matches the scope of ATOL 74904 before launch.

        The bottom padding clears the fixed WhatsApp button, which was sitting on
        top of the legal links and hiding one of them completely.
      */}
      {accreditations.length > 0 && (
        <div className="border-t border-border bg-sand-100">
          <div className="max-container padding-container py-6 pb-24 lg:pb-6">
            <p className="prose-centered text-center text-body-sm text-text-muted">
              Many of the flight-inclusive holidays on this website are financially
              protected by the ATOL scheme under ATOL {site.accreditation.atolNumber}. When
              you pay you will be supplied with an ATOL Certificate. Please ask for it and
              check to ensure that everything you booked — flights, hotels and other
              services — is listed on it. If you do receive an ATOL Certificate but all the
              parts of your trip are not listed on it, those parts will not be ATOL
              protected. Some of the flights on this website are also financially protected
              by the ATOL scheme, but ATOL protection does not apply to all flights.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
