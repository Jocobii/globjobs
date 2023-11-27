import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

export const PAGINATE_COMPANY = gql`
  query ($page: Int, $pageSize: Int, $sort: String, $filter: [FilterDtoInput!]) {
    companyList(
      paginateInput: { page: $page, pageSize: $pageSize, sort: $sort, filter: $filter }
    ) {
      rows {
        id: _id
        number
        name
        active
        rfc
        users {
          id: _id
          name
          lastName
          emailAddress
        }
        team {
          id
          name
        }
      }
      total
      totalPages
      page
      pageSize
    }
  }
`;

const INITIAL_PAGESIZE = 10;
const INITIAL_PAGE = 1;

export const useCompanyList = () => {
  const [pageSize, setPageSize] = useState(INITIAL_PAGESIZE);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [variables, setVariables] = useState<Record<any, any>>({});

  const {
    data,
    loading,
    error,
    fetchMore,
    refetch: refetchData,
  } = useQuery(PAGINATE_COMPANY, {
    variables: {
      filter: variables.filter || {},
      pageSize,
      page,
    },
  });

  useEffect(() => {
    fetchMore({
      query: PAGINATE_COMPANY,
      variables: {
        filter: variables.filter || {},
        pageSize,
        page,
      },
    });
  }, [variables, data?.companyList?.rows]);

  const handlePageChange = (p: number) => {
    if (p < 0) return;

    setPage(p + 1);

    fetchMore({
      query: PAGINATE_COMPANY,
      variables: {
        filter: variables.filter || {},
        pageSize,
        page,
      },
    });
  };

  const handleFilterAndSort = (options: Record<any, any>) => setVariables(options);

  const refetch = () => {
    setPage(INITIAL_PAGE);
    setPageSize(INITIAL_PAGESIZE);
    setVariables({});
    refetchData();
  };

  return {
    handleFilterAndSort,
    handlePageChange,
    setPageSize,
    pageSize,
    page,
    data,
    loading,
    error,
    refetch,
  };
};
