import {
  createContext, useEffect, useMemo, useReducer,
} from 'react';
import {
  SignInFormValues, SignInResponse, JWTPayload,
} from '@gsuite/typings/auth';

import { axios, jwt } from '../utils';

type AuthProviderProps = {
  children: React.ReactNode;
};

type State = {
  isAuthenticated: boolean;
  isInitialized?: boolean;
  user?: JWTPayload | null;
};

type Action =
  | { type: 'INITIALIZE'; payload: State }
  | { type: 'LOGIN'; payload: State }
  | { type: 'LOGOUT'; payload?: void };

type AuthContextValue = {
  method: 'jwt';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} & State;

const { NX_AUTH_URL } = import.meta.env;

const EMAIL_DOMAIN = '@g-global.com';
const ENVIRONMENT = '633207ea9bfe2b1d9c586671';
const AUTH_REST_SIGN_OUT = `${NX_AUTH_URL?.replace('session', 'signout')}`;
const AUTH_REST_CSRF = `${NX_AUTH_URL?.replace('session', 'csrf')}`;

export const getCsrfToken = async () => {
  const res = await fetch(AUTH_REST_CSRF, {
    // credentials: 'include',
  });

  const { csrfToken } = await res.json();

  return csrfToken;
};

export const getUserSession = async () => {
  if (!NX_AUTH_URL) throw new Error('No authorization url provided');

  const res = await fetch(NX_AUTH_URL, {
    // credentials: 'include',
  });
  return res.json();
};

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state: State, action: Action) => {
    const { isAuthenticated, user } = action.payload as State;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: Action) => {
    const { user } = action.payload as State;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  method: 'jwt',
  login: async () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getUserSession();

        if (session) {
          jwt.setSession(session.accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: {
                id: session?.user.id,
                fullName: session?.user.name,
                emailAddress: session?.user.email,
                role: session?.user.role,
              },
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const [userName] = email.split('@');

    const { access_token: accessToken, user } = await axios.post<SignInFormValues, SignInResponse>('/login', {
      email: `${userName}${EMAIL_DOMAIN}`,
      password,
      environment: ENVIRONMENT,
    });

    jwt.setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        isAuthenticated: true,
        user: {
          id: user.id as string,
          fullName: `${user.name} ${user.lastName}`,
          emailAddress: user.emailAddress,
          role: user.role,
        },
      },
    });
  };

  const logout = async () => {
    jwt.setSession(null);

    dispatch({ type: 'LOGOUT' });
    window.location.href = AUTH_REST_SIGN_OUT;
  };

  const values = useMemo<AuthContextValue>(() => ({
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
    user: state.user,
    method: 'jwt',
    login,
    logout,
  }), [state]);

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
