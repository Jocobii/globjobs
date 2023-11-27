import { Companies } from '../types';

interface Sector {
  label: string,
  key: string
}

interface Section {
  title: string,
  key: string,
  items: Sector[]
}

export const sectors: Section[] = [
  {
    title: 'Sectores autorizados de IMPORTACION',
    key: 'import',
    items: [
      {
        label: '1.- Productos químicos',
        key: 'chemicalProducts',
      },
      {
        label: '2.- Radiactivos y Nucleares.',
        key: 'nuclearRadioactive',
      },
      {
        label: '3.- Precursores Químicos y químicos esenciales.',
        key: 'chemicalPrecursors',
      },
      {
        label: '4.- Armas de fuego y sus partes, refacciones, accesorios y municiones.',
        key: 'firearms',
      },
      {
        label: '5.- Explosivos y material relacionado con explosivos.',
        key: 'explosives',
      },
      {
        label: '6.- Sustancias químicas, materiales para usos pirotécnicos y artificios relacionados con el empleo de explosivos.',
        key: 'pyrotechnics',
      },
      {
        label: '7.- Las demás armas y accesorios. Armas blancas y accesorios. Explosores.',
        key: 'knives',
      },
      {
        label: '8.- Máquinas, aparatos, dispositivos y artefactos, relacionados con armas y otros.',
        key: 'machines',
      },
      {
        label: '9. Cigarros.',
        key: 'cigars',
      },
      {
        label: '10.- Calzado.',
        key: 'footwear',
      },
      {
        label: '11.- Textil y Confección.',
        key: 'textile',
      },
      {
        label: '12. Alcohol Etílico.',
        key: 'alcohol',
      },
      {
        label: '13. Hidrocarburos y combustibles.',
        key: 'hydrocarbons',
      },
      {
        label: '14. Siderúrgico.',
        key: 'ironAndSteel',
      },
      {
        label: '15.- Productos Siderúrgicos.',
        key: 'ironAndSteelProducts',
      },
      {
        label: '16. Automotriz.',
        key: 'automotive',
      },
    ],
  },
  {
    title: 'Sectores autorizados de EXPORTACION',
    key: 'export',
    items: [
      { label: '1. Alcohol, alcohol desnaturalizado y mieles incristalizables.', key: 'alcohol' },

      { label: '2.- Cerveza.', key: 'beer' },

      { label: '3.- Tequila.', key: 'tequila' },

      { label: '4.- Bebidas alcohólicas fermentadas (vinos).', key: 'wines' },

      { label: '5.- Bebidas alcohólicas destiladas (licores).', key: 'liqueurs' },

      { label: '6.- Cigarros y tabacos labrados.', key: 'cigars' },

      { label: '7.- Bebidas energetizantes, así como concentrados polvos y jarabes para preparar bebidas energetizantes.', key: 'energizing' },

      { label: '8.- Minerales de hierro y sus concentrados.', key: 'minerals' },

      { label: '9.- Oro, plata y cobre.', key: 'goldSilverAndCopper' },

      { label: '10.- Plásticos.', key: 'plastics' },

      { label: '11.- Caucho.', key: 'rubber' },

      { label: '12.- Madera y papel.', key: 'wood' },

      { label: '13.- Vidrio.', key: 'glass' },

      { label: '14.- Hierro y Acero.', key: 'iron' },

      { label: '15.- Aluminio.', key: 'aluminum' },
    ],
  },
];

export const TYPE_OPTIONS = [
  {
    label: 'IMMEX',
    key: 'immex',
  },
  {
    label: 'Empresa con Registro de la Frontera',
    key: 'empresa',
  },
  {
    label: 'Otra Sociedad Mercantil',
    key: 'otro',
  },
];

export const MERCHANDISE_OPTIONS = [
  {
    label: 'Apartado A',
    key: 'a',
  },
  {
    label: 'Apartado B',
    key: 'b',
  },
  {
    label: 'Apartado C',
    key: 'c',
  },
  {
    label: 'Apartado D',
    key: 'd',
  },
  {
    label: 'Apartado E',
    key: 'e',
  },
  {
    label: 'Apartado F',
    key: 'f',
  },
  {
    label: 'Apartado G',
    key: 'g',
  },
];

export const PAYMENT_METHODS = [
  'PECE',
  'Línea de Captura',
  'PECE Agencia',
  'Financiamiento',
];

export const COMPLEMENTARY_ADP_DOCUMENTS = {
  petitionSimplifiedCopy: false,
  petitionNullCopy: false,
  manifestationOfValue: false,
  spreadsheet: false,
  attachedDocumentWithoutDigitization: false,
  shipper: false,
  manifestationEntry: false,
  waybill: false,
  billOfLading: false,
  guideOrTransportDocuments: false,
  millCertificate: false,
  prosec: false,
  immex: false,
};

export const MANDATORY_ADP_DOCUMENTS = {
  paidPetition: true,
  invoices: true,
  dodaPita: true,
  coveDetailAcknowledgment: true,
  ed: true,
  edXml: true,
  edAcknowledgment: true,
  validationFiles: true,
  paymentFiles: true,
  dodaPitaXml: true,
  coveXml: true,
};

export const IMPORT = {
  alcohol: false,
  automotive: false,
  chemicalPrecursors: false,
  chemicalProducts: false,
  cigars: false,
  explosives: false,
  firearms: false,
  footwear: false,
  hydrocarbons: false,
  ironAndSteel: false,
  ironAndSteelProducts: false,
  knives: false,
  machines: false,
  nuclearRadioactive: false,
  pyrotechnics: false,
  textile: false,
};

export const EXPORT = {
  alcohol: false,
  aluminum: false,
  beer: false,
  cigars: false,
  energizing: false,
  glass: false,
  goldSilverAndCopper: false,
  iron: false,
  liqueurs: false,
  minerals: false,
  plastics: false,
  rubber: false,
  tequila: false,
  wines: false,
  wood: false,
};

export const UENS_DEFAULT = {
  aamx: {
    active: false,
  },
  aaus: {
    active: false,
  },
  warehouse: {
    active: false,
  },
  g3pl: {
    active: false,
  },
  gnex: {
    active: false,
  },
  gogetters: {
    active: false,
  },
  kshield: {
    active: false,
  },
  transportmx: {
    active: false,
  },
  transportus: {
    active: false,
  },

};

export const UENS = [
  {
    label: 'AA Mexicano',
    key: 'uens.aamx.active',
  },
  {
    label: 'AA Americano',
    key: 'uens.aaus.active',
  },
  {
    label: 'Almacén',
    key: 'uens.warehouse.active',
  },
  {
    label: 'G-3PL',
    key: 'uens.g3pl.active',
  },
  {
    label: 'G-Nex',
    key: 'uens.gnex.active',
  },
  {
    label: 'Go Getters',
    key: 'uens.gogetters.active',
  },
  {
    label: 'K-Shield',
    key: 'uens.kshield.active',
  },
  {
    label: 'Transporte MX',
    key: 'uens.transportmx.active',
  },
  {
    label: 'Transporte USA',
    key: 'uens.transportus.active',
  },
];

type uensOptions = {
  label: string;
  key: keyof Companies['uens'];
};

export const UENS_OPTIONS: uensOptions[] = [
  {
    label: 'AA Mexicano',
    key: 'aamx',
  },
  {
    label: 'AA Americano',
    key: 'aaus',
  },
  {
    label: 'Almacén',
    key: 'warehouse',
  },
  {
    label: 'G-3PL',
    key: 'g3pl',
  },
  {
    label: 'G-Nex',
    key: 'gnex',
  },
  {
    label: 'Go Getters',
    key: 'gogetters',
  },
  {
    label: 'K-Shield',
    key: 'kshield',
  },
  {
    label: 'Transporte MX',
    key: 'transportmx',
  },
  {
    label: 'Transporte USA',
    key: 'transportus',
  },
];
