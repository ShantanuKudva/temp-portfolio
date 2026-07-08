import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL_DOCS } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Cookie Policy · Varsheni',
  description: 'The handful of cookies this site uses, and how to manage them.',
};

export default function Page() {
  return <LegalPage doc={LEGAL_DOCS.cookies} />;
}
