import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import { useSnackNotification } from '@gsuite/shared/hooks';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { User } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
export const toggleActiveUserMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    toggleActiveUser(
      id: $id
    ) {
      id: _id
      name
    }
  }
`;

export const toggleActiveUser = ({ id }: { id: string }): Promise<User> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  toggleActiveUserMutationDocument,
  {
    id,
  },
).then((res) => res.user);

type UseToggleActiveUserOptions = {
  config?: MutationConfig<typeof toggleActiveUser>;
  userId?: string;
};

const queryKey = ['users'];

export function useToggleActiveUser({ config, userId }: UseToggleActiveUserOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['user', userId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['user', userId]);
      queryClient.invalidateQueries(queryKey);
      successMessage('User updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: toggleActiveUser,
  });
}
