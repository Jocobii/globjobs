import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { MutationConfig, queryClient } from '@/lib/react-query';
import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';

export type AddToTeamDto = {
  idSpecialist: string;
  teamId: string;
};

type Response = {
  AddSpecialistToTeam: {
    name: string;
    teams: {
      id: string;
    }[]
  }
};

export const updateAddToTeamDocument = gql`
  mutation AddSpecialistToTeam($idSpecialist: String!, $teamId: String!) {
    AddSpecialistToTeam(idSpecialist: $idSpecialist, teamId: $teamId){
      name
      teams {
        id
      }
    }
  }
`;

export const updateAddToTeams = ({ idSpecialist, teamId }: AddToTeamDto) => graphqlGatewayClient
  .request<Response>(
  updateAddToTeamDocument,
  {
    idSpecialist,
    teamId,
  },
).then((res) => res.AddSpecialistToTeam);

type UseAddToTeamOptions = {
  config?: MutationConfig<typeof updateAddToTeams>;
  idSpecialist?: string;
  teamId?: string;
};

const queryKey = ['users'];

export function useAddToTeam({ config, idSpecialist, teamId }: UseAddToTeamOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['addToTeam', idSpecialist, teamId]);
    },
    onError: (error: any, __: any, context: any) => {
      if (context?.previousAddToTeam) {
        queryClient.setQueryData(queryKey, context.previousAddToTeam);
      }
      errorMessage(error.message);
    },
    onSuccess: async (data: any) => {
      queryClient.refetchQueries(['addtoteam', data?.id]);
      queryClient.invalidateQueries(queryKey);
      successMessage('El especialista se ha agregado al equipo correctamente');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: updateAddToTeams,
  });
}
