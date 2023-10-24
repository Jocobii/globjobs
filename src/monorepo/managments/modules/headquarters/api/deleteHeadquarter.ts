import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Headquarter } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

export type DeleteHeadquarterDto = {
  headquarterId: string;
};

export const deleteHeadquarterMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteHeadquarter(
      id: $id
    ) {
      id
      name
    }
  }
`;

export const deleteHeadquarter = ({ headquarterId }: DeleteHeadquarterDto):
Promise<Headquarter> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteHeadquarterMutationDocument,
  {
    id: headquarterId,
  },
).then((res) => res.deleteHeadquarter);

type UseDeleteHeadquarterOptions = {
  config?: MutationConfig<typeof deleteHeadquarter>;
  headquarterId?: string;
};

const queryKey = ['headquarters'];

export function useDeleteHeadquarter({ config, headquarterId }: UseDeleteHeadquarterOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (res: { headquarterId?: string }) => {
      await queryClient.cancelQueries(['headquarter', res?.headquarterId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousHeadquarter) {
        queryClient.setQueryData(queryKey, context.previousHeadquarter);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['area', headquarterId]);
      queryClient.invalidateQueries(queryKey);

      successMessage('Headquarter created');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteHeadquarter,
  });
}
