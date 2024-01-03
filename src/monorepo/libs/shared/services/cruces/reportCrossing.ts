import axios from '@gsuite/shared/utils/crossingAxios';

export const reportCrossing = async (
  clientNumber?: string[],
  initialDate?: Date,
  finalDate?: Date,
): Promise<Blob> => axios.get(
  '/exportReportOps',
  {
    params: { clientNumber, initialDate, finalDate },
    responseType: 'blob',
  },
);
