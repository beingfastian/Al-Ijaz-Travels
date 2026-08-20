'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { navLinks, site } from '@/data/site';
import { Logo } from '@/components/brand/Logo';
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
    <div className="sticky top-0 z-40 border-b border-border bg-ground/90 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="max-container padding-container flex-between gap-6 py-4"
      >
        <Link href="/" aria-label={`${site.name} — home`}>
          <Logo />
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
          {/* Call Now, not WhatsApp. The WhatsApp route is covered twice already —
              the utility bar above and the fixed button bottom-right — so the nav
              slot is better spent on the phone, which is what an older pilgrim
              reaches for first. */}
          <Button href={`tel:${site.contact.phone.replace(/\s/g, '')}`} variant="primary" size="sm">
            Call Now
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
            <Button href={`tel:${site.contact.phone.replace(/\s/g, '')}`} variant="primary" full>
              Call Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
