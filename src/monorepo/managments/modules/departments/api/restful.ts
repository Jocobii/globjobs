import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

import { Department } from '../types';

export type RestfulDepartmentsResponse = {
  departmentsRestful: Array<Partial<Department>>,
};
const { VITE_GATEWAY_URI } = import.meta.env;
const restfulDepartmentsDocument = gql`
  query {
    departmentsRestful {
      name
      id: _id
    }
  }
`;

export const restfulDepartments = async () => request(`${VITE_GATEWAY_URI}/gq/back-office`, restfulDepartmentsDocument);

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
