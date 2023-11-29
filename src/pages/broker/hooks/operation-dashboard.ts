import { gql, useQuery } from '@apollo/client';

export type DashboardAbstract = {
  dashboardData: {
    requestedOperations: number;
    operationProcess: number;
    operationFinished: number;
    arrivalUsa: number;
    usImport: number;
    collectionByTransport: number;
    usWarehouseReceipt: number;
    mxImport: number;
    borderCrossingUsaMex: number;
    arrivalMxWarehouse: number;
  };
};

export const DASHBOARD_DATA = gql`
  query DashboardAbstract {
    dashboardData {
      requestedOperations
      operationProcess
      operationFinished
      arrivalUsa
      usImport
      collectionByTransport
      usWarehouseReceipt
      mxImport
      borderCrossingUsaMex
      arrivalMxWarehouse
    }
  }
`;

export function useDashboardAbstract() {
  return useQuery(DASHBOARD_DATA);
}
