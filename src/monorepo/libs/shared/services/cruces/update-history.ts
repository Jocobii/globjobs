import { gql, useMutation } from '@apollo/client';

export const CRUCE_HISTORY_UPDATE = gql`
mutation UpdateCrossingHistory($operation: UpdateCrossingHistoryInput!) {
  updateCrossingHistory(operation: $operation) {
    id
    history {
      action
      comments
      files
      operationDate
      user {
        id
        lastName
        name
      }
    }
  }
}

`;

export function useUpdateCruceHistory() {
  const [updateHistory] = useMutation(CRUCE_HISTORY_UPDATE);

  return { updateHistory };
}
