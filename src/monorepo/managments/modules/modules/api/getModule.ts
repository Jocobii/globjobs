import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
const { VITE_GATEWAY_URI } = import.meta.env;
const getModuleDocument = gql`
  query module($id: String!) {
    module(id: $id) {
      name
        description
        component
        icon
        active
        route
        endpoint
        actions
        environment {
            id
            name
        }
    }
  }
`;

export const getModuleQuery = async (id: string) => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, getModuleDocument, { id }).then((res) => res.module);

type QueryFnType = typeof getModuleQuery;
type UseModuleOptions = {
  config?: QueryConfig<QueryFnType>;
  id: string;
};

export function useGetModule({ id, config }: UseModuleOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['module', id],
    queryFn: () => getModuleQuery(id),
    suspense: true,
  });
}
