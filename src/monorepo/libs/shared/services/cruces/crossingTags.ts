import { FileDropZone } from '@gsuite/typings/files';
import axios from '@gsuite/shared/utils/crossingAxios';

export type Tags = {
  file: string;
  tag: string;
};

export const getTagsFiles = async (files: FileDropZone[]): Promise<Tags[] | string> => {
  try {
    return await axios.post('/getTagsFiles', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch {
    return 'Tags error';
  }
};
