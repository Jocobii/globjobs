import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { graphqlGatewayClient } from '@/clients';

import { Role } from '../types';

export type RestfulRolesResponse = {
  rolesRestful: Array<Partial<Role>>,
};

const restfulRolesDocument = gql`
  query {
  rolesRestful {
    name,
    id,
    modules {
      name,
      permissions {
        name,
        checked
      }
    },
    notifications {
      email,
      whatsapp,
      notifications {
        name,
        key,
        permissions {
          name,
          checked
        }
      }
    }
  }
}
`;

export const restfulRoles = async (): Promise<RestfulRolesResponse> => graphqlGatewayClient.request<RestfulRolesResponse>(restfulRolesDocument);

type QueryFnType = () => Promise<RestfulRolesResponse>;

type UseRestfulRolesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulRoles({ config }: UseRestfulRolesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-roles'],
    queryFn: () => restfulRoles(),
  });
}
