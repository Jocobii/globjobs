import _ from 'lodash';
import { gql, useQuery } from '@apollo/client';
import { Company, CompanyFull } from '../types';

export type CompanyQuery = {
  companyGetOneByNumber: CompanyFull,
};

export type CompanyQuerySAP = {
  getSAPCompany: Company
};

export const COMPANIES_SAP_QUERY = gql`
  query {
    getSAPCompanies {
      Numero
      Nombre
      RFC
      Direccion
      Colonia
      Ciudad
      CP
      correoElectronico
      EstadoSAT
      label
      existsInDb
    }
  }
`;

export const COMPANY_QUERY = gql`
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

export const COMPANY_QUERY_SAP = gql`
  query($number:String!){
    getSAPCompany(number: $number){
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

export const useCompaniesSap = () => useQuery(COMPANIES_SAP_QUERY, { context: { clientName: 'globalization' } });

export function useCompany(number: string) {
  return useQuery<CompanyQuery>(COMPANY_QUERY, {
    variables: { number },
  });
}

export function useCompanySAP(number: string) {
  return useQuery<CompanyQuerySAP>(COMPANY_QUERY_SAP, {
    variables: { number },
    context: { clientName: 'globalization' },
  });
}

export function parseCompany(company: Company) {
  return {
    number: String(Number(company.Numero)),
    name: _.get(company, 'Nombre', ''),
    rfc: _.get(company, 'RFC', ''),
    address: {
      address1: _.get(company, 'Direccion', ''),
      address2: _.get(company, 'Colonia', ''),
      city: _.get(company, 'Ciudad', ''),
      state: _.get(company, 'EstadoSAT', ''),
      country: _.get(company, 'Ciudad', ''),
      postalCode: _.get(company, 'CP', ''),
    },
    email: _.get(company, 'correoElectronico', ''),
  };
}

export const useCompanyByNumber = (number: string) => useQuery<CompanyQuery>(
  COMPANY_QUERY,
  { variables: { number } },
);
