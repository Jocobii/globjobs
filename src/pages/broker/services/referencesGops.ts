import { gql, useQuery } from '@apollo/client';

type References = {
  id: string;
  gop: string;
  reference: string;
};

type ReferencesQuery = {
  customsDocuments: References[];
  invoice: References[];
  transport: References[];
  shipping: References[];
  extraCharges: References[];
};

export const REFERENCES_QUERY = gql`
  query{
    customsDocuments(type: "customsDocument") {
    gop
    reference
    id: _id
    type
  }
  invoice(type: "invoice") {
    gop
    reference
    id: _id
    type
  }
  transport(type: "transport") {
    gop
    reference
    id: _id
    type
  }
  shipping(type: "shipping") {
    gop
    reference
    id: _id
    type
  }
  extraCharges(type: "extraCharge") {
    gop
    reference
    id: _id
    type
  }
}
`;

export function useReferences() {
  return useQuery<ReferencesQuery>(REFERENCES_QUERY);
}
