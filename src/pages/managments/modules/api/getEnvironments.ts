import { gql, useQuery } from '@apollo/client';
import { Environment } from '../types';

export type RestfulEnvironmentsResponse = {
  environmentsRestful: Array<Partial<Environment>>,
};

const restfulEnvironmentsDocument = gql`
  query {
    environmentsRestful {
      name
      id
    }
  }
`;

export const useRestfulEnvironments = (variables?: Record<string, unknown>) => {
  const { data, refetch, loading } = useQuery<RestfulEnvironmentsResponse>(restfulEnvironmentsDocument, { variables });
  return {
    data,
    loading,
    refetch,
  };
};
