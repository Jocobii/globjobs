import { GridValueGetterParams } from '@mui/x-data-grid-pro';

export interface Company {
  CP?: string;
  Ciudad?: string;
  ClaveDarwinAnterior?: string;
  Colonia?: string;
  DiasAlmacenaje?: string;
  Direccion?: string;
  EstadoSAT?: string;
  Estatus?: string;
  Nombre?: string;
  Numero?: string;
  RFC?: string;
  correoElectronico?: string;
  existsInDb?: boolean;
}

export interface CompanyDocument {
  name: string | null;
  number: string | null;
  email: string | null;
  rfc: string | null;
  address?: Address;
  defaultPaymentMethod?: string;
}

export interface CreateComponentProps {
  handleSelectCompany: (company: Company) => void;
}

export interface CardComponentProps {
  company: CompanyDocument;
  edit: boolean;
}

export interface SectorVisibility {
  import: boolean;
  export: boolean;
}

export interface SectionProps {
  handleChange: (property: string, value: undefined | string | object | boolean) => void;
  initial?: Partial<CompanyFull>;
}

export interface SectorProps {
  handleChange: (property: string, value: undefined | string | object | boolean) => void;
  initial?: Partial<{
    import: ImportSector | null,
    export: ExportSector | null,
  }>;
}

export interface Address {
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ImportSector {
  alcohol?: boolean;
  automotive?: boolean;
  chemicalPrecursors?: boolean;
  chemicalProducts?: boolean;
  cigars?: boolean;
  explosives?: boolean;
  firearms?: boolean;
  footwear?: boolean;
  hydrocarbons?: boolean;
  ironAndSteel?: boolean;
  ironAndSteelProducts?: boolean;
  knives?: boolean;
  machines?: boolean;
  nuclearRadioactive?: boolean;
  pyrotechnics?: boolean;
  textile?: boolean;
}

export interface ExportSector {
  alcohol?: boolean;
  aluminum?: boolean;
  beer?: boolean;
  cigars?: boolean;
  energizing?: boolean;
  glass?: boolean;
  goldSilverAndCopper?: boolean;
  iron?: boolean;
  liqueurs?: boolean;
  minerals?: boolean;
  plastics?: boolean;
  rubber?: boolean;
  tequila?: boolean;
  wines?: boolean;
  wood?: boolean;
}

export interface CompanyFull extends CompanyDocument {
  _id: string | null,
  type: string | null,
  import: ImportSector | null,
  export: ExportSector | null,
  merchandise: boolean | null,
  merchandiseOption: string | null,
  oea: boolean | null,
  oeaOption: string | null,
  prosec: boolean | null,
  prosecOption: string | null,
  sectors: boolean | null,
  taxes: boolean | null,
  taxesOption: string | null,
}

export type User = {
  name: string;
  lastName: string;
  emailAddress: string;
};

export type Rows = {
  _id: string;
  number: string;
  name: string;
  status: boolean;
  rfc: string;
  users: Array<User>;
  team: {
    name: string;
    abbreviation: string;
  };
};

export type Toolbar = {
  actionFunction: (selectedCompany: Company) => void;
};

export type Props = {
  rows: GridValueGetterParams[];
};
