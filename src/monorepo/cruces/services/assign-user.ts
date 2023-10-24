import { gql, useMutation } from '@apollo/client';

const ASSIGN_USER = gql`
  mutation AssignUser($crossingId: String!, $userId: String) {
    assignUser(crossingId: $crossingId, userId: $userId) {
      number
    }
  }
`;

export const useAssignUser = () => useMutation(ASSIGN_USER, {
  context: { clientName: 'globalization' },
});
