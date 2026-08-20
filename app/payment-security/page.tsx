import { AssuranceLayout, buildAssuranceMetadata } from '@/components/legal/AssuranceLayout';

export const metadata = buildAssuranceMetadata('payment-security');

export default function PaymentSecurityPage() {
  return <AssuranceLayout slug="payment-security" />;
}
