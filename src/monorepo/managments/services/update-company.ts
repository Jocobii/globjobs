import { gql } from '@apollo/client';

export const UPDATE_COMPANY = gql`
  mutation (
    $number: String!
    $name: String!
    $rfc: String!
    $email: String!
    $type: String!
    $address: AddressInput!
    $export: ExportInput
    $import: ImportInput
    $merchandise: Boolean
    $merchandiseOption: String
    $oea: Boolean
    $oeaOption: String
    $prosec: Boolean
    $prosecOption: String
    $sectors: Boolean
    $taxes: Boolean
    $taxesOption: String
    $defaultPaymentMethod: String
  ) {
    updateCompany(
      updateCompanyInput: {
        number: $number
        name: $name
        rfc: $rfc
        email: $email
        type: $type
        address: $address
        export: $export
        import: $import
        merchandise: $merchandise
        merchandiseOption: $merchandiseOption
        oea: $oea
        oeaOption: $oeaOption
        prosec: $prosec
        prosecOption: $prosecOption
        sectors: $sectors
        taxes: $taxes
        taxesOption: $taxesOption
        defaultPaymentMethod: $defaultPaymentMethod
      }
    ) {
      number
      name
    }
  }
`;
