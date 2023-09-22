import { NodeModel } from '@minoru/react-dnd-treeview';

type PedimentoRemesasValidatedOutput = {
  numero: string;
  tipo: string;
  factura: string;
};

type PedimentValidatedOutput = {
  id: string;
  number: number;
  type: number;
  key: string;
  clientNumber?: string;
  integrationNumber?: string;
  remesas?: PedimentoRemesasValidatedOutput[];
};

type Issues = {
  type: string;
  message: string;
  section: string;
  field: number;
  line: number;
  value: string;
  rule: string;
  resolved?: boolean;
  newValue?: string;
};

export type FileWithIssue = {
  issues: Issues[];
  errors: number;
  warnings: number;
  informations: number;
  name: string;
};

export type IssuesResponse = {
  with_issues?: boolean;
  files?: FileWithIssue[];
  file_number?: number;
};

export type FileDropZone = {
  name: string;
  type?: string;
  id?: string;
};

export type UploadedFile = {
  etag: string;
  url: string;
  key: string;
  bucket: string;
};

export type FileData = {
  url?: string;
  key?: string;
  name?: string;
};

export type FileTags = {
  id: string;
} & File;

export type FileNode = {
  file?: FileDropZone & FileData;
  ext?: string;
  validate?: boolean;
  valueDarwin?: PedimentValidatedOutput;
  name?: string;
  tags?: string;
  issues?: FileWithIssue;
  digitized?: boolean;
  firstDigitized?: boolean;
  unauthorized?: boolean;
  integrationNumber?: string;
  extraData?: Record<string, unknown>;
  delete?: boolean;
  pendingAuthorization?: boolean;
  pedimentoNumber?: string;
  authorizedCashAmount?: number;
};

export type ResponseTags = {
  file: string,
  tag: string,
};

export type NodeModels = NodeModel<FileNode>;

export type ValidateFile = {
  fileId: string;
  validated: boolean;
  data: PedimentValidatedOutput;
};

export type SimpleNode = {
  id: string;
  name: string;
  key: string;
  tags: string;
  type: string;
  firstDigitized: boolean;
};

export type RequiredActions = {
  fileNodeId?: string;
  name: string;
  nameFile: string;
  resolved: boolean;
};
