import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '../../../../lib/react-query';
import { PaginatedResponse } from '../../../../typings/datagrid';
import { graphqlGatewayClient } from '../../../../clients';

import { Team } from '../types';

type Responses = {
  teams: PaginatedResponse<Team>;
};

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

export const getTeamsQuery = async (
  variables?: Record<string, unknown>,
) => graphqlGatewayClient.request<Responses>(getAllTeamsDocument, { pagination: variables })
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
