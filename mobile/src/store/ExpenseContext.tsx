import React, { createContext, useContext, useState, ReactNode } from 'react';
import { expenseAPI, categoryAPI, receiptAPI, analyticsAPI } from '../services/api';

interface Expense {
  id: string;
  amount: number;
  merchant: string | null;
  description: string | null;
  date: string;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface DashboardStats {
  totalThisMonth: number;
  transactionCount: number;
  avgTransaction: number;
  categoryBreakdown: Array<{
    category_name: string;
    category_color: string;
    total: number;
    count: number;
  }>;
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  dashboard: DashboardStats | null;
  loading: boolean;
  fetchExpenses: () => Promise<void>;
  createExpense: (data: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  scanReceipt: (formData: FormData) => Promise<any>;
  fetchDashboard: () => Promise<void>;
  fetchSummary: () => Promise<string>;
  fetchPatterns: () => Promise<string[]>;
}

const ExpenseContext = createContext<ExpenseContextType>({} as ExpenseContextType);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const { data } = await expenseAPI.getAll();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  }

  async function createExpense(expenseData: any) {
    const { data } = await expenseAPI.create(expenseData);
    setExpenses((prev) => [data, ...prev]);
  }

  async function deleteExpense(id: string) {
    await expenseAPI.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function fetchCategories() {
    const { data } = await categoryAPI.getAll();
    setCategories(data);
  }

  async function scanReceipt(formData: FormData) {
    const { data } = await receiptAPI.scan(formData);
    await fetchExpenses();
    return data;
  }

  async function fetchDashboard() {
    const { data } = await analyticsAPI.getDashboard();
    setDashboard(data);
  }

  async function fetchSummary(): Promise<string> {
    const { data } = await analyticsAPI.getSummary();
    return data.summary;
  }

  async function fetchPatterns(): Promise<string[]> {
    const { data } = await analyticsAPI.getPatterns();
    return data.patterns;
  }

  return (
    <ExpenseContext.Provider value={{
      expenses, categories, dashboard, loading,
      fetchExpenses, createExpense, deleteExpense,
      fetchCategories, scanReceipt, fetchDashboard,
      fetchSummary, fetchPatterns,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
