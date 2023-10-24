import { gql, useQuery } from '@apollo/client';

export const getCompanyByTeam = gql`
  query CompanyGetByTeam($paginateInput: PaginateGenericInput!) {
    companyGetByTeam(paginateInput: $paginateInput) {
      rows {
        _id
        name
        number
      }
      page
      pageSize
      totalPages
    }
  }
`;

type Params = {
  teamId?: string | null,
  variables?: {
    page?: number,
    pageSize?: number,
    sort?: string,
  },
};

export const useCompanyList = (params: Params) => {
  const { data } = useQuery(getCompanyByTeam, {
    variables: {
      paginateInput: {
        teamId: params.teamId,
        page: params.variables?.page,
        pageSize: params.variables?.pageSize,
        sort: params.variables?.sort,
      },
    },
  });
  return {
    data: data?.companyGetByTeam,
  };
};

export default useCompanyList;
