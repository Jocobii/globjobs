import { request, gql } from 'graphql-request';
import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { useQuery } from '@tanstack/react-query';

import { Module } from '../types';
type Responses = {
  modulesPermissions: Module[];
};

const { VITE_GATEWAY_URI } = import.meta.env;
const MODULES_QUERY = gql`
  query {
    modulesPermissions{
      name
      key
      permissions {
        checked
        name
      }
    }
  }
`;

export const restfulModules = async () => request<Responses>(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  MODULES_QUERY,
).then(({ modulesPermissions }) => modulesPermissions);

type QueryFnType = () => Promise<Module[]>;

type useGetModulesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export function useGetModules({ config }: useGetModulesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['modules'],
    queryFn: () => restfulModules(),
  });
}