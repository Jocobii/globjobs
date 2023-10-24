import { gql, useMutation } from '@apollo/client';

export const REQUEST_DRAFT_OPERATION = gql`
  mutation RequestDraftOperation($crossingId: String!) {
    requestDraftOperation(crossingId: $crossingId) {
      id
    }
  }
`;

export function useRequestDraftOperation() {
  const [requestDraftOperation] = useMutation(REQUEST_DRAFT_OPERATION);

  return { requestDraftOperation };
}
