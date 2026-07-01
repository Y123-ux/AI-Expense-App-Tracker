<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category } from '@/stores/expenses'

const props = defineProps<{ categories: Category[] }>()
const emit = defineEmits<{ filter: [filters: Record<string, string>] }>()

const search = ref('')
const activeCategory = ref('')
const startDate = ref('')
const endDate = ref('')
const showDateFilters = ref(false)

function applyFilters() {
  const filters: Record<string, string> = {}
  if (search.value) filters.search = search.value
  if (activeCategory.value) filters.categoryId = activeCategory.value
  if (startDate.value) filters.startDate = startDate.value
  if (endDate.value) filters.endDate = endDate.value
  emit('filter', filters)
}

function selectCategory(id: string) {
  activeCategory.value = activeCategory.value === id ? '' : id
  applyFilters()
}

function clearFilters() {
  search.value = ''
  activeCategory.value = ''
  startDate.value = ''
  endDate.value = ''
  showDateFilters.value = false
  emit('filter', {})
}

watch([search], () => {
  applyFilters()
})
</script>

<template>
  <div class="space-y-3">
    <!-- Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        @click="selectCategory('')"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border"
        :class="activeCategory === ''
          ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border"
        :class="activeCategory === cat.id
          ? 'text-white shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'"
        :style="activeCategory === cat.id
          ? { backgroundColor: cat.color, borderColor: cat.color }
          : {}"
      >
        <span class="text-sm">{{ cat.icon }}</span>
        {{ cat.name }}
      </button>
    </div>

    <!-- Search & Date Row -->
    <div class="flex items-center gap-2 flex-wrap">
      <div class="relative flex-1 min-w-[200px] max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input
          v-model="search"
          type="text"
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent-300/50 focus:border-accent-300 outline-none transition-colors"
          placeholder="Search expenses..."
        />
      </div>

      <button
        @click="showDateFilters = !showDateFilters"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors"
        :class="showDateFilters || startDate || endDate
          ? 'border-primary-300 text-primary-600 bg-primary-50'
          : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        Date Range
      </button>

      <button
        v-if="search || activeCategory || startDate || endDate"
        @click="clearFilters"
        class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-crimson-400 hover:bg-crimson-50 border border-crimson-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Clear
      </button>
    </div>

    <!-- Date Range Panel -->
    <Transition name="slide-up">
      <div v-if="showDateFilters" class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>From</span>
          <input v-model="startDate" type="date" class="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent-300" />
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>To</span>
          <input v-model="endDate" type="date" class="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent-300" />
        </div>
        <button @click="applyFilters" class="btn-primary text-xs px-3 py-1.5">Apply</button>
      </div>
    </Transition>
  </div>
</template>
