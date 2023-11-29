import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { MutationConfig, queryClient } from '../../../../lib/react-query';
import { graphqlGatewayClient } from '../../../../clients';
import { useSnackNotification } from '../../../../hooks';

import { Team } from '../types';

export type CreateTeamDto = {
  data: Team;
};
type Response = {
  createTeam: Team;
};

export const createTeamMutationDocument = gql`
  mutation CreateTeam($createTeamInput: CreateTeamInput!) {
    createTeam(createTeamInput: $createTeamInput) {
      id
      name
      groupEmail
      name
    }
  }
`;

export const createTeam = (
  { data }: CreateTeamDto,
): Promise<Team> => graphqlGatewayClient.request<Response>(createTeamMutationDocument, {
  createTeamInput: {
    name: data.name,
    groupEmail: data.groupEmail,
    headquarter: data.headquarter?.id,
  },
})
  .then((res) => res.createTeam);

type UseCreateTeamOptions = {
  config?: MutationConfig<typeof createTeam>;
};

const queryKey = ['teams'];
const restfullQueryKey = ['restful-teams'];

export function useCreateTeam({ config }: UseCreateTeamOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(queryKey, context.previousTeam);
      }
      errorMessage(error.message);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(restfullQueryKey);
      successMessage('Team successfully created');
      queryClient.refetchQueries(queryKey);
      queryClient.refetchQueries(restfullQueryKey);
    },
    ...config,
    mutationFn: createTeam,
  });
}

export default useCreateTeam;
