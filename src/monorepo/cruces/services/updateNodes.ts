import { gql, useMutation } from '@apollo/client';

export const CRUCE_UPDATE = gql`
mutation UpdateCrossing(
  $crossingId: String!
  $anden: String!
  $checker: String!
  $teamId: String!
  $comments: String!
  $dispatchFile: [CrossingNodeDetailInput!]!
) {
  updateNode(
    crossingId: $crossingId
    anden: $anden
    checker: $checker
    teamId: $teamId
    comments: $comments
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
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export function useUpdateCruce() {
  const [updateNode] = useMutation(CRUCE_UPDATE);

  return { updateNode };
}
