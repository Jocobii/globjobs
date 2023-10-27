import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Headquarter } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

export type CreateHeadquarterDto = {
  data: Headquarter;
};

export const createHeadquarterMutationDocument = gql`
  mutation (
    $name: String,
    $type: String,
    $address: AddressDtoInput,
    $phone: String,
  ) {
    createHeadquarter(
      createHeadquarterInput: {
        name: $name
        type: $type
        address: $address
        phone: $phone
      }
    ) {
      name
    }
  }
`;

export const createHeadquarter = ({ data }: CreateHeadquarterDto): Promise<Headquarter> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createHeadquarterMutationDocument,
  {
    name: data?.name,
    type: data?.type,
    phone: data?.phone,
    address: {
      address1: data?.address.address1,
      address2: data?.address.address2,
      city: data?.address.city,
      state: data?.address.state,
      postalCode: data?.address.postalCode,
      country: data?.address.country,
    },
  },
).then((res) => res?.createArea);

type UseCreateHeadquarterOptions = {
  config?: MutationConfig<typeof createHeadquarter>;
};

const queryKey = ['headquarters'];

export function useCreateHeadquarter({ config }: UseCreateHeadquarterOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousHeadquarters);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);

      successMessage('Headquarter created');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createHeadquarter,
  });
}
export default useCreateHeadquarter;
