import { gql, useMutation } from '@apollo/client';
import { CRUSE_QUERY } from './cruce-detail';

export const CRUCE_UPDATE = gql`
mutation updateDispatchFile(
  $crossingId: String!
  $dispatchFile: [CrossingNodeDetailInput!]!
) {
  updateDispatchFile(
    crossingId: $crossingId
    dispatchFile: $dispatchFile
  ) {
    id
    status {
      name
      color
      __typename
    }
    nodes {
      dispatchFileNode {
        id
        text
        parent
        droppable
        data {
          ext
          name
          validate
          file {
            url
            key
            name
          }
        }
      }
    }
  }
}
`;

export function useUpdateDispatchFile() {
  const [updateDispatchFile] = useMutation(CRUCE_UPDATE, {
    refetchQueries: [CRUSE_QUERY],
  });

  return { updateDispatchFile };
}
