import { t } from 'i18next';

export enum SiteType {
  Office = 'Office',
  Warehouse = 'Warehouse',
}

export enum CountryCode {
  MEX = 'MEX',
  USA = 'USA',
}

export enum RuleType {
  Error = 'error',
  Warning = 'warning',
  Information = 'information',
}

export type TFunctionType = typeof t;

export enum PaymentMethods {
  PECE = 'PECE',
  CAPTURE_LINE = 'Línea de Captura',
  PECE_AGENCY = 'PECE Agencia',
  FINANCING = 'Financiamiento',
}
