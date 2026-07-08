import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL_DOCS } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Terms of Service · Varsheni',
  description: 'The terms for using this site and commissioning review reels.',
};

export default function Page() {
  return <LegalPage doc={LEGAL_DOCS.terms} />;
}
