import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { MutationConfig, queryClient } from '@/lib/react-query';
import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';

import { Company } from '../types';

type Response = {
  changeCompaniesFromTeam: Partial<Company[]>;
};

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
): Promise<Partial<Company[]>> => graphqlGatewayClient.request<Response>(
  changeCompaniesFromTeamMutationDocument,
  {
    ids,
    teamId,
  },
).then((res) => res?.changeCompaniesFromTeam);

type UseChangeCompaniesFromTeamOptions = {
  config?: MutationConfig<typeof changeCompaniesFromTeam>;
  skip?: boolean;
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
