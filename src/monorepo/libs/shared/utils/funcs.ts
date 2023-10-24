import { UploadedFile, NodeModels } from '@gsuite/typings/files';
import {
  txtIcon, xlsIcon, csvIcon, pdfIcon, pngIcon, fileIcon,
} from '@gsuite/shared/assets';

type Status = {
  name: string;
  color: string;
  publicName?: string;
};

const URL = 'https://pecem.mat.sat.gob.mx/app/qr/ce/faces/pages/mobile/validadorqr.jsf?D1=16&D2=1&D3=';

export const urlIntegration = (value: string) => `${URL}${value}`;

export const openNewTab = (url: string) => {
  const win = window.open(url, '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=500,height=500,left = 50,top = 50');
  win?.focus();
};

export const getStatusName = (status: Status) => {
  if (status?.publicName) {
    return status.publicName;
  }
  return status?.name ?? 'N/A';
};

export const fileToNode = (
  fileUploaded: UploadedFile,
  etiqueta: string,
  parent = '0',
  integrationNumber?: string,
): NodeModels => ({
  id: fileUploaded.key,
  parent,
  droppable: false,
  text: fileUploaded.key,
  data: {
    ext: 'pdf',
    file: {
      name: fileUploaded.key,
      key: fileUploaded.key,
      url: fileUploaded.url,
    },
    name: fileUploaded.key,
    tags: etiqueta,
    ...integrationNumber && { integrationNumber: integrationNumber.toString() },
  },
});

export const getIconImgeByExt = (ext = 'default') => {
  const icon = ext.toLowerCase() as 'pdf' | 'csv' | 'txt' | 'xls' | 'png';
  switch (icon) {
    case 'pdf':
      return pdfIcon;
    case 'csv':
      return csvIcon;
    case 'txt':
      return txtIcon;
    case 'xls':
      return xlsIcon;
    case 'png':
      return pngIcon;
    default:
      return fileIcon;
  }
};

export function getMonthName(monthNumber = 1) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('es-US', {
    month: 'long',
  });
}
