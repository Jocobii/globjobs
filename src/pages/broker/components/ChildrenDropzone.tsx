import {
  useEffect, useState, Dispatch, SetStateAction,
} from 'react';

import { FileDropZone } from '@/typings/files';
import { Dropzone } from '@/components';

type Props = {
  index: number;
  fileSetter: Dispatch<SetStateAction<FileDropZone[][]>>;
  label: string;
  fileRemove?: (fileId: string) => void;
  disabled?: boolean;
};

export default function ChildrenDropzone({
  index, fileSetter, label, fileRemove = () => null,
  disabled = false,
}: Readonly<Props>) {
  const [files, setFiles] = useState<FileDropZone[]>([]);

  useEffect(() => {
    fileSetter((prev: FileDropZone[][]) => {
      const prevFilesArray = [...prev];
      const newPrevFilesSubArray = [...files];
      prevFilesArray[index] = newPrevFilesSubArray;
      return prevFilesArray;
    });
  }, [files, fileSetter, index]);

  return (
    <Dropzone
      disabled={disabled}
      label={label}
      files={files}
      filesSetter={setFiles}
      key="requirement-field"
      fileRemove={fileRemove}
    />
  );
}
