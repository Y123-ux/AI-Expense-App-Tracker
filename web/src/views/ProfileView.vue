<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore, CURRENCIES } from '@/stores/auth'

const auth = useAuthStore()

const name = ref(auth.user?.name || '')
const savingName = ref(false)
const nameSuccess = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)

const uploadingAvatar = ref(false)

async function saveName() {
  if (!name.value.trim()) return
  savingName.value = true
  nameSuccess.value = false
  try {
    await auth.updateName(name.value.trim())
    nameSuccess.value = true
    setTimeout(() => { nameSuccess.value = false }, 3000)
  } finally {
    savingName.value = false
  }
}

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (newPassword.value.length < 6) {
    passwordError.value = 'New password must be at least 6 characters'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return
  }

  changingPassword.value = true
  try {
    await auth.changePassword(currentPassword.value, newPassword.value)
    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    setTimeout(() => { passwordSuccess.value = false }, 3000)
  } catch (e: any) {
    passwordError.value = e.response?.data?.error || 'Failed to change password'
  } finally {
    changingPassword.value = false
  }
}

async function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.[0]) return
  uploadingAvatar.value = true
  try {
    await auth.uploadAvatar(input.files[0])
  } finally {
    uploadingAvatar.value = false
  }
}

async function selectCurrency(code: string) {
  await auth.updateCurrency(code)
}
</script>

<template>
  <div class="max-w-2xl">
    <!-- Cover Banner -->
    <div class="relative rounded-2xl overflow-hidden mb-6 h-36">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800"></div>
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
      <div class="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-300/10 rounded-full"></div>
    </div>

    <!-- Avatar & Info (overlapping banner) -->
    <div class="card mb-6 -mt-14 relative z-10 mx-2">
      <div class="flex items-center gap-6">
        <div class="relative -mt-10">
          <div
            v-if="auth.user?.avatar_url"
            class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg"
          >
            <img :src="auth.user.avatar_url" class="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div
            v-else
            class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl font-bold text-cream-100 ring-4 ring-white shadow-lg"
          >
            {{ auth.userInitials }}
          </div>
          <label class="absolute -bottom-1 -right-1 bg-accent-300 text-white p-1.5 rounded-full cursor-pointer hover:bg-accent-500 transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
          </label>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ auth.user?.name }}</h2>
          <p class="text-sm text-gray-500">{{ auth.user?.email }}</p>
          <p v-if="uploadingAvatar" class="text-xs text-accent-300 mt-1">Uploading...</p>
        </div>
      </div>
    </div>

    <!-- Personal Info Card -->
    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
      <div class="space-y-4">
        <div>
          <label class="label">Display Name</label>
          <input v-model="name" type="text" class="input max-w-md" placeholder="Your name" />
        </div>
        <div class="flex items-center gap-3">
          <button @click="saveName" :disabled="savingName" class="btn-primary text-sm">
            {{ savingName ? 'Saving...' : 'Save Name' }}
          </button>
          <span v-if="nameSuccess" class="text-sm text-green-600">Saved!</span>
        </div>
      </div>
    </div>

    <!-- Password Card -->
    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-4">Change Password</h3>

      <div v-if="passwordError" class="bg-crimson-50 text-crimson-400 p-3 rounded-lg mb-4 text-sm">
        {{ passwordError }}
      </div>
      <div v-if="passwordSuccess" class="bg-cream-100 text-primary-700 p-3 rounded-lg mb-4 text-sm">
        Password changed successfully!
      </div>

      <div class="space-y-4 max-w-md">
        <div>
          <label class="label">Current Password</label>
          <input v-model="currentPassword" type="password" class="input" placeholder="Enter current password" />
        </div>
        <div>
          <label class="label">New Password</label>
          <input v-model="newPassword" type="password" class="input" placeholder="Min. 6 characters" />
        </div>
        <div>
          <label class="label">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" class="input" placeholder="Re-enter new password" />
        </div>
        <button @click="handleChangePassword" :disabled="changingPassword" class="btn-primary text-sm">
          {{ changingPassword ? 'Changing...' : 'Change Password' }}
        </button>
      </div>
    </div>

    <!-- Currency Card -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Currency Preference</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <button
          v-for="(info, code) in CURRENCIES"
          :key="code"
          @click="selectCurrency(code)"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors border"
          :class="auth.user?.currency === code
            ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
            : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50'"
        >
          <span class="font-semibold">{{ info.symbol }}</span>
          <span>{{ code }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
