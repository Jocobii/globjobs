import { gql, useLazyQuery } from '@apollo/client';

export const SHIPPING_ORDER_STOCK_AND_TRACE = gql`
  query($soId: String!){
    getReceiptByExit(soId: $soId) {
      shippingOrderId
      receiveOrders
    }
  }
`;

export function useShippingStockAndTrace() {
  return useLazyQuery(SHIPPING_ORDER_STOCK_AND_TRACE);
}
