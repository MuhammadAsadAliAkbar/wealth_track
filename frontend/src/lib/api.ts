import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const PYTHON_URL = process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; currency?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const transactionAPI = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  stats: (params?: any) => api.get('/transactions/stats', { params }),
};

export const budgetAPI = {
  getAll: (params?: any) => api.get('/budgets', { params }),
  set: (data: any) => api.post('/budgets', data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const assetAPI = {
  getAll: (params?: any) => api.get('/assets', { params }),
  create: (data: any) => api.post('/assets', data),
  update: (id: string, data: any) => api.put(`/assets/${id}`, data),
  delete: (id: string) => api.delete(`/assets/${id}`),
  networth: () => api.get('/assets/networth'),
};

export const categoryAPI = {
  getAll: (params?: any) => api.get('/categories', { params }),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const pythonAPI = {
  forecast: (data: any) => axios.post(`${PYTHON_URL}/api/forecast`, data),
  assetProjection: (data: any) => axios.post(`${PYTHON_URL}/api/asset-projection`, data),
  budgetHealth: (data: any) => axios.post(`${PYTHON_URL}/api/budget-health`, data),
};

export default api;
