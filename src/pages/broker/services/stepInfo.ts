import { gql, useMutation } from '@apollo/client';

type Populate = {
  _id: string;
  name: string;
};
type Status = Populate;
type Maneuvers = Populate;
type FileData = {
  name: string;
  url: string;
  ext: string;
};
type Warehouse = {
  name: string;
  distributionChannel: string;
  salesOffice: string;
};
type ArrayFields = {
  businessName: string;
  invoiceNumber: string;
  packagesQuantity: string;
  references: string;
  remesa: string;
  patente: string;
  aduana: string;
  requirementNumber: string;
};
type ShippingOrder = {
  shippingOrderId: string;
  receiveOrders: string[];
};
type ReceiveLines = {
  receiveLineItemPackageName: string;
  receiveLineItemReceivedQty: number;
  packagesQuantity: number;
  receiveOrderCreationDate: Date;
};
type ReceiveStockAndTrace = {
  number: string;
  receivedDate: Date;
  lines: [ReceiveLines];
};

export type InfoStep = {
  step: number;
  pickupAppointment: Date;
  references: string;
  notes: string;
  status: Status;
  date: Date;
  arrivalPlace: string;
  origin: string;
  shippingOrder: string;
  importType: string;
  entryType: string;
  releaseDate: Date;
  trafficNumber: string;
  economicNumber: string;
  driver: string;
  vehicleType: string;
  receiptNumber: string;
  quantity: number;
  movement: Maneuvers;
  packageType: string;
  requirementNumber: string;
  invoiceNumber: string;
  packingListFiles: [FileData];
  txtFiles: [FileData];
  additionalFiles: [FileData];
  requirementFiles: [FileData];
  invoiceFiles: [FileData];
  warehouse: Warehouse;
  company: string;
  informationStatus: string;
  arrayFields: [ArrayFields];
  shipper: string;
  shippingOrders: [ShippingOrder];
  receiptNumbers: [ReceiveStockAndTrace];
};

export type StepInfo = {
  getStepInfo: InfoStep;
};
export const STEP_INFO_QUERY = gql`
  mutation ($id: String!, $step: Float!) {
    getStepInfo(id: $id, step: $step) {
      step
      pickupAppointment
      references
      notes
      status {
        _id
        name
      }
      date
      arrivalPlace
      origin
      pickupAppointment
      shippingOrder
      references
      notes
      importType
      entryType
      releaseDate
      trafficNumber
      economicNumber
      driver
      vehicleType
      receiptNumber
      quantity
      movement {
        _id
        name
      }
      packageType
      requirementNumber
      invoiceNumber
      packingListFiles {
        name
        url
        ext
      }
      txtFiles {
        name
        url
        ext
      }
      additionalFiles {
        name
        url
        ext
      }
      requirementFiles {
        name
        url
        ext
      }
      invoiceFiles {
        name
        url
        ext
      }
      warehouse {
        name
        distributionChannel
        salesOffice
      }
      company
      informationStatus
      arrayFields {
        businessName
        invoiceNumber
        packagesQuantity
        references
        remesa
        patente
        aduana
        requirementNumber
      }
      shipper
      shippingOrders {
        shippingOrderId
        receiveOrders
      }
      receiptNumbers {
        number
        receivedDate
        lines {
          receiveLineItemPackageName
          receiveLineItemReceivedQty
          packagesQuantity
          receiveOrderCreationDate
        }
      }
    }
  }
`;

export function useStepInfo() {
  return useMutation<StepInfo>(STEP_INFO_QUERY);
}
