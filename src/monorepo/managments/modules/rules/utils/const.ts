const SECTION = [
  {
    title: '501',
    value: '501',
  },
  {
    title: '502',
    value: '502',
  },
  {
    title: '504',
    value: '504',
  },
  {
    title: '505',
    value: '505',
  },
  {
    title: '516',
    value: '516',
  },
  {
    title: '551',
    value: '551',
  },
  {
    title: '999',
    value: '999',
  },
];

const OPERATORS = [
  {
    title: 'Si es vacio',
    value: 'null',
  },
  {
    title: 'Si es diferente de vacio',
    value: '!null',
  },
  {
    title: 'Si es un numero',
    value: 'number',
  },
  {
    title: 'Si no es numero',
    value: '!number',
  },
  {
    title: 'Si es un texto',
    value: 'string',
  },
  {
    title: 'Si no es un texto',
    value: '!string',
  },
  {
    title: 'Si es menor que',
    value: '<[value]',
  },
  {
    title: 'Si es mayor que',
    value: '>[value]',
  },
  {
    title: 'Si es menor o igual que',
    value: '<=[value]',
  },
  {
    title: 'Si es mayor o igual que',
    value: '>=[value]',
  },
  {
    title: 'Si es diferente de',
    value: '!==[value]',
  },
  {
    title: 'Si es igual a',
    value: '===[value]',
  },
];

export const FIELD_FORM_EASY: any = { // TODO: se va a remover el form easy
  field: {
    label: 'Numero de campo del TXT',
    type: 'number',
    helperText: 'Se empieza desde 1, de izquierda a derecha del TXT. Ejemplo si queremos validar la clave de pedimento de la seccion 501, seria el campo 4',
  },
  message: {
    label: 'Mensaje de la regla',
  },
  section: {
    label: 'Section del TXT',
    type: 'select',
    options: SECTION,
  },
  type: {
    label: 'Tipo de regla',
    type: 'select',
    options: [
      { value: 'warning', title: 'Advertencia' },
      { value: 'error', title: 'Error' },
      { value: 'information', title: 'Informativo' },
    ],
  },
  validator: {
    label: 'Operador logico',
    type: 'select',
    options: OPERATORS,
  },
};
