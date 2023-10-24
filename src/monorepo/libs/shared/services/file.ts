import { FileDropZone } from '@gsuite/typings/files';
import Axios, { AxiosRequestConfig } from 'axios';

const axios = Axios.create({
  baseURL: '/crossing',
  withCredentials: true,
});

axios.interceptors.request.use((request: AxiosRequestConfig) => {
  const { token } = JSON.parse(localStorage.getItem('wms.config') ?? '{}');

  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

type ParamsNodes = {
  file: FileDropZone,
};

export const convert = async ({
  file,
}: ParamsNodes) => axios.post('/convertToXML', {
  file,
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  responseType: 'blob',
}).catch(({ response }) => response);
