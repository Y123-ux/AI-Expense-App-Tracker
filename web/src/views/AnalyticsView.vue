<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useAuthStore } from '@/stores/auth'
import SpendingChart from '@/components/charts/SpendingChart.vue'

const analytics = useAnalyticsStore()
const auth = useAuthStore()
const loadingSummary = ref(false)
const loadingPatterns = ref(false)

onMounted(async () => {
  await analytics.fetchDashboard()
})

async function generateSummary() {
  loadingSummary.value = true
  try {
    await analytics.fetchSummary()
  } catch {
    // Error stored in analytics.summaryError
  } finally {
    loadingSummary.value = false
  }
}

async function detectPatterns() {
  loadingPatterns.value = true
  try {
    await analytics.fetchPatterns()
  } catch {
    // Error stored in analytics.patternsError
  } finally {
    loadingPatterns.value = false
  }
}
</script>

<template>
  <div>
    <!-- Cover Banner -->
    <div class="relative rounded-2xl overflow-hidden mb-6 h-40">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
      <div class="absolute top-4 right-10 w-20 h-20 rounded-2xl bg-indigo-200/40 rotate-12"></div>
      <div class="absolute top-10 right-32 w-14 h-14 rounded-full bg-purple-200/40"></div>
      <div class="absolute bottom-4 right-20 w-16 h-16 rounded-xl bg-pink-200/40 -rotate-6"></div>
      <div class="absolute top-6 right-52 text-3xl opacity-30">📊</div>
      <div class="absolute bottom-6 right-40 text-2xl opacity-25">🧠</div>
      <div class="absolute top-14 right-12 text-2xl opacity-20">✨</div>
      <div class="absolute inset-0 p-8 flex flex-col justify-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Analytics & Insights</h1>
        <p class="text-gray-600 text-sm max-w-md">
          AI-powered analysis of your spending habits, patterns, and personalized recommendations.
        </p>
      </div>
    </div>

    <!-- Category Breakdown Table -->
    <div class="card mb-6" v-if="analytics.dashboard?.categoryBreakdown.length">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Category Breakdown (This Month)</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th class="pb-3">Category</th>
              <th class="pb-3 text-center">Transactions</th>
              <th class="pb-3 text-right">Total</th>
              <th class="pb-3 text-right">Share</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="cat in analytics.dashboard.categoryBreakdown"
              :key="cat.category_id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3.5">
                <div class="flex items-center gap-3">
                  <span
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    :style="{ backgroundColor: (cat.category_color || '#6B7280') + '18' }"
                  >
                    {{ cat.category_icon }}
                  </span>
                  <span class="font-medium text-gray-700 text-sm">{{ cat.category_name || 'Uncategorized' }}</span>
                </div>
              </td>
              <td class="py-3.5 text-center">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {{ cat.count }}
                </span>
              </td>
              <td class="py-3.5 text-right font-semibold text-gray-800">{{ auth.formatCurrency(cat.total) }}</td>
              <td class="py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :style="{
                        width: Math.min((cat.total / (analytics.dashboard?.totalThisMonth || 1)) * 100, 100) + '%',
                        backgroundColor: cat.category_color || '#6B7280'
                      }"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-400 w-10 text-right">
                    {{ Math.round((cat.total / (analytics.dashboard?.totalThisMonth || 1)) * 100) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI Insights Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- AI Summary -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">AI Monthly Summary</h3>
          </div>
          <button @click="generateSummary" :disabled="loadingSummary" class="btn-primary text-xs px-3 py-1.5">
            {{ loadingSummary ? 'Generating...' : 'Generate' }}
          </button>
        </div>
        <div v-if="loadingSummary" class="space-y-2 animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          <div class="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div v-else-if="analytics.summaryError" class="bg-crimson-50 text-crimson-400 p-4 rounded-lg text-sm border border-crimson-100">
          {{ analytics.summaryError }}
        </div>
        <div v-else-if="analytics.summary" class="bg-gradient-to-br from-cream-100 to-amber-50 p-4 rounded-xl text-primary-700 text-sm leading-relaxed border border-amber-100">
          {{ analytics.summary }}
        </div>
        <div v-else class="flex flex-col items-center py-8 text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-3 text-xl">
            🤖
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">AI-Powered Analysis</p>
          <p class="text-gray-400 text-xs">Click "Generate" for spending insights</p>
        </div>
      </div>

      <!-- Spending Patterns -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-100 to-orange-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Spending Patterns</h3>
          </div>
          <button @click="detectPatterns" :disabled="loadingPatterns" class="btn-primary text-xs px-3 py-1.5">
            {{ loadingPatterns ? 'Analyzing...' : 'Detect' }}
          </button>
        </div>
        <div v-if="loadingPatterns" class="space-y-3 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="h-3 bg-gray-200 rounded flex-1"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="h-3 bg-gray-200 rounded flex-1 max-w-[80%]"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="h-3 bg-gray-200 rounded flex-1 max-w-[70%]"></div>
          </div>
        </div>
        <div v-else-if="analytics.patternsError" class="bg-crimson-50 text-crimson-400 p-4 rounded-lg text-sm border border-crimson-100">
          {{ analytics.patternsError }}
        </div>
        <ul v-else-if="analytics.patterns.length" class="space-y-3">
          <li
            v-for="(pattern, index) in analytics.patterns"
            :key="index"
            class="flex items-start gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-gray-50 transition-colors"
          >
            <div class="w-6 h-6 rounded-full bg-accent-300/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-accent-300 text-xs font-bold">{{ index + 1 }}</span>
            </div>
            <span class="text-sm text-gray-700 leading-relaxed">{{ pattern }}</span>
          </li>
        </ul>
        <div v-else class="flex flex-col items-center py-8 text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-orange-50 flex items-center justify-center mb-3 text-xl">
            🔍
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">Pattern Detection</p>
          <p class="text-gray-400 text-xs">Click "Detect" to find spending habits</p>
        </div>
      </div>
    </div>
  </div>
</template>
