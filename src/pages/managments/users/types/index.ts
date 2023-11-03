import { GridValueGetterParams } from '@mui/x-data-grid-pro';

export type Company = {
  name: string;
  rfc: string;
  number: string;
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

export type Props = {
  rows: GridValueGetterParams[];
};

export interface User {
  id: string;
  name: string;
  lastName: string;
  emailAddress: string;
  employeeNumber: string;
  birthDate: string;
  phoneNumber: string;
  headquarter: string;
  department: string;
  area: string;
  coach: string;
  charge: string;
  employeeType: string;
  costCenter: string;
  darwinUser: string;
  rbSystemsUser: string;
  roles?: string[];
  teamId?: string;
  teams?: string[];
  active: boolean;
  role?: {
    name: string;
  };
}
