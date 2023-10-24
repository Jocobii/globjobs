const URL = 'https://pecem.mat.sat.gob.mx/app/qr/ce/faces/pages/mobile/validadorqr.jsf?D1=16&D2=1&D3=';

export const urlIntegration = (value: string) => `${URL}${value}`;

export const openNewTab = (url: string) => {
  const win = window.open(url, '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=500,height=500,left = 50,top = 50');
  win?.focus();
};
