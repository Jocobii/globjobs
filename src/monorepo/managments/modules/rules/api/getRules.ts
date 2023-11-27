import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginateRules } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

type Response = {
  rules: PaginateRules;
};

const allRulesQueryDocument = gql`
  query PaginateRules($pagination: PaginationDtoInput!) {
    rules(paginationInput: $pagination) {
      rows {
        id
        section
        field
        type
        message
        validator
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getRulesQuery = async (variables?: Record<string, unknown>) => request<Response>(`${VITE_GATEWAY_URI}/gq/back-office`, allRulesQueryDocument, { pagination: variables }).then((res) => res.rules);

type QueryFnType = typeof getRulesQuery;

type UseRulesOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useRules({ config, variables }: UseRulesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['rules', variables],
    queryFn: () => getRulesQuery(variables),
    suspense: true,
  });
}
