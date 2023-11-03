import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';
import { MutationConfig, queryClient } from '@/lib/react-query';

import { User } from '../types';

type Response = {
  toggleActiveUser: User;
};

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

export const toggleActiveUser = ({ id }: { id: string }): Promise<User> => graphqlGatewayClient.request<Response>(
  toggleActiveUserMutationDocument,
  {
    id,
  },
).then((res) => res.toggleActiveUser);

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
