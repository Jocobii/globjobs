import {
  ApolloProvider, InMemoryCache, ApolloClient, ApolloLink, HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const gateway = new HttpLink({
  uri: 'http://localhost:3333/graphql',
  // credentials: 'include', // enable when auth is implemented
});

const globalization = new HttpLink({
  uri: 'http://localhost:3340/graphql',
  // credentials: 'include', // enable when auth is implemented
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjBiYTcyYmMwYzg1NzQwYThmOWMxYyIsIm5hbWUiOiJVemllbCBFc3RyYWRhIiwiZW1haWwiOiJ1emllbC5lc3RyYWRhQGctZ2xvYmFsLmNvbSIsImlhdCI6MTY5MjQ4NTAxOH0.MxvuCcRn8-JGxp5hTuYwo3OVhedpLNsD8OoHOl3b4B4',
    },
  };
});

export const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    ApolloLink.split(
      (operation) => operation.getContext()['clientName'] === 'globalization',
      globalization,
      gateway,
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
