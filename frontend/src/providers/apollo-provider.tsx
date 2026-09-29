
'use client';

import type { ReactNode } from 'react';
import { ApolloProvider as ApolloClientProvider } from '@apollo/client/react';

import { apolloClient } from '@/lib/apollo-client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export default function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
}

