import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export const VERIFY_TRAFFIC_NUMBER = gql`
  query VerifyTrafficNumber($trafficNumber: String!) {
    trafficNumber(trafficNumber: $trafficNumber) {
      dispatch
      economicNumber
      vehicleType
      driver
      plates {
        mex
        usa
      }
    }
  }
`;

export const useTrafficNumberValidation = () => {
  const [verifyTrafficNumber, { loading, data, error }] = useLazyQuery(VERIFY_TRAFFIC_NUMBER);
  const hasError = !loading && !!error;
  const isValid = data?.trafficNumber?.dispatch && !loading && !error;

  const debouncedValidation = useMemo(() => {
    const validateNumber = async (value = '') => {
      await verifyTrafficNumber({
        variables: {
          trafficNumber: String(value).trim(),
        },
      });
    };
    return _.debounce(validateNumber, 2000);
  }, [verifyTrafficNumber]);

  return {
    loading,
    hasError,
    data,
    isValid,
    debouncedValidation,
  };
};
