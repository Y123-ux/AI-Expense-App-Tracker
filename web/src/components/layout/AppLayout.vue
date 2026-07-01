<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
</script>

<template>
  <div class="min-h-screen bg-cream-50">
    <AppSidebar />
    <div
      class="transition-all duration-300"
      :class="ui.sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64'"
    >
      <AppHeader />
      <main class="p-4 md:p-6 lg:p-8 max-w-[1400px]">
        <slot />
      </main>
    </div>
  </div>
</template>
