import { gql } from '@apollo/client';

// MUTATION - Recoleccion en aeropuerto y entrega en Tijuana
export const REGISTER_RAET = gql`
  mutation RegisterRAET(
    $client: String!
    $clientNumber: String
    $airport: String!
    $guideNumber: String
    $expectedArrivalDate: String!
    $quantity: Int!
    $notes: String
    $packageType: String!
    $reference: String
    $step: Int!
    $notificationDate: String!
    $history: AddHistoryDtoInput
    $entryType: String
  ) {
    createOperation(
      createOperationInput: {
        client: $client
        clientNumber: $clientNumber
        airport: $airport
        guideNumber: $guideNumber
        expectedArrivalDate: $expectedArrivalDate
        quantity: $quantity
        notes: $notes
        packageType: $packageType
        reference: $reference
        step: $step
        notificationDate: $notificationDate
        history: $history
        entryType: $entryType
      }
    ) {
      step
      active
      completed
    }
  }
`;
