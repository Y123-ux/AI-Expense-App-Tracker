import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import api from '../services/api';

const CURRENCIES: Record<string, string> = {
  USD: '$', EUR: '\u20AC', GBP: '\u00A3', JPY: '\u00A5',
  CAD: 'C$', AUD: 'A$', INR: '\u20B9', PKR: 'Rs',
  CNY: '\u00A5', BRL: 'R$',
};

interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  currencySymbol: string;
  formatCurrency: (amount: number) => string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const currencySymbol = CURRENCIES[user?.currency || 'USD'] || '$';

  function formatCurrency(amount: number): string {
    return `${currencySymbol}${amount.toFixed(2)}`;
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const { data } = await authAPI.getProfile();
        setUser(data);
      }
    } catch {
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { data } = await authAPI.login(email, password);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function register(email: string, password: string, name: string) {
    const { data } = await authAPI.register(email, password, name);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function updateCurrency(currency: string) {
    const { data } = await api.put('/auth/profile', { currency });
    setUser(data);
  }

  async function logout() {
    await AsyncStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      currencySymbol,
      formatCurrency,
      login,
      register,
      updateCurrency,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
