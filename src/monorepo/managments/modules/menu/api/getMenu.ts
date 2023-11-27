import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

const { VITE_GATEWAY_URI } = import.meta.env;

const getMenuDocument = gql`
  query menu($id: String!) {
    menu(id: $id) {
      name
      icon
        environment {
            id
            name
        }
        modules {
            id
            name
        }
        order
        active
    }
  }
`;

export const getMenuQuery = async (id?: string) => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, getMenuDocument, { id }).then((res) => res.menu);

type QueryFnType = typeof getMenuQuery;
type UseMenuOptions = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

export function useGetMenu({ id, config }: UseMenuOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['menu', id],
    queryFn: () => getMenuQuery(id),
    suspense: true,
    enabled: !!id && id !== 'create',
  });
}
