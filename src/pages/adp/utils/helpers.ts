import { FieldValues } from 'react-hook-form';
import dayjs from 'dayjs';
import { decodeToken } from '@gsuite/shared/utils/jwt';
import { get } from 'lodash';
import { DATE_FORMAT, formFields } from './constans';
import { FilterForm, Document } from '../typings';

export const getExtByName = (name = '') => {
  const [ext] = name.toLocaleLowerCase().split('.').reverse();
  return ext;
};

const {
  client,
  startDate,
  endDate,
  pedimento,
  cove,
  factura,
  clave,
  aduana,
  patente,
} = formFields;

export const getFormValues = (data: FieldValues) => ({
  client: get(data, client, ''),
  ...get(data, startDate) && { startDate: dayjs(get(data, startDate)).format(DATE_FORMAT) },
  ...get(data, endDate) && { endDate: dayjs(get(data, endDate)).format(DATE_FORMAT) },
  ...get(data, cove) && { cove: get(data, cove).join(',') },
  ...get(data, pedimento) && { pedimento: get(data, pedimento).join(',') },
  ...get(data, factura) && { factura: get(data, factura).join(',') },
  ...get(data, clave) && { clave: get(data, clave).join(',') },
  ...get(data, aduana) && { aduana: get(data, aduana).join(',') },
  ...get(data, patente) && { patente: get(data, patente).join(',') },
  audit: true,
} as unknown as FilterForm);

export const getEmailFromToken = () => decodeToken(localStorage.getItem('accessToken') as string)?.email;

export const getFileTokenFromUrl = (file: Document[]) => file
  .filter((e) => e.file_token.length > 8)
  .map((e) => e?.file_token);

export const downloadFile = (data: Blob, type: string, name = 'file') => {
  const blob = new Blob([data], { type });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${name}-${Date.now()}`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
