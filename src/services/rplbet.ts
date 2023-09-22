import { gql } from '@apollo/client';

export const REGISTER_RPLBET = gql`
  mutation RegisterRPLBET(
    $client: String
    $clientNumber: String
    $container: String!
    $expectedArrivalDate: String!
    $packageType: String!
    $quantity: Int!
    $reference: String
    $notes: String
    $step: Int!
    $history: AddHistoryDtoInput
    $containerSize: String
    $entryType: String
  ) {
    createOperation(
      createOperationInput: {
        client: $client
        clientNumber: $clientNumber
        container: $container
        expectedArrivalDate: $expectedArrivalDate
        packageType: $packageType
        quantity: $quantity
        reference: $reference
        notes: $notes
        step: $step
        history: $history
        containerSize: $containerSize
        entryType: $entryType
      }
    ) {
      step
      active
      completed
    }
  }
`;
