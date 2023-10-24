import axios from '@gsuite/shared/utils/crossingAxios';

export const downloadProformaFiles = async (crossingId: string, pedimento: string):
Promise<any> => axios.get(`/download-proform/${crossingId}/${pedimento}`, {
  responseType: 'blob',
});
