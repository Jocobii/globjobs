import Axios from 'axios';

const axios = Axios.create({
  baseURL: '/adp',
  withCredentials: false,
});
axios.interceptors.request.use((request) => {
  const authObj = localStorage.getItem('@@g-globalization-auth') ?? '';
  const token = JSON.parse(authObj)?.accessToken ?? '';

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
