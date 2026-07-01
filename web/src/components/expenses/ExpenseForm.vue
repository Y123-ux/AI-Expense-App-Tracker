<script setup lang="ts">
import { ref, watch } from 'vue'
import { useExpenseStore, type Category, type Expense } from '@/stores/expenses'

const props = withDefaults(defineProps<{
  categories: Category[]
  expense?: Expense | null
  mode?: 'create' | 'edit'
}>(), {
  expense: null,
  mode: 'create',
})

const emit = defineEmits<{ created: []; updated: [] }>()

const store = useExpenseStore()
const amount = ref<number | null>(props.expense?.amount ?? null)
const merchant = ref(props.expense?.merchant ?? '')
const description = ref(props.expense?.description ?? '')
const date = ref(props.expense?.date ?? new Date().toISOString().split('T')[0])
const categoryId = ref(props.expense?.category_id ?? '')
const loading = ref(false)
const error = ref('')

watch(() => props.expense, (newExpense) => {
  if (newExpense) {
    amount.value = newExpense.amount
    merchant.value = newExpense.merchant ?? ''
    description.value = newExpense.description ?? ''
    date.value = newExpense.date
    categoryId.value = newExpense.category_id ?? ''
  } else {
    amount.value = null
    merchant.value = ''
    description.value = ''
    date.value = new Date().toISOString().split('T')[0]
    categoryId.value = ''
  }
})

async function handleSubmit() {
  if (!amount.value || amount.value <= 0) return
  loading.value = true
  error.value = ''

  try {
    if (props.mode === 'edit' && props.expense) {
      await store.updateExpense(props.expense.id, {
        amount: amount.value,
        merchant: merchant.value || undefined,
        description: description.value || undefined,
        date: date.value,
        category_id: categoryId.value || undefined,
      })
      emit('updated')
    } else {
      await store.createExpense({
        amount: amount.value,
        merchant: merchant.value || undefined,
        description: description.value || undefined,
        date: date.value,
        category_id: categoryId.value || undefined,
      })
      amount.value = null
      merchant.value = ''
      description.value = ''
      categoryId.value = ''
      emit('created')
    }
  } catch (e: any) {
    error.value = e.response?.data?.error || `Failed to ${props.mode} expense`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">{{ mode === 'edit' ? 'Edit Expense' : 'Add New Expense' }}</h3>

    <div v-if="error" class="bg-crimson-50 text-crimson-400 p-3 rounded-lg mb-4 text-sm">{{ error }}</div>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Amount *</label>
        <input v-model.number="amount" type="number" step="0.01" min="0.01" class="input" placeholder="0.00" required />
      </div>
      <div>
        <label class="label">Date *</label>
        <input v-model="date" type="date" class="input" required />
      </div>
      <div>
        <label class="label">Merchant</label>
        <input v-model="merchant" type="text" class="input" placeholder="Store name" />
      </div>
      <div>
        <label class="label">Category</label>
        <select v-model="categoryId" class="input">
          <option value="">Auto-categorize with AI</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="label">Description</label>
        <input v-model="description" type="text" class="input" placeholder="Optional notes" />
      </div>
      <div class="md:col-span-2">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? (mode === 'edit' ? 'Saving...' : 'Adding...') : (mode === 'edit' ? 'Save Changes' : 'Add Expense') }}
        </button>
      </div>
    </form>
  </div>
</template>
