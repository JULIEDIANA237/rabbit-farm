
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  'http://localhost:3001/graphql';

const httpLink = new HttpLink({
  uri: graphqlUrl,
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

