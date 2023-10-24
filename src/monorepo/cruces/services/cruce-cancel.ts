import { gql, useMutation } from '@apollo/client';

const CANCEL_CROSSING_QUERY = gql`
  mutation CancelCrossing($crossingId: String!, $userId: String) {
    cancelCrossing(crossingId: $crossingId, userId: $userId) {
      number
    }
  }
`;

export const useCancelCrossing = () => useMutation(CANCEL_CROSSING_QUERY, {
  context: { clientName: 'globalization' },
});
