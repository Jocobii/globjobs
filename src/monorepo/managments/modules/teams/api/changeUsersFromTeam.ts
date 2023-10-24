import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useTranslation } from 'react-i18next';
import { getCustomPropsFromError } from '@gsuite/shared/utils';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { User } from '../../users/types';

export type ChangeUsersFromTeamDto = {
  ids?: string[];
  teamId: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
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
): Promise<Partial<User>[]> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
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
      errorMessage(t<string>(`managements.teams.${i18Key}`));
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
