import { useMutation } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Company } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;
export type ChangeCompaniesFromTeamDto = {
  ids?: string[];
  teamId: string;
};

export const changeCompaniesFromTeamMutationDocument = gql`
    mutation($ids: [String!], $teamId: String!) {
      changeCompaniesFromTeam(
        changeCompaniesFromTeamInput: {
          ids: $ids
          teamId: $teamId
        }
      ) {
        number
        name
      }
    }
`;

export const changeCompaniesFromTeam = (
  { ids, teamId }: ChangeCompaniesFromTeamDto,
): Promise<Partial<Company[]>> => request(
  `${VITE_GATEWAY_URI}/gq/back-office`,
  changeCompaniesFromTeamMutationDocument,
  {
    ids,
    teamId,
  },
).then((res) => res?.changeCompaniesFromTeam);

type UseChangeCompaniesFromTeamOptions = {
  config?: MutationConfig<typeof changeCompaniesFromTeam>;
};

const queryKey = ['companies'];

export function useChangeCompaniesFromTeam({ config }: UseChangeCompaniesFromTeamOptions) {
  const { errorMessage, successMessage } = useSnackNotification();
  return useMutation({
    onError: (error: any, __, context: any) => {
      if (context?.previousCompanies) {
        queryClient.setQueryData(queryKey, context.previousCompanies);
      }
      errorMessage(error?.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      successMessage('Companie(s) team was successfully changed');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: changeCompaniesFromTeam,
  });
}
