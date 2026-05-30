import { LOCALES } from '@/lib/constants';
import WaitPageClient from './WaitPageClient';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale, ticketId: '_placeholder_' }));
}

export default function Page() {
  return <WaitPageClient />;
}
