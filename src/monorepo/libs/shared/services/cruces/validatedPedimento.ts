import { gql, useMutation } from '@apollo/client';

export type ValueDarwin = {
  FechaDePagoBanco?: string;
  aduana?: string;
  cliente?: string;
  id?: number;
  key?: string;
  number?: string;
  patente?: string;
  type?: number;
  remesas?: {
    numero?: string;
    factura?: string;
    tipo: string;
    fecha: string;
    patente: string;
    aduana: string,
  }
};
export type ValidateFile = {
  fileId: string;
  validated: boolean;
  data?: ValueDarwin;
};

export type PropsValidateFile = {
  fileId?: string;
  pedimento?: string;
  aduana?: string;
  patente?: string;
  factura?: string;
};

export type ValidatePedimento = {
  validatePedimento: [ValidateFile]
};

export const VALIDATE_PEDIMENTO = gql`
  mutation($validateFiles: [ValidateFilesInput!]!){
  validatePedimento(validateFiles: $validateFiles){
    fileId
    validated
    data {
      id
      number
      type
      key
      cliente
      FechaDePagoBanco
      remesas {
        numero
        tipo
        factura
        fecha
        patente
        aduana
      }
      aduana
      patente
    }
  }
}
`;
export function useValidateFiles() {
  return useMutation(VALIDATE_PEDIMENTO);
}
