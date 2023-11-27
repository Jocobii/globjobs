import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

type User = {
  _id: string;
  name: string;
};

const allUsersDocument = gql`
  query UsersByTeam($teamId: String!) {
    usersByTeam(teamId: $teamId) {
      _id
      name
    }
  }
`;

export const getUsersQuery = async (variables: Record<string, unknown>) => {
  const pagination = { ...variables };
  const teamId = pagination.teamId as string;
  delete pagination.teamId;
  return request<any>(
    '/gq/back-office',
    allUsersDocument,
    {
      teamId,
    },
  ).then((res) => res.usersByTeam);
};

type QueryFnType = (params?: Record<string, unknown> | undefined) =>
Promise<Partial<User>>;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
  variables?: Record<string, unknown>;
};

export function useGetUsersApi({ config, variables: pagination }: UseUsersOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['users', pagination],
    queryFn: () => getUsersQuery(pagination ?? {}),
    suspense: true,
    ...config,
  });
}
