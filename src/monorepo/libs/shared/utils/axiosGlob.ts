import Axios, { AxiosRequestConfig } from 'axios';

const { VITE_GLOBALIZATION_API_URI } = import.meta.env;
const axios = Axios.create({
  baseURL: `${VITE_GLOBALIZATION_API_URI}/crossing`,
  // withCredentials: true,
});

axios.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken') ?? '';

  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

axios.interceptors.response.use(
  (response) => response.data,
  (error): Promise<string> => {
    const message = error.response?.data?.message || error.message;

    if (message) {
      console.error(message);
    }

    return Promise.reject(message || 'Something went wrong');
  },
);

export default axios;
