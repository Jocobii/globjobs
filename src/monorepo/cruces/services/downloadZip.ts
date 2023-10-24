import axios from '@gsuite/shared/utils/crossingAxios';

export const downloadZip = (id: string): Promise<Blob> => axios.get(
  `/downloadZip/${id}`,
  {
    responseType: 'blob',
  },
);
