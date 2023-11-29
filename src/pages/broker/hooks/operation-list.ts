import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

export const PAGINATE_OPERATIONS = gql`
  query PaginateOperations($page: Int, $pageSize: Int, $sort: String, $status: String, $filter: [FilterInput!]) {
    operations(listOperationsInput: { page: $page, pageSize: $pageSize, sort: $sort, status: $status, filter: $filter }) {
      rows {
        id: _id
        number
        client
        container
        active
        completed
        notificationDate
        expectedArrivalDate
        releaseUsaDate
        transportationDate
        receiptUsaDate
        importMxDate
        borderCrossingDate
        warehouseMexDate
        completedDate
        timeElapsedTotal
        history {
          userName
        }
        gopsReferences{
          _id
          number
        }
        isCanceled
        canceledBy
        cancellationReason
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export type Variables = {
  filter?: Array<{
    c: string;
    o: string;
    v: string;
  }>
};

export const useOperations = (variables?: Variables) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [status, setStatus] = useState<string | null | undefined>(null);

  const {
    data, loading, error, fetchMore, refetch,
  } = useQuery(PAGINATE_OPERATIONS, {
    variables: {
      ...variables,
      page,
      pageSize,
      status,
    },
  });
  const handlePageChange = (p: number) => {
    if (p < 0) {
      return;
    }

    setPage(p);
    fetchMore({
      query: PAGINATE_OPERATIONS,
      variables: {
        ...variables,
        page: p,
        pageSize,
        status,
      },
    });
  };

  const handleStatusChange = (statusSearch: string | undefined) => {
    setStatus(statusSearch);
    fetchMore({
      query: PAGINATE_OPERATIONS,
      variables: {
        page,
        pageSize,
        status: statusSearch,
      },
    });
  };

  return {
    page,
    pageSize,
    data,
    loading,
    error,
    setPageSize,
    handlePageChange,
    handleStatusChange,
    refetch,
  };
};
