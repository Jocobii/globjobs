import { gql, useMutation } from '@apollo/client';

export type ClientNumber = {
  getClientNumbers: string[];
};

export const CLIENT_NUMBER_QUERY = gql`
mutation($id: String!) {
  getClientNumbers(id: $id)
}
`;

export function useClientNumber() {
  return useMutation<ClientNumber>(CLIENT_NUMBER_QUERY);
}
