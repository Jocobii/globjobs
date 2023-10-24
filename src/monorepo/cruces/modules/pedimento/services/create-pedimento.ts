import { gql, useMutation } from '@apollo/client';
import { useSnackNotification } from '@gsuite/shared/hooks';

export const PEDIMENTO_MUTATION = gql`
mutation CreateCrossingPedimento($crossing: CreateCrossingPedimentoInput!) {
  createCrossingPedimento(crossing: $crossing) {
    aduana
    id
    pedimento
    client
    clientNumber
    patente
    type
    nodes {
      externalNode {
        id
        parent
        text
        data {
          pendingPaymentAuthorization
          pendingAuthorization
          ext
          name
        }
      }
    }
  }
}
`;

export function useCreatePedimento() {
  const { successMessage, errorMessage } = useSnackNotification();
  const [createCrossingPedimento] = useMutation(PEDIMENTO_MUTATION, {
    onCompleted: () => successMessage('Pedimento creado correctamente'),
    onError: () => errorMessage('Hubo un error al crear el pedimento'),
  });

  return { createCrossingPedimento };
}
