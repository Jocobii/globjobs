import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Companies, CompanyDocument } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

export type CreateCompanyDto = {
  data: Companies;
};

export const createCompanyMutationDocument = gql`
mutation (
  $number: String!
  $name: String!
  $rfc: String!
  $email: String!
  $type: String!
  $address: AddressInput!
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
  $sendAdpAutomatically: Boolean
  $complementaryADPDocuments: ComplementaryADPDocumentsInput
  $mandatoryADPDocuments: MandatoryADPDocumentsInput
  $uens: UensInput
) {
  createCompany(
    createCompanyInput: {
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
      sendAdpAutomatically: $sendAdpAutomatically
      complementaryADPDocuments: $complementaryADPDocuments
      mandatoryADPDocuments: $mandatoryADPDocuments
      uens: $uens
    }
  ) {
    number
    name
  }
}
`;

export const createCompany = ({ data }: CreateCompanyDto): Promise<CompanyDocument> => request<any>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  createCompanyMutationDocument,
  {
    ...data,
  },
).then((res) => res?.createCompany);

type UseCreateCompanyOptions = {
  config?: MutationConfig<typeof createCompany>;
};

const queryKey = ['paginated-companies'];

export function useCreateCompany({ config }: UseCreateCompanyOptions = {}) {
  const { successMessage, errorMessage } = useSnackNotification();

  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousCompanies) {
        queryClient.setQueryData(queryKey, context.previousCompanies);
      }

      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);

      successMessage('Cliente creado con éxito');

      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createCompany,
  });
}
