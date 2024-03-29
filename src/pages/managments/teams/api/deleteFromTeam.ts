import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useTranslation } from 'react-i18next';

import { MutationConfig, queryClient } from '../../../../lib/react-query';
import { graphqlGatewayClient } from '../../../../clients';
import { useSnackNotification } from '../../../../hooks';

import { User } from '../../users/types';

type Response = {
  deleteUsersFromTeam: {
    usersUpdated: Partial<User>[];
    oldTeam: {
      id: string;
      name: string;
    };
  };
};

export type DeleteUsersFromTeamDto = {
  ids?: string[];
  teamId?: string;
};

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
) => graphqlGatewayClient.request<Response>(
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
    onError: (_, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }
      errorMessage(t('managements.teams.MUST_HAVE_ONE_COACH'));
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
