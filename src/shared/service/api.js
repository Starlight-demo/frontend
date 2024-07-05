import axios from 'axios';

// const API_URL = 'http://18.194.159.42:8082/api';
// const API_URL = 'http://starlight-network:8082/api';
const API_URL = 'http://localhost:8082/api'
// const API_URL = 'http://backend:8082/api';

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
});

export const protectedAxiosInstance = axios.create({
  baseURL: API_URL,
});

protectedAxiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

protectedAxiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log('Not authorized');
      localStorage.removeItem('token');
    } else {
      throw error;
    }
  },
);
