import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Team } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
const getAllTeamsDocument = gql`
  query PaginateTeams($pagination: PaginationDtoInput) {
    teams(paginationInput: $pagination) {
      rows {
        id
        name
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getTeamsQuery = async (variables?: Record<string, unknown>) => request(`${VITE_GATEWAY_URI}/gq/back-office`, getAllTeamsDocument, { pagination: variables })
  .then((res) => res.teams);

type QueryFnType = (params?: Record<string, unknown>) => Promise<PaginatedResponse<Partial<Team>>>;

type UseTeamsOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useTeams({ config, variables }: UseTeamsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['teams', variables],
    queryFn: () => getTeamsQuery(variables),
  });
}

export default useTeams;
