import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { AddToTeam } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
export type AddToTeamDto = {
  idSpecialist: string;
  teamId: string;
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

export const updateAddToTeams = ({ idSpecialist, teamId }: AddToTeamDto):
Promise<AddToTeam> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  updateAddToTeamDocument,
  {
    idSpecialist,
    teamId,
  },
).then((res) => res.updateAddToTeams);

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
