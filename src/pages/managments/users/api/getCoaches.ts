import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { graphqlGatewayClient } from '@/clients';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

export type Coaches = {
  _id: string;
  name: string;
  lastName: string
};

export type CoachesResponse = {
  getCoaches: Coaches[],
};

const restfulTeamDocument = gql`
  query {
    getCoaches {
      _id
      name
      lastName
    }
  }
`;

export const getAllCoaches = async () => graphqlGatewayClient.request<CoachesResponse>(restfulTeamDocument);

type QueryFnType = () => Promise<CoachesResponse>;

type UseGetCOachOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useGetCoaches({ config }: UseGetCOachOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-coaches'],
    queryFn: () => getAllCoaches(),
  });
}
