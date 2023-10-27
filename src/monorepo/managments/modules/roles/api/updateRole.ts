import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Role } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

type Response = {
  updateRole: Role;
};

export const updateRoleMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String!,
    $modules: [RoleModuleInput!],
    $notifications: RoleNotificationInput,
  ) {
    updateRole(
      id: $id,
      updateRoleInput: {
        name: $name
        modules: $modules,
        notifications: $notifications,
      }
    ) {
      name
    }
  }
`;

export const updateRole = ({ data }: any): Promise<Role> => request<Response>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateRoleMutationDocument,
  {
    id: data.id,
    name: data.name,
    modules: data.modules,
    notifications: data.notifications,
  },
).then((res) => res.updateRole);

type UseUpdateRoleOptions = {
  config?: MutationConfig<typeof updateRole>;
};

const queryKey = ['roles'];

export function useUpdateRole({ config }: UseUpdateRoleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __: unknown, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(queryKey, context.previousRoles);
      }
      const message = String(error.message).substring(0, String(error.message).indexOf(':'));
      errorMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      successMessage('Role updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateRole,
  });
}
