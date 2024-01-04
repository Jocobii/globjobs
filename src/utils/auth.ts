const { VITE_NX_AUTH_URL: NX_AUTH_URL } = import.meta.env;
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

export const getTokenFromLS = () => {
  const { accessToken } = JSON.parse(localStorage.getItem('@@g-globalization-auth') ?? '{}');

  return accessToken ? `Bearer ${accessToken}` : '';
};
