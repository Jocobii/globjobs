import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '../../../../lib/react-query';
import { graphqlGatewayClient } from '../../../../clients';
import { PaginatedResponse } from '../../../../typings/datagrid';

import { Company } from '../types';

type Responses = {
  companyList: PaginatedResponse<Partial<Company>>,
};

const allCompaniesDocument = gql`
  query PaginateCompanies($pagination: PaginateGenericInput!) {
    companyList(paginateInput: $pagination) {
      rows {
        number
        name
        rfc
        active
        email
        team {
          name
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getCompaniesQuery = async (
  variables?: Record<string, unknown>,
) => graphqlGatewayClient.request<Responses>(
  allCompaniesDocument,
  { pagination: variables },
).then((res) => res.companyList);

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Company>>>;

type UseCompaniesOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useGetCompanies({ config, variables }: UseCompaniesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['companies', variables],
    queryFn: () => getCompaniesQuery(variables),
    suspense: true,
  });
}
