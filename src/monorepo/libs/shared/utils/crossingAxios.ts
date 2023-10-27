import Axios from 'axios';
import { getTokenFromLS } from '@/utils/auth';

const { VITE_GLOBALIZATION_API_URI } = import.meta.env;
const axios = Axios.create({
  baseURL: `${VITE_GLOBALIZATION_API_URI}/crossing`,
  // withCredentials: true,
});

axios.interceptors.request.use((request) => {
  const token = getTokenFromLS();

  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

axios.interceptors.response.use(
  (response) => response.data,
  (error): Promise<string> => {
    const message = error.response?.data?.message || error.message;

    return Promise.reject(message || 'Something went wrong');
  },
);

export default axios;
