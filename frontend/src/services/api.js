import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global interceptor to handle errors gracefully without crashing the UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Interceptor:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;