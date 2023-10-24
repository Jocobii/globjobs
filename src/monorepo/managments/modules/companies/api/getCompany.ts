import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { CompanyFull } from '../types';
const { VITE_GATEWAY_URI } = import.meta.env;

export const getCompanyDocument = gql`
  query($number: String!){
    companyGetOneByNumber(number: $number){
      _id
      number
      name
      rfc
      email
      address{
        address1
        address2
        city
        state
        country
        postalCode
      }
      type
      defaultPaymentMethod
      import {
        alcohol
        automotive
        chemicalPrecursors
        chemicalProducts
        cigars
        explosives
        firearms
        footwear
        hydrocarbons
        ironAndSteel
        ironAndSteelProducts
        knives
        machines
        nuclearRadioactive
        pyrotechnics
        textile
      }
      export {
        alcohol
        aluminum
        beer
        cigars
        energizing
        glass
        goldSilverAndCopper
        iron
        liqueurs
        minerals
        plastics
        rubber
        tequila
        wines
        wood
      }
      merchandise
      merchandiseOption
      oea
      oeaOption
      prosec
      prosecOption
      sectors
      taxes
      taxesOption
    }
  }
`;

export const getCompanyQuery = async (number: string): Promise<CompanyFull> => request(`${VITE_GATEWAY_URI}/gq/back-office`, getCompanyDocument, { number }).then((res) => res.companyGetOneByNumber);

type QueryFnType = typeof getCompanyQuery;
type UseCompanyOptions = {
  config?: QueryConfig<QueryFnType>;
  number: string;
};

export function useGetCompany({ number, config }: UseCompanyOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['company', number],
    queryFn: () => getCompanyQuery(number),
  });
}
