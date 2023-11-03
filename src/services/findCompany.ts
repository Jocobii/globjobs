import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export const FIND_COMPANIES = gql`
  query($slug: String!) {
    companiesFind(slug: $slug){
      _id
      name
      number
      rfc
    }
  }
`;

export const useFindCompany = () => {
  const [companiesFind, { data, loading }] = useLazyQuery(FIND_COMPANIES);

  const findCompany = async (value = '') => {
    await companiesFind({
      variables: {
        slug: value,
      },
    });
  };

  const debouncedCompany = useMemo(() => _.debounce(findCompany, 2000), []);

  return {
    loading,
    data,
    debouncedCompany,
  };
};
