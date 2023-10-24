import { useMemo } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import _ from 'lodash';

export const FIND_COMPANIES = gql`
  query($slug: String!, $getUserCompanies: Boolean) {
    companiesFind(slug:$slug, getUserCompanies:$getUserCompanies){
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
        getUserCompanies: true,
      },
    });
  };

  const debouncedCompany = useMemo(() => _.debounce(findCompany, 600), []);

  return {
    loading,
    data,
    debouncedCompany,
  };
};

export const useFindCompanies = () => {
  const { data, loading } = useQuery(FIND_COMPANIES, { variables: { getUserCompanies: true, slug: '' } });
  return {
    loading,
    data,
  };
};
