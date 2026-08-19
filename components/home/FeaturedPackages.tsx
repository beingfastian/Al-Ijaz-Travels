import { Button } from '@/components/ui/Button';
import { PackageCard } from '@/components/package/PackageCard';
import { featuredPackages } from '@/data/packages';
import { Section } from '@/components/ui/Section';

export function FeaturedPackages() {
  const featured = featuredPackages();
  if (featured.length === 0) return null;

  return (
    <Section
      id="featured"
      eyebrow="Selected packages"
      title="Where most travellers start"
      action={
        <Button href="/packages/" variant="secondary">
          See all packages
        </Button>
      }
    >
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((pkg) => (
          <li key={pkg.slug} className="flex">
            <PackageCard pkg={pkg} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
