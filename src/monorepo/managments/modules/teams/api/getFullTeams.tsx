import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

export type Teams = {
  id: string;
  name: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export type RestfulTeamsResponse = {
  teamsRestful: Teams[],
};

const restfulTeamDocument = gql`
  query {
    teamsRestful {
      id
      name
    }
  }
`;

export const restfulTeams = async (): Promise<RestfulTeamsResponse> => request<RestfulTeamsResponse>(`${VITE_GATEWAY_URI}/gq/back-office`, restfulTeamDocument);

type QueryFnType = () => Promise<RestfulTeamsResponse>;

type UseRestfulTeamOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulTeams({ config }: UseRestfulTeamOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-teams'],
    queryFn: () => restfulTeams(),
  });
}
