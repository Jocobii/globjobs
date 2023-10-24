import { useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Variables } from '@gsuite/typings/table';
import { CrossingQuery } from '@gsuite/typings/crossing';

export const PAGINATE_CRUCES = gql`
query($page: Int, $pageSize: Int, $sort: String, $filter: [FilterInput!], $filterBy: Int, $status: String){
  crossingList(paginateInput: {
    page: $page,
    pageSize: $pageSize,
    sort: $sort,
    filter: $filter,
    filterBy: $filterBy,
    status: $status
  }) {
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
        name
        color
        publicName
      }
      requiredActions {
        name
        nameFile
        resolved
      }
      statusHistory {
        statusId
        startedAt
        finishedAt
      }
      nodes {
        tree {
          data {
            valueDarwin {
              remesas {
                factura
                numero
                tipo
                patente
                aduana
                fecha
              }
              id
              number
              type
              FechaDePagoBanco
            }
          }
        }
      }
      typeModulation
      type
      openingDate
      client
      placas
      aduana
      patente
      anden
      comments
      economicNumber
      updatedAt
    }
    page
    pageSize
    totalPages
    total
  }
}
`;

export function useGetCrucesList(variables?: Variables) {
  const [status, setStatus] = useState<string | null>(null);
  const {
    data, loading, error, fetchMore, refetch,
  } = useQuery<CrossingQuery>(PAGINATE_CRUCES, {
    variables: {
      ...variables,
      status,
      filterBy: 1,
    },
    context: { clientName: 'globalization' },
  });

  const handleStatusChange = useCallback((statusSearch: string | null) => {
    setStatus(statusSearch);
    fetchMore({
      query: PAGINATE_CRUCES,
      variables: {
        status: statusSearch,
      },
    });
  }, [fetchMore]);

  useEffect(() => {
    if (status) {
      handleStatusChange(status);
    }
  }, [handleStatusChange, status]);
  return {
    setStatus,
    status,
    data,
    loading,
    error,
    handleStatusChange,
    refetch,
  };
}
