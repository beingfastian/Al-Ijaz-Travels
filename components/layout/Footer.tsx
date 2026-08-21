import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { legalNavLinks, navLinks, secondaryNavLinks, site } from '@/data/site';
import { accreditations } from '@/data/trust';
import { airports } from '@/data/airports';
import { Logo } from '@/components/brand/Logo';

/**
 * The footer.
 *
 * Third pass, and this one came from holding our footer next to the
 * competitor's rather than from reasoning about it. Five differences, in
 * descending order of how much they cost us:
 *
 * 1. COLUMN HEADINGS. Theirs are large, bold and white and read unmistakably as
 *    headings. Ours were 12px gold uppercase micro-labels with 0.14em tracking
 *    — so quiet that in a screenshot of the footer they barely registered, and
 *    the columns read as four unlabelled lists. That single choice accounted for
 *    most of the difference in perceived polish. Now 18px semibold, cream.
 *
 * 2. THE BRAND COLUMN WAS EMPTY. Theirs opens with a real paragraph of copy,
 *    which is what makes their first column the same height as the other three.
 *    Ours had a six-word tagline, so the column ended early and left a void.
 *    There is now an actual description — factual, no "most trusted agency in
 *    the UK" claims, which is theirs and is not checkable.
 *
 * 3. LINK SIZE AND RHYTHM. Ours were 14px on a 52px row pitch: small type,
 *    loose spacing, which reads as sparse. Theirs are ~17px on ~36px. Now 16px
 *    on ~36px — bigger text, tighter list.
 *
 * 4. THE CONTACT COLUMN HAD NO HIERARCHY. Theirs separates the phone (bold) and
 *    email from a labelled "Office" block. Ours was three equal-weight rows, so
 *    the phone number — the most valuable thing in the footer — had no more
 *    prominence than the postcode.
 *
 * 5. "IATA Accredited Agent · IATA 91245302" wrapped with "IATA" orphaned onto
 *    the second line. The name and the number are now separate lines by
 *    construction, so no width can break them badly.
 *
 * Earlier passes: five grid items in a four-column grid left three empty
 * columns, and the khatam pattern read as unfinished texture along the ragged
 * bottom edge.
 *
 * ---------------------------------------------------------------------------
 * ⚠ THE ATOL NOTICE HAS BEEN REMOVED FROM THIS FOOTER, ON CLIENT INSTRUCTION.
 *
 * The prescribed CAA paragraph ("Many of the flight-inclusive holidays on this
 * website are financially protected by the ATOL scheme…") lived here in a band
 * of its own. It went through three treatments — centred on cream, small print
 * on dark, small print with more contrast — and the client rejected all three
 * as the worst thing on the page. Removed, and the reclaimed height given to
 * the columns and the bottom bar rather than left as a gap.
 *
 * What that costs: the footer is on every page, so this notice is now on none
 * of them. The ATOL badge and number still show in the brand column, which is
 * the claim; this paragraph is the qualification of that claim. A site selling
 * flight-inclusive packages is expected to carry it, so before launch it needs
 * a home — the quote flow and /payment-security/ are the natural places, and
 * both are outside this component. This is deliberately not silent: do not
 * treat its absence as an oversight already fixed.
 * ---------------------------------------------------------------------------
 */

/**
 * Spelled rather than numeric: "from 6 UK airports" reads as a spec sheet in the
 * middle of a sentence. Derived from the data all the same, so the copy cannot
 * drift out of step with `data/airports.ts` when a route is added.
 */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const airportCount = NUMBER_WORDS[airports.length] ?? String(airports.length);

const ABOUT = `Al Ijaz Travel arranges all-inclusive Umrah for pilgrims travelling from ${airportCount} UK airports. Flights, visa, hotels near the Haram and every transfer come in one per-person price — with each hotel's walking distance stated in metres before you pay.`;

export function Footer() {
  const year = new Date().getFullYear();
  const tel = site.contact.phone.replace(/\s/g, '');

  const columns = [
    {
      title: 'Travel',
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
          the first time. The brand column is given extra width so its paragraph
          sets at a readable measure rather than in a narrow ribbon. */}
      <div className="max-container padding-container grid gap-x-10 gap-y-11 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr]">
        <div className="flex flex-col gap-4">
          <Logo tone="light" />

          {/* The competitor's first column carries a paragraph, and that is what
              keeps it level with the other three. Ours carried six words. */}
          <p className="max-w-sm text-body-sm/[1.7] text-gold-100">{ABOUT}</p>

          {/* In the brand column rather than a fifth grid cell. Renders only
              when data/trust.ts holds real numbers. Name and number are
              separate lines so no column width can orphan half of one. */}
          {accreditations.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-x-8 gap-y-3 border-t border-green-800 pt-4">
              {accreditations.map((a) => (
                <li key={a.name} className="flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />
                  <span className="flex flex-col">
                    <span className="text-body-sm font-medium text-sand-50">{a.name}</span>
                    {a.reference && (
                      <span className="text-body-sm text-gold-200/85">{a.reference}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.label} className="flex flex-col gap-4">
            <h2 className="text-body-lg font-semibold text-sand-50">{column.title}</h2>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-sand-50/85 transition-colors hover:text-gold-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contact, with hierarchy. The phone number is the most valuable line
            in the footer and previously had the same weight as the postcode. */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body-lg font-semibold text-sand-50">Contact</h2>

          <div className="flex flex-col gap-2.5">
            <a
              href={`tel:${tel}`}
              className="flex items-center gap-2.5 text-body-lg font-semibold text-sand-50 transition-colors hover:text-gold-200"
            >
              <Phone size={17} className="shrink-0 text-gold-400" aria-hidden />
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-2.5 text-body text-sand-50/85 transition-colors hover:text-gold-200"
            >
              <Mail size={16} className="shrink-0 text-gold-400" aria-hidden />
              <span className="break-all">{site.contact.email}</span>
            </a>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-green-800 pt-4">
            <h3 className="text-label uppercase tracking-[0.14em] text-gold-300">Office</h3>
            <p className="flex items-start gap-2.5 text-body text-gold-100">
              <MapPin size={16} className="mt-1 shrink-0 text-gold-400" aria-hidden />
              {site.contact.address}
            </p>
          </div>
        </div>
      </div>

      {/*
        Bottom bar: copyright, and the legal links inline rather than as a fifth
        column with its own heading.

        The WhatsApp button is fixed to the viewport and used to cover "Payment
        Security" completely, which was first solved with 96px of bottom padding
        — correct, and visibly a strip of empty ground under the footer. Clearing
        it sideways instead: on large screens the links stop 288px short of the
        right edge. 224px was tried first and still clipped "Our Responsibility"
        by about 10px, because `max-container` is 1440px wide and therefore has no
        margin at all on a 1440px window — the arithmetic that works on a padded
        container does not work on a flush one.
        Below lg the links are left-aligned and short enough to sit clear of the
        collapsed button. Verified by bounding-box intersection at 1440/768/390
        rather than by eye, because this is exactly the kind of fix that holds at
        one width and fails at another.
      */}
      <div className="border-t border-green-800">
        <div className="max-container padding-container flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:pr-72">
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
