import { AssuranceLayout, buildAssuranceMetadata } from '@/components/legal/AssuranceLayout';

export const metadata = buildAssuranceMetadata('our-responsibility');

export default function OurResponsibilityPage() {
  return <AssuranceLayout slug="our-responsibility" />;
}
