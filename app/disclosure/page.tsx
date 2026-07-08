import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL_DOCS } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Content & Disclosure · Varsheni',
  description: 'When something is paid, and what an honest review is worth.',
};

export default function Page() {
  return <LegalPage doc={LEGAL_DOCS.disclosure} />;
}
