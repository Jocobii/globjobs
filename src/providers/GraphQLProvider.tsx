import {
  ApolloProvider, InMemoryCache, ApolloClient, ApolloLink, HttpLink, split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import { setContext } from '@apollo/client/link/context';

import { env } from '../config';

const { DEV } = import.meta.env;

const getToken = () => {
  const { accessToken } = JSON.parse(localStorage.getItem('@@g-globalization-auth') ?? '{}');

  return accessToken ? `Bearer ${accessToken}` : '';
};

const wsLink = new GraphQLWsLink(createClient({
  url: env.VITE_GLOBALIZATION_GRAPHQL_SOCKET_URI ?? '',
  retryAttempts: 5,
  connectionParams: {
    Authorization: getToken(),
  },
}));

wsLink.client.on('closed', (e) => console.log(e));

const gateway = new HttpLink({
  uri: `${env.VITE_GATEWAY_URI}`,
  credentials: DEV ? undefined : 'include',
});

const globalization = new HttpLink({
  uri: `${env.VITE_GLOBALIZATION_GRAPHQL_URI}`,
  credentials: DEV ? undefined : 'include',
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getToken(),
  },
}));

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition'
          && definition.operation === 'subscription'
        );
      },
      wsLink,
      ApolloLink.split(
        (operation) => operation.getContext().clientName === 'globalization',
        globalization,
        gateway,
      ),
    ),
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

type Props = {
  children: React.ReactNode;
};

export default function GraphQLProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
