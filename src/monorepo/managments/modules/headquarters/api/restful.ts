import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

import { Headquarter } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

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

export const restfulHeadquarters = async () => request(`${VITE_GATEWAY_URI}/gq/back-office`, restfulHeadquartersDocument);

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
