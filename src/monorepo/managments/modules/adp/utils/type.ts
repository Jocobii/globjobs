export type File = {
  fileName: string;
  route: string;
  selected: boolean;
  ileName: string;
  fileType: string;
  file_name: string;
  include: boolean;
  renamed: boolean;
  routes: string[];
  size: number;
  size_human: string;
  file_token: string;
};

export type Pediment = {
  customHouse: string;
  customLicense: string;
  customsDeclaration: string;
  fileType: string;
  pediment: string;
  tipo: number;
  pedimentDate: string;
  bankPaymentDate: string;
  files: File[]
  selected?: boolean;
  visible?: boolean;
  aduana: string;
  cliente: number;
  digitalizaciones: any[];
  dir: string;
  facturas: string[];
  fecha_de_pago: string;
  id: number;
  patente: string;
  pediment_dir: string;
  size: number;
  total_files: number;
  year: string;
};

export type ResponseData = {
  client: string,
  email: string,
  pediments: Pediment[]
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
  }
};

export type FormProps = {
  onSubmit: (data: FormData) => void;
  setSelectedCompany: (company: Company) => void;
  companies: Company[];
  loadingCompanies: boolean;
  selectedCompany: Company;
  onSubmitLoading: boolean;
  handleClear: () => void;
};
