import { FileDropZone } from '@gsuite/typings/files';
import Axios from 'axios';

const { VITE_GLOBALIZATION_API_URI } = import.meta.env;

const axios = Axios.create({
  baseURL: `${VITE_GLOBALIZATION_API_URI}/crossing`,
  // withCredentials: true,
});

axios.interceptors.request.use((request) => {
  const { token } = JSON.parse(localStorage.getItem('wms.config') ?? '{}');

  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

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
