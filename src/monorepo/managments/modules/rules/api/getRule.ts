import { request, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';

import { IRule as Rule } from '../types';

type Response = {
  rule: Rule;
};

const { VITE_GATEWAY_URI } = import.meta.env;
const getRuleQuery = gql`
  query getRule($ruleId: String!){
    rule(id: $ruleId) {
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

export type GetRuleDTO = {
  ruleId: string;
};

export const getRule = async ({ ruleId }: GetRuleDTO) => request<Response>(`${VITE_GATEWAY_URI}/gq/back-office`, getRuleQuery, { ruleId }).then((res) => res.rule);

type QueryFnType = typeof getRule;

type UseRuleOptions = {
  config?: QueryConfig<QueryFnType>;
} & GetRuleDTO;

export function useRule({ ruleId, config }: UseRuleOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['rule', ruleId],
    queryFn: () => getRule({ ruleId }),
  });
}
