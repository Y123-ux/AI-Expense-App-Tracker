<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const auth = useAuthStore()

onMounted(() => {
  if (auth.isAuthenticated) {
    auth.fetchProfile()
  }
})
</script>

<template>
  <AppLayout v-if="auth.isAuthenticated">
    <router-view />
  </AppLayout>
  <router-view v-else />
</template>
