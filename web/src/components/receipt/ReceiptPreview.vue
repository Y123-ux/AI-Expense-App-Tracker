<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

defineProps<{
  result: {
    parsed: {
      merchant: string
      amount: number
      date: string
      items: Array<{ name: string; quantity: number; price: number }>
    }
    expense: { id: string; category_name?: string }
  }
}>()

const auth = useAuthStore()
</script>

<template>
  <div class="space-y-4">
    <div class="bg-cream-100 text-primary-700 p-3 rounded-lg text-sm font-medium">
      Receipt scanned and expense created successfully!
    </div>

    <div class="space-y-3">
      <div class="flex justify-between py-2 border-b">
        <span class="text-gray-500">Merchant</span>
        <span class="font-medium">{{ result.parsed.merchant }}</span>
      </div>
      <div class="flex justify-between py-2 border-b">
        <span class="text-gray-500">Total Amount</span>
        <span class="font-semibold text-lg">{{ auth.formatCurrency(result.parsed.amount) }}</span>
      </div>
      <div class="flex justify-between py-2 border-b">
        <span class="text-gray-500">Date</span>
        <span class="font-medium">{{ result.parsed.date }}</span>
      </div>
    </div>

    <div v-if="result.parsed.items.length">
      <h4 class="font-medium text-gray-700 mb-2">Items</h4>
      <ul class="space-y-1">
        <li
          v-for="(item, i) in result.parsed.items"
          :key="i"
          class="flex justify-between text-sm text-gray-600"
        >
          <span>{{ item.quantity }}x {{ item.name }}</span>
          <span>{{ auth.formatCurrency(item.price) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
