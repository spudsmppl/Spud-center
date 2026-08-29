import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (email: string, password: string) =>
    client.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  me: () => client.get('/auth/me'),
  logout: () => client.post('/auth/logout'),
};

// Node endpoints
export const nodeAPI = {
  create: (data: any) => client.post('/nodes', data),
  list: () => client.get('/nodes'),
  get: (id: string) => client.get(`/nodes/${id}`),
  update: (id: string, data: any) => client.put(`/nodes/${id}`, data),
  delete: (id: string) => client.delete(`/nodes/${id}`),
  getStatus: (id: string) => client.get(`/nodes/${id}/status`),
  startMonitoring: (id: string) => client.post(`/nodes/${id}/monitor/start`),
  stopMonitoring: (id: string) => client.post(`/nodes/${id}/monitor/stop`),
};

// Preview endpoints
export const previewAPI = {
  capture: (id: string) => client.post(`/preview/${id}/capture`),
  get: (id: string) => client.get(`/preview/${id}`),
  getLive: (id: string) => client.get(`/preview/${id}/live`),
};

export default client;
