import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useTranslation } from 'react-i18next';

import { MutationConfig, queryClient } from '@/lib/react-query';
import { getCustomPropsFromError } from '@/utils';
import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';

export type AddCoachToTeamDto = {
  coachId: string;
  teamId: string;
};

type Response = {
  addCoachToTeam: {
    newTeam: {
      id: string;
      name: string;
    };
    userUpdated: {
      name: string;
      lastName: string;
    };
  };
};

export const AddCoachToTeamDocument = gql`
  mutation AddCoachToTeam($coachId: String!, $teamId: String!) {
  addCoachToTeam(AddCoachToTeamInput: {
    coachId: $coachId
    teamId: $teamId
  }) {
    newTeam {
      id
      name
    }
    userUpdated {
      name
      lastName
    }
  }
  }
`;

export const addCoachToTeam = ({ coachId, teamId }: AddCoachToTeamDto) => graphqlGatewayClient.request<Response>(
  AddCoachToTeamDocument,
  {
    coachId,
    teamId,
  },
).then((res) => res.addCoachToTeam);

type UseAddCoachToTeamOptions = {
  config?: MutationConfig<typeof addCoachToTeam>;
  coachId?: string;
  teamId?: string;
};

const queryKey = ['users'];

export function useAddCoachToTeam({ config }: UseAddCoachToTeamOptions = {}) {
  const { t } = useTranslation();
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAddToTeam) {
        queryClient?.setQueryData(queryKey, context?.previousAddToTeam);
      }
      const { i18Key } = getCustomPropsFromError(error);
      errorMessage(
        i18Key
          ? t(`managements.teams.${i18Key}`)
          : 'Something went wrong while trying to change the coach from team',
      );
    },
    onSuccess: async (data: any) => {
      const userName = `${data.userUpdated.name} ${data.userUpdated.lastName}`;
      const newTeamName = data.newTeam.name;
      successMessage(t('managements.teams.changedSuccessfully', { userName, teamName: newTeamName }));
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: addCoachToTeam,
  });
}
