import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
const { VITE_GATEWAY_URI } = import.meta.env;
const getAreaDocument = gql`
  query GetAreaQuery($areaId: String!) {
    area(id: $areaId) {
      _id
      name
      abbreviation
      department {
        id: _id
        name
      }  
    }
  }
`;

export const getAreaQuery = async (areaId: string) => request(`${VITE_GATEWAY_URI}/gq/back-office`, getAreaDocument, { areaId }).then((res) => res.area);

type QueryFnType = typeof getAreaQuery;
type UseAreaOptions = {
  config?: QueryConfig<QueryFnType>;
  areaId: string;
};

export function useGetArea({ areaId, config }: UseAreaOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['area', areaId],
    queryFn: () => getAreaQuery(areaId),
    suspense: true,
  });
}
