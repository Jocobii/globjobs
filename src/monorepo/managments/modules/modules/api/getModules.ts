import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Module } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
const modulesDocument = gql`
  query PaginateModules($pagination: PaginationDtoInput) {
    modules(paginationInput: $pagination) {
      rows {
        id
        name
        description
        icon
        endpoint
        route
        component
        toolbox
        active
        environment {
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

export const getModulesQuery = async (variables?: Record<string, unknown>) => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, modulesDocument, { pagination: variables })
  .then((res) => res.modules)
  .catch((err) => ({ rows: [], error: true, msg: err }));

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Module>>>;

type UseModulesOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useModules({ config, variables }: UseModulesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['modules', variables],
    queryFn: () => getModulesQuery(variables),
    suspense: true,
  });
}

export default useModules;
