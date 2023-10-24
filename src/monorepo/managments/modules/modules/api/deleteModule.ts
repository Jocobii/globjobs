import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Module } from '../types';

export type DeleteModuleDto = {
  moduleId: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export const deleteModuleMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteModule(
      id: $id
    ) {
      id
      name
    }
  }
`;

export const deleteModule = ({ moduleId }: DeleteModuleDto):
Promise<Module> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteModuleMutationDocument,
  {
    id: moduleId,
  },
).then((res) => res.deleteModule);

type UseDeleteModuleOptions = {
  config?: MutationConfig<typeof deleteModule>;
  moduleId?: string;
};

const queryKey = ['modules'];

export function useDeleteModule({ config, moduleId }: UseDeleteModuleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (res: { moduleId?: string }) => {
      await queryClient.cancelQueries(['module', res?.moduleId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousModule) {
        queryClient.setQueryData(queryKey, context.previousModule);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['module', moduleId]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Module deleted');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteModule,
  });
}
