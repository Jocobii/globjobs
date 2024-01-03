import jwtDecode from 'jwt-decode';

import axios from './axios';

export type Token = {
  accessToken: string;
  refreshToken: string;
  exp: number;
};

export const decodeToken = (accessToken: string) => jwtDecode<Token>(accessToken);

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = decodeToken(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

let expiredTimer: number;
const handleTokenExpired = (exp: number) => {
  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  expiredTimer = window.setTimeout(() => {
    // You can do what ever you want here, like show a notification
  }, timeLeft);
};

const setSession = (accessToken: string | null) => {
  if (!accessToken) {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;

    return;
  }

  localStorage.setItem('accessToken', accessToken);
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  // This function below will handle when token is expired
  const { exp } = decodeToken(accessToken);
  handleTokenExpired(exp);
};

export { isValidToken, setSession };
