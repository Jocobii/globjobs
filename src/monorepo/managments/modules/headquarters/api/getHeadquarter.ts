import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { Headquarter } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

const getHeadquarterDocument = gql`
  query GetHeadquarterQuery($headquarterId: String!) {
    headquarter(id: $headquarterId) {
      id
      name
      type
      address {
        address1
        address2
        city
        state
        postalCode
        country
      }
      phone
      active
    }
  }
`;

export const getHeadquarterQuery = async (headquarterId: string): Promise<Headquarter> => request(`${VITE_GATEWAY_URI}/gq/back-office`, getHeadquarterDocument, { headquarterId }).then((res) => res.headquarter);

type QueryFnType = typeof getHeadquarterQuery;
type UseHeadquarterOptions = {
  config?: QueryConfig<QueryFnType>;
  headquarterId: string;
};

export function useGetHeadquarter({ headquarterId, config }: UseHeadquarterOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['headquarter', headquarterId],
    queryFn: () => getHeadquarterQuery(headquarterId),
  });
}

export default useGetHeadquarter;
