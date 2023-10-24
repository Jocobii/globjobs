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
