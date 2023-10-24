import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import get from 'lodash/get';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Rows } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

export const allCompaniesDocument = gql`
  query ($page: Int, $pageSize: Int, $sort: String, $filter: [FilterDtoInput!]) {
    companyList(
      paginateInput: { page: $page, pageSize: $pageSize, sort: $sort, filter: $filter }
    ) {
      rows {
        id: _id
        number
        name
        active
        rfc
        users {
          id: _id
          name
          lastName
          emailAddress
          phoneNumber
        }
        team {
          id
          name
        }
      }
      total
      totalPages
      page
      pageSize
    }
  }
`;

export const geCompaniesQuery = async (variables?: Record<string, unknown>) => {
  const page = get(variables, 'page', 1);
  const pageSize = get(variables, 'pageSize', 10);
  const sort = get(variables, 'sort', '');
  const filter = get(variables, 'filter', {});
  return request(
    `${VITE_GATEWAY_URI}/gq/back-office`,
    allCompaniesDocument,
    {
      page,
      pageSize,
      sort,
      filter,
    },
  )
    .then((res) => res.companyList);
};

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Rows>>>;

type UseCompaniesOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useGetCompanies({ config, variables }: UseCompaniesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['paginated-companies', variables],
    queryFn: () => geCompaniesQuery(variables),
    suspense: true,
  });
}
