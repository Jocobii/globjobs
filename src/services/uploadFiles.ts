import axios from '../utils/axios';
import { FileDropZone } from '../typings/files';

export type FilesData = {
  key: string;
  url: string;
};

export const uploadFiles = async (files: FileDropZone[]) => {
  try {
    return await axios.post('/upload', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    return 'upload error';
  }
};

export const createArrayFiles = (array: FilesData[]) => array.map(({ key, url }: FilesData) => ({
  name: key,
  url,
}));
