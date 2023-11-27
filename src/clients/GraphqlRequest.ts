import { GraphQLClient } from 'graphql-request';

const {
  VITE_GLOBALIZATION_GRAPHQL_URI: GLOBALIZATION_GRAPHQL_URI,
  VITE_GATEWAY_URI: GATEWAY_URI,
} = import.meta.env;

const getToken = () => {
  const { accessToken } = JSON.parse(localStorage.getItem('@@g-globalization-auth') ?? '{}');

  return accessToken ? `Bearer ${accessToken}` : '';
};

export const graphqlGlobClient = new GraphQLClient(GLOBALIZATION_GRAPHQL_URI, {
  // credentials: 'include',
  headers: {
    authorization: getToken(),
  },
});

export const graphqlGatewayClient = new GraphQLClient(GATEWAY_URI, {
  // credentials: 'include',
  headers: {
    authorization: getToken(),
  },
});

export const publicGraphqlGatewayClient = new GraphQLClient(GATEWAY_URI);
