import { gql, useQuery } from '@apollo/client';

export type ManeuversQuery = {
  findAllManeuvers: [
    {
      _id: string;
      name: string;
    },
  ];
};

export const MANEUVERS_QUERY = gql`
  query findManeuvers {
    findAllManeuvers {
      _id
      name
    }
  }
`;

export function useManeuvers() {
  return useQuery<ManeuversQuery>(MANEUVERS_QUERY);
}
