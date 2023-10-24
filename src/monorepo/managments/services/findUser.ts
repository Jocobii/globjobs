import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export const FIND_USERS = gql`
  query($name: String!) {
    userFind(name: $name) {
      id: _id
      name
      lastName
      emailAddress
    }
  }
`;

export const useFindUser = () => {
  const [userFind, { data, loading }] = useLazyQuery(FIND_USERS);

  const findUser = async (value = '') => {
    await userFind({
      variables: {
        name: value,
      },
    });
  };

  const debouncedUser = useMemo(() => _.debounce(findUser, 3000), []);

  return {
    loading,
    data,
    debouncedUser,
  };
};
