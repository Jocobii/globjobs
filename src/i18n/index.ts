import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { brokerEn, brokerEs } from './broker.translate';
import { managementsEn, managementsEs } from './managements.translate';
import { crucesEn, crucesEs } from './cruces.traslate';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          next: 'Next',
          prev: 'Previous',
          forgot: 'Forgot Password',
          hello: 'Welcome Back! Please sign in to your Account',
          signInButton: 'Sign In',
          input: {
            email: 'Email',
            password: 'Password',
          },
          broker: brokerEn,
          cruces: crucesEn,
          cancel: 'Cancel',
          accept: 'Accept',
          view: 'View',
          GENERIC_ERROR: 'Something went wrong',
          downloadFiles: 'Download Files',
          register: 'register',
          update: 'Update',
          wasUpdated: 'Was updated',
          add: 'Add',
          unexpectedError: 'Something went wrong',
          dictionary: {
            unavailable: 'Service not available',
          },
          ui: {
            uploadedFiles: 'uploaded files',
            generalFiles: 'New files',
            noFilesAdded: 'No files added',
            removeFile: 'Click on any file to remove it from the list.',
            file: 'File',
            dragOrUploadFiles: 'Drag or upload your files',
          },
          generic: {
            requiredField: 'This field is required',
            save: 'Save',
            cancel: 'Cancel',
          },
          managements: managementsEn,
          all: 'All',
          active: 'Active',
          inactive: 'Inactive',
          confirm: 'Confirm',
          areYouSure: 'Are you sure about this action?',
          thisActionCannotBeUndone: 'This action cannot be undone',
          userCompanies: 'Company User\'s',
        },
      },
      es: {
        translation: {
          next: 'Siguiente',
          prev: 'Anterior',
          forgot: 'Olvidé mi contraseña',
          hello: 'Bienvenido! Por favor inicia sesión en tu cuenta',
          signInButton: 'Iniciar Sesión',
          input: {
            email: 'Correo electrónico',
            password: 'Contraseña',
          },
          view: 'Ver',
          broker: brokerEs,
          cancel: 'Cancelar',
          accept: 'Aceptar',
          downloadFiles: 'Descargar archivos',
          register: 'Registrar',
          GENERIC_ERROR: 'Algo salió mal',
          update: 'Actualizar',
          wasUpdated: 'Se actualizó',
          add: 'Agregar',
          unexpectedError: 'Algo salió mal',
          dictionary: {
            unavailable: 'Servicio no disponible',
          },
          ui: {
            uploadedFiles: 'Archivos subidos',
            generalFiles: 'Archivos nuevos',
            noFilesAdded: 'No se han agregado archivos',
            removeFile: 'Haga clic en cualquier archivo para eliminarlo de la lista.',
            file: 'Archivo',
            dragOrUploadFiles: 'Arrastra o sube tus archivos',
          },
          generic: {
            requiredField: 'Este campo es requerido',
            save: 'Guardar',
            cancel: 'Cancelar',
          },
          managements: managementsEs,
          cruces: crucesEs,
          all: 'Todos',
          active: 'Activos',
          inactive: 'Inactivos',
          confirm: 'Confirmar',
          areYouSure: '¿Estás seguro de esta acción?',
          thisActionCannotBeUndone: 'Esta acción no se puede deshacer',
          userCompanies: 'Usuarios Cliente',
        },
      },
    },
    lng: localStorage.getItem('i18nextLng') || 'es',
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
  });

export default i18n;
