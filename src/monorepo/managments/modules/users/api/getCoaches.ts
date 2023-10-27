import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
const { VITE_GATEWAY_URI } = import.meta.env;
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

export const getAllCoaches = async () => request<CoachesResponse>(`${VITE_GATEWAY_URI}/gq/back-office`, restfulTeamDocument);

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
