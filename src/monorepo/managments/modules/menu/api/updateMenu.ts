import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { get } from 'lodash';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Menu } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

export type UpdateModuleDto = {
  data: Partial<Menu>;
  menuId: string;
};

export const updateMenuMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String!,
    $environment: EnvironmentsInput!
    $icon: String!,
    $order: String!
    $modules: [String!]!
  ) {
    updateMenuAndSort(
      id: $id,
      updateMenuInput: {
        name: $name,
        environment: $environment,
        icon: $icon,
        order: $order,
        modules: $modules
      }
    ) {
      name
    }
  }
`;

export const updateMenu = ({ data, menuId }: UpdateModuleDto): Promise<Menu> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateMenuMutationDocument,
  {
    id: menuId,
    name: data.name,
    icon: data.icon,
    order: data.order,
    modules: get(data, 'modules', []).map(({ id }) => id),
    environment: data.environment,
  },
).then((res) => res.user);

type UseUpdateMenuOptions = {
  config?: MutationConfig<typeof updateMenu>;
  menuId?: string;
};

const queryKey = ['menus'];

export function useUpdateMenu({ config, menuId }: UseUpdateMenuOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['menu', menuId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(queryKey, context.previousModules);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['menu', menuId]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Module updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateMenu,
  });
}
