import { FileDropZone, PreTaggedFile } from '@gsuite/typings/files';
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
  crossingId: string;
  targetFolder: string;
  files?: FileDropZone[];
  comments?: string;
  pedimento?: string;
  preTaggedFiles?: PreTaggedFile[];
};

export const addNewFilesToCrossing = async ({
  crossingId,
  targetFolder,
  files,
  comments,
  pedimento,
  preTaggedFiles,
}: ParamsNodes) => axios.post(`/add-files/${crossingId}`, {
  preTaggedFiles, files, targetFolder, pedimento, comments,
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
