import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL_DOCS } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Privacy Policy · Varsheni',
  description: 'What this site collects, how it is used, and your choices.',
};

export default function Page() {
  return <LegalPage doc={LEGAL_DOCS.privacy} />;
}
