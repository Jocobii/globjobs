import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Area } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
export type CreateUserDto = {
  data: Area;
};

export const createAreaMutationDocument = gql`
  mutation (
    $name: String!,
    $abbreviation: String!,
    $department: DepartmentDtoInput!,
  ) {
    createArea(
      createAreaInput: {
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

export const createArea = ({ data }: CreateUserDto): Promise<Area> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createAreaMutationDocument,
  {
    name: data.name,
    abbreviation: data.abbreviation,
    department: data.department,
  },
).then((res) => res?.createArea);

type UseCreateAreaOptions = {
  config?: MutationConfig<typeof createArea>;
};

const queryKey = ['areas'];

export function useCreateArea({ config }: UseCreateAreaOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousAreas);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      successMessage('Area created');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createArea,
  });
}
