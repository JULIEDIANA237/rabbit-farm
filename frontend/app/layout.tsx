
import type { Metadata } from 'next';

import './globals.css';

import ApolloProviderWrapper from '@/providers/apollo-provider';

export const metadata: Metadata = {
  title: 'Rabbit Farm',
  description: 'Application de gestion d’élevage cunicole',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <ApolloProviderWrapper>
          {children}
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}

