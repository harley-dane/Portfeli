import axios from 'axios';

const API_URL = '/api'; // Using relative URL for proxying (Vite config needed for dev)

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('paymenu_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
