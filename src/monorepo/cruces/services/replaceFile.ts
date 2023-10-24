import { gql, useMutation } from '@apollo/client';

export const REPLACE_FILE = gql`
mutation replaceFile($crossingId: String!, $currentFile: Float!, $nodeId: String!) {
  replaceFile(crossingId: $crossingId, currentFile: $currentFile, nodeId: $nodeId) {
    data {
      digitized
      ext
      file {
        key
        name
        url
      }
      issues {
        name
        warnings
        issues {
          field
          line
          message
          newValue
          resolved
          rule
          section
          type
          value
        }
        errors
      }
      name
      tags
      validate
    }
    droppable
    id
    parent
    text
  }
}
`;

export function useReplaceFile() {
  const [replaceFile] = useMutation(REPLACE_FILE);

  return { replaceFile };
}
