import { gql, useSubscription } from '@apollo/client';
import mongoose from 'mongoose';
import { CruseQuery } from './cruce-detail';

export const CRUSE_QUERY = gql`
  subscription CRUCES_UPDATE ($id: String!){
  CRUCES_UPDATE(id: $id){
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
    typeModulation
    sentDarwin
    isWithoutTxtFlow
    requiredActions {
      fileNodeId
      name
      nameFile
      resolved
    }
  }
}
`;

export const useSubCruceDetail = (
  cruceId: string,
  setCrossing: (crossing: CruseQuery['getCrossing']) => void,
) => useSubscription(CRUSE_QUERY, {
  variables: { id: cruceId },
  context: { clientName: 'globalization' },
  onData: (data) => setCrossing(data?.data?.data?.CRUCES_UPDATE ?? {}),
  skip: !mongoose.Types.ObjectId.isValid(cruceId),
});
