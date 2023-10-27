import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { PaginatedResponse } from '@gsuite/typings/table';

import { User } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

type Response = {
  users: PaginatedResponse<Partial<User>>,
};

const allUsersDocument = gql`
  query PaginateUsers($teamId: String, $pagination: PaginationDtoInput) {
    users(teamId: $teamId, paginationInput: $pagination) {
      rows {
        id: _id
        name
        lastName
        active
        emailAddress
        area {
          id: _id
          name
        }
        department {
          id: _id
          name
        }
        headquarter {
          id
          name
        }
        role {
          id
          name
        }
        companies {
          _id
          name
          rfc
          number
        }
        employeeNumber
        birthDate
        phoneNumber
        coach
        costCenter
        charge
        employeeType
        darwinUser
        rbSystemsUser
        lastLogin
        teams {
          name
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const getUsersQuery = async (variables: Record<string, unknown>) => {
  const pagination = { ...variables };
  const teamId = pagination['teamId'] as string;
  delete pagination['teamId'];
  return request<Response>(
    `${VITE_GATEWAY_URI}/gq/back-office`,
    allUsersDocument,
    {
      teamId,
      pagination,
    },
  ).then((res) => res.users);
};

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<PaginatedResponse<Partial<User>>>;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useGetUsers({ config, variables: pagination }: UseUsersOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['users', pagination],
    queryFn: () => getUsersQuery(pagination ?? {}),
    suspense: false,
  });
}
