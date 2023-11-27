import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

import { Area } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type RestfulAreasResponse = {
  areaRestful: Array<Partial<Area>>,
};

const restfulAreasDocument = gql`
  query {
    areaRestful {
      name
      id: _id
    }
  }
`;

export const restfulAreas = async () => request<RestfulAreasResponse>(`${VITE_GATEWAY_URI}/gq/back-office`, restfulAreasDocument);

type QueryFnType = () => Promise<RestfulAreasResponse>;

type UseRestfulAreaOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulAreas({ config }: UseRestfulAreaOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-areas'],
    queryFn: () => restfulAreas(),
  });
}
