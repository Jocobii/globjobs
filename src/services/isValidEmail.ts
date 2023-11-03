import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

const VERIFY_EMAIL = gql`
  query VerifyEmail($emailAddress: String) {
    verifyEmail(emailAddress: $emailAddress) {
      isValid
    }
  }
`;

export const useValidateEmailAddress = () => {
  const [validateEmailAddress, { loading, data, error }] = useLazyQuery(VERIFY_EMAIL);
  const isValid = data?.validEmail && !loading && !error;
  let hasError: any = !loading && error;

  const validateEmail = async (emailAddress = '') => {
    try {
      await validateEmailAddress({
        variables: {
          emailAddress,
        },
      });
    } catch (err) {
      hasError = true;
    }
  };

  const debouncedValidation = useMemo(() => _.debounce(validateEmail, 3000), []);

  return {
    loading,
    hasError,
    data,
    isValid,
    debouncedValidation,
  };
};
