import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { legalNavLinks, navLinks, secondaryNavLinks, site } from '@/data/site';
import { accreditations } from '@/data/trust';

/**
 * Note the `key` on every mapped element. The base repo's footer maps
 * FOOTER_LINKS into <FooterColumn> without one, which React warns about and which
 * gets worse as the list grows.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-green-950 text-sand-50">
      <div className="khatam-field-gold">
        <div className="max-container padding-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <p className="font-serif text-subheading text-sand-50">{site.name}</p>
            <p lang="ar" className="text-body-lg text-gold-200">
              {site.nameArabic}
            </p>
            <p className="text-body-sm text-gold-100">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-4">
            <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">Explore</h2>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-sand-50 hover:text-gold-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li key="/quote/">
                <Link href="/quote/" className="text-body-sm text-sand-50 hover:text-gold-200">
                  Request a quote
                </Link>
              </li>
            </ul>
          </nav>

          {/* Services and company. Without these the flights, hotels, transport
              and assurance pages are built, prerendered and unreachable — which
              the dead-link check cannot catch, because an orphan page is not a
              broken link. */}
          <nav aria-label="Services and company" className="flex flex-col gap-4">
            <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">
              Services
            </h2>
            <ul className="flex flex-col gap-3">
              {secondaryNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-sand-50 hover:text-gold-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">Contact</h2>
            <ul className="flex flex-col gap-3 text-body-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 shrink-0 text-gold-300" aria-hidden />
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="hover:text-gold-200">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 shrink-0 text-gold-300" aria-hidden />
                <a href={`mailto:${site.contact.email}`} className="hover:text-gold-200">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-gold-300" aria-hidden />
                <span className="text-gold-100">{site.contact.address}</span>
              </li>
            </ul>
          </div>

          {/* Renders only once real credentials are entered in data/trust.ts —
              an empty accreditation row is better than an invented badge. */}
          {accreditations.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-label uppercase tracking-[0.14em] text-gold-300">
                Accreditation
              </h2>
              <ul className="flex flex-col gap-3 text-body-sm">
                {accreditations.map((a) => (
                  <li key={a.name} className="text-gold-100">
                    <span className="block text-sand-50">{a.name}</span>
                    <span className="text-body-sm">{a.reference}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="max-container padding-container flex flex-col gap-4 border-t border-green-800 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-body-sm text-gold-100">
            © {year} {site.name}. All rights reserved.
            {site.company.companyNumber && ` Company no. ${site.company.companyNumber}.`}
            {site.company.vatNumber && ` VAT no. ${site.company.vatNumber}.`}
          </p>

          {legalNavLinks.length > 0 && (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-gold-100 hover:text-sand-50 hover:underline"
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
