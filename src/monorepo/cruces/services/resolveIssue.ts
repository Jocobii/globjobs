import { gql, useMutation } from '@apollo/client';

export const ISSUE_RESOLVER = gql`
mutation ResolveIssue($crossingId: String!, $currentIssue: Float!, $issues: [CrossingIssuesInput!]!, $currentFile: Float!, $nodeId: String!) {
  resolveIssue(crossingId: $crossingId, currentIssue: $currentIssue, issues: $issues, currentFile: $currentFile, nodeId: $nodeId) {
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

export function useIssueResolver() {
  const [resolveIssue] = useMutation(ISSUE_RESOLVER);

  return { resolveIssue };
}
