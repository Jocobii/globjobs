import { gql, useQuery } from '@apollo/client';

export type CompaniesQuery = {
  findCompanies: [
    {
      _id: string;
      name: string;
      number: string;
    },
  ];
};

export const COMPANIES_QUERY = gql`
  query findCompanies {
    findCompanies {
      _id
      name
      number
    }
  }
`;

export function useCompanies() {
  return useQuery<CompaniesQuery>(COMPANIES_QUERY);
}
