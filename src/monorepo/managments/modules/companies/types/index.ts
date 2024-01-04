import { GridValueGetterParams } from '@mui/x-data-grid-pro';
import {
  InferType, boolean, object, string,
} from 'yup';
// eslint-disable-next-line import/no-cycle
import {
  COMPLEMENTARY_ADP_DOCUMENTS, MANDATORY_ADP_DOCUMENTS, IMPORT, EXPORT, UENS_DEFAULT,
} from '../utils/constants';

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
  sendAdpAutomatically?: boolean;
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

export interface MandatoryADPDocuments {
  paidPetition?: boolean;
  invoices?: boolean;
  dodaPita?: boolean;
  coveDetailAcknowledgment?: boolean;
  ed?: boolean;
  edXml?: boolean;
  edAcknowledgment?: boolean;
  validationFiles?: boolean;
  paymentFiles?: boolean;
  dodaPitaXml?: boolean;
  coveXml?: boolean;
}

export interface ComplementaryADPDocuments {
  petitionSimplifiedCopy?: boolean;
  petitionNullCopy?: boolean;
  manifestationOfValue?: boolean;
  spreadsheet?: boolean;
  attachedDocumentWithoutDigitization?: boolean;
  shipper?: boolean;
  manifestationEntry?: boolean;
  waybill?: boolean;
  billOfLading?: boolean;
  guideOrTransportDocuments?: boolean;
  millCertificate?: boolean;
  prosec?: boolean;
  immex?: boolean;
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
  mandatoryADPDocuments?: ComplementaryADPDocuments,
  complementaryADPDocuments?: ComplementaryADPDocuments,
  sendAdpAutomatically?: boolean;
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

export const companySchema = object().shape({
  name: string().required(),
  number: string().required(),
  rfc: string().required(),
  type: string().required(),
  address: object().shape({
    address1: string().required(),
    address2: string().optional().nullable(),
    city: string().required(),
    state: string().required(),
    country: string().required(),
    postalCode: string().required(),
  }).required(),
  export: object().shape({
    alcohol: boolean().optional().default(false),
    aluminum: boolean().optional().default(false),
    beer: boolean().optional().default(false),
    cigars: boolean().optional().default(false),
    energizing: boolean().optional().default(false),
    glass: boolean().optional().default(false),
    goldSilverAndCopper: boolean().optional().default(false),
    iron: boolean().optional().default(false),
    liqueurs: boolean().optional().default(false),
    minerals: boolean().optional().default(false),
    plastics: boolean().optional().default(false),
    rubber: boolean().optional().default(false),
    tequila: boolean().optional().default(false),
    wines: boolean().optional().default(false),
    wood: boolean().optional().default(false),
  }).optional().default(EXPORT),
  import: object().shape({
    alcohol: boolean().optional().default(false),
    automotive: boolean().optional().default(false),
    chemicalPrecursors: boolean().optional().default(false),
    chemicalProducts: boolean().optional().default(false),
    cigars: boolean().optional().default(false),
    explosives: boolean().optional().default(false),
    firearms: boolean().optional().default(false),
    footwear: boolean().optional().default(false),
    hydrocarbons: boolean().optional().default(false),
    ironAndSteel: boolean().optional().default(false),
    ironAndSteelProducts: boolean().optional().default(false),
    knives: boolean().optional().default(false),
    machines: boolean().optional().default(false),
    nuclearRadioactive: boolean().optional().default(false),
    pyrotechnics: boolean().optional().default(false),
    textile: boolean().optional().default(false),
  }).optional().default(IMPORT),
  merchandise: boolean().optional().default(false),
  merchandiseOption: string().optional().nullable(),
  oea: boolean().optional().default(false),
  oeaOption: string().optional().nullable(),
  prosec: boolean().optional().default(false),
  prosecOption: string().optional().nullable(),
  sectors: boolean().optional().default(false),
  taxes: boolean().optional().default(false),
  taxesOption: string().optional().nullable(),
  defaultPaymentMethod: string().required('El método de pago es requerido'),
  mandatoryADPDocuments: object().shape({
    paidPetition: boolean().optional().default(true),
    invoices: boolean().optional().default(true),
    dodaPita: boolean().optional().default(true),
    coveDetailAcknowledgment: boolean().optional().default(true),
    ed: boolean().optional().default(true),
    edXml: boolean().optional().default(true),
    edAcknowledgment: boolean().optional().default(true),
    validationFiles: boolean().optional().default(true),
    paymentFiles: boolean().optional().default(true),
    dodaPitaXml: boolean().optional().default(true),
    coveXml: boolean().optional().default(true),
  }).optional().default(MANDATORY_ADP_DOCUMENTS),
  complementaryADPDocuments: object().shape({
    petitionSimplifiedCopy: boolean().optional().default(false),
    petitionNullCopy: boolean().optional().default(false),
    manifestationOfValue: boolean().optional().default(false),
    spreadsheet: boolean().optional().default(false),
    attachedDocumentWithoutDigitization: boolean().optional().default(false),
    shipper: boolean().optional().default(false),
    manifestationEntry: boolean().optional().default(false),
    waybill: boolean().optional().default(false),
    billOfLading: boolean().optional().default(false),
    guideOrTransportDocuments: boolean().optional().default(false),
    millCertificate: boolean().optional().default(false),
    prosec: boolean().optional().default(false),
    immex: boolean().optional().default(false),
  }).optional().default(COMPLEMENTARY_ADP_DOCUMENTS),
  uens: object().shape({
    aamx: object().shape({
      active: boolean().optional().default(false),
    }),
    aaus: object().shape({
      active: boolean().default(false),
      entryInvoice: boolean().default(false),
      entrySupplier: boolean().default(false),
      shipperInvoice: boolean().default(false),
      shipperSupplier: boolean().default(false),
      import: boolean().default(false),
      export: boolean().default(false),
    }),
    warehouse: object().shape({
      active: boolean().optional().default(false),
    }),
    g3pl: object().shape({
      active: boolean().optional().default(false),
    }),
    gnex: object().shape({
      active: boolean().optional().default(false),
    }),
    gogetters: object().shape({
      active: boolean().optional().default(false),
    }),
    kshield: object().shape({
      active: boolean().optional().default(false),
    }),
    transportmx: object().shape({
      active: boolean().optional().default(false),
    }),
    transportus: object().shape({
      active: boolean().optional().default(false),
    }),
  }).default(UENS_DEFAULT),
});

export type Companies = InferType<typeof companySchema>;

export type ICompany = Company;
