export interface Role {
  id: string;
  name: string;
  modules?: Module[];
  notifications?: Notification;
}

export interface Module {
  name: string;
  key: string;
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
