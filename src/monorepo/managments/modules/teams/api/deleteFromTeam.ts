import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useTranslation } from 'react-i18next';
import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { User } from '../../users/types';

export type DeleteUsersFromTeamDto = {
  ids?: string[];
  teamId?: string;
};
const { VITE_GATEWAY_URI } = import.meta.env;
export const deleteFromTeamMutationDocument = gql`
  mutation($ids: [String!]!, $teamId: String!) {
    deleteUsersFromTeam(
      deleteUsersFromTeamInput: {
        ids: $ids
        teamId: $teamId
      }
    ) {
      usersUpdated {
      id: _id
      name
      lastName
      teams {
      name
      }
    }
    oldTeam {
      id
      name
    }
    }
  }
`;

export const deleteUsersFromTeam = (
  { ids, teamId }: DeleteUsersFromTeamDto,
): Promise<Partial<User>[]> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  deleteFromTeamMutationDocument,
  {
    ids,
    teamId,
  },
).then((res) => res?.deleteUsersFromTeam);

type UseDeleteUsersFromTeamOptions = {
  config?: MutationConfig<typeof deleteUsersFromTeam>;
};

const queryKey = ['users'];

export function useDeleteUsersFromTeam({ config }: UseDeleteUsersFromTeamOptions) {
  const { successMessage, errorMessage } = useSnackNotification();
  const { t } = useTranslation();
  return useMutation({
    onError: (_, e, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }
      errorMessage(t<string>('managements.teams.MUST_HAVE_ONE_COACH'));
    },
    onSuccess: (data: any, i) => {
      queryClient.invalidateQueries(queryKey);
      successMessage(t('managements.teams.deleteFromTeam', { quantity: i.ids?.length || 0, oldTeam: data.oldTeam.name }));
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: deleteUsersFromTeam,
  });
}
