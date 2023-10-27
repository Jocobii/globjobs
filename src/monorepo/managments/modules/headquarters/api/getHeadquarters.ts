import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Headquarter } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

const allHeadquartersDocument = gql`
  query PaginateHeadquarters($pagination: PaginationDtoInput) {
    headquarters(paginationInput: $pagination) {
      rows {
        id
        name
        type
        phone
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getHeadquartersQuery = async (variables?: Record<string, unknown>) => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, allHeadquartersDocument, { pagination: variables })
  .then((res) => res.headquarters)
  .catch((err) => ({ rows: [], error: true, msg: err }));

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Headquarter>>>;

type UseHeadquartersOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useHeadquarters({ config, variables }: UseHeadquartersOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['headquarters', variables],
    queryFn: () => getHeadquartersQuery(variables),
    suspense: true,
  });
}

export default useHeadquarters;
