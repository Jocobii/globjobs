import { object, string } from 'yup';

export interface Role {
  id: string;
  name: string;
  modules?: Module[];
  notifications?: Notification;
}

export interface Module {
  name: string;
  key: string;
  checked?: boolean;
  permissions: Permission[]
}

export interface Permission {
  name: string;
  checked: boolean;
}

export interface Notification {
  email: boolean;
  whatsapp: boolean;
  notifications: Module[]
}

export type ErrorType<T = unknown> = {
  i18Key?: string;
  response?: {
    errors?: Array<{
      extensions: {
        exception: {
          response: T;
        };
      };
    }>;
  };
};

export type Props = {
  open: boolean;
  roleId?: string;
  onClose: () => void;
};

export const schema = object({
  name: string().max(50, 'Maximo de caracteres es 50.').required('El nombre es requerido.'),
});
