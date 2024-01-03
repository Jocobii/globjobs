import Axios from 'axios';
import { env } from '@/config/index';
import { getTokenFromLS } from '@/utils/auth';

const axios = Axios.create({
  baseURL: `${env.VITE_GLOBALIZATION_API_URI}/crossing`,
  withCredentials: false,
});
axios.interceptors.request.use((request) => {
  const token = getTokenFromLS();

  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error): Promise<string> => {
    const message = error.response?.data?.message || error.message;
    console.log('error axios instance:', error);
    return Promise.reject(message || 'Something went wrong');
  },
);

export default axios;
