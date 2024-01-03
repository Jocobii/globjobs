import { FileDropZone, NodeModels } from '@gsuite/typings/files';
import axios from '@/clients/axios-globalization'

type ParamsNodes = {
  clientNumber: string;
  operationType: number,
  nodes: NodeModels[],
  files?: FileDropZone[],
};

export const validateFiles = async ({
  clientNumber,
  operationType,
  nodes,
  files,
}: ParamsNodes) => axios.post('/validate', {
  clientNumber, operationType, nodes, files,
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
