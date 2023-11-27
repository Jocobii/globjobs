import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Department } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
const allDepartmentsDocument = gql`
  query PaginateDepartments($pagination: PaginationDtoInput) {
    departments(paginationInput: $pagination) {
      rows {
        id: _id
        name
        abbreviation
        email
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getDepartmentsQuery = async (variables?: Record<string, unknown>) => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, allDepartmentsDocument, { pagination: variables }).then((res) => res.departments);

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Department>>>;

type UseDepartmentsOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useDepartments({ config, variables }: UseDepartmentsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['departments', variables],
    queryFn: () => getDepartmentsQuery(variables),
    suspense: true,
  });
}
