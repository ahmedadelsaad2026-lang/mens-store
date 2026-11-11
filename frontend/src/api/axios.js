import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (user && user.id) {
    config.headers['X-User-Id'] = user.id;
  }
  return config;
});

export default api;