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
