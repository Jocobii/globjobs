import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Department } from '../types';

export type UpdateDepartmentDto = {
  data: Partial<Department>;
  departmentId: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export const updateDepartmentMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String,
    $abbreviation: String,
    $email: String,
  ) {
    updateDepartment(
      id: $id
      updateDepartmentInput: {
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

export const updateDepartment = ({ data, departmentId }: UpdateDepartmentDto):
Promise<Department> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateDepartmentMutationDocument,
  {
    id: departmentId,
    ...data,
  },
).then((res) => res.updateDepartment);

type UseUpdateDepartmentOptions = {
  config?: MutationConfig<typeof updateDepartment>;
  departmentId?: string;
};

const queryKey = ['departments'];

export function useUpdateDepartment({ config, departmentId }: UseUpdateDepartmentOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['department', departmentId]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(queryKey, context.previousDepartments);
      }
      errorMessage(error.message);
    },
    onSuccess: async (data: any) => {
      queryClient.refetchQueries(['department', data?.id]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Department updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateDepartment,
  });
}
