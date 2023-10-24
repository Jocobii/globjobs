import { gql, useMutation } from '@apollo/client';

export type SendCruseMutation = {
  id: string;
  sendCrossing: {
    error: boolean;
    message: string;
  }
};

export const CRUSE_MUTATION = gql`
  mutation($id: String!){
  sendCrossing(id: $id){
    error
    message
  }
}
`;

export const useSendCruce = () => {
  const [sendCrossing, { loading }] = useMutation<SendCruseMutation>(CRUSE_MUTATION, {
    context: { clientName: 'globalization' },
  });

  return { sendCrossing, loading };
};
