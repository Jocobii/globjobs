import { gql, useQuery } from '@apollo/client';

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
      customerUser{
        name
        lastName
      }
      status {
        id: _id
        name
        color
        publicName
      }
      typeModulation
      trafficType
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
      statusHistory {
        statusId
        startedAt
        finishedAt
      }
      type
      openingDate
      client
      placas
      economicNumber
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

export const useCrucesList = ({ variables } : FilterOption) => {
  const {
    data, loading, error, refetch, fetchMore,
  } = useQuery(PAGINATE_CRUCES, {
    variables,
    context: { clientName: 'globalization' },
    pollInterval: 15000,
  });

  return {
    data,
    loading,
    error,
    refetch,
    fetchMore,
  };
};
