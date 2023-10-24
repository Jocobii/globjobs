import { gql, useQuery } from '@apollo/client';

export type ProformaReview = {
  infoProformaReview: {
    aduana: string;
    patente: string;
    paymentMethod: string;
    pedimento: string;
    amount: string;
  }
};

export const PROFORMA_REVIEW_QUERY = gql`
query Query($crossingId: String!, $fileId: String!) {
  infoProformaReview(crossingId: $crossingId, fileId: $fileId) {
    aduana
    patente
    paymentMethod
    pedimento
    amount
  }
}
`;

export const useProformaReview = (
  crossingId: string,
  fileId: string,
) => useQuery<ProformaReview>(PROFORMA_REVIEW_QUERY, {
  variables: { crossingId, fileId },
  context: { clientName: 'globalization' },
});
