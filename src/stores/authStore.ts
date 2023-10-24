import { create } from 'zustand';
import get from 'lodash/get';

import { getLocalStorage, setLocalStorage, deleteLocalStorage } from '@/utils/func';
import { LOCALSTORAGE_AUTH_KEY, LOCALSTORAGE_CONFIG_KEY } from '@/seeders';
import { User, Auth } from '@/typings/authentication';

type AuthStore = {
  logIn: (user: User, accessToken: string) => void;
  logOut: () => void;
  setErrorMessage: (errorMessage: string) => void;
} & Auth;

const initializeState = (): Auth => {
  const accessToken: string = get(getLocalStorage(LOCALSTORAGE_AUTH_KEY), 'accessToken', undefined);
  const user = get(getLocalStorage(LOCALSTORAGE_CONFIG_KEY), 'user', {}) as User;
  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    errorMessage: '',
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initializeState(),
  logIn: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      errorMessage: undefined,
    });
    setLocalStorage(LOCALSTORAGE_CONFIG_KEY, { user });
    setLocalStorage(LOCALSTORAGE_AUTH_KEY, { accessToken });
  },
  logOut: () => {
    set({
      user: {},
      errorMessage: '',
      accessToken: undefined,
      isAuthenticated: false,
    });

    deleteLocalStorage(LOCALSTORAGE_AUTH_KEY);
    deleteLocalStorage(LOCALSTORAGE_CONFIG_KEY);
  },
  setErrorMessage: (errorMessage) => {
    set({ errorMessage, isAuthenticated: false });
  },
}));