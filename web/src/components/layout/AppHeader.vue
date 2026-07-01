<script setup lang="ts">
import { useAuthStore, CURRENCIES } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const auth = useAuthStore()
const ui = useUIStore()
const router = useRouter()
const route = useRoute()
const showCurrencyMenu = ref(false)

function goBack() {
  router.push('/')
}

async function selectCurrency(code: string) {
  await auth.updateCurrency(code)
  showCurrencyMenu.value = false
}

const isSubPage = () => route.path !== '/'

const pageInfo = computed(() => {
  const map: Record<string, { title: string; icon: string }> = {
    '/': { title: 'Dashboard', icon: '📊' },
    '/expenses': { title: 'Expenses', icon: '💰' },
    '/scan': { title: 'Scan Receipt', icon: '📷' },
    '/analytics': { title: 'Analytics', icon: '📈' },
    '/profile': { title: 'Profile', icon: '👤' },
  }
  return map[route.path] || { title: '', icon: '' }
})

const today = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <!-- Mobile hamburger -->
      <button
        @click="ui.toggleMobileSidebar()"
        class="lg:hidden text-primary-400 hover:text-primary-600 p-1 transition-colors"
        title="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        v-if="isSubPage()"
        @click="goBack"
        class="text-primary-300 hover:text-primary-500 transition-colors p-1"
        title="Back to Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Page title & date -->
      <div class="hidden sm:flex items-center gap-3">
        <div>
          <h2 class="text-sm font-semibold text-gray-800 leading-tight">{{ pageInfo.title }}</h2>
          <p class="text-[11px] text-gray-400 leading-tight">{{ today }}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- Quick Add button -->
      <button
        @click="router.push('/expenses')"
        class="hidden md:flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
        title="Add Expense"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Add</span>
      </button>

      <!-- Divider -->
      <div class="hidden md:block w-px h-6 bg-gray-200"></div>

      <!-- Currency Selector -->
      <div class="relative">
        <button
          @click="showCurrencyMenu = !showCurrencyMenu"
          class="flex items-center gap-1.5 text-sm text-primary-700 hover:text-primary-800 bg-cream-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span class="font-medium">{{ auth.currencySymbol }}</span>
          <span class="hidden sm:inline">{{ auth.user?.currency || 'USD' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div
          v-if="showCurrencyMenu"
          class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto"
        >
          <button
            v-for="(info, code) in CURRENCIES"
            :key="code"
            @click="selectCurrency(code)"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
            :class="auth.user?.currency === code ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'"
          >
            <span>{{ info.symbol }} {{ info.name }}</span>
            <span class="text-gray-400 text-xs">{{ code }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <!-- Overlay to close currency menu -->
  <div v-if="showCurrencyMenu" @click="showCurrencyMenu = false" class="fixed inset-0 z-20"></div>
</template>
