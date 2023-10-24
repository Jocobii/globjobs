import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Area } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
const allAreasDocument = gql`
  query PaginateAreas($pagination: PaginationDtoInput) {
    areas(paginationInput: $pagination) {
      rows {
        id: _id
        name
        abbreviation
        department {
          id: _id
          name
        }
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const geAreasQuery = async (variables?: Record<string, unknown>) => request(`${VITE_GATEWAY_URI}/gq/back-office`, allAreasDocument, { pagination: variables }).then((res) => res.areas);

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<Area>>>;

type UseAreasOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useGetAreas({ config, variables }: UseAreasOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['areas', variables],
    queryFn: () => geAreasQuery(variables),
    suspense: true,
  });
}
