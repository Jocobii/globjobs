import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useTranslation } from 'react-i18next';


import { MutationConfig, queryClient } from '@/lib/react-query';
import { getCustomPropsFromError } from '@/utils';
import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';

import { User } from '../../users/types';

export type ChangeUsersFromTeamDto = {
  ids?: string[];
  teamId: string;
};
type Response = {
  changeUsersFromTeam: {
    usersUpdated: User[];
    newTeam: {
      id: string;
      name: string;
    };
    teamId: string;
  };
};

export const changeFromTeamMutationDocument = gql`
  mutation($ids: [String!], $teamId: String!) {
    changeUsersFromTeam(
      changeUsersFromTeamInput: {
        ids: $ids
        teamId: $teamId
      }
    ) {
      usersUpdated {
      name
      lastName
      }
      newTeam {
        id
        name
      }
    }
  }
`;

export const changeUsersFromTeam = (
  { teamId, ids }: ChangeUsersFromTeamDto,
) => graphqlGatewayClient.request<Response>(
  changeFromTeamMutationDocument,
  {
    ids,
    teamId,
  },
).then((res) => ({ ...res?.changeUsersFromTeam, teamId }));

type UseChangeUsersFromTeamOptions = {
  config?: MutationConfig<typeof changeUsersFromTeam>;
};

const queryKey = ['users'];

export function useChangeUsersFromTeam({ config }: UseChangeUsersFromTeamOptions) {
  const { t } = useTranslation();
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onError: (error: any, __, context: any) => {
      const { i18Key } = getCustomPropsFromError(error);
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }
      errorMessage(t(`managements.teams.${i18Key}`));
    },
    onSuccess: (data: any) => {
      const { usersUpdated, newTeam } = data;
      const areManyUsers = usersUpdated.length > 1;
      const message = areManyUsers
        ? t('managements.teams.manyChangedSuccessfully', { usersQty: usersUpdated.length, teamName: newTeam.name })
        : t('managements.teams.changedSuccessfully', { userName: `${usersUpdated[0].name} ${usersUpdated[0].lastName}`, teamName: newTeam.name });
      successMessage(message);
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: changeUsersFromTeam,
  });
}
