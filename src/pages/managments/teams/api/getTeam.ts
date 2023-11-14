import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { graphqlGatewayClient } from '@/clients';

import { Team } from '../types';

type Responses = {
  team: Team;
};

const getTeamDocument = gql`
  query getTeamQuery($teamId: String!) {
    team(id: $teamId) {
      id
      name
      groupEmail
      headquarter {
        id
        name
      }
      active
    }
  }
`;

export const getTeamQuery = async (teamId: string): Promise<Team> => graphqlGatewayClient.request<Responses>(getTeamDocument, { teamId })
  .then((res) => res.team);

  type QueryFnType = typeof getTeamQuery;
  type UseTeamsOptions = {
    config?: QueryConfig<QueryFnType>;
    teamId: string;
  };

export function useGetTeam({ teamId, config }: UseTeamsOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['teams', teamId],
    queryFn: () => getTeamQuery(teamId),
  });
}

export default useGetTeam;
