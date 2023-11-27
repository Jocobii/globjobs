import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ExtractFnReturnType, QueryConfig } from '@gsuite/shared/lib/react-query';
import { Companies } from '../types';

const { VITE_GATEWAY_URI } = import.meta.env;

type Responses = {
  companyGetOneByNumber: Companies;
};

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
      mandatoryADPDocuments {
        paidPetition
        invoices
        dodaPita
        coveDetailAcknowledgment
        ed
        edXml
        edAcknowledgment
        validationFiles
        paymentFiles
        dodaPitaXml
        coveXml
      }
      complementaryADPDocuments {
        petitionSimplifiedCopy
        petitionNullCopy
        manifestationOfValue
        spreadsheet
        attachedDocumentWithoutDigitization
        shipper
        manifestationEntry
        waybill
        billOfLading
        guideOrTransportDocuments
        millCertificate
        prosec
        immex
      }
      uens {
        aamx {
          active
        }
        aaus {
          active
          entryInvoice
          entrySupplier
          import
          export
          shipperSupplier
          shipperInvoice
        }
        warehouse {
          active
        }
        g3pl {
          active
        }
        gnex {
          active
        }
        gogetters {
          active
        }
        kshield {
          active
        }
        transportmx {
          active
        }
        transportus {
          active
        }
      }
    }
  }
`;

export const getCompanyQuery = async (number?: string): Promise<Companies> => request<Responses>(`${VITE_GATEWAY_URI}/gq/back-office`, getCompanyDocument, { number }).then((res) => res.companyGetOneByNumber);

type QueryFnType = typeof getCompanyQuery;
type UseCompanyOptions = {
  config?: QueryConfig<QueryFnType>;
  number?: string;
  isUpdate?: boolean;
};

export function useGetCompany({ number, config, isUpdate = false }: UseCompanyOptions) {
  return useQuery <ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['company', number],
    queryFn: () => getCompanyQuery(number),
    enabled: !!number && !!isUpdate,
  });
}
