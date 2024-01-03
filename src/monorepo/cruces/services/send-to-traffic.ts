import { gql, useMutation } from '@apollo/client';

export const SEND_CROSSING_TO_TRAFFIC_MUTATION = gql`
  mutation SendCrossingToTraffic($sendTraffic: SendCrossingToTrafficInput!) {
    sendCrossingToTraffic(sendTraffic: $sendTraffic) {
      number
      history {
        action
        operationDate
        comments
        user {
          id
          lastName
          name
        }
      }
      status {
        name
      }
    }
  }
`;

export const useSendToTraffic = () => {
  const [sendCrossingToTraffic, { loading }] = useMutation(SEND_CROSSING_TO_TRAFFIC_MUTATION, {
    context: { clientName: 'globalization' },
  });

  return { sendCrossingToTraffic, loading };
};
