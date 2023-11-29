import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { MutationConfig, queryClient } from '../../../../lib/react-query';
import { graphqlGatewayClient } from '../../../../clients';
import { useSnackNotification } from '../../../../hooks';

import { Team } from '../types';

export type UpdateTeamDto = {
  data: Partial<Team>;
  teamId: string;
};
type Responses = {
  updateTeam: Team;
};

export const updateTeamMutationDocument = gql`
  mutation UpdateTeam($updateTeamId: String!, $updateTeamInput: UpdateTeamInput!) {
    updateTeam(id: $updateTeamId, updateTeamInput: $updateTeamInput) {
      name
      groupEmail
      headquarter {
        id
        name
      }
    }
  }
`;

export const updateTeam = (
  { data, teamId }: UpdateTeamDto,
): Promise<Team> => graphqlGatewayClient.request<Responses>(updateTeamMutationDocument, {
  updateTeamId: teamId,
  updateTeamInput: {
    name: data.name,
    active: data.active,
    groupEmail: data.groupEmail,
    headquarter: data.headquarter,
  },
})
  .then((res) => res.updateTeam);

type UseUpdateTeamOptions = {
  config?: MutationConfig<typeof updateTeam>;
  teamId?: string;
};

const queryKey = ['teams'];

export function useUpdateTeam({ config, teamId }: UseUpdateTeamOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries([...queryKey, teamId]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousTeam);
      }
      errorMessage(error.message);
    },
    onSuccess: async (data: any) => {
      queryClient.refetchQueries(['teams', data?.id]);
      queryClient.invalidateQueries(queryKey);
      successMessage(`Team (${data?.name}) successfully updated`);
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateTeam,
  });
}

export default useUpdateTeam;
