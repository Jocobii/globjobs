import { gql, useQuery } from '@apollo/client';
import { CreateCrossingType } from '../types';

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

type FilterOption = {
  variables?: Record<string, unknown>;
};
type crossingList = {
  page: number;
  pageSize: number;
  rows: CreateCrossingType[] | [];
  total: number;
  totalPages: number;
};

const emptyResponse: crossingList = {
  page: 1,
  pageSize: 1,
  rows: [],
  total: 1,
  totalPages: 1,
};

type CruceListResponse = {
  crossingList: crossingList | undefined;
};

export const useCrucesList = ({ variables } : FilterOption) => {
  const {
    data, loading, error, refetch, fetchMore,
  } = useQuery<CruceListResponse>(PAGINATE_CRUCES, {
    variables,
    context: { clientName: 'globalization' },
  });

  return {
    data: data?.crossingList ?? emptyResponse,
    loading,
    error,
    refetch,
    fetchMore,
  };
};
