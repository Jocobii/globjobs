import { Module } from '../types';

export const NOTIFICATIONS: Module[] = [
  {
    name: 'Cruces',
    key: 'cruces',
    permissions: [
      {
        checked: false,
        name: 'Documentos en proceso',
      },
      {
        checked: false,
        name: 'Documentos pagados ',
      },
      {
        checked: false,
        name: 'Documentos listos',
      },
      {
        checked: false,
        name: 'Documentos entregados',
      },
      {
        checked: false,
        name: 'Reconocimiento aduanal ',
      },
      {
        checked: false,
        name: 'Desaduanamiento libre',
      },
      {
        checked: false,
        name: 'Carpeta de despacho',
      },
      {
        checked: false,
        name: 'Alertar a equipo de rojos',
      },
      {
        checked: false,
        name: 'Alertar a finanzas',
      },
      {
        checked: false,
        name: 'Descarga de layout para creacion de TXT',
      },
      {
        checked: false,
        name: 'Validacion de TXT ',
      },
      {
        checked: false,
        name: 'Asignar cruce',
      },
    ],
  },
  {
    name: 'Pedimentos',
    key: 'pedimentos',
    permissions: [
      {
        checked: false,
        name: 'Solicitar pedimento',
      },
      {
        checked: false,
        name: 'Abrir pedimentos predeterminados',
      },
      {
        checked: false,
        name: 'Consolidados aperturados programados.',
      },
      {
        checked: false,
        name: 'Pedimentos por cerrar',
      },
      {
        checked: false,
        name: 'Pedimentos vencidos',
      },
      {
        checked: false,
        name: 'Pedimentos en riesgo de bloqueo de patente',
      },
      {
        checked: false,
        name: 'Editar claves de pedimentos',
      },
      {
        checked: false,
        name: 'Eliminar claves de pedimentos',
      },
    ],
  },
  {
    name: 'Administrador de tareas',
    key: 'administrador-de-tareas',
    permissions: [
      {
        checked: false,
        name: 'Tarea asignada',
      },
    ],
  },
  {
    name: 'Compras',
    key: 'compras',
    permissions: [
      {
        checked: false,
        name: 'Solicitud de compra',
      },
      {
        checked: false,
        name: 'Compra aprobada',
      },
      {
        checked: false,
        name: 'Compra provisionada',
      },
      {
        checked: false,
        name: 'Solicitud de pago de multa',
      },
    ],
  },
];
