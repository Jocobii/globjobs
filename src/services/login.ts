import { gql } from 'graphql-request';
import { useMutation } from '@tanstack/react-query';

import { publicGraphqlGatewayClient } from '../clients/GraphqlRequest';
import { MutationConfig } from '../lib/react-query';
import { User } from '../typings/authentication';

const loginMutationDocument = gql`
  mutation (
    $email: String!,
    $password: String!,
    $environment: String!
  ) {
    loginUser(loginUserInput: { email: $email, password: $password, environment: $environment }) {
      access_token
      user {
        id
        name
        lastName
        emailAddress
        role
      }
    }
  }
`;

export type LoginUser = {
  data: {
    email: string,
    password: string,
    environment: string,
  };
};

type LoginUserMutationDocumentResponse = {
  loginUser: { user: Omit<User, 'photoUrl'>, access_token: string };
};

export const loginUser = ({ data }: LoginUser) => publicGraphqlGatewayClient
  .request<LoginUserMutationDocumentResponse>(
  loginMutationDocument,
  { ...data },
)
  .then((res) => res?.loginUser);

type UseLoginUserOptions = {
  config?: MutationConfig<typeof loginUser>;
};

export function useLoginUser({ config }: UseLoginUserOptions = {}) {
  return useMutation({
    onError: (error) => error,
    onSuccess: (data) => data,
    ...config,
    mutationFn: loginUser,
  });
}
