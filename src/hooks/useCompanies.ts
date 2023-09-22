import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import debounce from 'lodash/debounce';

export const FIND_COMPANIES = gql`
  query($slug: String!) {
    companiesFind(slug:$slug){
      _id
      name
      number
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

  const searchByNameOrNumber = useMemo(() => debounce(findCompany, 700), []);

  return {
    loading,
    data: data?.companiesFind ?? [],
    searchByNameOrNumber,
  };
};
