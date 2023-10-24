import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Menu } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

export type DeleteMenuDto = {
  menuId: string;
};

export const deleteMenuMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteMenu(
      id: $id
    ) {
      id
      name
    }
  }
`;

export const deleteMenu = ({ menuId }: DeleteMenuDto):
Promise<Menu> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteMenuMutationDocument,
  {
    id: menuId,
  },
).then((res) => res.deleteMenu);

type UseDeleteMenuOptions = {
  config?: MutationConfig<typeof deleteMenu>;
  menuId?: string;
};

const queryKey = ['menus'];

export function useDeleteMenu({ config, menuId }: UseDeleteMenuOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (res: { menuId?: string }) => {
      await queryClient.cancelQueries(['menu', res?.menuId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousMenu) {
        queryClient.setQueryData(queryKey, context.previousMenu);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['area', menuId]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Menu deleted');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteMenu,
  });
}
