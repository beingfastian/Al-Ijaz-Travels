import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { legalNavLinks, navLinks, secondaryNavLinks, site } from '@/data/site';
import { accreditations } from '@/data/trust';
import { Logo } from '@/components/brand/Logo';

/**
 * The footer.
 *
 * Second rebuild. The first one fixed the grid arithmetic and then failed on
 * three things that mattered more, all visible in one screenshot:
 *
 * 1. The tiled khatam pattern. Along the ragged bottom edge of four unequal
 *    columns it read as an unfinished background texture rather than as
 *    decoration, and it fought every line of text sitting on it. A footer is
 *    the one part of a page that should recede. Flat dark green now.
 *
 * 2. The ATOL notice was set as ten lines of CENTRED body copy on a cream band
 *    — a wall of text, and the loudest element on the page. Worse, the comment
 *    on `prose-centered` in globals.css says in as many words that paragraphs
 *    should not be centred, which I then did to the longest paragraph on the
 *    site. It is small print now: left-aligned, low contrast, inside the dark
 *    footer. Still legally present, no longer shouting.
 *
 * 3. Six gold small-caps headings for four columns. The legal links have moved
 *    into the bottom bar as an inline row, which is where the competitor puts
 *    them and removes a heading nobody needed.
 *
 * Vertical rhythm is tighter throughout, so the columns no longer leave a void
 * above the copyright rule.
 *
 * FAB clearance is bottom padding on the last band rather than horizontal
 * padding on its contents — the button is fixed to the viewport, so only
 * vertical space is a reliable guarantee at every width.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const tel = site.contact.phone.replace(/\s/g, '');

  const columns = [
    {
      title: 'Explore',
      label: 'Footer',
      links: [...navLinks, { href: '/quote/', label: 'Request a quote' }],
    },
    { title: 'Company', label: 'Services and company', links: [...secondaryNavLinks] },
  ];

  return (
    <footer className="mt-24 border-t border-green-800 bg-green-950 text-sand-50">
      {/* Last call before they leave. Somebody who has read the whole page
          without enquiring is the person most worth handing a phone number to. */}
      <div className="border-b border-green-800/80 bg-green-900">
        <div className="max-container padding-container flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-subheading text-sand-50">Let us speak first</h2>
            <p className="max-w-xl text-body-sm text-gold-100">
              A quote costs nothing and commits you to nothing. We confirm availability
              before anyone is asked for a deposit.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-body font-semibold text-noir-950 transition-colors hover:bg-gold-400"
            >
              <Phone size={17} aria-hidden />
              {site.contact.phone}
            </a>
            <Link
              href="/quote/"
              className="inline-flex items-center justify-center rounded-full border border-gold-500/70 px-7 py-3 text-body font-semibold text-gold-200 transition-colors hover:border-gold-400 hover:text-sand-50"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </div>

      {/* Exactly four children. Five in a four-column grid is what broke this
          the first time. */}
      <div className="max-container padding-container grid gap-x-8 gap-y-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo tone="light" />
          <p className="max-w-xs text-body-sm text-gold-100">{site.tagline}</p>

          {/* In the brand column rather than a fifth grid cell. Renders only
              when data/trust.ts holds real numbers. */}
          {accreditations.length > 0 && (
            <ul className="mt-1 flex flex-col gap-2.5 border-t border-green-800 pt-4">
              {accreditations.map((a) => (
                <li key={a.name} className="flex items-center gap-2 text-body-sm">
                  <ShieldCheck size={15} className="shrink-0 text-gold-400" aria-hidden />
                  <span className="text-gold-100">
                    <span className="text-sand-50">{a.name}</span>
                    {a.reference && <span className="text-gold-200/80"> · {a.reference}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.label} className="flex flex-col gap-3.5">
            <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">{column.title}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-sand-50/90 transition-colors hover:text-gold-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-3.5">
          <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">Contact</h2>
          <ul className="flex flex-col gap-3 text-body-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="mt-1 shrink-0 text-gold-400" aria-hidden />
              <a href={`tel:${tel}`} className="text-sand-50/90 hover:text-gold-200">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-1 shrink-0 text-gold-400" aria-hidden />
              <a
                href={`mailto:${site.contact.email}`}
                className="break-all text-sand-50/90 hover:text-gold-200"
              >
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-1 shrink-0 text-gold-400" aria-hidden />
              <span className="text-gold-100">{site.contact.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/*
        The statutory ATOL notice, as small print.

        This is the CAA's standard wording, not copy, and it is expected on any
        UK site selling flight-inclusive packages. It was previously centred body
        text on a cream band, which turned a legal footnote into the biggest
        element on the page.

        TODO(client): have a solicitor confirm this is the current prescribed
        wording and that it matches the scope of ATOL 74904 before launch.
      */}
      {accreditations.length > 0 && (
        <div className="border-t border-green-800/70">
          {/* max-w on an inner element, not on `max-container` itself — putting it
              on the container overrode its own max-width and its `mx-auto` then
              indented the whole notice off the column grid. */}
          <div className="max-container padding-container py-7">
            <p className="max-w-4xl text-left text-[0.8125rem]/[1.65] text-gold-100/65">
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

      {/*
        Bottom bar: copyright, and the legal links inline rather than as a fifth
        column with its own heading.

        pb-24 at every width, not just on mobile. The WhatsApp button is fixed to
        the viewport, so at the very bottom of the page it overlaps whatever
        occupies the last ~80px regardless of width — it was covering "Payment
        Security" completely. Vertical clearance is the only guarantee that
        holds; padding on the right would only work at some widths.
      */}
      <div className="border-t border-green-800">
        <div className="max-container padding-container flex flex-col gap-4 py-7 pb-24 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-body-sm text-gold-100/80">
            © {year} {site.name}
            {site.company.legalName && ` — ${site.company.legalName}`}
            {site.company.companyNumber && `. Company no. ${site.company.companyNumber}`}
            {site.company.vatNumber && `. VAT no. ${site.company.vatNumber}`}. All rights
            reserved.
          </p>

          {legalNavLinks.length > 0 && (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {legalNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-gold-100/80 transition-colors hover:text-gold-200"
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
    </footer>
  );
}
