import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';

import { getAccessToken, removeAccessToken } from './auth-storage';

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

/**
 * Ajoute le JWT dans le header Authorization.
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

/**
 * Session expirée ou jeton invalide : retour à la connexion.
 */
const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const unauthenticated = error.errors.some(
    (e) =>
      e.extensions?.code === 'UNAUTHENTICATED' ||
      /unauthorized/i.test(e.message),
  );

  if (unauthenticated && typeof window !== 'undefined') {
    removeAccessToken();
    if (!window.location.pathname.startsWith('/login')) {
      window.location.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }
});

const httpLink = new HttpLink({ uri: graphqlUrl });

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
});
