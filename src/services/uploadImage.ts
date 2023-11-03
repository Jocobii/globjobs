import axios from '@gsuite/shared/utils/axios';

export type Response = {
  key: string;
  url: string;
  bucket: string;
  etag: string;
};

export const uploadFiles = async (
  file: ArrayBuffer,
  isResize?: boolean,
  width?: number,
  height?: number,
): Promise<Response[]> => {
  try {
    return await axios.post('/upload-image', {
      file,
      isResize,
      width,
      height,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    throw new Error('upload error');
  }
};
