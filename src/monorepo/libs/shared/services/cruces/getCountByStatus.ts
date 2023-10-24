import { gql, useQuery } from '@apollo/client';

export type CountStatus = {
  countCrossingsByStatus: {
    customsRecognition: number;
    documentsDelivered: number;
    documentsProcess: number;
    finishedOperation: number;
    freeDisadvantage: number;
    paidDocuments: number;
    proformaAuthorization: number;
    readyDocuments: number;
  };
};

export const COUNT_STATUS_OUTPUT = gql`
  query CountCrossingsByStatus {
    countCrossingsByStatus {
      documentsProcess
      proformaAuthorization
      paidDocuments
      readyDocuments
      documentsDelivered
      customsRecognition
      freeDisadvantage
      finishedOperation
    }
  }
`;

export function useCountByStatus() {
  return useQuery<CountStatus>(COUNT_STATUS_OUTPUT, {
    context: { clientName: 'globalization' },
  });
}
