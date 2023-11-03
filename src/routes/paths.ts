const { NX_AUTH_URL } = import.meta.env;

export const environment = '633207ea9bfe2b1d9c586671';

export const CLIENT_ROLE = '60de0221ba8f6728321ea699';

export const CLIENT_ENVIRONMENT = '6482333525826c6274fac953';


const ROOTS_APP = '/';

function path(root: string, subLink: string): string {
  return `${root}${subLink}`;
}

export const PATH_AUTH = {
  api: `${NX_AUTH_URL}`,
  login: NX_AUTH_URL?.replace('api/auth/session', ''),
};

export const PATH_APP = {
  root: ROOTS_APP,
  general: {
    root: path(ROOTS_APP, '/broker'),
    broker: path(ROOTS_APP, '/broker'),
  },
};
