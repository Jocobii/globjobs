import { gql, useQuery } from '@apollo/client';

export type PackagesQuery = {
  findAllPackages: [
    {
      _id: string;
      name: string;
    },
  ];
};

export const PACKAGES_QUERY = gql`
  query findPackages {
    findAllPackages {
      _id
      name
    }
  }
`;

export function usePackages() {
  return useQuery<PackagesQuery>(PACKAGES_QUERY);
}
