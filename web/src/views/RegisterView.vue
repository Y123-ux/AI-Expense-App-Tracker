<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(email.value, password.value, name.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cream-50 px-4">
    <div class="card max-w-md w-full">
      <h1 class="text-2xl font-bold text-center text-primary-500 mb-2">Create Account</h1>
      <p class="text-center text-gray-500 mb-6">Start tracking your expenses with AI</p>

      <div v-if="error" class="bg-crimson-50 text-crimson-400 p-3 rounded-lg mb-4 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="label">Name</label>
          <input v-model="name" type="text" class="input" placeholder="Your name" required />
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label class="label">Password</label>
          <input v-model="password" type="password" class="input" placeholder="Min. 6 characters" required minlength="6" />
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <router-link to="/login" class="text-accent-300 font-medium hover:underline">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>
