import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface DashboardStats {
  totalThisMonth: number
  transactionCount: number
  avgTransaction: number
  categoryBreakdown: Array<{
    category_id: string
    category_name: string
    category_icon: string
    category_color: string
    total: number
    count: number
  }>
  monthlyTrend: Array<{ month: string; total: number; count: number }>
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const dashboard = ref<DashboardStats | null>(null)
  const summary = ref<string>('')
  const patterns = ref<string[]>([])
  const loading = ref(false)
  const summaryError = ref('')
  const patternsError = ref('')

  async function fetchDashboard() {
    loading.value = true
    try {
      const { data } = await api.get('/analytics/dashboard')
      dashboard.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary(startDate?: string, endDate?: string) {
    summaryError.value = ''
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    try {
      const { data } = await api.get(`/analytics/summary?${params}`)
      summary.value = data.summary
    } catch (e: any) {
      summaryError.value = e.response?.data?.error || 'Failed to generate summary'
      throw e
    }
  }

  async function fetchPatterns() {
    patternsError.value = ''
    try {
      const { data } = await api.get('/analytics/patterns')
      patterns.value = data.patterns
    } catch (e: any) {
      patternsError.value = e.response?.data?.error || 'Failed to detect patterns'
      throw e
    }
  }

  return {
    dashboard, summary, patterns, loading, summaryError, patternsError,
    fetchDashboard, fetchSummary, fetchPatterns,
  }
})
