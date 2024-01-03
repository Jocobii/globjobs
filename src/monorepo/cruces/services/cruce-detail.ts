import { gql, useQuery } from '@apollo/client';
import { NodeModels } from '@gsuite/typings/files';
import mongoose from 'mongoose';

export type History = {
  action: string;
  comments: string;
  user: {
    id: string,
    name: string;
    lastName: string;
  }
  files: string[];
  operationDate: string;
};

export type StatusHistory = {
  statusId: {
    _id: string;
  };
  startedAt: string;
  finishedAt?: string;
  resolved?: boolean;
};

export type CruseQuery = {
  getCrossing: {
    id: string;
    number: string;
    client: string;
    clientNumber: string;
    patente: string;
    aduana: string;
    type: string;
    comments?: string;
    pedimento?: string;
    trafficType?: string;
    user?: {
      _id: string;
      name: string;
      lastName: string;
    }
    status: {
      _id: string;
      name: string;
      color: string;
    }
    statusHistory?: StatusHistory[]
    nodes: {
      tree: NodeModels[];
      externalNode: NodeModels[];
      dispatchFileNode: NodeModels[];
    }
    history: History[]
    sentDarwin: boolean;
    isAAUSDocComplete: boolean;
  }
};

export const CRUSE_QUERY = gql`
  query($id: String!){
  getCrossing(id:$id){
    isAAUSDocComplete
    id
    number
    client
    clientNumber
    patente
    aduana
    user{
      id
      name
      lastName
    }
    type
    createBy {
      id
      name
      lastName
    }
    customerUser {
      id
      name
      lastName
    }
    status {
        _id
        name
        color
        publicName
      }
    statusHistory {
      statusId
      startedAt
      finishedAt
      resolved
    }
    history{
      user{
        id
        name
        lastName
      }
      operationDate
      action
      comments
      files
    }
    nodes{
      tree{
        id
        text
        parent
        droppable
        data{
          file{
            name
            url
            key
          }
          ext
          name
          validate
          tags
          digitized
          unauthorized
          firstDigitized
          valueDarwin{
            id
            number
            type
            key
            FechaDePagoBanco
            remesas {
              numero
              tipo
              factura
            }
          }
          issues {
            errors
            name
            warnings
            issues {
              field
              line
              message
              newValue
              resolved
              rule
              section
              type
              value
            }
          }
          pendingAuthorization
          pendingPaymentAuthorization
          authorizedCashAmount
          pedimentoNumber
        }
      }
      externalNode {
        id
        text
        parent
        droppable
        data {
          file {
            name
            url
            key
          }
          ext
          name
          validate
          tags
          digitized
          firstDigitized
          pendingAuthorization
          pendingPaymentAuthorization
          pedimentoNumber
        }
      }
      dispatchFileNode {
         id
        text
        parent
        droppable
        data {
          file {
            name
            url
            key
          }
          firstDigitized
          digitized
          ext
          name
          validate
          tags
          integrationNumber
        }
      }
    }
    maritimeFlow {
      user {
        id
        name
        lastName
      }
      files {
        url
        key
      }
      step {
        label
        key
      }
      issuedAt
      status {
        _id
        name
        color
        publicName
        key
      }
      nextStatus {
        _id
        name
        color
        publicName
        key
      }
      completed
      data {
        emails
        appointmentDate
        eta
        inspection
        containerNumber
        closingDate
        sailingDate
      }
    }
    typeModulation
    sentDarwin
    trafficType
    isWithoutTxtFlow
    requiredActions {
      fileNodeId
      name
      nameFile
      resolved
      type
    }
  }
}
`;

export const useCruceDetail = (cruceId: string) => useQuery<CruseQuery>(CRUSE_QUERY, {
  variables: { id: cruceId },
  context: { clientName: 'globalization' },
  skip: !mongoose.Types.ObjectId.isValid(cruceId),
});
