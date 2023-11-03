import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

const GENERATE_EMAIL_ADDRESS = gql`
  query GenarateEmailAddress($name: String, $lastname: String) {
    generateValidEmail(name: $name, lastname: $lastname) {
      validEmail
    }
  }
`;

export const useGenerateEmailAddress = () => {
  const [generateEmailAddress, { loading, data, error }] = useLazyQuery(GENERATE_EMAIL_ADDRESS);
  const isValid = data?.validEmail && !loading && !error;
  let hasError: any = !loading && error;

  const generateEmail = async (name = '', lastname = '') => {
    try {
      await generateEmailAddress({
        variables: {
          name,
          lastname,
        },
      });
    } catch (err) {
      hasError = true;
    }
  };

  const debouncedValidation = useMemo(() => _.debounce(generateEmail, 2000), []);

  return {
    loading,
    hasError,
    data,
    isValid,
    debouncedValidation,
  };
};
