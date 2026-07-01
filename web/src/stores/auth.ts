import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '\u20AC', name: 'Euro' },
  GBP: { symbol: '\u00A3', name: 'British Pound' },
  JPY: { symbol: '\u00A5', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  INR: { symbol: '\u20B9', name: 'Indian Rupee' },
  PKR: { symbol: 'Rs', name: 'Pakistani Rupee' },
  CNY: { symbol: '\u00A5', name: 'Chinese Yuan' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
}

interface User {
  id: string
  email: string
  name: string
  currency: string
  avatar_url: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const currencySymbol = computed(() => {
    const code = user.value?.currency || 'USD'
    return CURRENCIES[code]?.symbol || '$'
  })
  const userInitials = computed(() => {
    const name = user.value?.name || ''
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })

  function formatCurrency(amount: number): string {
    return `${currencySymbol.value}${amount.toFixed(2)}`
  }

  async function register(email: string, password: string, name: string) {
    const { data } = await api.post('/auth/register', { email, password, name })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/profile')
      user.value = data
    } catch {
      logout()
    }
  }

  async function updateCurrency(currency: string) {
    const { data } = await api.put('/auth/profile', { currency })
    user.value = data
  }

  async function updateName(name: string) {
    const { data } = await api.put('/auth/profile', { name })
    user.value = data
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await api.put('/auth/password', { currentPassword, newPassword })
  }

  async function uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    user.value = data
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user, token, isAuthenticated, currencySymbol, userInitials,
    formatCurrency, register, login, fetchProfile, updateCurrency,
    updateName, changePassword, uploadAvatar, logout,
  }
})
