import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { get } from 'lodash';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Module } from '../types';

export type UpdateModuleDto = {
  data: Partial<Module>;
  moduleId: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
type SelectOption = {
  id: string;
  name: string;
};

export const updateModuleMutationDocument = gql`
    mutation (
        $id: String!
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
        updateModule(
            id: $id,
            updateModuleInput: {
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

export const updateModule = ({ data, moduleId }: UpdateModuleDto): Promise<Module> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateModuleMutationDocument,
  {
    id: moduleId,
    name: data.name,
    description: data.description,
    component: data.component,
    exact: data.exact,
    icon: data.icon,
    route: data.route,
    endpoint: data.route,
    toolbox: data.toolbox,
    actions: get(data, 'actions', []).map(({ id }: SelectOption) => id),
    environment: data.environment,
  },
).then((res) => res.updateModule);

type UseUpdateModuleOptions = {
  config?: MutationConfig<typeof updateModule>;
  moduleId?: string;
};

const queryKey = ['modules'];

export function useUpdateModule({ config, moduleId }: UseUpdateModuleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['module', moduleId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(queryKey, context.previousModules);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['module', moduleId]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Module updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateModule,
  });
}
