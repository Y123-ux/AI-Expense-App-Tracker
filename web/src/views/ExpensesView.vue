<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useExpenseStore, type Expense } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue'

const store = useExpenseStore()
const auth = useAuthStore()
const showForm = ref(false)
const editingExpense = ref<Expense | null>(null)
const formMode = ref<'create' | 'edit'>('create')

onMounted(async () => {
  await Promise.all([store.fetchExpenses(), store.fetchCategories()])
})

async function handleFilter(filters: Record<string, string>) {
  await store.fetchExpenses(filters)
}

function handleEdit(expense: Expense) {
  editingExpense.value = expense
  formMode.value = 'edit'
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleForm() {
  if (showForm.value && formMode.value === 'create') {
    showForm.value = false
  } else {
    editingExpense.value = null
    formMode.value = 'create'
    showForm.value = !showForm.value
  }
}

function handleCreated() {
  showForm.value = false
  editingExpense.value = null
  formMode.value = 'create'
  store.fetchExpenses()
}

function handleUpdated() {
  showForm.value = false
  editingExpense.value = null
  formMode.value = 'create'
  store.fetchExpenses()
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this expense?')) {
    await store.deleteExpense(id)
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Cover Banner -->
    <div class="relative rounded-2xl overflow-hidden mb-6 h-44">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100"></div>

      <!-- Decorative Shapes -->
      <div class="absolute top-4 right-8 w-24 h-24 rounded-2xl bg-amber-200/50 rotate-12"></div>
      <div class="absolute top-12 right-28 w-16 h-16 rounded-full bg-rose-200/40"></div>
      <div class="absolute bottom-4 right-16 w-20 h-20 rounded-xl bg-orange-200/50 -rotate-6"></div>
      <div class="absolute top-6 right-56 w-10 h-10 rounded-full bg-amber-300/30"></div>
      <div class="absolute bottom-6 left-1/2 w-14 h-14 rounded-lg bg-rose-200/30 rotate-45"></div>

      <!-- Decorative Icons -->
      <div class="absolute top-6 right-12 text-4xl opacity-40 rotate-12">🧾</div>
      <div class="absolute bottom-8 right-36 text-3xl opacity-30 -rotate-12">💰</div>
      <div class="absolute top-16 right-52 text-2xl opacity-25">📊</div>
      <div class="absolute bottom-4 right-64 text-2xl opacity-20 rotate-6">💳</div>

      <!-- Content -->
      <div class="absolute inset-0 p-8 flex flex-col justify-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
        <p class="text-gray-600 text-sm max-w-md">
          Track, manage, and analyze your spending. Stay on top of your finances with detailed expense breakdowns.
        </p>
        <div class="mt-4">
          <button @click="toggleForm" class="btn-primary text-sm inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            {{ showForm && formMode === 'create' ? 'Cancel' : 'Add Expense' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Expense Form -->
    <Transition name="slide-up">
      <ExpenseForm
        v-if="showForm"
        :categories="store.categories"
        :expense="editingExpense"
        :mode="formMode"
        @created="handleCreated"
        @updated="handleUpdated"
        class="mb-6"
      />
    </Transition>

    <!-- Filters -->
    <ExpenseFilters :categories="store.categories" @filter="handleFilter" class="mb-6" />

    <!-- Skeleton Loading -->
    <div v-if="store.loading" class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-100">
        <div class="col-span-4 h-3 w-16 bg-gray-200 rounded"></div>
        <div class="col-span-2 h-3 w-10 bg-gray-200 rounded"></div>
        <div class="col-span-2 h-3 w-16 bg-gray-200 rounded"></div>
        <div class="col-span-2 h-3 w-14 bg-gray-200 rounded ml-auto"></div>
        <div class="col-span-2 h-3 w-14 bg-gray-200 rounded ml-auto"></div>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="i in 6" :key="i" class="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse items-center">
          <div class="col-span-4 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-gray-200 flex-shrink-0"></div>
            <div>
              <div class="h-4 w-28 bg-gray-200 rounded mb-1.5"></div>
              <div class="h-3 w-20 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div class="col-span-2 h-3 w-20 bg-gray-100 rounded hidden md:block"></div>
          <div class="col-span-2 h-5 w-16 bg-gray-100 rounded-full hidden md:block"></div>
          <div class="col-span-2 h-4 w-16 bg-gray-200 rounded ml-auto"></div>
          <div class="col-span-2 h-4 w-12 bg-gray-100 rounded ml-auto hidden md:block"></div>
        </div>
      </div>
    </div>

    <!-- Expense Table -->
    <div v-else-if="store.expenses.length" class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <!-- Table Header -->
      <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div class="col-span-4">Expense</div>
        <div class="col-span-2">Date</div>
        <div class="col-span-2">Category</div>
        <div class="col-span-2 text-right">Amount</div>
        <div class="col-span-2 text-right">Actions</div>
      </div>

      <!-- Table Rows -->
      <div class="divide-y divide-gray-50">
        <div
          v-for="expense in store.expenses"
          :key="expense.id"
          class="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors items-center"
        >
          <!-- Expense Name -->
          <div class="col-span-4 flex items-center gap-3 min-w-0">
            <span
              class="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              :style="{ backgroundColor: (expense.category_color || '#6B7280') + '15' }"
            >
              {{ expense.category_icon || '📦' }}
            </span>
            <div class="min-w-0">
              <p class="font-medium text-gray-800 text-sm truncate">{{ expense.merchant || 'Unknown Merchant' }}</p>
              <p v-if="expense.description" class="text-xs text-gray-400 truncate">{{ expense.description }}</p>
            </div>
          </div>

          <!-- Date -->
          <div class="col-span-2 text-sm text-gray-500 hidden md:block">
            {{ formatDate(expense.date) }}
          </div>

          <!-- Category -->
          <div class="col-span-2 hidden md:block">
            <span
              class="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium"
              :style="{
                backgroundColor: (expense.category_color || '#6B7280') + '15',
                color: expense.category_color || '#6B7280'
              }"
            >
              {{ expense.category_name || 'Uncategorized' }}
            </span>
          </div>

          <!-- Mobile: date + category row -->
          <div class="md:hidden flex items-center gap-2 -mt-1">
            <span class="text-xs text-gray-400">{{ formatDate(expense.date) }}</span>
            <span class="text-gray-300">&middot;</span>
            <span
              class="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
              :style="{
                backgroundColor: (expense.category_color || '#6B7280') + '12',
                color: expense.category_color || '#6B7280'
              }"
            >
              {{ expense.category_name || 'Uncategorized' }}
            </span>
          </div>

          <!-- Amount -->
          <div class="col-span-2 text-right">
            <span class="font-semibold text-primary-700">{{ auth.formatCurrency(expense.amount) }}</span>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex items-center justify-end gap-1">
            <button
              @click="handleEdit(expense)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors md:opacity-0 md:group-hover:opacity-100"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              @click="handleDelete(expense.id)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-crimson-400 hover:bg-crimson-50 transition-colors md:opacity-0 md:group-hover:opacity-100"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with count -->
      <div class="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
        {{ store.expenses.length }} expense{{ store.expenses.length === 1 ? '' : 's' }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-gray-100 text-center py-16 px-6">
      <div class="relative inline-block mb-4">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">No expenses found</h3>
      <p class="text-gray-400 mb-6 max-w-sm mx-auto">Add one manually or scan a receipt to get started tracking your spending!</p>
      <button @click="toggleForm" class="btn-primary inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Your First Expense
      </button>
    </div>
  </div>
</template>
