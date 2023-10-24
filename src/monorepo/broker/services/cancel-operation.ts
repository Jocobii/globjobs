import { gql, useMutation } from '@apollo/client';

export const CANCEL_OPERATION = gql`
mutation($operationId: String!, $cancellationReason: String!) {
  cancelOperation(id: $operationId, cancellationReason: $cancellationReason) {
    _id
  }
}
`;

export function useCancelOperation() {
  const [cancelOperation] = useMutation(CANCEL_OPERATION);

  return { cancelOperation };
}
