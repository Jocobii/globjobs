import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Department } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
export type DeleteDepartmentDto = {
  departmentId: string;
};

export const deleteDepartmentMutationDocument = gql`
  mutation (
    $id: String!,
  ) {
    deleteDepartment(
      id: $id
    ) {
      id: _id
      name
    }
  }
`;

export const deleteDepartment = ({ departmentId }: DeleteDepartmentDto):
Promise<Department> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteDepartmentMutationDocument,
  {
    id: departmentId,
  },
).then((res) => res.deleteDepartment);

type UseDeleteDepartmentOptions = {
  config?: MutationConfig<typeof deleteDepartment>;
  departmentId?: string;
};

const queryKey = ['departments'];

export function useDeleteDepartment({ config, departmentId }: UseDeleteDepartmentOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (res: { departmentId?: string }) => {
      await queryClient.cancelQueries(['department', res?.departmentId]);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(queryKey, context.previousDepartments);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['department', departmentId]);
      queryClient.invalidateQueries(queryKey);

      successMessage('Department deleted');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteDepartment,
  });
}
