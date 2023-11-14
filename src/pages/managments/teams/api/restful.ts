import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { graphqlGatewayClient } from '@/clients';

export type Teams = {
  id: string;
  name: string;
};

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

export const restfulTeams = async (): Promise<RestfulTeamsResponse> => graphqlGatewayClient.request<RestfulTeamsResponse>(restfulTeamDocument);

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

