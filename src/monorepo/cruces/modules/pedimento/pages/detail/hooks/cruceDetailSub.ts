import { gql } from '@apollo/client';

export const CRUSE_QUERY_SUB = gql`
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
