import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { graphqlGatewayClient } from '@/clients';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Headquarter } from '../types';

export type RestfulHeadquartersResponse = {
  headquartersRestful: Array<Partial<Headquarter>>,
};

const restfulHeadquartersDocument = gql`
  query {
    headquartersRestful {
      name
      id
    }
  }
`;

export const restfulHeadquarters = async () => graphqlGatewayClient
  .request<RestfulHeadquartersResponse>(restfulHeadquartersDocument);

type QueryFnType = () => Promise<RestfulHeadquartersResponse>;

type UseRestfulHeadquartersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulHeadquarters({ config }: UseRestfulHeadquartersOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-headquarters'],
    queryFn: () => restfulHeadquarters(),
  });
}
