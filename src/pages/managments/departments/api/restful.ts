import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { graphqlGatewayClient } from '@/clients';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Department } from '../types';

export type RestfulDepartmentsResponse = {
  departmentsRestful: Array<Partial<Department>>,
};

const restfulDepartmentsDocument = gql`
  query {
    departmentsRestful {
      name
      id: _id
    }
  }
`;

export const restfulDepartments = async () => graphqlGatewayClient
  .request<RestfulDepartmentsResponse>(restfulDepartmentsDocument);

type QueryFnType = () => Promise<RestfulDepartmentsResponse>;

type UseRestfulDepartmentsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useRestfulDepartments({ config }: UseRestfulDepartmentsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['restful-departments'],
    queryFn: () => restfulDepartments(),
  });
}
