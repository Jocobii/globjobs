/* eslint-disable sonarjs/no-duplicate-string */
import * as yup from 'yup';
import { GENERIC_MESSAGE } from '../utils/constans';

export type File = {
  fileName: string;
  route: string;
  selected?: boolean | number;
  fileType?: string | null;
  file_name: string;
  include: boolean;
  renamed: boolean;
  routes: string[];
  size: number;
  size_human: string;
  file_token: string;
  file_url: string;
};

export type Remesa = {
  Clave: string;
  EDocument: string;
  FechaTransmisionCove: string;
  ID: number;
  NombreArchivo: string;
  NumeroDeFactura: string;
  NumeroDeRemesa: number;
  Pedimento: string;
  Proveedor: number;
  files: File[];
  year: number;
};

export type Pediment = {
  customHouse: string;
  customLicense: string;
  customsDeclaration: string;
  fileType?: string;
  pedimento: string;
  tipo: number;
  pedimentDate: string;
  bankPaymentDate?: string;
  files: File[];
  clave: string;
  fechaDePagoBanco: string;
  fechaPedimento: string;
  selected?: boolean;
  visible?: boolean;
  aduana: string;
  cliente: number;
  generales?: File[];
  digitalizaciones: any[];
  dir: string;
  facturas: string[];
  fecha_de_pago: string;
  iD: number;
  patente: string;
  pediment_dir: string;
  size?: number;
  total_files: number;
  year: string;
  remesas: Remesa[];
  audit?: Record<string, boolean>;
};

export type PedimentoGroup = Record<string, Pediment[]>;
export type RemesaGroup = Pediment[];

export type ResponseGrouped<T> = {
  body: {
    data: T;
  };
};

export type ResponseData = {
  client: string;
  email: string;
  pediments: Pediment[];
};

export type Response = {
  success: boolean;
  data: ResponseData;
};

export type Company = {
  Numero?: string;
  Nombre?: string;
};

export type DataDownload = {
  fileName: string;
  file: string;
};

export type Download = {
  success: boolean;
  data: DataDownload[];
  message: string;
};

export type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
  type: string;
  year?: string;
  extra?: any;
};

export type FormData = {
  type: string;
  query: {
    startDate: Date;
    endDate: Date;
    ids: string[];
    email: string[];
  };
};

export type Document = {
  file_token: string;
  father: string;
  remesa?: string;
};

export const formExportFields = {
  client: yup.string().required(GENERIC_MESSAGE),
  startDate: yup.date().nullable().default(null).transform((curr, orig) => (orig === '' ? null : curr)),
  endDate: yup
    .date()
    .nullable()
    .default(null)
    .transform((curr: any, orig: any) => (orig === '' ? null : curr)),
};

export const filterSchema = yup.object().shape({
  client: yup.string().required(GENERIC_MESSAGE),
  startDate: yup.date().nullable().default(null).transform((curr, orig) => (orig === '' ? null : curr)),
  endDate: yup
    .date()
    .nullable()
    .default(null)
    .transform((curr: any, orig: any) => (orig === '' ? null : curr)),
  pedimento: yup.array().of(yup.string()
    .matches(/^[0-9]+$/, ({ value }) => `${value} no es un pedimento valido`)
    .min(7, 'El pedimento debe ser de 7 digitos')
    .max(7, 'El pedimento debe ser de 7 digitos')),
  factura: yup.array().of(yup.string())
    .optional()
    .nullable()
    .default(null),
  clave: yup.array().of(yup.string()
    .min(2, ({ value }) => `${value} no es una clave de pedimento valida`)
    .max(2, ({ value }) => `${value} no es una clave de pedimento valida`))
    .optional()
    .nullable()
    .default(null),
  aduana: yup.array().of(yup.string()
    .matches(/^[0-9]+$/, ({ value }) => `${value} no es una aduana valida`)
    .min(3, ({ value }) => `La aduana ${value} debe ser de 3 digitos`)
    .max(3, ({ value }) => `La aduana ${value} debe ser de 3 digitos`)
    .optional()
    .nullable()
    .default(null)
    .transform((_, val) => (val !== '' ? val : null)))
    .optional()
    .nullable()
    .default(null),
  patente: yup.array().of(yup.string()
    .matches(/^[0-9]+$/, ({ value }) => `${value} no es una patente valida`)
    .min(4, ({ value }) => `${value} no es una patente valida de 4 digitos`)
    .max(4, ({ value }) => `${value} no es una patente valida de 4 digitos`)
    .optional()
    .nullable()
    .default(null)
    .transform((_, val) => (val !== '' ? val : null)))
    .optional()
    .nullable()
    .default(null),
  cove: yup.array().of(yup.string()),
  groupBy: yup.string().optional().nullable(),
});

export type FilterForm = yup.InferType<typeof filterSchema>;

export type GroupBy = 'Pedimento' | 'Remesa';
