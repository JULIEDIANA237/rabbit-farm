
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';

import { getAccessToken } from './auth-storage';

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  'http://localhost:3001/graphql';

/**
 * Link d'authentification.
 *
 * Ajoute automatiquement le JWT dans le header Authorization
 * pour les requêtes GraphQL nécessitant une authentification.
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();

  console.log('[APOLLO] Requête GraphQL:', operation.operationName);

  if (token) {
    console.log('[APOLLO] Token JWT présent');
  } else {
    console.log('[APOLLO] Aucun token JWT');
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  }));

  const observable = forward(operation);

  return new Observable((observer) => {
    const subscription = observable.subscribe({
      next: (result) => {
        observer.next(result);
      },

      error: (error) => {
        console.error(
          '[APOLLO] Erreur GraphQL:',
          error,
        );

        observer.error(error);
      },

      complete: () => {
        observer.complete();
      },
    });

    return () => subscription.unsubscribe();
  });
});

/**
 * Transport HTTP vers NestJS / GraphQL.
 */
const httpLink = new HttpLink({
  uri: graphqlUrl,
});

/**
 * Client Apollo global.
 */
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache(),

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },
});

