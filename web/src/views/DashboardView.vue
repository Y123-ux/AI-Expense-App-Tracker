<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useExpenseStore } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import SpendingChart from '@/components/charts/SpendingChart.vue'
import CategoryPieChart from '@/components/charts/CategoryPieChart.vue'
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart.vue'

const analytics = useAnalyticsStore()
const expenseStore = useExpenseStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await Promise.all([
    analytics.fetchDashboard(),
    expenseStore.fetchExpenses({ limit: '5' }),
  ])
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
</script>

<template>
  <div>
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-800 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-1/3 w-56 h-56 bg-white/5 rounded-full translate-y-1/2"></div>
      <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-accent-300/10 rounded-full"></div>
      <div class="absolute bottom-4 right-12 w-16 h-16 bg-cream-300/10 rounded-lg rotate-12"></div>
      <div class="absolute top-8 right-40 w-10 h-10 bg-white/5 rounded-full"></div>

      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p class="text-primary-200 text-sm mb-1">Welcome back,</p>
          <h1 class="text-3xl font-bold mb-1">{{ auth.user?.name || 'User' }}</h1>
          <p class="text-primary-200 text-sm">Here's your financial overview for {{ currentMonth }}.</p>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-3">
          <button
            @click="router.push('/expenses')"
            class="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Expense
          </button>
          <button
            @click="router.push('/scan')"
            class="flex items-center gap-2 bg-accent-300/80 hover:bg-accent-300 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            Scan Receipt
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" v-if="analytics.dashboard">
      <!-- Total Spending -->
      <div class="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white group hover:shadow-lg transition-shadow">
        <div class="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full"></div>
        <div class="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm text-primary-100 font-medium">This Month</span>
          </div>
          <p class="text-3xl font-bold">
            {{ auth.formatCurrency(analytics.dashboard.totalThisMonth) }}
          </p>
          <p class="text-xs text-primary-200 mt-1">Total spending in {{ currentMonth }}</p>
        </div>
      </div>

      <!-- Transactions -->
      <div class="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-accent-300 to-accent-500 text-white group hover:shadow-lg transition-shadow">
        <div class="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full"></div>
        <div class="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm text-orange-100 font-medium">Transactions</span>
          </div>
          <p class="text-3xl font-bold">
            {{ analytics.dashboard.transactionCount }}
          </p>
          <p class="text-xs text-orange-100 mt-1">Total transactions this month</p>
        </div>
      </div>

      <!-- Average -->
      <div class="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-crimson-400 to-crimson-600 text-white group hover:shadow-lg transition-shadow">
        <div class="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full"></div>
        <div class="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm text-red-100 font-medium">Average</span>
          </div>
          <p class="text-3xl font-bold">
            {{ auth.formatCurrency(analytics.dashboard.avgTransaction) }}
          </p>
          <p class="text-xs text-red-100 mt-1">Per transaction average</p>
        </div>
      </div>
    </div>

    <!-- Skeleton loading for stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div v-for="i in 3" :key="i" class="rounded-xl p-5 bg-gray-200 animate-pulse h-[130px]"></div>
    </div>

    <!-- Charts + Top Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Monthly Trend (wider) -->
      <div class="lg:col-span-2 card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Monthly Spending Trend</h3>
          <router-link to="/analytics" class="text-xs text-accent-300 hover:text-accent-500 font-medium transition-colors">
            View Details &rarr;
          </router-link>
        </div>
        <MonthlyTrendChart
          v-if="analytics.dashboard?.monthlyTrend.length"
          :data="analytics.dashboard.monthlyTrend"
        />
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-gray-500 font-medium mb-1">No spending data yet</p>
          <p class="text-gray-400 text-sm">Add expenses to see your trends</p>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="card hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Top Categories</h3>
        <div v-if="analytics.dashboard?.categoryBreakdown.length" class="space-y-3">
          <div
            v-for="cat in analytics.dashboard.categoryBreakdown.slice(0, 5)"
            :key="cat.category_id"
            class="flex items-center gap-3"
          >
            <span
              class="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              :style="{ backgroundColor: (cat.category_color || '#6B7280') + '18' }"
            >
              {{ cat.category_icon }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 truncate">{{ cat.category_name }}</span>
                <span class="text-sm font-semibold text-gray-800 ml-2">{{ auth.formatCurrency(cat.total) }}</span>
              </div>
              <!-- Progress bar -->
              <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{
                    width: Math.min((cat.total / (analytics.dashboard?.totalThisMonth || 1)) * 100, 100) + '%',
                    backgroundColor: cat.category_color || '#6B7280'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-100 to-orange-50 flex items-center justify-center mb-3">
            <svg class="w-7 h-7 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <p class="text-gray-400 text-sm">No categories yet</p>
        </div>
      </div>
    </div>

    <!-- Category Pie Chart + Recent Expenses -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Spending by Category -->
      <div class="card hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
        <CategoryPieChart
          v-if="analytics.dashboard?.categoryBreakdown.length"
          :data="analytics.dashboard.categoryBreakdown"
        />
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cream-100 to-amber-50 flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <p class="text-gray-500 font-medium mb-1">No data yet</p>
          <p class="text-gray-400 text-sm">Start tracking to see your breakdown</p>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Recent Expenses</h3>
          <router-link to="/expenses" class="text-xs text-accent-300 font-medium hover:text-accent-500 transition-colors">
            View all &rarr;
          </router-link>
        </div>
        <div v-if="expenseStore.expenses.length" class="space-y-1">
          <div
            v-for="expense in expenseStore.expenses.slice(0, 5)"
            :key="expense.id"
            class="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                :style="{ backgroundColor: (expense.category_color || '#5E244E') + '15' }"
              >
                {{ expense.category_icon || '📦' }}
              </span>
              <div>
                <p class="font-medium text-gray-800 text-sm">{{ expense.merchant || 'Unknown' }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs text-gray-400">{{ formatDate(expense.date) }}</span>
                  <span
                    class="inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    :style="{
                      backgroundColor: (expense.category_color || '#6B7280') + '12',
                      color: expense.category_color || '#6B7280'
                    }"
                  >
                    {{ expense.category_name || 'Other' }}
                  </span>
                </div>
              </div>
            </div>
            <span class="font-semibold text-primary-700 text-sm">{{ auth.formatCurrency(expense.amount) }}</span>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-3">
            <svg class="w-7 h-7 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-gray-500 font-medium mb-1">No expenses yet</p>
          <p class="text-gray-400 text-sm mb-3">Scan a receipt to get started!</p>
          <button @click="router.push('/scan')" class="btn-primary text-xs px-3 py-1.5">
            Scan Receipt
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Tips -->
    <div class="bg-gradient-to-r from-cream-100 via-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-amber-200/50 flex items-center justify-center flex-shrink-0 text-lg">
          💡
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Smart Tip</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Visit the <router-link to="/analytics" class="text-accent-500 font-medium hover:underline">Analytics</router-link> page to generate AI-powered insights about your spending patterns. You can also use the <router-link to="/scan" class="text-accent-500 font-medium hover:underline">receipt scanner</router-link> to automatically extract expense data from photos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
