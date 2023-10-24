import axios from '@gsuite/shared/utils/axios';

export const downloadFilesZipByKeys = async (fileKeys: string[]): Promise<Blob> => axios.get(
  '/files-zip',
  {
    params: { fileKeys },
    responseType: 'blob',
  },
);
