import {
  FileDropZone,
} from '@gsuite/typings/files';
import { convert } from '../services/file';

const useFiles = () => {
  const validateFile = (
    filesUploaded: FileDropZone,
  ) => convert({ file: filesUploaded });

  return {
    validateFile,
  };
};

export default useFiles;
