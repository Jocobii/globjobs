import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Team } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
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

export const updateTeam = ({ data, teamId }: UpdateTeamDto): Promise<Team> => request<Responses>(`${VITE_GATEWAY_URI}/gq/back-office`, updateTeamMutationDocument, {
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
