import { useSnackNotification } from '@gsuite/shared/hooks';
import { request, gql } from 'graphql-request';
import { useMutation } from '@tanstack/react-query';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { IRule as Rule, PaginateRules } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
const deleteMutation = gql`
  mutation deleteRuleMutation($ruleId: String!) {
    deleteRule(id: $ruleId) {
      id
      section
      field
      type
      message
      validator
      active
    }
  }
`;

type DeleteRuleDTO = {
  ruleId: string;
};

export const deleteRuleMutation = async ({ ruleId }: DeleteRuleDTO): Promise<Rule> => request(`${VITE_GATEWAY_URI}/gq/back-office`, deleteMutation, { ruleId });

type UseDeleteRuleOptions = {
  config?: MutationConfig<typeof deleteRuleMutation>;
};

const queryKey = ['rules', {}];

export const useDeleteRule = ({ config }: UseDeleteRuleOptions = {}) => {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (deletedRule) => {
      await queryClient.cancelQueries(queryKey);

      const previousRules = queryClient.getQueryData<PaginateRules>(queryKey);

      queryClient.setQueryData(
        queryKey,
        previousRules?.rows.filter(
          (rule) => rule.id !== deletedRule.ruleId,
        ),
      );

      return { previousRules };
    },
    onError: (error, __, context: any) => {
      if (context?.previousRules) {
        queryClient.setQueryData(queryKey, context.previousRules);
      }
      errorMessage(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      successMessage('Rule Deleted');
    },
    ...config,
    mutationFn: deleteRuleMutation,
  });
};
