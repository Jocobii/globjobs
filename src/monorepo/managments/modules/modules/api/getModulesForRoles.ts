import { request, gql } from 'graphql-request';
import { ENVIRONMENTS_SUITE } from '@gsuite/shared/seeders';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

export type Module = {
  id: string;
  name: string;
  actions: string[],
};
const { VITE_GATEWAY_URI } = import.meta.env;
export type RestfulModulesResponse = {
  modulesRestful: Module[],
};

const restfulModuleDocument = gql`
query ModulesRestful($environment: String) {
  modulesRestful(environment: $environment) {
    name
    actions
  }
}
`;

export const restfulModules = async () => request<RestfulModulesResponse>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  restfulModuleDocument,
  { environment: ENVIRONMENTS_SUITE },
);

type QueryFnType = () => Promise<RestfulModulesResponse>;

type UseRestfulTeamOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulModules({ config }: UseRestfulTeamOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-modules'],
    queryFn: () => restfulModules(),
  });
}
