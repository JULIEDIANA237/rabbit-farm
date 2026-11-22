import type { Metadata, Viewport } from 'next';

import './globals.css';

import ApolloProviderWrapper from '@/providers/apollo-provider';
import { RegisterServiceWorker } from '@/components/pwa/register-sw';
import { UpdateBanner } from '@/components/pwa/update-banner';
import { THEME_BOOT_SCRIPT } from '@/lib/theme-boot';

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
  // Le clavier du téléphone réduit la page au lieu de recouvrir les champs,
  // et le contenu peut aller sous l'encoche (marges via safe-area).
  interactiveWidget: 'resizes-content',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme est posé par le script avant l'affichage : React ne doit pas s'en étonner.
    <html lang="fr" data-theme="day" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        <RegisterServiceWorker />
        <UpdateBanner />
      </body>
    </html>
  );
}
