import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

export type RolesSummary = {
  id: string,
  name: string,
  usersTotal: number,
  modulesTotal: number,
  permissionsTotal: number,
  notificationsTotal: number,
  additional: Additional[],
};

type Response = {
  getRolesSummary: PaginatedResponse<Partial<RolesSummary>>;
};

export type Additional = {
  name: string,
  field: string,
  value: boolean,
};
const { VITE_GATEWAY_URI } = import.meta.env;
const rolesSummaryDocument = gql`
query GetRolesSummary($pagination: PaginationDtoInput) {
  getRolesSummary(paginationInput: $pagination) {
    rows {
      id
      name
      usersTotal
      modulesTotal
      permissionsTotal
      notificationsTotal
      additional {
        field
        name
        value
      }
    },
    total
    page
    pageSize
    totalPages
  }
}
`;

export const rolesSummary = async (variables?: Record<string, unknown>) => request<Response>(`${VITE_GATEWAY_URI}/gq/back-office`, rolesSummaryDocument, { pagination: variables }).then((res) => ({ ...res.getRolesSummary }));

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<RolesSummary>>>;

type UseRestfulTeamOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useRolesSummary({ config, variables }: UseRestfulTeamOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['roles-summary', variables],
    queryFn: () => rolesSummary(variables),
    suspense: true,
  });
}
