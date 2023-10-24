export const DRAFT_OPERATION_STATUS = '64cc010d995cbc1823b46bc6';
export const REQUESTED_OPERATION_STATUS = '64cc013e995cbc1823b46bc8';
export const DOCUMENTS_PROCESS_STATUS = '64cc01f3995cbc1823b46bca';
export const PROFORMA_AUTHORIZATION_STATUS = '64cc0215995cbc1823b46bcc';
export const PAID_DOCUMENTS_STATUS = '64cc023a995cbc1823b46bce';
export const READY_DOCUMENTS_STATUS = '64cc0260995cbc1823b46bd0';
export const DOCUMENTS_DELIVERED_STATUS = '64cc032a995cbc1823b46bd1';
export const CUSTOMS_RECOGNITION_STATUS = '64cc0408995cbc1823b46bd2';
export const FREE_DISADVANTAGE_STATUS = '64cc0e00995cbc1823b46bd3';
export const FINISHED_OPERATION_STATUS = '64cc0e0d995cbc1823b46bd4';
export const PROFORMA_SUBMITTED = '6525da0cbae91529705f415d';

export const STATUS_CRUCE = [
  {
    _id: DOCUMENTS_PROCESS_STATUS,
    name: 'Documento en Proceso',
    color: '#46B63D',
  },
  {
    _id: PROFORMA_AUTHORIZATION_STATUS,
    name: 'Autorización de Proforma',
    color: '#46B63D',
  },
  {
    color: '#46B63D',
    name: 'Documentos Entregados',
    _id: DOCUMENTS_DELIVERED_STATUS,
    canSetStatus: true,
  },
  {
    color: '#46B63D',
    name: 'Documentos Pagados',
    id: PAID_DOCUMENTS_STATUS,
    canSetStatus: true,
  },
  {
    color: '#46B63D',
    name: 'Reconocimiento Aduanero',
    _id: CUSTOMS_RECOGNITION_STATUS,
    canSetStatus: true,
  },
  {
    color: '#46B63D',
    name: 'Desaduanamiento libre',
    _id: FREE_DISADVANTAGE_STATUS,
    canSetStatus: true,
  },
  {
    color: '#46B63D',
    name: 'Operación finalizada',
    _id: FINISHED_OPERATION_STATUS,
    canSetStatus: true,
  },
];
