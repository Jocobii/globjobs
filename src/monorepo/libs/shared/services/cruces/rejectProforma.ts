import { gql, useMutation } from '@apollo/client';

export const REJECT_PROFORMA = gql`
mutation RejectProforma($crossingId: String!, $nodeId: String!, $reason: String!, $userId: String) {
  rejectProforma(crossingId: $crossingId, nodeId: $nodeId, reason: $reason, userId: $userId) {
    data {
      name
    }
  }
}
`;

export const useRejectProform = () => useMutation(REJECT_PROFORMA, {
  context: { clientName: 'globalization' },
});

export const DELETE_PROFORMA = gql`
mutation DeleteProforma($crossingId: String!, $nodeId: String!, $userId: String) {
  deleteProforma(crossingId: $crossingId, nodeId: $nodeId, userId: $userId) {
    data {
      name
    }
  }
}
`;

export const useDeleteProform = () => useMutation(DELETE_PROFORMA, {
  context: { clientName: 'globalization' },
});
