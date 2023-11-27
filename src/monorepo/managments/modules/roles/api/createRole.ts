import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import { useSnackNotification } from '@gsuite/shared/hooks';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';
import { ENVIRONMENTS_SUITE } from '@gsuite/shared/seeders';
import { Role } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

type CreateRoleDto = {
  createRole: Role;
};

export const createRoleMutationDocument = gql`
  mutation (
    $name: String!,
    $modules: [RoleModuleInput!]!,
    $notifications: RoleNotificationInput!,
    $environment: String!
  ) {
    createRole(
      createRoleInput: {
        name: $name
        modules: $modules,
        notifications: $notifications,
        environment: $environment
      }
    ) {
      name
    }
  }
`;

export const createRole = ({ data }: any): Promise<Role> => request<CreateRoleDto>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createRoleMutationDocument,
  {
    name: data.name,
    modules: data.modules,
    notifications: data.notifications,
    environment: ENVIRONMENTS_SUITE, // data.environment,
  },
).then((res) => res.createRole);

type UseCreateRoleOptions = {
  config?: MutationConfig<typeof createRole>;
};

const queryKey = ['roles'];

export function useCreateRole({ config }: UseCreateRoleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(queryKey, context.previousRoles);
      }

      // Substring al primer :, validar que los errores tengan ese formato.
      // ya que lo regresa stack completo
      const message = String(error.message).substring(0, String(error.message).indexOf(':'));
      errorMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.refetchQueries(['roles-summary']);
      queryClient.invalidateQueries(['restful-roles']);
      successMessage('Role created');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createRole,
  });
}
