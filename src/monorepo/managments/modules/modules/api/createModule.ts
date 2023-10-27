import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Module } from '../types';

export type CreateModuleDto = {
  data: Module;
};

type SelectOption = {
  id: string;
  name: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export const createModuleMutationDocument = gql`
  mutation (
    $name: String!,
    $description: String!,
    $component: String!,
    $exact: Boolean!,
    $icon: String!,
    $route: String!,
    $toolbox: Boolean!,
    $actions: [String!]!,
    $environment: EnvironmentsInput!
    $endpoint: String!
  ) {
    createModule(
      createModuleInput: {
        name: $name,
        description: $description,
        component: $component,
        exact: $exact,
        icon: $icon,
        route: $route,
        endpoint: $endpoint,
        toolbox: $toolbox,
        actions: $actions,
        environment: $environment
      }
    ) {
      name
    }
  }
`;

export const createModule = ({ data }: any): Promise<Module> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createModuleMutationDocument,
  {
    name: data.name,
    description: data.description,
    component: data.component,
    exact: data.exact,
    icon: data.icon,
    route: data.route,
    endpoint: data.route,
    toolbox: data.toolbox,
    actions: data.actions.map(({ id }: SelectOption) => id),
    environment: data.environment,
  },
).then((res) => res.user);

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createModule>;
};

const queryKey = ['modules'];

export function useCreateModule({ config }: UseCreateModuleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(queryKey, context.previousModules);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      successMessage('Module created');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createModule,
  });
}
