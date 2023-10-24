import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

import { Team } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
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

export const getTeamQuery = async (teamId: string): Promise<Team> => request(`${VITE_GATEWAY_URI}/gq/back-office`, getTeamDocument, { teamId })
  .then((res) => res.team)
  .catch((err) => ({ rows: [], error: true, msg: err }));

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
