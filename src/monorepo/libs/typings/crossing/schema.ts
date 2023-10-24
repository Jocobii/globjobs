import { NodeModels } from '../files';
import { PaginatedResponse } from '../table';

export type Crossing = {
  id: string | undefined;
  number: string | undefined;
  client: string | undefined;
  clientNumber: string | undefined;
  patente: string | undefined;
  aduana: string | undefined;
  type: string | undefined;
  status: {
    _id: string | undefined;
    name: string | undefined;
    color: string | undefined;
    publicName: string | undefined;
  };
  nodes: {
    tree: NodeModels[] | undefined;
    externalNode: NodeModels[] | undefined;
    dispatchFileNode: NodeModels[] | undefined;
  };
  requiredActions: {
    name: string | undefined;
    nameFile: string | undefined;
    resolved: boolean | undefined;
  }
};

export type CrossingListResponse = PaginatedResponse<Crossing>;

export type CrossingQuery = {
  crossingList: CrossingListResponse;
};
