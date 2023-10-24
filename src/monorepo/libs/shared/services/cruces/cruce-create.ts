import { gql, useMutation } from '@apollo/client';

export const CRUCE_CREATE = gql`
mutation($crossing: CreateCrossingInput!) {
  createCrossing(crossing:$crossing) {
    id
    number
  }
}
`;

export function useCreateCruce() {
  const [createCrossing] = useMutation(CRUCE_CREATE);

  return { createCrossing };
}
