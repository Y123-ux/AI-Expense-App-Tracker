<script setup lang="ts">
import { ref } from 'vue'
import { useExpenseStore } from '@/stores/expenses'
import ReceiptUploader from '@/components/receipt/ReceiptUploader.vue'
import ReceiptPreview from '@/components/receipt/ReceiptPreview.vue'

const store = useExpenseStore()
const scanResult = ref<any>(null)
const scanning = ref(false)
const error = ref('')

async function handleUpload(file: File) {
  scanning.value = true
  error.value = ''
  scanResult.value = null

  try {
    const result = await store.scanReceipt(file)
    scanResult.value = result
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to scan receipt'
  } finally {
    scanning.value = false
  }
}

function reset() {
  scanResult.value = null
  error.value = ''
}
</script>

<template>
  <div>
    <!-- Cover Banner -->
    <div class="relative rounded-2xl overflow-hidden mb-6 h-40">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100"></div>
      <div class="absolute top-4 right-10 w-20 h-20 rounded-2xl bg-emerald-200/40 rotate-12"></div>
      <div class="absolute top-12 right-28 w-14 h-14 rounded-full bg-teal-200/40"></div>
      <div class="absolute bottom-4 right-16 w-16 h-16 rounded-xl bg-cyan-200/40 -rotate-6"></div>
      <div class="absolute top-6 right-48 text-3xl opacity-30">📸</div>
      <div class="absolute bottom-6 right-36 text-2xl opacity-25">🧾</div>
      <div class="absolute top-14 right-14 text-2xl opacity-20">✨</div>
      <div class="absolute inset-0 p-8 flex flex-col justify-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Scan Receipt</h1>
        <p class="text-gray-600 text-sm max-w-md">
          Upload a receipt photo and our OCR engine will automatically extract the expense details.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upload Area -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2.5 mb-4">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Upload Receipt Image</h3>
        </div>
        <ReceiptUploader @upload="handleUpload" :loading="scanning" />

        <div v-if="error" class="mt-4 bg-crimson-50 text-crimson-400 p-3 rounded-lg text-sm border border-crimson-100">
          {{ error }}
        </div>
      </div>

      <!-- Results -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-100 to-orange-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Extracted Data</h3>
          </div>
          <button v-if="scanResult" @click="reset" class="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
            Clear
          </button>
        </div>

        <div v-if="scanning" class="text-center py-12">
          <div class="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Scanning receipt with OCR...</p>
          <p class="text-gray-400 text-xs mt-1">This may take a moment</p>
        </div>

        <ReceiptPreview v-else-if="scanResult" :result="scanResult" />

        <div v-else class="flex flex-col items-center py-12 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-gray-500 font-medium mb-1">No receipt scanned</p>
          <p class="text-gray-400 text-sm">Upload a receipt image to extract data</p>
        </div>
      </div>
    </div>
  </div>
</template>
