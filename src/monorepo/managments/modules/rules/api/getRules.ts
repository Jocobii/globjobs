import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginateRules } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
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

export const getRulesQuery = async (variables?: Record<string, unknown>): Promise<PaginateRules> => request(`${VITE_GATEWAY_URI}/gq/back-office`, allRulesQueryDocument, { pagination: variables }).then((res) => res.rules).catch((err) => ({ rows: [], error: true, msg: err }));

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
