import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Area } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type DeleteAreaDto = {
  areaId: string;
};

export const deleteAreaMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteArea(
      id: $id
    ) {
      id: _id
      name
    }
  }
`;

export const deleteArea = ({ areaId }: DeleteAreaDto): Promise<Area> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteAreaMutationDocument,
  {
    id: areaId,
  },
).then((res) => res.deleteArea);

type UseDeleteAreaOptions = {
  config?: MutationConfig<typeof deleteArea>;
  areaId?: string;
};

const queryKey = ['areas'];

export function useDeleteArea({ config, areaId }: UseDeleteAreaOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (res: { areaId?: string }) => {
      await queryClient.cancelQueries(['area', res?.areaId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousAreas);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['area', areaId]);
      queryClient.invalidateQueries(queryKey);

      successMessage('Area deleted');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteArea,
  });
}
