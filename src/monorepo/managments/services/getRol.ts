import { gql, useQuery } from '@apollo/client';

export const queryRoleSummary = gql`
query GetRolesSummary {
  getRolesSummary {
    modules
    name
    notifications
    permissions
    users
  }
}
`;

export const useRoleList = () => {
  const { data } = useQuery(queryRoleSummary);
  return {
    data: data?.companyGetByTeam,
  };
};

export default useRoleList;
