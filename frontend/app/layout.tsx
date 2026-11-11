import type { Metadata, Viewport } from 'next';

import './globals.css';

import ApolloProviderWrapper from '@/providers/apollo-provider';
import { RegisterServiceWorker } from '@/components/pwa/register-sw';
import { UpdateBanner } from '@/components/pwa/update-banner';

export const metadata: Metadata = {
  title: { default: 'Rabbit Farm', template: '%s · Rabbit Farm' },
  description: 'Application de gestion d’élevage cunicole',
  applicationName: 'Rabbit Farm',
  appleWebApp: { capable: true, title: 'Rabbit Farm', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }, { url: '/icons/icon-192.png', sizes: '192x192' }],
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        <RegisterServiceWorker />
        <UpdateBanner />
      </body>
    </html>
  );
}
