import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { Department } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
const getDepartmentDocument = gql`
  query GetDepartmentQuery($departmentId: String!) {
    department(id: $departmentId) {
      id: _id
      name
      abbreviation
      email
      active
    }
  }
`;

export const getDepartmentQuery = async (departmentId?: string): Promise<Department> => request<any>(`${VITE_GATEWAY_URI}/gq/back-office`, getDepartmentDocument, { departmentId }).then((res) => res.department);

type QueryFnType = typeof getDepartmentQuery;
type UseDepartmentOptions = {
  config?: QueryConfig<QueryFnType>;
  departmentId?: string;
};

export function useGetDepartment({ departmentId, config }: UseDepartmentOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['department', departmentId],
    queryFn: () => getDepartmentQuery(departmentId),
    enabled: !!departmentId && departmentId !== 'create',
  });
}
