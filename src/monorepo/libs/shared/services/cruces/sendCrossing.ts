import { gql, useMutation } from '@apollo/client';

export type SendCruseQuery = {
  id: string;
  sendCrossing: {
    error: boolean;
    message: string;
  }
};

export const CRUSE_QUERY = gql`
  mutation($id: String!){
  sendCrossing(id:$id){
    error
    message
  }
}
`;

export const useSendCruce = (id: string) => useMutation<SendCruseQuery>(CRUSE_QUERY, {
  variables: {
    id,
  },
  context: { clientName: 'globalization' },
});
