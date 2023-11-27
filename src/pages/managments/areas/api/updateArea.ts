import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Area } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type UpdateAreaDto = {
  data: Partial<Area>;
  areaId: string;
};

export const updateAreaMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String,
    $abbreviation: String,
    $department: DepartmentDtoInput,
  ) {
    updateArea(
      id: $id
      updateAreaInput: {
        name: $name
        abbreviation: $abbreviation
        department: $department
      }
    ) {
      id: _id
      name
    }
  }
`;

export const updateArea = ({ data, areaId }: UpdateAreaDto): Promise<Area> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateAreaMutationDocument,
  {
    id: areaId,
    name: data.name,
    abbreviation: data.abbreviation,
    department: data.department,
  },
).then((res) => res.updateArea);

type UseUpdateAreaOptions = {
  config?: MutationConfig<typeof updateArea>;
  areaId?: string;
};

const queryKey = ['areas'];

export function useUpdateArea({ config, areaId }: UseUpdateAreaOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['area', areaId]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousAreas);
      }

      errorMessage(error.message);
    },
    onSuccess: async (data: any) => {
      queryClient.refetchQueries(['area', data?.id]);
      queryClient.invalidateQueries(queryKey);

      successMessage('Area updated');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateArea,
  });
}
