import { useSnackNotification } from '@gsuite/shared/hooks';
import { request, gql } from 'graphql-request';
import { useMutation } from '@tanstack/react-query';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { IRule, Rule, PaginateRules } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type CreateRuleDTO = {
  data: Rule;
};

const createMutation = gql`
  mutation createRuleMutation($rule: CreateRuleInput!) {
    createRule(createRuleInput: $rule) {
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

export const createRuleMutation = async ({ data }: CreateRuleDTO): Promise<IRule> => request(`${VITE_GATEWAY_URI}/gq/back-office`, createMutation, { rule: data });

type UseCreateRuleOptions = {
  config?: MutationConfig<typeof createRuleMutation>;
};

const queryKey = ['rules', {}];

export function useCreateRule({ config }: UseCreateRuleOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (newRule) => {
      await queryClient.cancelQueries(queryKey);

      const previousRules = queryClient.getQueryData<PaginateRules>(queryKey);

      queryClient.setQueryData(queryKey, [
        ...(previousRules?.rows || []),
        { ...newRule, id: new Date().getTime().toString() },
      ]);

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
      successMessage('Rule created');
      queryClient.refetchQueries(queryKey);
    },
    ...config,
    mutationFn: createRuleMutation,
  });
}
