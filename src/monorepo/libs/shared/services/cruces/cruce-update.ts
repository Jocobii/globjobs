import { gql, useMutation } from '@apollo/client';

export const CRUCE_UPDATE = gql`
mutation($crossing: UpdateCrossingInput!) {
  updateCrossing(crossing:$crossing) {
    id
  }
}
`;

export function useUpdateCruce() {
  const [updateCrossing] = useMutation(CRUCE_UPDATE);

  return { updateCrossing };
}

export const CRUCE_STATUS_UPDATE = gql`
mutation($id: String!, $status: String!) {
  updateStatusCrossing(id: $id, status: $status) {
    id
  }
}
`;

export function useUpdateStatusCruce() {
  const [updateStatusCrossing] = useMutation(CRUCE_STATUS_UPDATE);
  return { updateStatusCrossing };
}
