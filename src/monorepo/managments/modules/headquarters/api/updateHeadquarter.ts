import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Headquarter } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type UpdateHeadquarterDto = {
  data: Partial<Headquarter>;
  headquarterId: string;
};

export const updateHeadquarterMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String,
    $type: String,
    $address: AddressDtoInput,
    $phone: String,
  ) {
    updateHeadquarter(
      id: $id
      updateHeadquarterInput: {
        name: $name
        type: $type
        address: $address
        phone: $phone
      }
    ) {
      id
      name
    }
  }
`;

export const updateHeadquarter = ({ data, headquarterId }: UpdateHeadquarterDto):
Promise<Headquarter> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateHeadquarterMutationDocument,
  {
    id: headquarterId,
    name: data?.name,
    type: data?.type,
    phone: data?.phone,
    address: {
      address1: data?.address?.address1,
      address2: data?.address?.address2,
      city: data?.address?.city,
      state: data?.address?.state,
      postalCode: data?.address?.postalCode,
      country: data?.address?.country,
    },
  },
).then((res) => res.updateHeadquarter);

type UseUpdateHeadquarterOptions = {
  config?: MutationConfig<typeof updateHeadquarter>;
  headquarterId?: string;
};

const queryKey = ['headquarters'];

export function useUpdateHeadquarter({ config, headquarterId }: UseUpdateHeadquarterOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['headquarter', headquarterId]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousHeadquarters);
      }
      errorMessage(error.message);
    },
    onSuccess: async (data: any) => {
      queryClient.refetchQueries(['headquarter', data?.id]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Headquarter updated');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateHeadquarter,
  });
}

export default useUpdateHeadquarter;
