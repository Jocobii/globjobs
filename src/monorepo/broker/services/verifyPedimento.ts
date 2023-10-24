import { gql, useLazyQuery } from '@apollo/client';

export type VerifyPedimento = {
  pedimento: string;
  clave: string;
  tipo: number;
  fileId: string;
};

export const VERIFY_PEDIMENTO = gql`
  query($pedimento: String!, $clave: String!, $tipo: Float!, $fileId: String!, $invoiceNumber: String!) {
    QueryPedimento(pedimento: $pedimento, clave: $clave, tipo: $tipo, fileId: $fileId, invoiceNumber: $invoiceNumber) {
      requirementNumber
      patente
      aduana
      remesa
      businessName
      reference
      invoiceNumber
      packagesQuantity
      fileId
    }
  }
`;

export const usePedimentoValidation = () => {
  const [QueryPedimento, { loading, data, error }] = useLazyQuery(VERIFY_PEDIMENTO);
  const isValid = data?.QueryPedimento?.pedimento && !loading && !error;

  let hasError: boolean = !loading && !!error;

  const validatePedimento = async (pedimento = '', clave = '', tipo = 0, fileId = '', invoiceNumber = '') => {
    try {
      await QueryPedimento({
        variables: {
          pedimento,
          clave,
          tipo,
          fileId,
          invoiceNumber,
        },
      });
    } catch (err) {
      hasError = true;
    }
  };

  return {
    loading,
    data: data?.QueryPedimento,
    isValid,
    hasError,
    validatePedimento,
  };
};
