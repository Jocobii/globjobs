import { gql, useMutation } from '@apollo/client';

const ASSIGN_TRAFFIC_USER = gql`
  mutation assignTrafficUser($crossingId: String!, $userId: String) {
    assignTrafficUser(crossingId: $crossingId, userId: $userId) {
      number
    }
  }
`;

export const useAssignTrafficUser = () => useMutation(ASSIGN_TRAFFIC_USER, {
  context: { clientName: 'globalization' },
});
