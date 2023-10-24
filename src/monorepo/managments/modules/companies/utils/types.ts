import { GridValueGetterParams } from '@mui/x-data-grid-pro';
import { Company as SelectedCompany } from '../types';

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
  actionFunction: (selectedCompany: SelectedCompany) => void;
};

export type Props = {
  rows: GridValueGetterParams[];
};
