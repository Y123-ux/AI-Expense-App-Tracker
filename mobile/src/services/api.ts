import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Expense API
export const expenseAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get('/expenses', { params }),
  create: (data: { amount: number; merchant?: string; description?: string; date: string; category_id?: string }) =>
    api.post('/expenses', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/expenses/${id}`, data),
  delete: (id: string) =>
    api.delete(`/expenses/${id}`),
};

// Receipt API
export const receiptAPI = {
  scan: (formData: FormData) =>
    api.post('/receipts/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSummary: () => api.get('/analytics/summary'),
  getPatterns: () => api.get('/analytics/patterns'),
};
