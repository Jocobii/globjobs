import { gql, useQuery } from '@apollo/client';
import { PaginatedResponse } from '@gsuite/typings/table';

import { Menu } from '../types';

type PaginateMenusResponse = {
  menus: PaginatedResponse<Menu>;
};

const menusDocument = gql`
  query PaginateMenus($pagination: PaginationDtoInput) {
    menus(paginationInput: $pagination) {
      rows {
        id
        name
        environment {
          name
        }
        modules {
          name
        }
        icon
        order
        active
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const useMenus = (variables?: Record<string, unknown>) => {
  const { data, refetch, loading } = useQuery<PaginateMenusResponse>(menusDocument, { variables });

  return {
    data: data?.menus,
    loading,
    refetch,
  };
};

export default useMenus;
