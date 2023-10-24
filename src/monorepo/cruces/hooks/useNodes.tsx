import {
  FileDropZone,
  NodeModels,
  FileData,
} from '@gsuite/typings/files';
import { aeach } from '@gsuite/shared/utils/aeach';
import { useState } from 'react';
import { uploadFiles } from '@gsuite/shared/lib/uploadFile';

const useNodes = () => {
  const [dispatchFile, setDispatchFile] = useState<NodeModels[]>([]);
  const extension = (name: string) => {
    const split = name.split('.');
    return {
      name: split[0],
      ext: split[1]?.toLocaleLowerCase(),
    };
  };

  const sortFiles = (filesSort: FileDropZone[]): FileDropZone[] => [...filesSort].sort((a, b) => {
    const { ext: aExt } = extension(a.name);
    const { ext: bExt } = extension(b.name);
    if (aExt < bExt) {
      return 1;
    }
    if (aExt > bExt) {
      return -1;
    }
    return 0;
  });

  const createNodes = async (
    filesCreate: FileDropZone[],
    dispatchFileNode: NodeModels[],
  ): Promise<{
    dispatchFileNodes: NodeModels[],
  }> => {
    const newDispatchFileNode = [...dispatchFileNode];
    const filesSorted = sortFiles(filesCreate);
    await aeach({
      array: filesSorted,
      callback: async (item) => {
        const id = String(Math.floor(10000 + Math.random() * 90000));
        const { name, ext } = extension(item.name);

        newDispatchFileNode.push({
          id: `${name}-${id}`,
          text: name,
          parent: '0',
          droppable: false,
          data: {
            file: item,
            ext,
            name: item.name,
            ...ext === 'pdf' && { digitized: false, firstDigitized: false },
            validate: false,
          },
        });
        return [];
      },
    });

    return { dispatchFileNodes: newDispatchFileNode };
  };

  const addFilesS3 = (filesResponse: FileData[], dispatchFileNodes: NodeModels[]) => {
    const newDispatchFileNodes = [...dispatchFileNodes];

    filesResponse.forEach(({ url, key }) => {
      const indexExternal = newDispatchFileNodes.findIndex((node) => node.data?.name === key);
      if (indexExternal !== -1) {
        newDispatchFileNodes[indexExternal].data = {
          ...newDispatchFileNodes[indexExternal].data,
          file: {
            url,
            key,
            name: key || String(indexExternal),
          },
        };
      }
    });
    return { updateNodes: newDispatchFileNodes };
  };

  return {
    dispatchFile,
    setDispatchFile,
    createNodes,
    uploadFiles,
    addFilesS3,
  };
};

export default useNodes;
