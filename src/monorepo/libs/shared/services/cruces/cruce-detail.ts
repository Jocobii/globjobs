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

export type RequiredActions = {
  fileNodeId?: string;
  name: string;
  nameFile: string;
  resolved: boolean;
};

export type CruseQuery = {
  getCrossing: {
    id: string;
    pedimento: string;
    number: string;
    client: string;
    clientNumber: string;
    patente: string;
    aduana: string;
    type: string;
    comments?: string;
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
    nodes: {
      tree: NodeModels[];
      externalNode: NodeModels[];
      dispatchFileNode: NodeModels[];
    }
    history: History[]
    sentDarwin: boolean;
    isWithoutTxtFlow?: boolean;
    requiredActions: RequiredActions[];
  }
};

export const CRUSE_QUERY = gql`
  query($id: String!){
  getCrossing(id: $id) {
    id
    number
    client
    clientNumber
    patente
    aduana
    pedimento
    type
    comments
    user {
      id
      name
      lastName
    }
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
    createBy {
      id
      name
      lastName
    }
    status {
      _id
      name
      color
    }
    history {
      action
      comments
      operationDate
      user {
        id
        name
        lastName
      }
      files
    }
    nodes {
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
          pedimentoNumber
          pendingAuthorization
          pendingPaymentAuthorization
          unauthorized
        }
      }
      dispatchFileNode {
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
          integrationNumber
        }
      }
      tree {
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
          valueDarwin {
            id
            number
            type
            key
            FechaDePagoBanco
            remesas {
              factura
              numero
              tipo
              patente
              aduana
              fecha
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
          unauthorized
          authorizedCashAmount
          pedimentoNumber
        }
      }
    }
    sentDarwin
    requiredActions {
      fileNodeId
      name
      nameFile
      resolved
    }
    isWithoutTxtFlow
  }
}
`;

export const useCruceDetail = (cruceId: string) => useQuery<CruseQuery>(CRUSE_QUERY, {
  variables: { id: cruceId },
  context: { clientName: 'globalization' },
  skip: !mongoose.Types.ObjectId.isValid(cruceId),
});

export default useCruceDetail;
