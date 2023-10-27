import { useQuery } from '@tanstack/react-query';
import { CreateCrossingType } from '../types';
import { PaginatedResponse } from '@/typings';
import { gql } from 'graphql-request';
import { graphqlGlobClient } from '@/clients';

export const PAGINATE_CRUCES = gql`
query($page: Int, $pageSize: Int, $sort: String, $filter: [FilterInput!], $filterBy: Int){
  crossingList(paginateInput: {page: $page, pageSize: $pageSize, sort: $sort, filter: $filter, filterBy: $filterBy}) {
    rows {
      id
      number
      user{
        name
        lastName
      }
      checker{
        name
      }
      status {
        id: _id
        name
        color
        publicName
      }
      typeModulation
      nodes {
        tree {
          data {
            valueDarwin {
              remesas {
                tipo
                numero
                factura
                patente
                aduana
              }
              id
              number
              type
              FechaDePagoBanco
            }
          }
        }
      }
      type
      openingDate
      client
      placas
      aduana
      patente
      anden
      comments
    }
    page
    pageSize
    totalPages
    total
  }
}
`;

type useCrucesListOptions = {
  variables?: Record<string, unknown>;
};

const emptyResponse: PaginatedResponse<CreateCrossingType> = {
  page: 1,
  pageSize: 1,
  rows: [],
  total: 1, 
  totalPages: 1,
};

type CruceListResponse = {
  crossingList: PaginatedResponse<CreateCrossingType>;
}
export const getCrucesList = async (variables?: Record<string, unknown>) => graphqlGlobClient.request<CruceListResponse>(PAGINATE_CRUCES, variables)
  .then((res) => res.crossingList)
  .catch(() => (emptyResponse));

  export function useCrucesList({ variables }: useCrucesListOptions = {}) {
  return useQuery({
    queryKey: ['cruces-get-list', variables],
    queryFn: () => getCrucesList(variables),
    suspense: true,
    refetchInterval: 10000,
  });
}
