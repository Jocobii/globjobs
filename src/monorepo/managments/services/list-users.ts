import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

export const PAGINATE_USERS = gql`
  query PaginateUsers($page: Int, $pageSize: Int, $sort: String) {
    listUsers(listUsersInput: { page: $page, pageSize: $pageSize, sort: $sort }) {
      rows {
        id: _id
        name
        lastName
        active
        emailAddress
        area {
          id: _id
          name
        }
        department {
          id: _id
          name
        }
        headquarter {
          id
          name
        }
        employeeNumber
        birthDate
        phoneNumber
        coach
        costCenter
        charge
        employeeType
        darwinUser
        rbSystemsUser
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const useUsers = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const {
    data, loading, error, fetchMore, refetch,
  } = useQuery(PAGINATE_USERS, {
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
      query: PAGINATE_USERS,
      variables: {
        page: p,
        pageSize,
      },
    });
  };

  const handleRefetch = () => refetch({
    page,
    pageSize,
  });

  return {
    page,
    pageSize,
    data,
    loading,
    handleRefetch,
    error,
    setPageSize,
    handlePageChange,
  };
};
