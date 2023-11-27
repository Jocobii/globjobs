import { useSnackNotification } from '@gsuite/shared/hooks';
import { request, gql } from 'graphql-request';
import { useMutation } from '@tanstack/react-query';

import { MutationConfig, queryClient } from '@gsuite/shared/lib/react-query';

import { Rule, IRule } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;
export type UpdateRuleDTO = {
  data: Partial<Rule>;
  ruleId: string;
};

const updateMutation = gql`
  mutation updateRuleMutation($ruleId: String!, $rule: UpdateRuleInput!) {
    updateRule(id: $ruleId, updateRuleInput: $rule) {
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

export const updateRuleMutation = async ({
  ruleId,
  data: {
    section,
    field,
    type,
    message,
    validator,
    active,
  },
}: UpdateRuleDTO): Promise<IRule> => request(`${VITE_GATEWAY_URI}/gq/back-office`, updateMutation, {
  ruleId,
  rule: {
    section,
    field,
    type,
    message,
    validator,
    active,
  },
});

type UseUpdateRuleOptions = {
  config?: MutationConfig<typeof updateRuleMutation>;
};

export const useUpdateRule = ({ config }: UseUpdateRuleOptions = {}) => {
  const { errorMessage, successMessage } = useSnackNotification();

  return useMutation({
    onMutate: async (updatingRule) => {
      await queryClient.cancelQueries(['rule', updatingRule?.ruleId]);

      const previousRule = queryClient.getQueryData<Rule>([
        'rule',
        updatingRule?.ruleId,
      ]);

      queryClient.setQueryData(['rule', updatingRule?.ruleId], {
        ...previousRule,
        ...updatingRule.data,
        id: updatingRule.ruleId,
      });

      return { previousRule };
    },
    onError: (error, __, context: any) => {
      if (context?.previousRule) {
        queryClient.setQueryData(
          ['rule', context.previousRule.id],
          context.previousRule,
        );
      }
      errorMessage(error.message);
    },
    onSuccess: ({ id: ruleId }) => {
      queryClient.refetchQueries(['rule', ruleId]);
      queryClient.invalidateQueries(['rules']);
      successMessage('Rule updated');
    },
    ...config,
    mutationFn: updateRuleMutation,
  });
};
