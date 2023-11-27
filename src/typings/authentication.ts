export type User = {
  id?: string;
  name?: string;
  lastName?: string;
  photoUrl?: string;
  emailAddress?: string;
  role?: string;
};

export type Auth = {
  accessToken?: string;
  user?: User;
  isAuthenticated: boolean;
  errorMessage?: string;
};
