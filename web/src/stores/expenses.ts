import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Expense {
  id: string
  amount: number
  merchant: string | null
  description: string | null
  date: string
  category_id: string | null
  category_name: string | null
  category_icon: string | null
  category_color: string | null
  receipt_id: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function fetchExpenses(filters?: Record<string, string>) {
    loading.value = true
    try {
      const params = new URLSearchParams(filters)
      const { data } = await api.get(`/expenses?${params}`)
      expenses.value = data
    } finally {
      loading.value = false
    }
  }

  async function createExpense(expense: {
    amount: number
    merchant?: string
    description?: string
    date: string
    category_id?: string
  }) {
    const { data } = await api.post('/expenses', expense)
    expenses.value.unshift(data)
    return data
  }

  async function updateExpense(id: string, updates: Record<string, unknown>) {
    const { data } = await api.put(`/expenses/${id}`, updates)
    const idx = expenses.value.findIndex((e) => e.id === id)
    if (idx !== -1) expenses.value[idx] = data
    return data
  }

  async function deleteExpense(id: string) {
    await api.delete(`/expenses/${id}`)
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  async function fetchCategories() {
    const { data } = await api.get('/categories')
    categories.value = data
  }

  async function scanReceipt(file: File) {
    const formData = new FormData()
    formData.append('receipt', file)
    const { data } = await api.post('/receipts/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // Refresh expenses list after scan
    await fetchExpenses()
    return data
  }

  return {
    expenses, categories, loading,
    fetchExpenses, createExpense, updateExpense, deleteExpense,
    fetchCategories, scanReceipt,
  }
})
