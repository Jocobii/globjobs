import { gql, useQuery } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
import { CrossingQuery } from '@gsuite/typings/crossing';

export const PAGINATE_CRUCES = gql`
query($page: Int, $pageSize: Int, $sort: String, $filter: [FilterInput!], $status: String,  $filterBy: Int){
  crossingList(paginateInput: {page: $page, pageSize: $pageSize, sort: $sort, filter: $filter, filterBy: $filterBy, status: $status}) {
    rows {
    id
    trafficUser {
      id
      name
      lastName
    }
    user {
      id
      name
      lastName
    }
    number
    status {
      _id
      name
      color
      publicName
    }
    client
    placas
    economicNumber
    type
  }
    pageSize
    page
    total
    totalPages
  }
}
`;

type FilterOption = {
  variables?: Record<string, unknown>;
  initStatus?: string;
};

const getAnyOperation = 3;

export const useCrucesList = ({ variables, initStatus }: FilterOption) => {
  const [status, setStatus] = useState<string>(initStatus ?? 'documentsReady');
  const {
    data, loading, error, refetch, fetchMore,
  } = useQuery<CrossingQuery>(PAGINATE_CRUCES, {
    variables: {
      ...variables,
      filterBy: getAnyOperation,
      status,
    },
    context: { clientName: 'globalization' },
  });

  const handleStatusChange = useCallback((statusSearch: string) => {
    setStatus(statusSearch);
    fetchMore({
      query: PAGINATE_CRUCES,
      variables: {
        ...variables,
        status: statusSearch,
      },
      context: { clientName: 'globalization' },
    });
  }, [fetchMore]);

  useEffect(() => {
    if (status) {
      handleStatusChange(status);
    }
  }, [handleStatusChange, status]);

  return {
    setStatus,
    data,
    loading,
    error,
    refetch,
    fetchMore,
    handleStatusChange,
  };
};
