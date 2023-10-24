import { gql, useMutation } from '@apollo/client';

const REASON_CROSSING_QUERY = gql`
  mutation AddReasonForDelayToStatus($crossingId: String!, $reason: String!) {
  addReasonForDelayToStatus(crossingId: $crossingId, reason: $reason) {
    statusId
    startedAt
    finishedAt
    resolved
  }
}
`;

export const useReasonDelayCrossing = () => useMutation(REASON_CROSSING_QUERY, {
  context: { clientName: 'globalization' },
});
