import { FileDropZone, NodeModels } from '@gsuite/typings/files';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: '/crossing',
  withCredentials: true,
});

axios.interceptors.request.use((request) => {
  const { token } = JSON.parse(localStorage.getItem('wms.config') ?? '{}');

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

type ParamsNodes = {
  clientNumber: string;
  operationType: number,
  nodes: NodeModels[],
  files?: FileDropZone[],
};

export const validateFiles = async ({
  clientNumber,
  operationType,
  nodes,
  files,
}: ParamsNodes) => axios.post('/validate', {
  clientNumber, operationType, nodes, files,
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
