'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { navLinks, site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

/**
 * The base repo's navbar renders the hamburger as a decorative <Image> with no
 * state behind it — there is no mobile menu at all. This is a working drawer.
 *
 * Also note every asset path here is absolute. The base repo uses src="menu.svg"
 * and src="hilink-logo.svg" without the leading slash, which resolves on `/` and
 * 404s on every nested route.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change, or the drawer stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll behind the drawer, and restore whatever the page had.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ground/90 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="max-container padding-container flex-between gap-6 py-4"
      >
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
          {/* TODO(client): drop the real logo SVG in at public/brand/logo.svg and
              swap this mark for it. Built as inline SVG meanwhile so there is no
              broken-image state and no extra request. */}
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-subheading text-green-900">{site.name}</span>
            <span lang="ar" className="text-body-sm text-gold-text">
              {site.nameArabic}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'text-body transition-colors',
                    active ? 'text-green-900 font-medium' : 'text-text-muted hover:text-green-900'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href={whatsappUrl()} variant="primary" size="sm">
            WhatsApp us
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden rounded-full p-2 text-green-900 hover:bg-green-50"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-border bg-ground">
          <ul className="padding-container flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block border-b border-border py-4 text-body-lg text-green-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="padding-container pb-6 pt-2">
            <Button href={whatsappUrl()} variant="primary" full>
              WhatsApp us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/** Dome, crescent and flight-path motif distilled from the logo. */
function BrandMark() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true" className="shrink-0">
      <circle cx="19" cy="19" r="18.25" fill="var(--color-green-900)" />
      <path
        d="M27.5 9.5a8.6 8.6 0 1 0 0 19 10.2 10.2 0 1 1 0-19Z"
        fill="var(--color-gold-500)"
      />
      <path
        d="M15 24.5v-5.2a4 4 0 0 1 8 0v5.2Z"
        fill="var(--color-green-200)"
      />
      <rect x="24.2" y="17" width="1.7" height="7.5" fill="var(--color-green-200)" />
      <rect x="12" y="24.5" width="14" height="1.6" fill="var(--color-sand-50)" />
    </svg>
  );
}
