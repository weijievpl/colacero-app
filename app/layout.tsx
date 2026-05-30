import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ColaCero - La cola que no se nota',
  description: 'Sistema de gestión de colas en tiempo real. Obtén tu turno desde el móvil sin esperas.',
  icons: {
    icon: '/assets/images/colacero-logo.png',
    apple: '/assets/images/colacero-logo.png',
  },
};

// This is a minimal root layout that just passes children through
// The actual layout with providers is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
