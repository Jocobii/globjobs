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

export type TFunctionType = <T>(key: string | string[], variables?: Record<string, any>) => T;

export enum PaymentMethods {
  PECE = 'PECE',
  CAPTURE_LINE = 'Línea de Captura',
  PECE_AGENCY = 'PECE Agencia',
  FINANCING = 'Financiamiento',
}
