import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export const GET_ONE_COMPANY = gql`
query CompanyGetOneByNumber($number: String!) {
  companyGetOneByNumber(number: $number) {
    users {
      name
      lastName
      _id
    }
  }
}
`;

export const useGetOneCompany = () => {
  const [companiesOneFind, { data, loading }] = useLazyQuery(GET_ONE_COMPANY);

  const findOneCompany = async (value = '') => {
    await companiesOneFind({
      variables: {
        number: value,
      },
    });
  };

  const debouncedOneCompany = useMemo(() => _.debounce(findOneCompany, 600), []);

  return {
    loading,
    data,
    debouncedOneCompany,
  };
};
