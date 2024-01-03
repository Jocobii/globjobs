import { gql, useLazyQuery } from '@apollo/client';

export const RECEIVED_STOCK_AND_TRACE = gql`
  query($received: String!){
    getReceivedStockAndTrace(received: $received) {
      receiveLineItemPackageName
      receiveLineItemReceivedQty
      packagesQuantity
      receiveOrderCreationDate
    }
  }
`;

export function useReceivedStockAndTrace() {
  return useLazyQuery(RECEIVED_STOCK_AND_TRACE);
}
