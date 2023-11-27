import { gql } from 'graphql-request';
import { useMutation } from '@tanstack/react-query';

import { publicGraphqlGatewayClient } from '../clients/GraphqlRequest';
import { MutationConfig } from '../lib/react-query';
import { User } from '../typings/authentication';

const googleLoginMutationDocument = gql`
  mutation (
    $emailAddress: String!,
  ) {
    googleLogin(emailAddress: $emailAddress) {
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

export type GoogleLoginDto = {
  data: { emailAddress: string };
};

type GoogleLoginMutationDocumentResponse = {
  googleLogin: { user: Omit<User, 'photoUrl'>, access_token: string };
};

export const googleLogin = ({ data }: GoogleLoginDto) => publicGraphqlGatewayClient
  .request<GoogleLoginMutationDocumentResponse>(
  googleLoginMutationDocument,
  { ...data },
)
  .then((res) => res?.googleLogin);

type UseGoogleLoginOptions = {
  config?: MutationConfig<typeof googleLogin>;
};

export function useGoogleLogin({ config }: UseGoogleLoginOptions = {}) {
  return useMutation({
    onError: (error) => error,
    onSuccess: (data) => data,
    ...config,
    mutationFn: googleLogin,
  });
}
