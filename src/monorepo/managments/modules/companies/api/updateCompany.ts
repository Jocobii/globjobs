import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { CompanyFull, CompanyDocument } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

export type UpdateCompanyDto = {
  data: Partial<CompanyFull>;
  number?: string;
};

export const updateCompanyMutationDocument = gql`
  mutation (
    $number: String!
    $name: String!
    $rfc: String
    $email: String
    $type: String
    $address: AddressInput
    $export: ExportInput
    $import: ImportInput
    $merchandise: Boolean
    $merchandiseOption: String
    $oea: Boolean
    $oeaOption: String
    $prosec: Boolean
    $prosecOption: String
    $sectors: Boolean
    $taxes: Boolean
    $taxesOption: String
    $defaultPaymentMethod: String
  ) {
    updateCompany(
      updateCompanyInput: {
        number: $number
        name: $name
        rfc: $rfc
        email: $email
        type: $type
        address: $address
        export: $export
        import: $import
        merchandise: $merchandise
        merchandiseOption: $merchandiseOption
        oea: $oea
        oeaOption: $oeaOption
        prosec: $prosec
        prosecOption: $prosecOption
        sectors: $sectors
        taxes: $taxes
        taxesOption: $taxesOption
        defaultPaymentMethod: $defaultPaymentMethod
      }
    ) {
      number
      name
    }
  }
`;

export const updateCompany = ({ data, number }: UpdateCompanyDto):
Promise<CompanyDocument> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateCompanyMutationDocument,
  {
    id: number,
    ...data,
  },
).then((res) => res.updateCompany);

type UseUpdateCompanyOptions = {
  config?: MutationConfig<typeof updateCompany>;
  number?: string;
};

const queryKey = ['paginated-companies'];

export function useUpdateCompany({ config, number }: UseUpdateCompanyOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['company', number]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(queryKey, context.previousCompanies);
      }
      errorMessage(error.message);
    },
    onSuccess: async (data?: any) => {
      queryClient.refetchQueries(['company', data?.number]);
      queryClient.invalidateQueries(queryKey);
      successMessage('Cliente actualizado con éxito');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateCompany,
  });
}
