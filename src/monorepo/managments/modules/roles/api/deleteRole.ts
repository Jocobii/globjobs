import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useTranslation } from 'react-i18next';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';
import { getCustomPropsFromError } from '@gsuite/shared/utils';
import { Role } from '../types';

export type DeleteRoleDto = {
  roleId: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export const deleteRoleMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteRole(
      id: $id
    ) {
      id
      name
    }
  }
`;

export const deleteRole = ({ roleId }: DeleteRoleDto):
Promise<Role> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteRoleMutationDocument,
  {
    id: roleId,
  },
).then((res) => res.deleteRole);

type UseDeleteRoleOptions = {
  config?: MutationConfig<typeof deleteRole>;
  roleId?: string;
};

const queryKey = ['roles'];

export function useDeleteRole({ config, roleId }: UseDeleteRoleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  const { t } = useTranslation();

  return useMutation({
    onMutate: async (res: { roleId?: string }) => {
      await queryClient.cancelQueries(['role', res?.roleId]);
    },
    onError: (error: any, __, context: any) => {
      const { qtyUsers, i18Key = 'GENERIC_ERROR', roleName } = getCustomPropsFromError(error);
      if (context?.previousRoles) {
        queryClient.setQueryData(queryKey, context.previousRoles);
      }
      errorMessage(t<string>(`managements.roles.${i18Key}`, { qtyUsers, roleName }));
    },
    onSuccess: (data: Role) => {
      queryClient.refetchQueries(['roles', roleId]);
      queryClient.invalidateQueries(queryKey);
      queryClient.refetchQueries(['roles-summary']);
      successMessage(t<string>('managements.roles.roleDeleted', { roleName: data.name }));
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteRole,
  });
}
