import { gql, useMutation, useQuery } from '@apollo/client';
import { DASHBOARD_DATA } from '../../../services/operation-dashboard';

// TYPES
type DataFiles = {
  name: string;
  url: string;
  ext: string;
};

type ReferenceHistory = {
  label: number;
  references: string[];
};

type Logs = {
  user: string;
  date: string;
  newValue: string;
};

export type OperationQuery = {
  operation: {
    number: string;
    client: string;
    clientNumber?: string;
    step: number;
    skipStepUsa: boolean;
    isInvoiced?: boolean;
    history: [
      {
        step: number;
        userName: string;
        status: {
          name: string;
        };
        date: Date;
        logs: Logs[] | [];
        company: string;
        quantity: number;
        origin: string;
        arrivalPlace: string;
        packingListFiles: DataFiles[];
      },
    ];
    referencesHistory: ReferenceHistory[];
    steps: [
      {
        step: string;
        date: string;
      },
    ];
    timeElapsed: string;
    resume: [{
      title: string;
      info: string[];
    }];
    documents: DataFiles[];
    extraCharges: [
      {
        charges: [
          {
            charge: string;
            qty: number;
            sapid: string;
          },
        ];
      },
    ];
  };
};

// QUERIES
export const OPERATION_QUERY = gql`
  query PostsQuery($id: String!) {
    operation(id: $id) {
      client
      clientNumber
      number
      skipStepUsa
      step
      isInvoiced
      history {
        userName
        step
        logs {
          user
          date
          newValue
        }
        status {
          name
        }
        date
        company
        quantity
        origin
        arrivalPlace
        packingListFiles {
          url
        }
      }
      referencesHistory {
        label
        references
      }
      steps {
        step
        date
      }
      timeElapsed
      resume {
        title
        info
      }
      documents {
        name
        url
        ext
      }
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
      }
    }
  }
`;

export const BORDER_INFO = gql`
  query($id: String!){
  borderInfo(id: $id){
    trafficNumber
    economicNumber
    driver
    vehicleType
  }
}
`;

// MUTATIONS
export const ADD_HISTORY = gql`
  mutation addHistory(
    $id: String
    $arrivalPlace: String
    $pickupAppointment: DateTime
    $references: String
    $trafficNumber: String
    $economicNumber: String
    $driver: String
    $vehicleType: String
    $warehouse: WarehouseDtoInput
    $receiptNumber: String
    $importType: String
    $requirementNumber: String
    $releaseDate: DateTime
    $invoiceNumber: String
    $entryType: String
    $shippingOrders: [ShippingOrderReceiptInput!]
    $arrayFields: [RequirementDtoInput!]
    $movement: String
    $packageType: String
    $quantity: Float
    $notes: String
    $step: Float!
    $additionalFiles: [FileDataDtoInput!]
    $requirementFiles: [FileDataDtoInput!]
    $invoiceFiles: [FileDataDtoInput!]
    $txtFiles: [FileDataDtoInput!]
    $additionalCharges: [AdditionalExtraChargeDto!]
    $number: String
    $receiptNumbers: [AddReceiveDtoInput!]
    $gops: [GopsInput!]
    $verifyPedimentos: [VerifyPedimentosInput!]
    $client: String
    $clientNumber: String
    $isCreateOperation: Boolean
    $skipStepUsa: Boolean
    $shipper: String
  ) {
    addHistory(
      id: $id
      history: {
        arrivalPlace: $arrivalPlace
        pickupAppointment: $pickupAppointment
        references: $references
        trafficNumber: $trafficNumber
        economicNumber: $economicNumber
        driver: $driver
        vehicleType: $vehicleType
        warehouse: $warehouse
        receiptNumber: $receiptNumber
        importType: $importType
        requirementNumber: $requirementNumber
        releaseDate: $releaseDate
        invoiceNumber: $invoiceNumber
        entryType: $entryType
        shippingOrders:  $shippingOrders
        arrayFields: $arrayFields
        movement: $movement
        packageType: $packageType
        quantity: $quantity
        notes: $notes
        step: $step
        additionalFiles: $additionalFiles
        requirementFiles: $requirementFiles
        invoiceFiles: $invoiceFiles
        txtFiles: $txtFiles
        additionalCharges: $additionalCharges
        number: $number
        receiptNumbers: $receiptNumbers
        gops: $gops
        verifyPedimentos: $verifyPedimentos
        client: $client
        clientNumber: $clientNumber
        shipper: $shipper
      }
      isCreateOperation: $isCreateOperation
      skipStepUsa: $skipStepUsa
    ) {
      client
      step
      skipStepUsa
      history {
        userName
        status {
          name
        }
        date
        company
        quantity
        origin
        arrivalPlace
        packingListFiles {
          url
        }
      }
      referencesHistory {
        label
        references
      }
      steps {
        step
        date
      }
      timeElapsed
      resume {
        title
        info
      }
      documents {
        name
        url
        ext
      }
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
      }
    }
  }
`;

export const UPDATE_HISTORY = gql`
  mutation updateStepInfo(
    $id: String
    $arrivalPlace: String
    $pickupAppointment: DateTime
    $references: String
    $trafficNumber: String
    $economicNumber: String
    $driver: String
    $vehicleType: String
    $warehouse: WarehouseDtoInput
    $receiptNumber: String
    $importType: String
    $requirementNumber: String
    $releaseDate: DateTime
    $invoiceNumber: String
    $entryType: String
    $shippingOrders: [ShippingOrderReceiptInput!]
    $arrayFields: [RequirementDtoInput!]
    $movement: String
    $packageType: String
    $quantity: Float
    $notes: String
    $step: Float
    $additionalFiles: [FileDataDtoInput!]
    $requirementFiles: [FileDataDtoInput!]
    $invoiceFiles: [FileDataDtoInput!]
    $txtFiles: [FileDataDtoInput!]
    $additionalCharges: [AdditionalExtraChargeDto!]
    $number: String
    $receiptNumbers: [AddReceiveDtoInput!]
    $gops: [GopsInput!]
    $verifyPedimentos: [VerifyPedimentosInput!]
    $client: String
    $clientNumber: String
    $shipper: String
    $logInput: LogOpsInput
  ) {
    updateStepInfo(
      id: $id
      history: {
        arrivalPlace: $arrivalPlace
        pickupAppointment: $pickupAppointment
        references: $references
        trafficNumber: $trafficNumber
        economicNumber: $economicNumber
        driver: $driver
        vehicleType: $vehicleType
        warehouse: $warehouse
        receiptNumber: $receiptNumber
        importType: $importType
        requirementNumber: $requirementNumber
        releaseDate: $releaseDate
        invoiceNumber: $invoiceNumber
        entryType: $entryType
        shippingOrders:  $shippingOrders
        arrayFields: $arrayFields
        movement: $movement
        packageType: $packageType
        quantity: $quantity
        notes: $notes
        step: $step
        additionalFiles: $additionalFiles
        requirementFiles: $requirementFiles
        invoiceFiles: $invoiceFiles
        txtFiles: $txtFiles
        additionalCharges: $additionalCharges
        number: $number
        receiptNumbers: $receiptNumbers
        gops: $gops
        verifyPedimentos: $verifyPedimentos
        client: $client
        clientNumber: $clientNumber
        shipper: $shipper
      }
      logInput: $logInput
    ) {
      client
      step
      skipStepUsa
      history {
        userName
        status {
          name
        }
        date
        company
        quantity
        origin
        arrivalPlace
        packingListFiles {
          url
        }
      }
      referencesHistory {
        label
        references
      }
      steps {
        step
        date
      }
      timeElapsed
      resume {
        title
        info
      }
      documents {
        name
        url
        ext
      }
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
      }
    }
  }
`;

export const ADD_EXTRA_CHARGE = gql`
  mutation addExtraCharge($id: String!, $extraCharge: ExtraChargeInput!) {
    addExtraCharge(id: $id, extraCharge: $extraCharge) {
      _id
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
        invoiceDate
        notes
        reference
        warehouse {
          name
          distributionChannel
          salesOffice
        }
      }
      resume {
        title
        info
      }
    }
  }
`;

export const SKIP_TRANSPORT_DATA = gql`
  mutation skipTransportData(
    $id: String!,
    $notes: String,
    $warehouse: WarehouseDtoInput,
    $additionalFiles: [FileDataDtoInput!],
    $txtFiles: [FileDataDtoInput!],
    $packingListFiles: [FileDataDtoInput!],
    $requirementFiles: [FileDataDtoInput!],
    $invoiceFiles: [FileDataDtoInput!],
    $step: Float,
    $isEdit: Boolean,
  ) {
    skipTransportData(
      id: $id
      data: {
        step: $step
        notes: $notes
        warehouse: $warehouse,
        additionalFiles: $additionalFiles
        txtFiles: $txtFiles
        packingListFiles: $packingListFiles
        requirementFiles: $requirementFiles
        invoiceFiles: $invoiceFiles
      }
      isEdit: $isEdit
    ) {
      client
      number
      step
      skipStepUsa,
      history {
        userName
        status {
          name
        }
        date
        company
        quantity
        origin
        arrivalPlace
        packingListFiles {
          url
        }
      }
      steps {
        step
        date
      }
      timeElapsed
      resume {
        title
        info
      }
      documents {
        name
        url
        ext
      }
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
      }
    }
  }
`;

export const SKIP_STEP_USA = gql`
  mutation skipStepUsa($id: String!, $isEdit: Boolean) {
    skipStepUsa(id: $id, isEdit: $isEdit) {
      client
      number
      step
      skipStepUsa,
      history {
        userName
        status {
          name
        }
        date
        company
        quantity
        origin
        arrivalPlace
        packingListFiles {
          url
        }
      }
      steps {
        step
        date
      }
      timeElapsed
      resume {
        title
        info
      }
      documents {
        name
        url
        ext
      }
      extraCharges {
        charges {
          sapid
          charge
          qty
        }
      }
    }
  }
`;

export const OMIT_RECEIVE_WMS_QUERY = gql`
mutation($id: String!, $isEdit: Boolean) {
  skipReceiveWms(id: $id, isEdit: $isEdit) {
    client
    number
    step
    skipStepUsa,
    history {
      userName
      status {
        name
      }
      date
      company
      quantity
      origin
      arrivalPlace
      packingListFiles {
        url
      }
    }
    steps {
      step
      date
    }
    timeElapsed
    resume {
      title
      info
    }
    documents {
      name
      url
      ext
    }
    extraCharges {
      charges {
        sapid
        charge
        qty
      }
    }
  }
}
`;

export function useUpdateHistory(operationId: string) {
  return useMutation(UPDATE_HISTORY, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.updateHistory,
          },
        },
      });
    },
  });
}

export function useAddHistory(operationId: string) {
  return useMutation(ADD_HISTORY, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.addHistory,
          },
        },
      });
    },
    refetchQueries: [{ query: DASHBOARD_DATA }],
  });
}

export function useAddExtraCharge(operationId: string) {
  return useMutation(ADD_EXTRA_CHARGE, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.addExtraCharge,
          },
        },
      });
    },
  });
}

export function useOperation(operationId: string) {
  return useQuery<OperationQuery>(OPERATION_QUERY, {
    variables: { id: operationId },
  });
}

export function useBorderInfo(operationId: string) {
  return useQuery(BORDER_INFO, {
    variables: { id: operationId },
  });
}

export function useSkipStep(operationId: string) {
  return useMutation(SKIP_STEP_USA, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.skipStepUsa,
          },
        },
      });
    },
  });
}

export function useOmitReceiveWms(operationId: string) {
  return useMutation(OMIT_RECEIVE_WMS_QUERY, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.skipReceiveWms,
          },
        },
      });
    },
  });
}

export function useSkipTransport(operationId: string) {
  return useMutation(SKIP_TRANSPORT_DATA, {
    update(cache, { data }) {
      const operationData = cache.readQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
      });
      cache.writeQuery<OperationQuery>({
        query: OPERATION_QUERY,
        variables: { id: operationId },
        data: {
          ...operationData,
          operation: {
            ...operationData?.operation,
            ...data.skipTransportData,
          },
        },
      });
    },
  });
}
