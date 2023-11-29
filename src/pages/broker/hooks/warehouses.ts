import { gql, useQuery } from '@apollo/client';

export type WarehousesQuery = {
  findAllWarehouses: [
    {
      _id: string;
      name: string;
    },
  ];
};

export const WAREHOUSES_QUERY = gql`
  query findWarehouses {
    findAllWarehouses {
      _id
      name
      distributionChannel
      salesOffice
    }
  }
`;

export function useWarehouses() {
  return useQuery<WarehousesQuery>(WAREHOUSES_QUERY);
}
