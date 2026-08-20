import { AssuranceLayout, buildAssuranceMetadata } from '@/components/legal/AssuranceLayout';

export const metadata = buildAssuranceMetadata('travel-insurance');

export default function TravelInsurancePage() {
  return <AssuranceLayout slug="travel-insurance" />;
}
