import type { ObjectShape } from 'yup';

export type ID =  string;

export type User = {
  id: ID;
  name: string;
  lastName: string;
  emailAddress: string;
  role: string;
  email?: string;
};

export type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Shape<T extends Record<any, any>> = Partial<Record<keyof T, ObjectShapeValues>>;

export type SignInFormValues = {
  email: string;
  password: string;
  server?: {
    message: string;
  };
};

export type PasswordResetFormValues = {
  password: string;
  passwordConfirm: string;
};

export type SignInResponse = {
  user: User;
  access_token: string;
  statusCode?: number;
};

export type JWTPayload = {
  id: string;
  fullName: string;
  emailAddress: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type JWTDecoded = {
  payload: JWTPayload;
  userId: ID;
};
