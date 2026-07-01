<script setup lang="ts">
import type { Expense } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'

defineProps<{ expense: Expense }>()
defineEmits<{ delete: [id: string]; edit: [expense: Expense] }>()

const auth = useAuthStore()
</script>

<template>
  <div class="card group hover:shadow-md hover:border-primary-100 transition-all duration-200 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <span
        class="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        :style="{ backgroundColor: (expense.category_color || '#6B7280') + '15' }"
      >
        {{ expense.category_icon || '📦' }}
      </span>
      <div>
        <p class="font-medium text-gray-800">{{ expense.merchant || 'Unknown Merchant' }}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span
            class="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
            :style="{
              backgroundColor: (expense.category_color || '#6B7280') + '12',
              color: expense.category_color || '#6B7280'
            }"
          >
            {{ expense.category_name || 'Uncategorized' }}
          </span>
          <span class="text-xs text-gray-400">{{ expense.date }}</span>
        </div>
        <p v-if="expense.description" class="text-xs text-gray-400 mt-0.5">{{ expense.description }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-lg font-semibold text-primary-700">{{ auth.formatCurrency(expense.amount) }}</span>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          @click="$emit('edit', expense)"
          class="p-1.5 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', expense.id)"
          class="p-1.5 rounded-lg text-crimson-300 hover:text-crimson-400 hover:bg-crimson-50 transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
