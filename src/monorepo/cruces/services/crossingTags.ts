import { FileDropZone } from '@gsuite/typings/files';
import axios from '@gsuite/shared/utils/crossingAxios';

export const getTagsFiles = async (files: FileDropZone[]) => {
  console.log('files', files);
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
