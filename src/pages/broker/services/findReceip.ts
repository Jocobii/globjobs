import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export const FIND_RECEIPT = gql`
  query($number: String!) {
    receiptFind(number: $number) {
      _id
      number
    }
  }
`;

export const useFindReceipt = () => {
  const [receiptFind, { data, loading }] = useLazyQuery(FIND_RECEIPT);

  const debouncedReceipt = useMemo(() => {
    const findReceipt = async (value = '') => {
      await receiptFind({
        variables: {
          number: value,
        },
      });
    };
    return _.debounce(findReceipt, 2000);
  }, [receiptFind]);

  return {
    loading,
    data,
    debouncedReceipt,
  };
};
