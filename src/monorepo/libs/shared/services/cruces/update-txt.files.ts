import { gql, useMutation } from '@apollo/client';

export type ValidateTxT = {
  isValid: boolean;
  plates: string[];
  economic: string[];
  country: string[];
};

type Response = {
  checkCrossing: ValidateTxT;
};

const validateTxT = gql`
mutation($crossingId: String!) {
  checkCrossing(crossingId: $crossingId) {
    isValid
    plates
    economic
    country
  }
}
`;

export const useValidateTxT = () => useMutation<Response>(validateTxT, {
  context: { clientName: 'globalization' },
});

const updateTxT = gql`
mutation UpdatedTxtFiles($data: UpdateTxtInput!) {
  updatedTxtFiles(data: $data)
}
`;

export const useUpdateTxT = () => useMutation(updateTxT, {
  context: { clientName: 'globalization' },
});
