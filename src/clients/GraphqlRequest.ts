import { GraphQLClient } from 'graphql-request';
const {
  VITE_GLOBALIZATION_GRAPHQL_URI: GLOBALIZATION_GRAPHQL_URI,
  VITE_GATEWAY_URI: GATEWAY_URI
} = import.meta.env;

export const graphqlGlobClient = new GraphQLClient(GLOBALIZATION_GRAPHQL_URI, {
  // credentials: 'include',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjBiYTcyYmMwYzg1NzQwYThmOWMxYyIsIm5hbWUiOiJVemllbCBFc3RyYWRhIiwiZW1haWwiOiJ1emllbC5lc3RyYWRhQGctZ2xvYmFsLmNvbSIsImlhdCI6MTY5MjQ4NTAxOH0.MxvuCcRn8-JGxp5hTuYwo3OVhedpLNsD8OoHOl3b4B4,'
  },
});

export const graphqlGatewayClient = new GraphQLClient(GATEWAY_URI, {
  // credentials: 'include',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjBiYTcyYmMwYzg1NzQwYThmOWMxYyIsIm5hbWUiOiJVemllbCBFc3RyYWRhIiwiZW1haWwiOiJ1emllbC5lc3RyYWRhQGctZ2xvYmFsLmNvbSIsImlhdCI6MTY5MjQ4NTAxOH0.MxvuCcRn8-JGxp5hTuYwo3OVhedpLNsD8OoHOl3b4B4,'
  },
});

export const publicGraphqlGatewayClient = new GraphQLClient(GATEWAY_URI);