import { FileDropZone } from '@gsuite/typings/files';
import axios from '@/clients/axios-globalization';

type ParamsNodes = {
  files?: FileDropZone[],
};

export const validateProforma = async ({
  files,
}: ParamsNodes) => axios.post('/validateProforma', {
  files,
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}).catch(({ response }) => response);
