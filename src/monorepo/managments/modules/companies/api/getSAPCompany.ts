import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { Company } from '../types';

const { VITE_GLOBALIZATION_GRAPHQL_URI } = import.meta.env;

export const getSAPCompanyDocument = gql`
  query($number: String!) {
    getSAPCompany(number: $number) {
      Numero
      Nombre
      RFC
      Direccion
      Colonia
      Ciudad
      CP
      correoElectronico
      EstadoSAT
      Estatus
    }
  }
`;

export const getSAPCompanyQuery = async (number: string): Promise<Company> => request<any>(`${VITE_GLOBALIZATION_GRAPHQL_URI}/globalization`, getSAPCompanyDocument, {
  number,
  context: 'globalization',
})
  .then((res) => res.getSAPCompany);

type QueryFnType = typeof getSAPCompanyQuery;
type UseSAPCompanyOptions = {
  config?: QueryConfig<QueryFnType>;
  number: string;
};

export function useGetSAPCompany({ number, config }: UseSAPCompanyOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['company-sap', number],
    queryFn: () => getSAPCompanyQuery(number),
  });
}
