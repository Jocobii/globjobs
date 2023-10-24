import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
const { VITE_GATEWAY_URI } = import.meta.env;
const roleDocument = gql`
query GetRole(
  $id: String!,
) {
  role(id: $id) {
    id
    name
    modules {
      name
      key
      permissions {
        name
        checked
      }
    }
    notifications {
      email
      whatsapp
      notifications {
        name
        permissions {
          checked
          name
        }
      }
    }
    defaultRoute
    active
  }
}
`;

export const role = async (id: string) => request(`${VITE_GATEWAY_URI}/gq/back-office`, roleDocument, { id }).then((res) => res.role);

type QueryFnType = typeof role;

type UseRestfulTeamOptions = {
  config?: QueryConfig<QueryFnType>;
  id: string;
};

export function useRole({ id, config }: UseRestfulTeamOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['role', id],
    queryFn: () => role(id),
    suspense: true,
  });
}
