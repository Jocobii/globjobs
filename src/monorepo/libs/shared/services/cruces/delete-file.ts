import { gql, useMutation } from '@apollo/client';

const DELETE_FILE = gql`
  mutation DeleteFile($crossingId: String!, $nodeId: String!) {
    deleteFile(crossingId: $crossingId, nodeId: $nodeId) {
      number
      nodes {
        externalNode {
          id
          text
          parent
          droppable
          data {
            tags
            name
          }
        }
      }
    }
  }
`;

export const useDeleteFile = () => {
  const [deleteFile, { loading, error }] = useMutation(DELETE_FILE);

  return { deleteFile, loading, error };
};
