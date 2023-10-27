import { gql, useQuery } from '@apollo/client';
import { CreateCrossingType } from '../types';

export const CRUSE_QUERY = gql`
  query($id: String!){
  getCrossing(id:$id){
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

export const useCruceDetail = (cruceId: string) => useQuery<CreateCrossingType>(CRUSE_QUERY, {
  variables: { id: cruceId },
  context: { clientName: 'globalization' },
  skip: !cruceId,
});
