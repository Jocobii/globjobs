import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Department } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type CreateDepartmentDto = {
  data: Department;
};

export const createDepartmentMutationDocument = gql`
  mutation (
    $name: String!,
    $abbreviation: String!,
    $email: String!,
  ) {
    createDepartment(
      createDepartmentInput: {
        name: $name
        abbreviation: $abbreviation
        email: $email
      }
    ) {
      id: _id
      name
    }
  }
`;

export const createDepartment = ({
  data,
}: CreateDepartmentDto): Promise<Department> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createDepartmentMutationDocument,
  {
    ...data,
  },
).then((res) => res?.createDepartment);

type UseCreateDepartmentOptions = {
  config?: MutationConfig<typeof createDepartment>;
};

const queryKey = ['departments'];

export function useCreateDepartment({ config }: UseCreateDepartmentOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(queryKey, context.previousDepartments);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);

      successMessage('Department created');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createDepartment,
  });
}
