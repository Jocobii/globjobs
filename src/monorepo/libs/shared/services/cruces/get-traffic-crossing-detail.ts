import { gql, useQuery } from '@apollo/client';
import mongoose from 'mongoose';
import { Crossing } from '@gsuite/shared/contexts/cruces/CrossingContext';
import { useCrossing } from '@gsuite/shared/contexts';

type DispatchCrossing = {
  getDispatchFolderFiles: Crossing;
};

export const GET_CROSSING_DETAIL = gql`
  query GetDispatchFolderFiles($crossingId: String!) {
    getDispatchFolderFiles(crossingId: $crossingId) {
      id
      number
      user {
        id
        name
        lastName
      }
      trafficUser {
        id
        name
        lastName
      }
      openingDate
      status {
        _id
        name
        color
        publicName
      }
      client
      customerUser {
        id
        name
        lastName
      }
      clientNumber
      placas
      aduana
      patente
      type
      anden
      comments
      team
      nodes {
        externalNode {
          id
          text
          parent
          droppable
          data {
            file {
              url
              key
              name
            }
            ext
            name
            validate
            tags
            digitized
            unauthorized
            firstDigitized
          }
        }
      }
      economicNumber
      history {
        user {
          id
          name
          lastName
        }
        action
        operationDate
        files
        comments
      }
      updatedAt
      sentDarwin
      isWithoutTxtFlow
      canceledAt
      active
    }
  }
`;

export const useTrafficDetail = (crossingId: string, updateContext = false) => {
  const { crossing, setCrossing } = useCrossing();
  const { loading, error, data } = useQuery<
  DispatchCrossing
  >(GET_CROSSING_DETAIL, {
    variables: { crossingId },
    context: { clientName: 'globalization' },
    skip: !mongoose.Types.ObjectId.isValid(crossingId),
    onCompleted: (response) => {
      if (!updateContext) return;
      setCrossing(response.getDispatchFolderFiles);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  if (error) return { crossing, loading, error };
  return { loading, error, data };
};

export default useTrafficDetail;
