import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { whatsappUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  alternates: { canonical: '/contact/' },
  title: 'Contact',
  description: `Speak to ${site.name} about Umrah packages, dates and availability.`,
};

export default function ContactPage() {
  return (
    <section className="max-container padding-container flex flex-col gap-8 py-16">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">Contact</p>
        <h1 className="text-display">Talk to a consultant</h1>
        <p className="prose-column text-body-lg text-text-muted">
          WhatsApp is fastest. We answer questions about dates, hotels and
          availability before you commit to anything.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        <li className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-6">
          <Phone size={18} className="text-gold-text" aria-hidden />
          <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="text-body">
            {site.contact.phone}
          </a>
        </li>
        <li className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-6">
          <Mail size={18} className="text-gold-text" aria-hidden />
          <a href={`mailto:${site.contact.email}`} className="text-body break-all">
            {site.contact.email}
          </a>
        </li>
        <li className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-6">
          <MapPin size={18} className="text-gold-text" aria-hidden />
          <span className="text-body">{site.contact.address}</span>
        </li>
      </ul>

      <div>
        <Button href={whatsappUrl()} size="lg">
          Message us on WhatsApp
        </Button>
      </div>
    </section>
  );
}
