import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

export const PAGINATE_MONITOR = gql`
query getDataMonitor($page: Int, $pageSize: Int) {
  monitors(listMonitorsInput: { page: $page, pageSize: $pageSize}) {
    rows {
      id: _id
      week
      gops
      warehouse
      estimation
      court
      shippingOrder
      type
      client
      rule7501
      rule321
      rule8501
      transit
      driveType
      economic
      unitArrival
      documentGeneration
      immex
      invoice
      sentDocuments
      documentsDelivered
      unitDispatch
      moduleMX
      moduleUSA
      weighingMachine
      arrivalAlmUsa
      offloadAlmUsa
      delivered
      totalTime
    }
    total
    page
    pageSize
    totalPages
  }
}
`;

export const useMonitor = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const {
    data, loading, error, fetchMore,
  } = useQuery(PAGINATE_MONITOR, {
    variables: {
      page,
      pageSize,
    },
  });

  const handlePageChange = (p: number) => {
    if (p < 0) {
      return;
    }

    setPage(p);
    fetchMore({
      query: PAGINATE_MONITOR,
      variables: {
        page: p,
        pageSize,
      },
    });
  };

  const handleStatusChange = () => {
    fetchMore({
      query: PAGINATE_MONITOR,
      variables: {
        page,
        pageSize,
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
  };
};
