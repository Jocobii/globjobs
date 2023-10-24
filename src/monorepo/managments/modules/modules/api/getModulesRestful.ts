import { gql, useQuery } from '@apollo/client';
import { Module } from '../types';

type RestfulModulesResponse = {
  modulesRestful: Array<Partial<Module>>,
};

const restfulModulesDocument = gql`
  query ModulesQuery($environment: String) {
    modulesRestful(environment: $environment) {
      name
      id
      environment {
        id
      }
      toolbox
      actions
    }
  }
`;

export const useRestfulModules = (environment?: string) => {
  const { data } = useQuery<RestfulModulesResponse>(restfulModulesDocument, { variables: { environment } });
  return {
    data,
  };
}
