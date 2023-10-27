import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Company } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

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

export const getCompaniesQuery = async (variables?: Record<string, unknown>) => request<Responses>(`${VITE_GATEWAY_URI}/gq/back-office`, allCompaniesDocument, { pagination: variables }).then((res) => res.companyList);

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
