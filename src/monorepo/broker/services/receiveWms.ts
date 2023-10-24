import { gql, useQuery } from '@apollo/client';

export type ReceiveQuery = {
  findReceive: [
    {
      _id: string;
      number: string;
    },
  ];
};

export const RECEIVE_WMS_QUERY = gql`
  query {
    findReceive {
      _id
      number
    }
  }
`;

export function useReceive() {
  return useQuery<ReceiveQuery>(RECEIVE_WMS_QUERY);
}
